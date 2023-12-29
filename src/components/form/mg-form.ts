import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {Form, FormEvent, FormItem, FormItemEvent} from '../../global/form';
import styles from './mg-form.scss';

@customElement('mg-form')
export class MgForm extends LitElement {
  static override styles = styles;

  @property({attribute: 'form'})
  set setModel(form: string) {
    this.form = JSON.parse(form);
  }

  @property({attribute: false})
  form: Form = {
    name: '',
    valid: true,
    formItems: [],
  };

  @state()
  childNodes: NodeListOf<ChildNode>;

  constructor() {
    super();
  }

  firstUpdated() {
    this.addEventListener(FormItemEvent.updated, this.changeView);
  }

  disconnectedCallback() {
    this.removeEventListener(FormItemEvent.updated, this.changeView);
    super.disconnectedCallback();
  }

  changeView(e: Event) {
    e.stopImmediatePropagation();
    const detail = (e as CustomEvent).detail;
    if (detail && detail.formItem) {
      const formItem = detail.formItem as FormItem;
      const name = formItem.name;
      if (this.form && this.form.formItems) {
        const formItems = this.form.formItems.filter((formItem) => {
          return formItem.name !== name;
        });
        formItems.push(formItem);
        this.form.formItems = formItems;
      }
    }
    this.validateForm();
  }

  validateForm() {
    if (this.form && this.form.formItems) {
      const formItems = this.form.formItems as FormItem[];
      const validators = formItems.filter(
        (formItem: FormItem) => !!formItem.validator
      );
      this.form.valid = true;
      if (validators.length > 0) {
        this.form.valid = formItems.every((formItem: FormItem) => {
          const valid = !!formItem.validator;
          return valid ? formItem.validator.valid : true;
        });
      }
    }
    this.dispatchEvent(
      new CustomEvent(FormEvent.updated, {
        detail: {
          name: this.form.name,
          form: JSON.parse(JSON.stringify(this.form)), // simple clone
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleSlotchange(event) {
    const childNodes = event.target.assignedNodes({flatten: true});
    // ... do something with childNodes ...
    this.childNodes = childNodes;
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
