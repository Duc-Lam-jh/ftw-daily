import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';
import { ALL_ITEM_KEY } from '../../util/data';

import css from './ListingPage.module.css';

const SectionPaymentMethodMaybe = props => {
  const { options, publicData } = props;
  if (!publicData || !publicData.paymentType) {
    return null;
  }

  const selectedOptions = publicData && publicData.paymentType ? [publicData.paymentType] : [];

  if (selectedOptions[0] === ALL_ITEM_KEY) {
    selectedOptions.pop();
    options.forEach(item => {
      if (item.key !== ALL_ITEM_KEY) {
        selectedOptions.push(item.key);
      }
    })
  }

  return (
    <div className={css.sectionPaymentType}>
      <h2 className={css.paymentTypeTitle}>
        <FormattedMessage id="ListingPage.paymentTypeTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.paymentTypes"
        options={options.filter(item => item.key !== ALL_ITEM_KEY)}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionPaymentMethodMaybe;
