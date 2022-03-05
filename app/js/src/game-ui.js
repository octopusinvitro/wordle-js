class GameUI {
  static IS_LETTER = /^[a-zA-Z]$/;
  static ENTER_KEY = 'Enter';
  static BACKS_KEY = 'Backspace';

  constructor(options, board, game, stats) {
    this._keyboard = document.querySelectorAll(options.selectors.keys);
    this._messages = document.getElementById(options.selectors.messages);
    this._delay = options.delay;

    this._board = board;
    this._game = game;
    this._stats = stats;

    this._previousKey = '';
    this._won = false;
  }

  initialize() {
    document.addEventListener('keydown', event => {
      this._processKey(event.key);
    });

    document.addEventListener('click', event => {
      let key = event.target.dataset.key;
      if (key) { this._processKey(key); }
    });
  }

  _processKey(key) {
    if (this._isInvalid(key) || this._won) {
      return;
    }

    if (this._isLetter(key) && this._board.isNextTileInCurrentRow()) {
      this._placeLetter(key);
    }

    if (key === GameUI.BACKS_KEY && this._board.isThisTileInCurrentRow()) {
      this._deleteLetter();
    }

    if (key === GameUI.ENTER_KEY && this._board.isRowFull() &&
       this._previousKey !== GameUI.ENTER_KEY) {
      this._submitWord();
    }

    this._previousKey = key;
  }

  _isInvalid(key) {
    return !this._isLetter(key) && !this._isSpecial(key);
  }

  _isLetter(key) {
    return GameUI.IS_LETTER.test(key);
  }

  _isSpecial(key) {
    return [GameUI.ENTER_KEY, GameUI.BACKS_KEY].includes(key);
  }

  _placeLetter(letter) {
    let firstEmptyTile = this._board.firstEmptyTile();

    if (firstEmptyTile) {
      firstEmptyTile.textContent = letter;
    }
  }

  _deleteLetter() {
    let lastBusyTile = this._board.lastBusyTile();

    if (lastBusyTile) {
      lastBusyTile.textContent = '';
    }
  }

  _submitWord() {
    let word = this._board.word();
    let evaluations = this._game.submitWord(word);

    this._applyEvaluationsToBoard(evaluations);
    this._applyEvaluationsToKeyboard(evaluations, word);

    this._checkForWin();
  }

  _applyEvaluationsToBoard(evaluations) {
    this._board.wordTiles().forEach((tile, index) => {
      tile.dataset.state = evaluations[index].name;
    });
  }

  _applyEvaluationsToKeyboard(evaluations, word) {
    word.forEach((letter, index) => {
      let key = Array.from(this._keyboard).find(key => { return key.dataset.key == letter; });
      key.dataset.state = evaluations[index].name;
    });
  }

  _checkForWin() {
    if (this._game.isWin()) { return this._isWin(); }
    if (this._game.isOver()) { return this._isOver(); }
    this._board.currentRow += 1;
  }

  _isWin() {
    this._won = true;
    this._stats.write(this._game.evaluations.length, this._won);
    setTimeout(() => this._messages.textContent = 'Splendid!', this._delay);
  }

  _isOver() {
    this._stats.write(this._game.evaluations.length, this._won);
    let message = `Word of the day: <span class="word">${this._game.word}</span>.`;
    setTimeout(() => this._messages.innerHTML = message, this._delay);
  }
}
