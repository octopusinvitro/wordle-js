describe('ModalStats', () => {
  let container, game, modal, modalDiv, stats;

  beforeEach(() => {
    setupDOM();

    game = new Game();
    stats = new Stats();
    spyOn(stats, 'read').and.returnValue(Stats.DEFAULT);

    modal = new ModalStats(Selectors.STATS, game, stats);
    modal.initialize();
  });

  afterEach(() => {
    resetDOM();
  });

  describe('#initialize', () => {
    describe('when button is clicked', () => {
      it('displays statistics data', () => {
        clickButton();
        ModalStats.STATS_KEYS.forEach(key => {
          expect(contentsOf(key)).toEqual(Stats.DEFAULT[key]);
        });
      });

      it('displays bar contents', () => {
        clickButton();
        ModalStats.BAR_INDICES.forEach(index => {
          expect(contentsOf(`bar${index}`)).toEqual(Stats.DEFAULT.guesses[index]);
        });
      });

      it('displays bar counts', () => {
        clickButton();
        document.querySelectorAll('span[id^=bar]').forEach((bar, index) => {
          expect(bar.style.cssText).toContain(Stats.DEFAULT.guesses[index + 1]);
        });
      });

      it('shows hidden share button if game was won', () => {
        spyOn(game, 'isWin').and.returnValue(true);
        clickButton();
        expect(modal.shareButton.classList).not.toContain('visually-hidden');
        expect(modal.shareButton.classList).toContain('share-button');
      });

      it('does not show hidden share button if game was lost', () => {
        spyOn(game, 'isWin').and.returnValue(false);
        clickButton();
        expect(modal.shareButton.classList).not.toContain('share-button');
        expect(modal.shareButton.classList).toContain('visually-hidden');
      });

      it('shows hidden modal', () => {
        clickButton();
        expect(modalDiv.classList).not.toContain('visually-hidden');
        expect(modalDiv.classList).toContain('visible-stats');
      });
    });

    describe('when modal is clicked', () => {
      beforeEach(() => {
        clickButton();
        modalDiv.click();
      });

      it('hides it', () => {
        expect(modalDiv.classList).toContain('visually-hidden');
        expect(modalDiv.classList).not.toContain('visible-stats');
      });

      it('resets share message contents', () => {
        expect(document.querySelector('#share p').textContent).toEqual('');
      });
    });

    // xdescribe('when share button is clicked', () => {
    //   let board = '🟩🟨🟨🟨⬛\n🟩🟩🟩🟩🟩';
    //
    //   beforeEach(() => {
    //     spyOn(game, 'isWin').and.returnValue(true);
    //     spyOn(game, 'buildShareableBoard').and.returnValue(board);
    //     clickButton();
    //   });
    //
    //   it('copies board representation to clipboard', () => {
    //     modal.shareButton.click();
    //     modal.shareMessage.focus();
    //     document.execCommand('paste');
    //     expect(modal.shareMessage.textContent).toEqual(board);
    //   });
    //
    //   it('displays success message', () => {
    //     modal.shareButton.click();
    //     expect(modal.shareMessage.textContent).toContain('Copied');
    //   });
    // });
    xdescribe('#copyToClipboard', () => {
      let board = '🟩🟨🟨🟨⬛\n🟩🟩🟩🟩🟩';

      beforeEach(() => {
        spyOn(game, 'buildShareableBoard').and.returnValue(board);
      });

      it('copies board representation to clipboard', () => {
        modal.copyToClipboard().then(() => {
          modal.shareMessage.focus();
          document.execCommand('paste');
          expect(modal.shareMessage.textContent).toEqual(board);
        });
      });

      it('displays success message', () => {
        modal.copyToClipboard().then(() => {
          expect(modal.shareMessage.textContent).toContain('Copied');
        });
      });
    });
  });

  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
    <button id="stats"></button>
    <section id="modal-stats" class="visually-hidden">
      <span id="gamesPlayed"></span>
      <span id="winPercentage"></span>
      <span id="currentStreak"></span>
      <span id="maximumStreak"></span>

      <span id="bar1"></span>
      <span id="bar2"></span>
      <span id="bar3"></span>
      <span id="bar4"></span>
      <span id="bar5"></span>
      <span id="bar6"></span>

      <footer id="share">
        <p></p>
        <button class="visually-hidden"></button>
      </footer>
    </section>
    `;

    document.body.appendChild(container);
    modalDiv = document.getElementById('modal-stats');
  }

  function resetDOM() {
    container.remove();
  }

  function clickButton() {
    document.getElementById('stats').click();
  }

  function contentsOf(id) {
    return document.getElementById(id).textContent | 0;
  }
});
