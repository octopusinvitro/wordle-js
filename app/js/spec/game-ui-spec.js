describe('GameUI', () => {
  let board, game, grid, messages, stats, ui;
  let UI = GameUI;

  beforeEach(() => {
    setupDOM();

    board = new Board('.grid__tile');
    game = new Game(2);
    stats = new Stats();
    ui = new UI({ selectors: Selectors.GAME, delay: 0 }, board, game, stats);
    ui.initialize();
  });

  afterEach(() => {
    resetDOM();
    localStorage.clear();
  });

  describe('#initialize', () => {
    it('places only letters in next available tile', () => {
      let notLetters = [
        '1', '#', ';', ',', '.', '/', '!', '£', '$', '%', '^', '&',
        '*', '(', ')', '-', '_', '+', '='
      ];
      notLetters.forEach((notLetter) => typeKey(notLetter));
      expect(board.contents()).toEqual([ 'b', '', '', '', '', '', '', '', '', '' ]);
    });

    it('places typed letter in next available tile of the current row', () => {
      typeKey('a');
      expect(board.contents()).toEqual(['b', 'a', '', '', '', '', '', '', '', '']);
    });

    it('stops placing after 5 letters have been placed in the current row', () => {
      ['a', 'b', 'a', 'b', 'a'].forEach((key) => typeKey(key));
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', '', '', '', '', '']);
    });

    it('starts placing in next row after Enter has been pressed', () => {
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', 'a', '', '', '', '']);
    });

    it('does nothing if Enter is pressed midword', () => {
      ['a', 'b', UI.ENTER_KEY, 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', 'a', '', '', '', '']);
    });

    it('deletes a letter in the current row', () => {
      typeKey(UI.BACKS_KEY);
      expect(board.contents()).toEqual(['', '', '', '', '', '', '', '', '', '']);
    });

    it('does not delete the previous word', () => {
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      typeKey(UI.BACKS_KEY);
      typeKey(UI.BACKS_KEY);
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', '', '', '', '', '']);
    });

    it('keeps deleting if Enter is pressed midword', () => {
      ['a', 'b', 'a', 'b'].forEach((key) => typeKey(key));
      typeKey(UI.BACKS_KEY);
      typeKey(UI.ENTER_KEY);
      typeKey(UI.BACKS_KEY);
      expect(board.contents()).toEqual(['b', 'a', 'b', '', '', '', '', '', '', '']);
    });

    it('submits word after Enter has been pressed', () => {
      spyOn(game, 'submitWord').and.returnValue(
        [].concat([State.CORRECT, State.PRESENT], Array(3).fill(State.ABSENT))
      );
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      expect(game.submitWord).toHaveBeenCalledWith(['b', 'a', 'b', 'a', 'b']);
    });

    it('applies evaluations to board', () => {
      let evaluations = [].concat([State.CORRECT, State.PRESENT], Array(3).fill(State.ABSENT));

      spyOn(game, 'submitWord').and.returnValue(evaluations);
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      let tiles = Array.from(grid.querySelectorAll('.grid__tile[data-state]'));
      let states = tiles.map(tile => { return State.fromName(tile.dataset.state); });

      expect(states).toEqual(evaluations);
    });

    it('applies evaluations to keyboard', () => {
      let evaluations = Array(Game.WORD_SIZE).fill(State.CORRECT);
      spyOn(game, 'submitWord').and.returnValue(evaluations);

      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      let keyboard = Array.from(grid.querySelectorAll('button[data-state]'));
      let states = keyboard.map(key => { return key.dataset.state; });

      expect(states).toEqual([State.CORRECT.name, State.CORRECT.name]);
    });

    it('avoids typing if win happened', () => {
      spyOn(game, 'isWin').and.returnValue(true);
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a'].forEach((key) => typeKey(key));
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', '', '', '', '', '']);
    });

    it('updates stats if win happened', () => {
      spyOn(game, 'isWin').and.returnValue(true);
      spyOn(stats, 'write');
      ['a', 'b', 'a', 'b', UI.ENTER_KEY].forEach((key) => typeKey(key));
      expect(stats.write).toHaveBeenCalledWith(1, true);
    });

    it('shows message if win happened', () => {
      jasmine.clock().install();

      spyOn(game, 'isWin').and.returnValue(true);
      ['a', 'b', 'a', 'b', UI.ENTER_KEY].forEach((key) => typeKey(key));
      jasmine.clock().tick(1);
      expect(messages.textContent).not.toEqual('');

      jasmine.clock().uninstall();
    });

    it('updates stats if game over happened', () => {
      spyOn(game, 'isWin').and.returnValue(false);
      spyOn(stats, 'write');
      let keys = ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a', 'b', 'a', 'b', 'a', UI.ENTER_KEY];
      keys.forEach((key) => typeKey(key));
      expect(stats.write).toHaveBeenCalledWith(2, false);
    });

    it('shows word if game over happened', () => {
      jasmine.clock().install();

      spyOn(game, 'isWin').and.returnValue(false);
      game.word ='baker';
      let keys = ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a', 'b', 'a', 'b', 'a', UI.ENTER_KEY];
      keys.forEach((key) => typeKey(key));
      jasmine.clock().tick(1);
      expect(messages.textContent).toContain('baker');

      jasmine.clock().uninstall();
    });

    it('works with UI keyboard too', () => {
      ['a', 'b', 'a', 'b', UI.ENTER_KEY, 'a',].forEach((key) => clickKey(key));
      expect(board.contents()).toEqual(['b', 'a', 'b', 'a', 'b', 'a', '', '', '', '']);
    });
  });

  function setupDOM() {
    messages = document.createElement('div');
    messages.id = 'messages';

    grid = document.createElement('div');
    grid.innerHTML = `
    <div class="grid__tile">b</div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>

    <div class="grid__tile"></div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>
    <div class="grid__tile"></div>

    <div class="row">
      <button data-key="a">a</button>
      <button data-key="b">b</button>
      <button data-key="Enter">Enter</button>
      <button data-key="Backspace">Backspace</button>
    </div>
    `;

    document.body.appendChild(messages);
    document.body.appendChild(grid);
  }

  function resetDOM() {
    messages.remove();
    grid.remove();
  }

  function typeKey(key) {
    let event = new Event('keydown');
    event.key = key;
    document.dispatchEvent(event);
  }

  function clickKey(key) {
    document.querySelector(`[data-key=${key}]`).click();
  }
});
