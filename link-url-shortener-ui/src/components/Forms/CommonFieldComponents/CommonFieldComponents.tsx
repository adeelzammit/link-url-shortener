import { ErrorMessage, Field, useFormikContext } from "formik";
import React from "react";
import { Form } from "react-bootstrap";

const CommonFieldComponents = {
  TextInput: React.memo(
    ({
      label,
      placeholder,
      controlId,
      name,
      serverError = false,
      disabled = false,
      ...props
    }: any) => {
      const { setFieldValue, setFieldTouched } = useFormikContext();
      return (
        <Field name={name} {...props}>
          {(fieldProps: any) => (
            <Form.Group
              className="common-field-component-group mb-3"
              controlId={controlId}
            >
              <Form.Label>{label}</Form.Label>
              <Form.Control
                {...fieldProps.field}
                disabled={disabled}
                isInvalid={!!fieldProps.meta.error || !!serverError}
                type="text"
                placeholder={placeholder}
                onChange={(e) => {
                  setFieldValue(name, e.target.value, true);
                  setFieldTouched(name, true, true);
                  fieldProps.field.onChange(e);
                }}
              />
              {serverError && (
                <div className="server-error-message">{serverError}</div>
              )}
              <ErrorMessage name={name}>
                {(msg) => <div className="formik-error-message">{msg}</div>}
              </ErrorMessage>
            </Form.Group>
          )}
        </Field>
      );
    }
  ),
  TextOnlyInput: React.memo(
    ({
      placeholder,
      name,
      serverError = false,
      disabled = false,
      ...props
    }: any) => {
      const { setFieldValue, setFieldTouched } = useFormikContext();
      return (
        <Field name={name} {...props}>
          {(fieldProps: any) => (
            <>
              <Form.Control
                {...fieldProps.field}
                disabled={disabled}
                isInvalid={!!fieldProps.meta.error || !!serverError}
                type="text"
                placeholder={placeholder}
                onChange={(e) => {
                  setFieldValue(name, e.target.value, true);
                  setFieldTouched(name, true, true);
                  fieldProps.field.onChange(e);
                }}
              />
              <ErrorMessage name={name}>
                {(msg) => <div className="formik-error-message">{msg}</div>}
              </ErrorMessage>
            </>
          )}
        </Field>
      );
    }
  ),
};

export default CommonFieldComponents;
