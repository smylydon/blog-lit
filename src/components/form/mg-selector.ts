import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import styles from './mg-form.scss';

@customElement('mg-selector')
export class MgSelector extends LitElement {
  static override styles = styles;

  @property()
  view = 'list-post';

  override render() {
    return html`
      <form>
        <slot>form items</slot>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-selector': MgSelector;
  }
}
