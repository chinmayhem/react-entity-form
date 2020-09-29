import React, { useMemo, useRef } from 'react';

import { Row } from './Row';
import { makeMetaSelector } from './helper';

import { RowInterface, Values, Errors, Fields, LayoutInterface, OnActionInterface } from '../types';

export interface LayoutProps {
  values: Values;
  errors: Errors;
  fields: Fields;
  layout: LayoutInterface;
  onAction: OnActionInterface<any, string>;
  componentOverrides?: {
    Root?: any;
    Layout?: any;
    Row?: any;
  };
}

const DefaultLayout = ({ children }) => <React.Fragment>{children}</React.Fragment>;

const Layout = ({ values, errors, fields, layout, onAction, componentOverrides }: LayoutProps) => {
  const getMetaSelector = useRef(makeMetaSelector('columns'));
  const rowToGetters = useMemo(() => {
    return getMetaSelector.current(layout.rows);
  }, [layout.rows]);

  const Root = componentOverrides?.Layout || DefaultLayout;

  return (
    <Root values={values} errors={errors} fields={fields} layout={layout} onAction={onAction}>
      {layout.rows.map((row: RowInterface) => {
        const rowId = typeof row === 'string' ? row : row.id;
        return (
          <Row
            key={rowId}
            row={row}
            fields={rowToGetters[rowId].fieldsGetter(fields)}
            values={rowToGetters[rowId].valuesGetter(values)}
            errors={rowToGetters[rowId].errorsGetter(errors)}
            onAction={onAction}
            componentOverrides={componentOverrides}
          />
        );
      })}
    </Root>
  );
};

export { Layout };
