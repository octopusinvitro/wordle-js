class Game {
  static TOTAL_ROWS = 6;
  static WORD_SIZE = 5;

  constructor(total_rows = null) {
    this._total_rows = total_rows || Game.TOTAL_ROWS;
    this._words = Words.ALL;
    this.word = this._chooseWord();
    this._evaluations = [];
  }

  get evaluations() {
    return this._evaluations;
  }

  submitWord(word) {
    let evaluation = word.map((letter, index) => {
      return this._evaluate(letter, index);
    });

    this.evaluations.push(evaluation);
    return evaluation;
  }

  isWin() {
    let lastEvaluation = this.evaluations.slice(-1);
    if (lastEvaluation.length === 0) {
      return false;
    }

    let correct = lastEvaluation[0].filter(evaluation => evaluation === State.CORRECT);
    return correct.length === Game.WORD_SIZE;
  }

  isOver() {
    return this.evaluations.length >= this._total_rows;
  }

  buildShareableBoard() {
    let rows = this._evaluations.map(evaluation => {
      return evaluation.map(state => { return state.tile; }).join('');
    });
    return rows.join('\n');
  }

  _chooseWord() {
    let index = Math.random() * this._words.length | 0;
    return this._words[index];
  }

  _evaluate(letter, index) {
    if (letter === this.word.charAt(index)) {
      return State.CORRECT;
    }

    return (this.word.includes(letter)) ? State.PRESENT : State.ABSENT;
  }
}
