import { FieldComponentProps } from '../types';

function Null() {
  return null;
}

class FieldBuilder<V, F, P extends FieldComponentProps<V, F>> {
  FieldComponent: React.ComponentType<P> = Null;
  componentProps: Omit<P, 'value' | 'onAction' | 'fieldId'> = {} as P;
  fieldId: F;
  isHidden: boolean = false;

  constructor(field?: {
    FieldComponent: React.ComponentType<P>;
    componentProps: Omit<P, 'value' | 'onAction' | 'fieldId'>;
    isHidden: boolean;
    fieldId: F;
  }) {
    if (field) {
      this.FieldComponent = field.FieldComponent;
      this.componentProps = field.componentProps;
      this.isHidden = field.isHidden;
      this.fieldId = field.fieldId;
    }
  }

  setFieldComponent(Component: React.ComponentType<P & { value: V }>) {
    this.FieldComponent = Component;
  }

  setComponentProps(componentProps: Omit<P, 'value' | 'onAction' | 'fieldId'>) {
    this.componentProps = componentProps;
  }

  build(): {
    FieldComponent: React.ComponentType<P>;
    componentProps: Omit<P, 'value' | 'onAction' | 'fieldId'>;
    isHidden: boolean;
    fieldId: F;
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
