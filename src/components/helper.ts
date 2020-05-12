import { createSelector } from 'reselect';
import _property from 'lodash/property';
import _pick from 'lodash/pick';

import { Fields, Values, Errors } from '../builders/types';

interface UnitItem {
  id: string;
}

type UnitInterface = string | UnitItem;

function getUnitId(unit: UnitInterface) {
  return typeof unit === 'string' ? unit : unit.id;
}

export function getFieldIds<U extends UnitInterface>(unit: U, lookFor: 'columns' | 'rows' = 'rows'): string[] {
  if (typeof unit === 'string') {
    return [unit];
  }
  return unit[lookFor].flatMap((item: UnitInterface) =>
    typeof item === 'string' ? item : getFieldIds(item, lookFor === 'rows' ? 'columns' : 'rows')
  );
}

function makeGetter<U extends UnitInterface>(unit: U, lookFor: 'columns' | 'rows') {
  const fieldIds = getFieldIds(unit, lookFor);
  return createSelector(
    fieldIds.map((fieldId: string) => _property<Dict<U>, U>(fieldId)),
    (...items) => {
      return items.reduce((res, item, index) => {
        res[fieldIds[index]] = item;
        return res;
      }, {});
    }
  );
}

function getSelectorsAndUnits<T extends UnitInterface>(unitList: T[], lookFor: 'columns' | 'rows') {
  return unitList.reduce(
    (res, unit) => {
      const unitId = getUnitId(unit);
      res.selectors[unitId] = {
        valuesGetter: makeGetter(unit, lookFor),
        fieldsGetter: makeGetter(unit, lookFor),
        errorsGetter: makeGetter(unit, lookFor),
      };
      res.units[unitId] = unit;
      return res;
    },
    { selectors: {}, units: {} }
  );
}

interface Dict<T> {
  [k: string]: T;
}

interface Getter<T> {
  (dict: T): T;
}

interface Selectors {
  valuesGetter: Getter<Values>;
  fieldsGetter: Getter<Fields>;
  errorsGetter: Getter<Errors>;
}

export const makeMetaSelector = (lookFor: 'columns' | 'rows') => {
  let prevSelectors: Dict<Selectors> = {};
  let prevUnits: Dict<unknown> = {};
  return function getMetaSelectors<T extends UnitInterface>(unitList: T[]) {
    if (prevUnits == null) {
      const { selectors, units } = getSelectorsAndUnits(unitList, lookFor);
      prevSelectors = selectors;
      prevUnits = units;
      return prevSelectors;
    }

    const changedUnitList = unitList.filter(
      (unit) => prevUnits[getUnitId(unit)] && prevUnits[getUnitId(unit)] !== unit
    );
    const unChangedUnitList = unitList.filter(
      (unit) => prevUnits[getUnitId(unit)] && prevUnits[getUnitId(unit)] === unit
    );
    const addedUnitList = unitList.filter((unit) => !prevUnits[getUnitId(unit)]);
    const { selectors, units } = getSelectorsAndUnits([...changedUnitList, ...addedUnitList], lookFor);
    const unChangedUnitIds = unChangedUnitList.map((unit) => getUnitId(unit));
    prevSelectors = {
      ..._pick(prevSelectors, unChangedUnitIds),
      ...selectors,
    };
    prevUnits = {
      ..._pick(prevUnits, unChangedUnitIds),
      ...units,
    };

    return prevSelectors;
  };
};
