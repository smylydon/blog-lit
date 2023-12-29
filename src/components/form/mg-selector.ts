import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {when} from 'lit/directives/when.js';

import {FormItemBase} from './mg-form-item';
import styles from './mg-form.scss';

@customElement('mg-selector')
export class MgSelector extends FormItemBase(LitElement) {
  static override styles = styles;

  @property({attribute: 'items'})
  set setItems(items: string) {
    this.items = JSON.parse(items);
  }

  @property({attribute: false})
  items = [];

  @property()
  initialItem = '';

  constructor() {
    super();
    this.setFormItemName('selector');
  }

  _onSelected(e: Event) {
    e.stopImmediatePropagation();
    this.value = (e.target as HTMLSelectElement).value;
  }

  override render() {
    const name = this.getFormItemName();

    const output1 = when(
      this.label.length > 0,
      () => html`<label htmlFor=${name}>${this.label}</label>`,
      () => html``
    );

    const initialItem = this.initialItem.trim();
    const comparator = initialItem.length > 0 ? initialItem : this.value.trim();

    const choices = repeat(
      this.items,
      (item) => item.id,
      (item, index) => {
        if (String(item.id) === comparator) {
          this.value = comparator;
          return html` <option value=${index} selected>${item.item}</option> `;
        } else {
          return html` <option value=${index}>${item.item}</option> `;
        }
      }
    );

    const output2 = when(
      this.disable,
      () => html`<select name=${name} disabled>
        <option value=""></option>
        ${choices}
      </select>`,
      () => html`<select name=${name} @change=${this._onSelected}>
        <option value=""></option>
        ${choices}
      </select>`
    );

    return html` ${output1} ${output2} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-selector': MgSelector;
  }
}
