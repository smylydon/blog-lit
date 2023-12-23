import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {FormItemBase} from './mg-form-item';
import styles from './mg-form.scss';

@customElement('mg-textarea')
export class MgTextarea extends FormItemBase(LitElement) {
  static override styles = styles;
  _onInput(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    this.value = (e.target as HTMLTextAreaElement).value;
  }

  override render() {
    const output1 = when(
      this.label.length > 0,
      () => html`<label htmlFor="textArea">${this.label}</label>`,
      () => html``
    );
    const output2 = when(
      this.disable,
      () =>
        html` <textarea
          name="textArea"
          value=${this.value}
          disabled
        ></textarea>`,
      () =>
        html` <textarea
          name="textArea"
          value=${this.value}
          @input=${this._onInput}
        ></textarea>`
    );
    return html` ${output1} ${output2} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-textarea': MgTextarea;
  }
}
