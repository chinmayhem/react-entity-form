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
}

const Layout = ({ values, errors, fields, layout, onAction }: LayoutProps) => {
  const getMetaSelector = useRef(makeMetaSelector('columns'));
  const rowToGetters = useMemo(() => {
    return getMetaSelector.current(layout.rows);
  }, [layout.rows]);

  return (
    <React.Fragment>
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
          />
        );
      })}
    </React.Fragment>
  );
};

export { Layout };
