class Board {
  constructor(tilesSelector) {
    this._tiles = Array.from(document.querySelectorAll(tilesSelector));
    this._currentRow = 0;
  }

  get tiles() {
    return this._tiles;
  }

  get currentRow() {
    return this._currentRow;
  }

  set currentRow(value) {
    this._currentRow = value;
  }

  contents(tiles) {
    tiles = tiles || this.tiles;
    return tiles.map(tile => { return tile.textContent; });
  }

  word() {
    return this.contents(this.wordTiles());
  }

  wordTiles() {
    return this._getUsedTiles().slice(-Game.WORD_SIZE);
  }

  isRowFull() {
    return this._getUsedTiles().length % Game.WORD_SIZE === 0;
  }

  firstEmptyTile() {
    let emptyTiles = this._getEmptyTiles();

    if (emptyTiles.length !== 0) {
      return emptyTiles[0];
    }
  }

  lastBusyTile() {
    return this._getUsedTiles().slice(-1)[0];
  }

  isNextTileInCurrentRow() {
    let nextTile = this._getUsedTiles().length;
    return this._inCurrentRow(nextTile);
  }

  isThisTileInCurrentRow() {
    let thisTile = this._getUsedTiles().length - 1;
    return this._inCurrentRow(thisTile);
  }

  _inCurrentRow(tilePosition) {
    let row = (tilePosition / Game.WORD_SIZE) | 0;
    return row === this.currentRow;
  }

  _getUsedTiles() {
    return this.tiles.filter(function(tile) { return tile.textContent !== ''; });
  }

  _getEmptyTiles() {
    return this.tiles.filter(function(tile) { return tile.textContent === ''; });
  }
}
