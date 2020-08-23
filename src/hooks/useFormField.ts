import { useCallback, useRef } from 'react';
import { FORM_CHANGE_ACTION, MARK_FORM_FIELD_TOUCHED_ACTION, REGISTER_FORM_FIELD_ACTION } from '../actionTypes';

const useFormField = (fieldId, onAction) => {
  const fieldIdRef = useRef(fieldId);
  const onActionRef = useRef(onAction);
  fieldIdRef.current = fieldId;
  onActionRef.current = onAction;

  const handleChange = useCallback((value) => {
    onActionRef.current({
      type: FORM_CHANGE_ACTION,
      payload: { fieldId: fieldIdRef.current, value },
    });
  }, []);

  const handleBlur = useCallback(() => {
    onActionRef.current({
      type: MARK_FORM_FIELD_TOUCHED_ACTION,
      payload: { fieldId: fieldIdRef.current },
    });
  }, []);

  const registerFieldEl = useCallback((el) => {
    onActionRef.current({
      type: REGISTER_FORM_FIELD_ACTION,
      payload: { fieldId: fieldIdRef.current, el },
    });
  }, []);

  return [registerFieldEl, handleBlur, handleChange];
};

export { useFormField };
