import React, { useCallback, useMemo, useRef } from 'react';

import { Layout } from './Layout';
import { makeMetaSelector } from './helper';

import { Errors, Fields, LayoutInterface, OnActionInterface, Values } from '../types';

export interface FormProps {
  values: Values;
  errors: Errors;
  fields: Fields;
  layouts: LayoutInterface[];
  onAction: OnActionInterface<any, string>;
  componentOverrides?: {
    Root?: any;
    Layout?: any;
    Row?: any;
  };
}

const DefaultRoot = ({ onSubmit, children }) => <form onSubmit={onSubmit}>{children}</form>;

const Form = ({ values, errors, fields, layouts, onAction, componentOverrides }: FormProps) => {
  const handleSubmission = useCallback((e) => {
    e.preventDefault();
  }, []);

  const getMetaSelector = useRef(makeMetaSelector('rows'));
  const layoutToGetters = useMemo(() => {
    return getMetaSelector.current(layouts);
  }, [layouts]);

  const Root = componentOverrides?.Root || DefaultRoot;

  return (
    <Root onSubmit={handleSubmission}>
      {layouts.map((layout) => (
        <Layout
          key={layout.id}
          layout={layout}
          fields={layoutToGetters[layout.id].fieldsGetter(fields)}
          values={layoutToGetters[layout.id].valuesGetter(values)}
          errors={layoutToGetters[layout.id].errorsGetter(errors)}
          onAction={onAction}
          componentOverrides={componentOverrides}
        />
      ))}
    </Root>
  );
};

export { Form };
