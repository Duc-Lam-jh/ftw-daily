import React from 'react';
import { required as requiredValidator } from '../../util/validators';
import { FieldSelect } from '../../components';
import { ALL_ITEM_KEY } from '../../util/data';

import css from './SectionPaymentTypeSelectMaybe.module.css';

const SectionPaymentTypeSelectMaybe = props => {
  const { options, publicData, intl, formName } = props;
  if (!publicData || !publicData.paymentType) {
    return null;
  }

  const selectedOptions = publicData && publicData.paymentType ? publicData.paymentType : '';
  const label = intl.formatMessage({
    id: `${formName}.paymentTypeLabel`,
  });
  const placeholder = intl.formatMessage({
    id: `${formName}.paymentTypePlaceholder`,
  });
  const requiredMessage = requiredValidator(
    intl.formatMessage({
      id: `${formName}.paymentTypeRequired`,
    })
  );

  if (selectedOptions === ALL_ITEM_KEY) {
    const paymentOptions = options.filter(item => item.key !== ALL_ITEM_KEY);

    return paymentOptions ? (
      <FieldSelect
        className={css.selectField}
        name='paymentType'
        id='paymentType'
        label={label}
        validate={requiredMessage}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {paymentOptions.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
    ) : null;
  }

  const paymentOptions = options.filter(item => item.key === selectedOptions);

  return (
    <>
      <div className={css.paymentType}>
        {`${label}: ${paymentOptions[0].label}`}
      </div>
    </>
  )
};

export default SectionPaymentTypeSelectMaybe;
