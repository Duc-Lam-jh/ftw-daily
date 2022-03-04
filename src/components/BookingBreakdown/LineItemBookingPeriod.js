import React from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import { DATE_TYPE_DATETIME, propTypes } from '../../util/types';
import { dateFromAPIToLocalNoon } from '../../util/dates';

import css from './BookingBreakdown.module.css';

const BASE_CLASS_HOURS = 8;

const BookingPeriod = props => {
  const { startDate, endDate, dateType } = props;

  const timeFormatOptions =
    dateType !== DATE_TYPE_DATETIME
      ? {
        weekday: 'long',
      }
      : {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      };

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSection}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingStart" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={startDate} {...timeFormatOptions} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={startDate} {...dateFormatOptions} />
          </div>
        </div>

        <div className={css.bookingPeriodSectionRigth}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingEnd" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={endDate} {...timeFormatOptions} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={endDate} {...dateFormatOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

const LineItemBookingPeriod = props => {
  const { booking, dateType } = props;

  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { start, end, time, displayStart, displayEnd } = booking.attributes;
  const localStartDate = dateFromAPIToLocalNoon(displayStart || start);
  const localEndDateRaw = dateFromAPIToLocalNoon(displayEnd || end);

  localStartDate.setHours(time, 0, 0);
  localEndDateRaw.setHours(parseInt(time) + BASE_CLASS_HOURS, 0, 0);

  return (
    <>
      <div className={css.lineItem}>
        <BookingPeriod startDate={localStartDate} endDate={localEndDateRaw} dateType={dateType} />
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};
LineItemBookingPeriod.defaultProps = { dateType: null };

LineItemBookingPeriod.propTypes = {
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,
};

export default LineItemBookingPeriod;
