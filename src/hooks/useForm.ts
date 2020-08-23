import { useCallback, useReducer, useRef, useEffect } from 'react';
import _keys from 'lodash/keys';
import _pick from 'lodash/pick';

import { FORM_CHANGE_ACTION, REGISTER_FORM_FIELD_ACTION, MARK_FORM_FIELD_TOUCHED_ACTION } from '../actionTypes';

function reduceFormChangeAction(state, action) {
  return {
    ...state,
    values: {
      ...state.values,
      [action.payload.fieldId]: action.payload.value,
    },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case FORM_CHANGE_ACTION:
      return reduceFormChangeAction(state, action);
    case 'RESET': {
      return { ...state, ...action.payload };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case 'SUBMIT': {
      return {
        ...state,
        loading: false,
        errors: action.payload.errors,
        submitCount: state.submitCount + 1,
      };
    }
    case 'UPDATE_ERRORS': {
      return {
        ...state,
        errors: action.payload,
      };
    }
    case MARK_FORM_FIELD_TOUCHED_ACTION: {
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.fieldId]: true,
        },
      };
    }
    default:
      return state;
  }
}

const EMPTY_OBJ = {};

const useForm = ({
  initialValues,
  initialErrors,
  initialLayouts,
  initialFields,
  onSubmit,
  onAction,
  validate,
  reduceChanges,
  shouldScrollToErrors,
  shoudlValidateOnBlur,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    values: initialValues,
    errors: initialErrors,
    layouts: initialLayouts,
    fields: initialFields,
    touched: {},
    submitCount: 0,
  });
  const { submitCount, ...restState } = state;
  const fieldIdToEl = useRef({});
  const shouldValidateOnBlurRef = useRef(shoudlValidateOnBlur);
  const onSubmitRef = useRef(onSubmit);
  const onActionRef = useRef(onAction);
  const reduceChangesRef = useRef(reduceChanges);
  const validateRef = useRef(validate);
  const stateRef = useRef(state);
  shouldValidateOnBlurRef.current = shoudlValidateOnBlur;
  onSubmitRef.current = onSubmit;
  onActionRef.current = onAction;
  reduceChangesRef.current = reduceChanges;
  stateRef.current = state;
  validateRef.current = validate;

  const validationPromise = useRef<(Promise<any> & { ignore?: boolean }) | null>(null);

  const scrollToError = useCallback((errors = stateRef.current.errors) => {
    const errorFieldId = _keys(errors)[0];
    const fieldElement = fieldIdToEl.current[errorFieldId];
    if (fieldElement && fieldElement.scrollIntoView) {
      fieldElement.scrollIntoView();
    }
  }, []);

  const handleValidation = useCallback((onErrorsFetch) => {
    if (validationPromise.current) {
      validationPromise.current.ignore = true;
    }
    const errorsPromise = (Promise.resolve(validateRef.current(stateRef.current)) as unknown) as Promise<any> & {
      ignore?: boolean;
    };
    validationPromise.current = errorsPromise;
    dispatch({ type: 'SET_LOADING', payload: true });
    errorsPromise
      .then((errors) => {
        if (errorsPromise.ignore) {
          return;
        }
        onErrorsFetch(errors);
      })
      .catch(() => {
        if (errorsPromise.ignore) {
          return;
        }
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  }, []);

  const handleSubmit = useCallback(() => {
    if (validateRef.current) {
      handleValidation((errors) => {
        if (errors) {
          dispatch({ type: 'SUBMIT', payload: { errors } });
          if (shouldScrollToErrors) {
            scrollToError(errors);
          }
        } else {
          dispatch({ type: 'SUBMIT', payload: { errors: {} } });
          onSubmit(restState);
        }
      });
    }
  }, []);
  const handleAction = useCallback((action) => {
    switch (action.type) {
      case FORM_CHANGE_ACTION: {
        if (reduceChanges) {
          dispatch({
            type: 'RESET',
            payload: reduceChangesRef.current(
              stateRef.current,
              reduceFormChangeAction(stateRef.current, action),
              action
            ),
          });
        } else {
          dispatch(action);
        }
        break;
      }
      case MARK_FORM_FIELD_TOUCHED_ACTION: {
        dispatch(action);
        break;
      }
      case REGISTER_FORM_FIELD_ACTION: {
        fieldIdToEl.current[action.payload.fieldId] = action.payload.el;
        break;
      }
      default: {
        return onActionRef.current(action);
      }
    }
  }, []);
  const reset = useCallback((nextState) => {
    dispatch({
      type: 'RESET',
      payload: nextState,
    });
  }, []);

  useEffect(() => {
    if (validateRef.current) {
      const touchedFieldIds = _keys(stateRef.current.touched);
      if (submitCount || (touchedFieldIds.length && shouldValidateOnBlurRef.current)) {
        handleValidation((errors) => {
          dispatch({
            type: 'UPDATE_ERRORS',
            payload: submitCount ? errors || EMPTY_OBJ : _pick(errors, touchedFieldIds),
          });
        });
      }
    }
  }, [restState.values, restState.touched, submitCount]);

  return { ...restState, handleSubmit, handleAction, scrollToError, reset };
};

export { useForm };
