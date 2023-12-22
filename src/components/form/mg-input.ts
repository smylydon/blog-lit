import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {FormItem, ValidatorType} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-input')
export class MgInput extends LitElement {
  static override styles = styles;

  @property({attribute: 'model'})
  set setPost(formItem: string) {
    this.formItem = JSON.parse(formItem);
  }

  @property({attribute: false})
  formItem: FormItem = {
    type: '',
    name: '',
    value: '',
    validator: {
      length: 0,
      type: ValidatorType.length,
      valid: true,
    },
  };

  @property()
  value = '';

  @property()
  label = '';

  override render() {
    const output = when(
      this.label.length > 0,
      () => html`<label htmlFor="input">${this.label}</label>`,
      () => html``
    );
    return html`
      ${output}
      <input name="input" value=${this.value} />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-input': MgInput;
  }
}
