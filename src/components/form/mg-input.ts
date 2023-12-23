import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {FormItem, FormItemEvent, ValidatorType} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-input')
export class MgInput extends LitElement {
  static override styles = styles;

  @property({attribute: 'validator'})
  set setInput(formItem: string) {
    this.formItem = JSON.parse(formItem);
  }

  @property({attribute: false})
  formItem: FormItem = {
    type: '',
    name: '',
    value: '',
  };

  @property()
  value = '';

  @property()
  label = '';

  @property()
  disable = false;

  updated() {
    if (this.formItem && this.formItem.validator) {
      const validator = this.formItem.validator;
      const value = this.value.trim();
      if (validator.type === ValidatorType.length) {
        validator.valid = value.length >= validator.length;
      } else {
        validator.valid = value.length > 0;
      }
    }
    this.dispatchEvent(
      new CustomEvent(FormItemEvent.updated, {
        detail: {
          name: this.formItem.name,
          formItem: this.formItem,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onInput(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    this.value = (e.target as HTMLInputElement).value;
  }

  override render() {
    const output1 = when(
      this.label.length > 0,
      () => html`<label htmlFor="input">${this.label}</label>`,
      () => html``
    );
    const output2 = when(
      this.disable,
      () => html` <input name="input" value=${this.value} disabled />`,
      () =>
        html` <input
          name="input"
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
