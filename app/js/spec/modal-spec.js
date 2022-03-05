describe('Modal', () => {
  let container, modal, modalDiv;

  beforeEach(() => {
    setupDOM();

    modal = new Modal(Selectors.HELP);
    modal.initialize();
  });

  afterEach(() => {
    resetDOM();
  });

  describe('#initialize', () => {
    it('shows hidden modal when button is clicked', () => {
      clickButton();
      expect(modalDiv.classList).not.toContain('visually-hidden');
      expect(modalDiv.classList).toContain('visible');
    });

    it('hides visible modal when clicked', () => {
      modalDiv.classList.replace('visually-hidden', 'visible');
      modalDiv.click();
      expect(modalDiv.classList).toContain('visually-hidden');
      expect(modalDiv.classList).not.toContain('visible');
    });
  });

  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
    <button id="help"></button>
    <div id="modal-help" class="visually-hidden"></div>
    `;
    document.body.appendChild(container);
    modalDiv = document.getElementById('modal-help');
  }

  function resetDOM() {
    container.remove();
  }

  function clickButton() {
    document.getElementById('help').click();
  }
});
