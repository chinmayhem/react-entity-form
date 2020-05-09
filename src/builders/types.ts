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

interface PayloadInterface<V> {
  value: V;
  additional?: any;
}

export interface OnActionInterface<T> {
  ({ type, payload }: { type: typeof FORM_CHANGE_ACTION; payload: PayloadInterface<T> }): Promise<unknown>;
}

export interface FieldComponentProps<T> {
  value: T;
  onAction: OnActionInterface<T>;
}

export interface Fields {
  [k: string]: {
    fieldId: string;
    isHidden: boolean;
    FieldComponent: React.ElementType;
    componentProps: object;
  };
}
