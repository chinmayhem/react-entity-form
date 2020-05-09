import { createSelector } from 'reselect';
import _property from 'lodash/property';
import _pick from 'lodash/pick';

export function getFieldIds(unit, lookFor = 'rows') {
  return unit[lookFor].flatMap((item) =>
    typeof item === 'string' ? item : getFieldIds(item, lookFor === 'rows' ? 'columns' : 'rows')
  );
}

function makeGetter(unit, lookFor) {
  const fieldIds = getFieldIds(unit, lookFor);
  return createSelector(
    fieldIds.map((fieldId) => _property(fieldId)),
    (...items) => {
      return items.reduce((res, item, index) => {
        res[fieldIds[index]] = item;
        return res;
      }, {});
    }
  );
}

function getSelectorsAndUnits(unitList, lookFor) {
  return unitList.reduce(
    (res, unit) => {
      res.selectors[unit.id] = {
        valuesGetter: makeGetter(unit, lookFor),
        fieldsGetter: makeGetter(unit, lookFor),
        errorsGetter: makeGetter(unit, lookFor),
      };
      res.units[unit.id] = unit;
      return res;
    },
    { selectors: {}, units: {} }
  );
}

export const makeMetaSelector = (lookFor) => {
  let prevSelectors = null;
  let prevUnits = null;
  return function getMetaSelectors(unitList) {
    if (prevUnits == null) {
      const { selectors, units } = getSelectorsAndUnits(unitList, lookFor);
      prevSelectors = selectors;
      prevUnits = units;
      return prevSelectors;
    }

    const changedUnitList = unitList.filter((unit) => prevUnits[unit.id] && prevUnits[unit.id] !== unit);
    const unChangedUnitList = unitList.filter((unit) => prevUnits[unit.id] && prevUnits[unit.id] === unit);
    const addedUnitList = unitList.filter((unit) => !prevUnits[unit.id]);
    const { selectors, units } = getSelectorsAndUnits([...changedUnitList, ...addedUnitList]);
    const unChangedUnitIds = unChangedUnitList.map((unit) => unit.id);
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
