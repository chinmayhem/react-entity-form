import React, { useCallback } from 'react';

import {
  LayoutsBuilder,
  LayoutBuilder,
  RowBuilder,
  ColumnBuilder,
  FieldBuilder,
  OnActionInterface,
  Fields,
  LayoutInterface,
  Form,
} from 'react-entity-form';

interface TextInputProps<F> {
  value: string;
  onAction: OnActionInterface<string, F>;

  fieldId: F;
  label: string;
  className: string;
}

const TextInput = <F extends string>({ value = '', onAction, className, fieldId, label }: TextInputProps<F>) => {
  const onChange = useCallback(
    (e) => {
      onAction({
        type: '@@form/change',
        payload: {
          fieldId,
          value: e.target.value,
        },
      });
    },
    [onAction, fieldId]
  );

  return (
    <div className={`${className || ''} flex flex-col`}>
      <label className="block flex-none" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        placeholder={label}
        className="w-full block flex-1"
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

interface TextAreaInputProps<F> {
  value: string;
  onAction: OnActionInterface<string, F>;

  fieldId: F;
  label: string;
  className: string;
}

function TextAreaInput<F extends string>({
  value = '',
  onAction,
  className,
  fieldId,
  label,
}: TextAreaInputProps<F>): React.ReactElement {
  const onChange = useCallback(
    (e) => {
      onAction({
        type: '@@form/change',
        payload: {
          fieldId,
          value: e.target.value,
        },
      });
    },
    [onAction, fieldId]
  );

  return (
    <div className={`${className || ''} flex flex-col`}>
      <label className="block flex-none" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        placeholder={label}
        className="w-full block flex-1"
        value={value}
        onChange={onChange}
        rows={3}
      />
    </div>
  );
}

const FIELDS: Fields = {
  firstname: new FieldBuilder<string, 'firstname', TextInputProps<'firstname'>>({
    fieldId: 'firstname' as const,
    isHidden: false,
    componentProps: { className: '', label: 'First name' },
    FieldComponent: TextInput,
  }).build(),
  lastname: new FieldBuilder<string, 'lastname', TextInputProps<'lastname'>>({
    fieldId: 'lastname' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Last Name' },
    FieldComponent: TextInput,
  }).build(),
  tagline: new FieldBuilder<string, 'tagline', TextInputProps<'tagline'>>({
    fieldId: 'tagline' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Tagline' },
    FieldComponent: TextInput,
  }).build(),
  lifeMoto: new FieldBuilder<string, 'lifeMoto', TextAreaInputProps<'lifeMoto'>>({
    fieldId: 'lifeMoto' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Life Moto' },
    FieldComponent: TextAreaInput,
  }).build(),
  address1: new FieldBuilder<string, 'address1', TextInputProps<'address1'>>({
    fieldId: 'address1' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Address line 1' },
    FieldComponent: TextInput,
  }).build(),
  address2: new FieldBuilder<string, 'address2', TextInputProps<'address2'>>({
    fieldId: 'address2' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Address line 2' },
    FieldComponent: TextInput,
  }).build(),
  pincode: new FieldBuilder<string, 'pincode', TextInputProps<'pincode'>>({
    fieldId: 'pincode' as const,
    isHidden: false,
    componentProps: { className: '', label: 'Pincode' },
    FieldComponent: TextInput,
  }).build(),
} as const;

const LAYOUTS: LayoutInterface[] = new LayoutsBuilder()
  .addLayout(
    new LayoutBuilder()
      .addRow(
        new RowBuilder()
          .addColumn('firstname' as const)
          .addColumn('lastname' as const)
          .build()
      )
      .addRow('tagline' as const)
      .addRow(
        new RowBuilder()
          .addColumn('lifeMoto' as const)
          .addColumn(
            new ColumnBuilder()
              .addRow('address1' as const)
              .addRow('address2' as const)
              .addRow('pincode' as const)
              .build()
          )
          .build()
      )
      .build()
  )
  .build();

const BasicForm = () => {
  const [values, setValues] = React.useState({});
  const errors = {};
  const onAction = React.useCallback(
    (action) => {
      setValues((prev) => ({
        ...prev,
        [action.payload.fieldId]: action.payload.value,
      }));
    },
    [setValues]
  );
  return <Form fields={FIELDS} layouts={LAYOUTS} values={values} errors={errors} onAction={onAction} />;
};

export { BasicForm };
