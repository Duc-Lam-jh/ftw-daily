import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionPaymentMethodMaybe = props => {
  const { options, publicData } = props;
  if (!publicData || !publicData.paymentType) {
    return null;
  }

  const selectedOptions = publicData && publicData.paymentType ? [publicData.paymentType] : [];

  if (selectedOptions[0] === 'both') {
    selectedOptions.pop();
    selectedOptions.push('prepaid');
    selectedOptions.push('postpaid');
  }

  return (
    <div className={css.sectionPaymentType}>
      <h2 className={css.paymentTypeTitle}>
        <FormattedMessage id="ListingPage.paymentTypeTitle" />
      </h2>
      <PropertyGroup
        id="ListingPage.paymentTypes"
        options={options.filter(item => item.key !== 'both')}
        selectedOptions={selectedOptions}
        twoColumns={true}
      />
    </div>
  );
};

export default SectionPaymentMethodMaybe;
