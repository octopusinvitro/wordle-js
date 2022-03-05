class Stats {
  static KEY = 'stats';
  static DEFAULT = {
    gamesPlayed: 0,
    winPercentage: 0,
    currentStreak: 0,
    maximumStreak: 0,
    guesses: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 },
    gamesWon: 0,
    lastPlayed: 0
  };

  read() {
    let stats = JSON.parse(localStorage.getItem(Stats.KEY));

    if (!stats) {
      stats = { ...Stats.DEFAULT };
      stats.guesses = { ...Stats.DEFAULT.guesses };
    }

    return this._ensureValidStats(stats);
  }

  write(totalGuesses, won = true) {
    let stats = this.read();

    stats.gamesPlayed += 1;
    stats.gamesWon += won | 0;
    stats.winPercentage = this._winPercentage(stats);
    stats.currentStreak = this._currentStreak(stats);
    stats.maximumStreak = this._maximumStreak(stats);
    won ? stats.guesses[String(totalGuesses)] += 1 : stats.guesses.fail += 1;
    stats.lastPlayed = Date.now();

    localStorage.setItem(Stats.KEY, JSON.stringify(stats));
  }

  _ensureValidStats(stats) {
    stats = this._ensureValidInteger(stats, 'gamesPlayed');
    stats = this._ensureValidPercentage(stats, 'winPercentage');
    stats = this._ensureValidInteger(stats, 'currentStreak');
    stats = this._ensureValidInteger(stats, 'maximumStreak');
    stats = this._ensureValidObject(stats, 'guesses');
    stats = this._ensureValidInteger(stats, 'gamesWon');
    stats = this._ensureValidDate(stats, 'lastPlayed');

    return stats;
  }

  _ensureValidInteger(stats, key) {
    if (!stats[key] || stats[key] < 0) {
      stats[key] = Stats.DEFAULT[key];
    }

    return stats;
  }

  _ensureValidPercentage(stats, key) {
    if (!stats[key] || stats[key] < 0 || stats[key] > 100) {
      stats[key] = Stats.DEFAULT[key];
    }

    return stats;
  }

  _ensureValidObject(stats, key) {
    if (!stats[key] || typeof stats[key] !== 'object' || stats[key].constructor !== Object) {
      stats[key] = { ...Stats.DEFAULT[key] };
    }

    return stats;
  }

  _ensureValidDate(stats, key) {
    if (!stats[key] || (new Date(stats[key])).getTime() <= 0) {
      stats[key] = Date.now();
    }

    return stats;
  }

  _winPercentage(stats) {
    let percentage = (stats.gamesWon / stats.gamesPlayed) * 100;

    return percentage | 0;
  }

  _currentStreak(stats) {
    let lastPlayed = (new Date(stats.lastPlayed));
    let now = (new Date(Date.now()));
    let playedNextDay = (now.getDay() - lastPlayed.getDay() < 2);

    return playedNextDay ? stats.currentStreak + 1 : 0;
  }

  _maximumStreak(stats) {
    return (stats.maximumStreak < stats.currentStreak) ? stats.currentStreak : stats.maximumStreak;
  }
}
