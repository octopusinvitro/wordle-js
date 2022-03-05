class Selectors {
  static CLASSES = {
    hiddenClass: 'visually-hidden',
    visibleClass: 'visible'
  };

  static HELP = {
    ...{ button: 'help', modal: 'modal-help' },
    ...Selectors.CLASSES
  };

  static SETTINGS = {
    ...{ button: 'settings', modal: 'modal-settings' },
    ...Selectors.CLASSES
  };

  static STATS = {
    button: 'stats',
    modal: 'modal-stats',
    gamesPlayed: 'gamesPlayed',
    winPercentage: 'winPercentage',
    currentStreak: 'currentStreak',
    maximumStreak: 'maximumStreak',
    bar1: 'bar1',
    bar2: 'bar2',
    bar3: 'bar3',
    bar4: 'bar4',
    bar5: 'bar5',
    bar6: 'bar6',
    share: 'share',
    shareClass: 'share-button',
    hiddenClass: Selectors.CLASSES.hiddenClass,
    visibleClass: 'visible-stats'
  };

  static GAME = { keys: '[data-key]', messages: 'messages' };
}
