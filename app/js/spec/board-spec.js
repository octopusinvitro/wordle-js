describe('Board', () => {
  let board, grid;

  beforeEach(() => {
    setupDOM();
    board = new Board('.grid__tile');
  });

  afterEach(() => {
    resetDOM();
  });

  describe('#contents', () => {
    it('returns contents of board', () => {
      expect(board.contents()).toEqual(['b', '', '', '', '', '', '', '', '', '']);
    });
  });

  describe('#word', () => {
    it('returns word in current row', () => {
      board.tiles.slice(0, 5).forEach(tile => { tile.textContent = 'a'; });
      expect(board.word().join('')).toEqual('aaaaa');

      fillBoard();
      board.currentRow = 1;
      expect(board.word().join('')).toEqual('bbbbb');
    });
  });

  describe('#wordTiles', () => {
    it('returns wordTiles in current row', () => {
      fillBoard();
      expect(board.wordTiles().length).toEqual(Game.WORD_SIZE);
    });
  });

  describe('#isRowFull', () => {
    it('detects if current row is full', () => {
      fillBoard();
      expect(board.isRowFull()).toEqual(true);
    });

    it('detects if current row is not full', () => {
      expect(board.isRowFull()).toEqual(false);
    });
  });

  describe('#firstEmptyTile', () => {
    it('returns first available tile in current row', () => {
      expect(board.firstEmptyTile()).toEqual(board.tiles[1]);
    });

    it('returns nothing if no available tiles in current row', () => {
      fillBoard();
      expect(board.firstEmptyTile()).toEqual(undefined);
    });
  });

  describe('#lastBusyTile', () => {
    it('returns first occupied tile in current row', () => {
      expect(board.lastBusyTile()).toEqual(board.tiles[0]);
    });

    it('returns nothing if no occupied tiles in current row', () => {
      board.tiles[0].textContent = '';
      expect(board.lastBusyTile()).toEqual(undefined);
    });
  });

  describe('#isNextTileInCurrentRow', () => {
    it('detects if next empty tile is in current row', () => {
      expect(board.isNextTileInCurrentRow()).toEqual(true);
    });

    it('detects if next empty tile is not in current row', () => {
      board.currentRow += 1;
      expect(board.isNextTileInCurrentRow()).toEqual(false);
    });
  });

  describe('#isThisTileInCurrentRow', () => {
    it('detects if last occupied tile is in current row', () => {
      expect(board.isThisTileInCurrentRow()).toEqual(true);
    });

    it('detects if last occupied tile is not in current row', () => {
      board.currentRow += 1;
      expect(board.isThisTileInCurrentRow()).toEqual(false);
    });
  });

  function setupDOM() {
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
    `;
    document.body.appendChild(grid);
  }

  function resetDOM() {
    grid.remove();
  }

  function fillBoard() {
    board.tiles.forEach(tile => tile.textContent = 'b');
  }
});
