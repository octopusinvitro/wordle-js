class Modal {
  constructor(selectors) {
    Object.keys(selectors).forEach(key => {
      key.endsWith('Class') ?
        this._setClass(key, selectors[key]) :
        this._setElement(key, selectors[key]);
    });
  }

  initialize() {
    this.button.addEventListener('click', () => { this.show(); });
    this.modal.addEventListener('click', () => { this.hide(); });
  }

  show() {
    this.modal.classList.replace(this.hiddenClass, this.visibleClass);
  }

  hide() {
    this.modal.classList.replace(this.visibleClass, this.hiddenClass);
  }

  _setClass(key, value) {
    this[`${key}`] = value;
  }

  _setElement(key, value) {
    this[`${key}`] = document.getElementById(value);
  }
}
