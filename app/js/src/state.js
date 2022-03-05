class State {
  static CORRECT = new State('correct');
  static PRESENT = new State('present');
  static ABSENT = new State('absent');

  static fromName(name) {
    let enums = [State.CORRECT, State.PRESENT, State.ABSENT];
    return enums.find(value => name === value.name);
  }

  constructor(name) {
    this.name = name;
    this.tile = this._tile();
  }

  _tile() {
    let tiles = { correct: '🟩', present: '🟨', absent: '⬛' };
    return tiles[this.name];
  }
}
