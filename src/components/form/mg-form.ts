import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Form} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-form')
export class MgForm extends LitElement {
  static override styles = styles;

  @property({attribute: 'model'})
  set setPost(form: string) {
    this.form = JSON.parse(form);
  }

  @property({attribute: false})
  form: Form = {
    name: '',
    valid: true,
    formItems: [],
  };

  constructor() {
    super();
  }

  handleSlotchange(event) {
    console.log('item:::', event);
    const childNodes = event.target.assignedNodes({flatten: true});
    // ... do something with childNodes ...
    const allText = childNodes
      .map((node) => {
        return node.textContent ? node.textContent : '';
      })
      .join('');
    console.log(childNodes.length, allText);
  }

  override render() {
    return html`
      <form>
        <slot @slotchange=${this.handleSlotchange}>form items</slot>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mg-form': MgForm;
  }
}
