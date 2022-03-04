import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { LINE_ITEM_HOUR, propTypes } from '../../util/types';

import css from './BookingBreakdown.module.css';

const LineItemHoursMaybe = props => {
  const { transaction, unitType } = props;

  if (unitType !== LINE_ITEM_HOUR) {
    return null;
  }

  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );

  if (!unitPurchase) {
    throw new Error(`LineItemHoursMaybe: lineItem (${unitType}) missing`);
  }

  const quantity = unitPurchase.quantity;

  return (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.quantityHourTitle" />
      </span>
      <span className={css.itemValue}>
        <FormattedMessage id="BookingBreakdown.quantityHour" values={{ quantity }} />
      </span>
    </div>
  );
};

LineItemHoursMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
};

export default LineItemHoursMaybe;
