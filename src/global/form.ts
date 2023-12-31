export enum FormEvent {
  Updated = 'mg-form:updated',
}

export enum FormItemEvent {
  Updated = 'mg-formitem:updated',
}

export enum ValidatorType {
  Exists = 'exists',
  Length = 'length',
}

export interface Validator {
  valid: boolean;
  type: ValidatorType;
}

export interface ExistsValidator extends Validator {
  type: ValidatorType.Exists;
}

export interface LengthValidator extends Validator {
  type: ValidatorType.Length;
  length: number;
}

export interface FormItem {
  type: string;
  name: string;
  value: number | string | boolean;
  validator?: ExistsValidator | LengthValidator;
}

export interface Form {
  name: string;
  valid: boolean;
  formItems: FormItem[];
}
