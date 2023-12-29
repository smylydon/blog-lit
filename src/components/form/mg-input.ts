import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {FormItemBase} from './mg-form-item';
import styles from './mg-form.scss';

@customElement('mg-input')
export class MgInput extends FormItemBase(LitElement) {
  static override styles = styles;

  constructor() {
    super();
    this.setFormItemName('input');
  }

  _onInput(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    this.value = (e.target as HTMLInputElement).value;
  }

  override render() {
    const name = this.getFormItemName();

    const output1 = when(
      this.label.length > 0,
      () => html`<label htmlFor=${name}>${this.label}</label>`,
      () => html``
    );
    const output2 = when(
      this.disable,
      () => html` <input name=${name} value=${this.value} disabled />`,
      () =>
        html` <input
          name=${name}
          value=${this.value}
          @input=${this._onInput}
        />`
    );
    return html` ${output1} ${output2} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-input': MgInput;
  }
}
