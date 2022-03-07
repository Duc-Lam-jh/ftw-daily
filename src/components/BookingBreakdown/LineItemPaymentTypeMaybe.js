import React from 'react';
import config from '../../config';
import { FormattedMessage } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';
import { LINE_ITEM_HOUR, propTypes } from '../../util/types';

import css from './BookingBreakdown.module.css';

const LineItemPaymentTypeMaybe = props => {
  const { transaction } = props;

  const { paymentType } = transaction.booking.attributes;
  const paymentTypeOptions = findOptionsForSelectFilter('paymentType', config.custom.filters)
  const selectedPaymentType = paymentTypeOptions.filter(item => item.key === paymentType);

  return (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.paymentTypeTitle" />
      </span>
      <span className={css.itemValue}>
        <FormattedMessage id="BookingBreakdown.paymentType"
          values={{ paymentType: selectedPaymentType.length ? selectedPaymentType[0].label : paymentType }}
        />
      </span>
    </div>
  );
};

LineItemPaymentTypeMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
};

export default LineItemPaymentTypeMaybe;
