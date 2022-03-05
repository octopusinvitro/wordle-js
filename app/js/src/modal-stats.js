class ModalStats {
  static STATS_KEYS = ['gamesPlayed', 'winPercentage', 'currentStreak', 'maximumStreak'];
  static BAR_INDICES = [1, 2, 3, 4, 5, 6];

  constructor(selectors, game, stats) {
    this._modal = new Modal(selectors);
    this._game = game;
    this._stats = stats;

    this.shareButton = this._modal.share.querySelector('button');
    this.shareMessage = this._modal.share.querySelector('p');
  }

  initialize() {
    this._modal.button.addEventListener('click', () => {
      this._displayModalContents();
      this._displayShareContents();
      this._modal.show();
    });

    this._modal.modal.addEventListener('click', () => {
      this._modal.hide();
      this._resetShareContents();
    });

    this.shareButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.copyToClipboard();
    });
  }

  copyToClipboard() {
    let board = this._game.buildShareableBoard();

    return navigator.clipboard.writeText(board).then(() => {
      this.shareMessage.textContent = 'Copied results to Clipboard.';
    }, () => {
      this.shareMessage.textContent = 'Could not copy results to Clipboard.';
    });
  }

  _displayModalContents() {
    let stats = this._stats.read();
    this._displayStats(stats);
    this._displayGraph(stats);
  }

  _displayStats(stats) {
    ModalStats.STATS_KEYS.forEach(key => {
      this._modal[`${key}`].textContent = stats[key];
    });
  }

  _displayGraph(stats) {
    ModalStats.BAR_INDICES.forEach(index => {
      let bar = this._modal[`bar${index}`];
      let value = stats.guesses[index];

      bar.textContent = value;
      bar.style.cssText = `--count: ${value}em`;
    });
  }

  _displayShareContents() {
    if (this._game.isWin()) {
      this.shareButton.classList.replace(this._modal.hiddenClass, this._modal.shareClass);
    }
  }

  _resetShareContents() {
    this.shareMessage.textContent = '';
  }
}
