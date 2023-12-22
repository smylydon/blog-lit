export enum ValidatorType {
  exists = 'exists',
  length = 'length',
}

export interface Validator {
  valid: boolean;
  type: ValidatorType;
}

export interface ExistsValidator extends Validator {
  type: ValidatorType.exists;
}

export interface LengthValidator extends Validator {
  type: ValidatorType.length;
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
