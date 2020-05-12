import { FORM_CHANGE_ACTION } from './actionTypes';

export interface ColumnObjectInterface {
  id: string;
  rows: RowInterface[];
  isHidden: boolean;
  additional?: any;
}

export type ColumnInterface = string | ColumnObjectInterface;

export interface RowObjectInterface {
  id: string;
  columns: ColumnInterface[];
  isHidden: boolean;
  additional?: any;
}

export type RowInterface = string | RowObjectInterface;

export interface LayoutInterface {
  rows: RowInterface[];
  id: string;
  isHidden: boolean;
  additional?: any;
}

interface PayloadInterface<V, F> {
  value: V;
  fieldId: F;
  additional?: any;
}

export interface OnActionInterface<T, F> {
  ({ type, payload }: { type: typeof FORM_CHANGE_ACTION; payload: PayloadInterface<T, F> }): any;
}

export interface FieldComponentProps<T, F> {
  value: T;
  fieldId: F;
  onAction: OnActionInterface<T, F>;
}

export interface Fields {
  [k: string]: {
    fieldId: string;
    isHidden: boolean;
    FieldComponent: React.ElementType;
    componentProps: object;
  };
}

export interface Values {
  [k: string]: any;
}

export interface Errors {
  [k: string]: any;
}
