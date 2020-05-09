import { ComponentType } from 'react';
import { FieldComponentProps } from './types';

function Null() {
  return null;
}

function makeIdGenerator() {
  let id = 1;
  return function generateId() {
    return `field-${id++}`;
  };
}

const idGenerator = makeIdGenerator();

class FieldBuilder<V, P extends FieldComponentProps<V>> {
  FieldComponent: ComponentType<P> = Null;
  componentProps: Omit<P, 'value' | 'onAction'> = {} as P;
  fieldId: string = idGenerator();
  isHidden: boolean = false;

  constructor(field?: {
    FieldComponent: ComponentType<P>;
    componentProps: Omit<P, 'value' | 'onAction'>;
    isHidden: boolean;
    fieldId: string;
  }) {
    if (field) {
      this.FieldComponent = field.FieldComponent;
      this.componentProps = field.componentProps;
      this.isHidden = field.isHidden;
      this.fieldId = field.fieldId;
    }
  }

  setFieldComponent(Component: ComponentType<P & { value: V }>) {
    this.FieldComponent = Component;
  }

  setComponentProps(componentProps: Omit<P, 'value' | 'onAction'>) {
    this.componentProps = componentProps;
  }

  build(): {
    FieldComponent: ComponentType<P>;
    componentProps: Omit<P, 'value' | 'onAction'>;
    isHidden: boolean;
    fieldId: string;
  } {
    return {
      FieldComponent: this.FieldComponent,
      componentProps: this.componentProps,
      isHidden: this.isHidden,
      fieldId: this.fieldId,
    };
  }
}

export { FieldBuilder };
