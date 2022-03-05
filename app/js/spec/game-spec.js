describe('Game', () => {
  let game;

  beforeEach(() => {
    spyOn(Math, 'random').and.returnValue(0);
    game = new Game();
  });

  describe('#submitWord', () => {
    it('detects correct letters', () => {
      expect(submitWord('bokeh')).toEqual(
        [State.CORRECT, State.ABSENT, State.CORRECT, State.CORRECT, State.ABSENT]
      );
    });

    it('detects present letters', () => {
      expect(submitWord('roman')).toEqual(
        [State.PRESENT, State.ABSENT, State.ABSENT, State.PRESENT, State.ABSENT]
      );
    });

    it('detects absent letters', () => {
      expect(submitWord('foggy')).toEqual(
        [State.ABSENT, State.ABSENT, State.ABSENT, State.ABSENT, State.ABSENT]
      );
    });
  });

  describe('#isWin', () => {
    it('detects is win', () => {
      submitWord('baker');
      expect(game.isWin()).toEqual(true);
    });

    it('detects is not win', () => {
      submitWord('bread');
      expect(game.isWin()).toEqual(false);
    });
  });

  describe('#isOver', () => {
    it('detects is game over', () => {
      expect(game.isOver()).toEqual(false);
    });

    it('detects is not game over', () => {
      Array(Game.TOTAL_ROWS).fill().forEach(() => submitWord('bread') );
      expect(game.isOver()).toEqual(true);
    });
  });

  describe('#buildShareableBoard', () => {
    it('generates safe-to-share board representation', () => {
      submitWord('bread');
      submitWord('baker');
      let board = '🟩🟨🟨🟨⬛\n🟩🟩🟩🟩🟩';
      expect(game.buildShareableBoard()).toEqual(board);
    });
  });

  function submitWord(word) {
    return game.submitWord(word.split(''));
  }
});
