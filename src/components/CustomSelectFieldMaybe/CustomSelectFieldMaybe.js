import React from 'react';
import { required as requiredValidator } from '../../util/validators';
import { FieldSelect } from '../index';

import css from './CustomSelectFieldMaybe.module.css';

const CustomSelectFieldMaybe = props => {
  const { name, id, options, formName, intl, hidePlaceholder, disabled, required } = props;
  const label = intl.formatMessage({
    id: `${formName}.${name}Label`,
  });
  const placeholder = intl.formatMessage({
    id: `${formName}.${name}Placeholder`,
  });
  const requiredMessage = required ? requiredValidator(
    intl.formatMessage({
      id: `${formName}.${name}Required`,
    })
  ) : null;
  return options ? (
    <FieldSelect
      className={css.selectField}
      name={name}
      id={id}
      label={label}
      validate={requiredMessage}
      disabled={disabled}
    >
      {!hidePlaceholder ?
        <option disabled value="">
          {placeholder}
        </option>
        : null}
      {options.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomSelectFieldMaybe;
