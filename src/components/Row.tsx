import React, { useRef, useMemo } from 'react';
import { makeMetaSelector } from './helper';

const emptyArray = [];
const Row = ({ values, errors, fields, row, onAction, className, unitKey = 'columns' }) => {
  const getMetaSelector = useRef(makeMetaSelector(unitKey));
  const unit = row[unitKey];
  const columnToGetters = useMemo(() => {
    return getMetaSelector.current(unit || emptyArray);
  }, [unit]);

  if (typeof row === 'string') {
    if (fields[row].isHidden) {
      return null;
    }

    const field = fields[row];
    const value = values[row];
    const error = errors[row];
    const { FieldComponent, componentProps, fieldId } = field;

    return (
      <FieldComponent
        className={className}
        value={value}
        error={error}
        componentProps={componentProps}
        fieldId={fieldId}
      />
    );
  }

  return (
    <div className="flex flow-row">
      {unit.map((col) => (
        <Row
          key={col.id}
          row={col}
          values={columnToGetters[col.id].valuesGetter(values)}
          errors={columnToGetters[col.id].errorsGetter(values)}
          fields={columnToGetters[col.id].fieldsGetter(values)}
          unitKey={unitKey === 'rows' ? 'columns' : 'rows'}
          onAction={onAction}
          className="flex-1"
        />
      ))}
    </div>
  );
};

export { Row };
