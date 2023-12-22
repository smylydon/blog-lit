import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {when} from 'lit/directives/when.js';

import {FormItem} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-selector')
export class MgSelector extends LitElement {
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

  @property({attribute: 'items'})
  set setItems(items: string) {
    this.items = JSON.parse(items);
  }

  @property({attribute: false})
  items = [];

  override render() {
    const output = when(
      this.label.length > 0,
      () => html`<label htmlFor="selector">${this.label}</label>`,
      () => html``
    );
    return html`
      ${output}
      <select name="selector">
        <option value=""></option>
        ${repeat(
          this.items,
          (item) => item.id,
          (item, index) => html` <option value=${index}>${item.item}</option> `
        )}
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-selector': MgSelector;
  }
}
