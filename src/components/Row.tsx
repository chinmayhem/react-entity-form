import React, { useRef, useMemo } from 'react';
import { makeMetaSelector } from './helper';

import { RowInterface, ColumnInterface, Values, Errors, Fields, OnActionInterface } from '../types';

import s from '../styles.module.css';

export interface RowProps {
  values: Values;
  errors: Errors;
  fields: Fields;
  row: RowInterface | ColumnInterface;
  onAction: OnActionInterface<any, string>;
  className?: string;
  unitKey?: 'columns' | 'rows';
}

const Row = ({ values, errors, fields, row, onAction, className = '', unitKey = 'columns' }: RowProps) => {
  const getMetaSelector = useRef(makeMetaSelector(unitKey === 'columns' ? 'rows' : 'columns'));
  const unit = row[unitKey];
  const columnToGetters = useMemo(() => {
    return unit == null ? {} : getMetaSelector.current(unit);
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
        {...componentProps}
        onAction={onAction}
        className={className}
        value={value}
        error={error}
        fieldId={fieldId}
      />
    );
  }

  return (
    <div className={`${s.flex} ${unitKey === 'columns' ? s.flexRow : s.flexCol} ${className || ''}`}>
      {unit.map((col: ColumnInterface | RowInterface) => {
        const colId = typeof col === 'string' ? col : col.id;
        return (
          <Row
            key={colId}
            row={col}
            values={columnToGetters[colId].valuesGetter(values)}
            errors={columnToGetters[colId].errorsGetter(errors)}
            fields={columnToGetters[colId].fieldsGetter(fields)}
            unitKey={unitKey === 'rows' ? 'columns' : 'rows'}
            onAction={onAction}
            className={s.flex1}
          />
        );
      })}
    </div>
  );
};

export { Row };
