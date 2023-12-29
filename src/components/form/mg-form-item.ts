import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {FormItem, FormItemEvent, ValidatorType} from '../../global/form';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;
/* eslint-enable  @typescript-eslint/no-explicit-any */

export declare class FormItemBaseInterface {
  set setInput(formItem: string);
  getFormItemName(): string;
  setFormItemName(name: string);
  formItem: FormItem;
  value: string;
  label: string;
  disable: boolean;
  name?: string;
}

export const FormItemBase = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  class FormItemElement extends superClass {
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
    name = '';

    @property()
    value = '';

    @property()
    label = '';

    @property()
    disable;

    private formItemName = 'formItemName';

    setFormItemName(name: string) {
      this.formItemName = name.trim().length > 3 ? name : this.formItemName;
    }

    getFormItemName(): string {
      return this.formItemName + new Date().getTime();
    }

    override updated() {
      if (this.formItem && this.formItem.validator) {
        if (this.formItem.validator) {
          const validator = this.formItem.validator;
          const value = this.value.trim();
          if (validator.type === ValidatorType.length) {
            validator.valid = value.length >= validator.length;
          } else {
            validator.valid = value.length > 0;
          }
        }
        this.formItem.value = this.value.trim();
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
  }

  return FormItemElement as Constructor<FormItemBaseInterface> & T;
};
