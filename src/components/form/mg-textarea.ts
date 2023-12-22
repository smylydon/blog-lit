import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {FormItem} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-textarea')
export class MgTextarea extends LitElement {
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
  };

  @property()
  value = '';

  @property()
  label = '';

  override render() {
    const output = when(
      this.label.length > 0,
      () => html`<label htmlFor="textArea">${this.label}</label>`,
      () => html``
    );
    return html`
      ${output}
      <textarea name="textArea" value=${this.value}></textarea>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-textarea': MgTextarea;
  }
}
