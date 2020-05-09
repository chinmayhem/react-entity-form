import React, { useMemo, useRef } from 'react';

import { Row } from './Row';
import { makeMetaSelector } from './helper';

const Layout = ({ values, errors, fields, layout, onAction }) => {
  const getMetaSelector = useRef(makeMetaSelector('columns'));
  const rowToGetters = useMemo(() => {
    return getMetaSelector.current(layout.rows);
  }, [layout.rows]);

  return (
    <>
      {layout.rows.map((row) => (
        <Row
          key={row.id}
          row={row}
          fields={rowToGetters[row.id].fieldsGetter(fields)}
          values={rowToGetters[row.id].valuesGetter(values)}
          errors={rowToGetters[row.id].errorsGetter(errors)}
          onAction={onAction}
        />
      ))}
    </>
  );
};

export { Layout };
