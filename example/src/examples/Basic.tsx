import React, { useCallback } from 'react';

import { FieldBuilder } from '../builders/FieldBuilder';
import { OnActionInterface, Fields } from '../builders/types';

interface TextInputProps {
  value: string;
  onAction: OnActionInterface<string>;

  className: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onAction, className }) => {
  const onChange = useCallback(
    (e) => {
      onAction({
        type: '@@form/change',
        payload: {
          value: e.target.value,
        },
      });
    },
    [onAction]
  );

  return <input className={className} type="text" value={value} onChange={onChange} />;
};

const FIELDS: Fields = {
  name: new FieldBuilder({
    fieldId: 'name',
    isHidden: false,
    componentProps: { className: 'lol' },
    FieldComponent: TextInput,
  }).build(),
};
