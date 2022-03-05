describe('Stats', () => {
  let fakeTime, stats;

  beforeEach(() => {
    stats = new Stats();
    fakeTime = mockClock().getTime();
  });

  afterEach( () => {
    localStorage.clear();
    unMockClock();
  });

  describe('#read', () => {
    it('returns default if empty', () => {
      let defaultStats = { ...Stats.DEFAULT };
      defaultStats.lastPlayed = fakeTime;
      expect(stats.read()).toEqual(defaultStats);
    });

    it('reads stats from localStorage', () => {
      let stored = { ...Stats.DEFAULT };
      stored.lastPlayed = 1647909102410;
      setLocalStorage(stored);
      expect(stats.read()).toEqual(stored);
    });

    it('ensures a valid "gamesPlayed" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().gamesPlayed).toEqual(Stats.DEFAULT.gamesPlayed);
    });

    it('ensures a valid "gamesPlayed" is returned when negative', () => {
      setLocalStorage({ gamesPlayed: -1 });
      expect(stats.read().gamesPlayed).toEqual(Stats.DEFAULT.gamesPlayed);
    });

    it('ensures a valid "gamesWon" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().gamesWon).toEqual(Stats.DEFAULT.gamesWon);
    });

    it('ensures a valid "gamesWon" is returned when negative', () => {
      setLocalStorage({ gamesWon: -1 });
      expect(stats.read().gamesWon).toEqual(Stats.DEFAULT.gamesWon);
    });

    it('ensures a valid "winPercentage" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().winPercentage).toEqual(Stats.DEFAULT.winPercentage);
    });

    it('ensures a valid "winPercentage" is returned when negative', () => {
      setLocalStorage({ winPercentage: -1 });
      expect(stats.read().winPercentage).toEqual(Stats.DEFAULT.winPercentage);
    });

    it('ensures a valid "winPercentage" is returned when beyond 100%', () => {
      setLocalStorage({ winPercentage: 200 });
      expect(stats.read().winPercentage).toEqual(Stats.DEFAULT.winPercentage);
    });

    it('ensures a valid "lastPlayed" is returned when no localStorage', () => {
      expect(stats.read().lastPlayed).toEqual(fakeTime);
    });

    it('ensures a valid "lastPlayed" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().lastPlayed).toEqual(fakeTime);
    });

    it('ensures a valid "lastPlayed" is returned when negative', () => {
      setLocalStorage({ lastPlayed: -1 });
      expect(stats.read().lastPlayed).toEqual(fakeTime);
    });

    it('ensures a valid "currentStreak" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().currentStreak).toEqual(Stats.DEFAULT.currentStreak);
    });

    it('ensures a valid "currentStreak" is returned when negative', () => {
      setLocalStorage({ currentStreak: -1 });
      expect(stats.read().currentStreak).toEqual(Stats.DEFAULT.currentStreak);
    });

    it('ensures a valid "maximumStreak" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().maximumStreak).toEqual(Stats.DEFAULT.maximumStreak);
    });

    it('ensures a valid "maximumStreak" is returned when negative', () => {
      setLocalStorage({ maximumStreak: -1 });
      expect(stats.read().maximumStreak).toEqual(Stats.DEFAULT.maximumStreak);
    });

    it('ensures a valid "guesses" is returned when missing', () => {
      setLocalStorage({});
      expect(stats.read().guesses).toEqual(Stats.DEFAULT.guesses);
    });

    it('ensures a valid "guesses" is returned when not an object', () => {
      setLocalStorage({ guesses: function x() {} });
      expect(stats.read().guesses).toEqual(Stats.DEFAULT.guesses);
    });
  });

  describe('#write', () => {
    let totalGuesses = 1;

    it('writes "gamesPlayed" to localStorage', () => {
      stats.write(totalGuesses);
      expect(getLocalStorage().gamesPlayed).toEqual(1);
    });

    it('updates existing "gamesPlayed"', () => {
      setLocalStorage({ gamesPlayed: 1 });
      stats.write(totalGuesses);
      expect(getLocalStorage().gamesPlayed).toEqual(2);
    });

    it('updates existing "gamesWon" if won', () => {
      setLocalStorage({ gamesWon: 1 });
      stats.write(totalGuesses);
      expect(getLocalStorage().gamesWon).toEqual(2);
    });

    it('does not update "gamesWon" if lost', () => {
      setLocalStorage({ gamesWon: 1 });
      stats.write(totalGuesses, false);
      expect(getLocalStorage().gamesWon).toEqual(1);
    });

    it('updates existing "winPercentage" if won', () => {
      setLocalStorage({ gamesPlayed: 1, gamesWon: 0, winPercentage: 0 });
      stats.write(totalGuesses);
      expect(getLocalStorage().winPercentage).toEqual(50);
    });

    it('updates existing "winPercentage" if lost', () => {
      setLocalStorage({ gamesPlayed: 1, gamesWon: 1, winPercentage: 100 });
      stats.write(totalGuesses, false);
      expect(getLocalStorage().winPercentage).toEqual(50);
    });

    it('writes "currentStreak" to localStorage', () => {
      stats.write(totalGuesses);
      expect(getLocalStorage().currentStreak).toEqual(1);
    });

    it('updates existing "currentStreak" if played the next day', () => {
      setLocalStorage({ currentStreak: 1, lastPlayed: fakeTime });
      let dayInMilliseconds = 24 * 3600 * 1000;
      jasmine.clock().tick(dayInMilliseconds);
      stats.write(totalGuesses);
      expect(getLocalStorage().currentStreak).toEqual(2);
    });

    it('sets "currentStreak" to zero if not played the next day', () => {
      setLocalStorage({ currentStreak: 1, lastPlayed: fakeTime });
      let twoDaysInMilliseconds = 2 * 24 * 3600 * 1000;
      jasmine.clock().tick(twoDaysInMilliseconds);
      stats.write(totalGuesses);
      expect(getLocalStorage().currentStreak).toEqual(0);
    });

    it('updates existing "maximumStreak" if lower than "currentStreak"', () => {
      setLocalStorage({ currentStreak: 1, maximumStreak: 1 });
      stats.write(totalGuesses);
      expect(getLocalStorage().maximumStreak).toEqual(2);
    });

    it('does not update "maximumStreak" if larger than "currentStreak"', () => {
      setLocalStorage({ currentStreak: 1, maximumStreak: 10 });
      stats.write(totalGuesses);
      expect(getLocalStorage().maximumStreak).toEqual(10);
    });

    it('writes "guesses" to localStorage', () => {
      stats.write(totalGuesses);
      expect(getLocalStorage().guesses).toEqual({
        '1': 1, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0
      });
    });

    it('updates existing "guesses"', () => {
      setLocalStorage({
        guesses: { '1': 1, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
      });
      stats.write(totalGuesses);
      expect(getLocalStorage().guesses).toEqual({
        '1': 2, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0
      });
    });

    it('updates existing "guesses.fail" if lost', () => {
      stats.write(Game.TOTAL_ROWS, false);
      expect(getLocalStorage().guesses).toEqual({
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 1
      });
    });

    it('does not update "guesses.fail" if won at max guesses', () => {
      stats.write(Game.TOTAL_ROWS);
      expect(getLocalStorage().guesses).toEqual({
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 1, 'fail': 0
      });
    });

    it('updates existing "lastPlayed"', () => {
      setLocalStorage({ lastPlayed: 1647909102410 });
      stats.write(totalGuesses);
      expect(getLocalStorage().lastPlayed).toEqual(fakeTime);
    });
  });

  function setLocalStorage(value) {
    localStorage.setItem(Stats.KEY, JSON.stringify(value));
  }

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem(Stats.KEY));
  }

  function mockClock() {
    jasmine.clock().install();
    let fakeTime = new Date(2022, 2, 22);
    jasmine.clock().mockDate(fakeTime);
    return fakeTime;
  }

  function unMockClock() {
    jasmine.clock().uninstall();
  }
});
