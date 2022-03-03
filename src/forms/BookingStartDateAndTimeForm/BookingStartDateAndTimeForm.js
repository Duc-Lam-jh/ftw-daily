import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import moment from 'moment';
import config from '../../config';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { required, composeValidators, bookingDateRequired } from '../../util/validators';
import { START_DATE, START_TIME } from '../../util/dates';
import { propTypes } from '../../util/types';
import { Form, IconSpinner, PrimaryButton, FieldDateInput, CustomSelectFieldMaybe, FieldTextInput } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

import css from './BookingStartDateAndTimeForm.module.css';
import { findOptionsForSelectFilter } from '../../util/search';

const identity = v => v;

export class BookingStartDateAndTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.onFocusedInputChange = this.onFocusedInputChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  // Function that can be passed to nested components
  // so that they can notify this component when the
  // focused input changes.
  onFocusedInputChange(focusedInput) {
    this.setState({ focusedInput });
  }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(e) {
    const { startDate, startTime } = e;
    console.log(startDate);
    if (!startDate) {
      e.preventDefault();
      this.setState({ focusedInput: START_DATE });
    } else if (!startTime) {
      e.preventDefault();
      this.setState({ focusedInput: START_TIME });
    } else {
      this.props.onSubmit(e);
    }
  }

  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(formValues) {
    const { startDate, startTime } = formValues.values;
    formValues.values.endTime = startTime && parseInt(startTime) + 8;
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    if (startDate && startTime && !this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: { startDate, startTime },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingStartDateAndTimeForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingStartDateAndTimeForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            startDatePlaceholder,
            formId,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitType,
            values,
            timeSlots,
            fetchTimeSlotsError,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
            filterConfig,
          } = fieldRenderProps;
          const { startDate, startTime } = values;

          const bookingStartLabel = intl.formatMessage({
            id: 'BookingStartDateAndTimeForm.bookingStartTitle',
          });
          const requiredMessage = intl.formatMessage({
            id: 'BookingStartDateAndTimeForm.requiredDate',
          });
          const startDateErrorMessage = intl.formatMessage({
            id: 'FieldDateRangeInput.invalidStartDate',
          });
          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.sideBarError}>
              <FormattedMessage id="BookingStartDateAndTimeForm.timeSlotsError" />
            </p>
          ) : null;

          // This is the place to collect breakdown estimation data.
          // Note: lineItems are calculated and fetched from FTW backend
          // so we need to pass only booking data that is needed otherwise
          // If you have added new fields to the form that will affect to pricing,
          // you need to add the values to handleOnChange function
          const bookingData =
            startDate && startTime
              ? {
                unitType,
                startDate,
                startTime,
              }
              : null;

          const showEstimatedBreakdown =
            bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingStartDateAndTimeForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
            </div>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingStartDateAndTimeForm.fetchLineItemsError" />
            </span>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const now = moment();
          const today = now.startOf('day').toDate();
          const tomorrow = now
            .startOf('day')
            .add(1, 'days')
            .toDate();
          const startDatePlaceholderText =
            startDatePlaceholder || intl.formatDate(today, dateFormatOptions);
          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          const startTimeOptions = findOptionsForSelectFilter('classStartTime', filterConfig)
          const endTimeOptions = findOptionsForSelectFilter('classEndTime', filterConfig);

          const endTime = startTime ? endTimeOptions.filter(item => item.key == parseInt(startTime) + 8) : [];
          values.endTime = startTime && parseInt(startTime) + 8;

          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              {timeSlotsError}
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />

              <FieldDateInput
                className={css.bookingDates}
                name='startDate'
                useMobileMargins
                id={`${formId}.bookingStartDate`}
                label={bookingStartLabel}
                format={identity}
                placeholderText={startDatePlaceholderText}
                timeSlots={timeSlots}
                disabled={fetchLineItemsInProgress}
                validate={
                  composeValidators(required(requiredMessage),
                    bookingDateRequired(startDateErrorMessage))
                }
              />

              <div className={css.timePickerContainer}>
                <CustomSelectFieldMaybe
                  className={css.startTimeSelect}
                  name='startTime'
                  id='startTime'
                  formName='BookingStartDateAndTimeForm'
                  options={startTimeOptions}
                  intl={intl}
                  required={true}
                />

                <CustomSelectFieldMaybe
                  className={css.startTimeSelect}
                  name='endTime'
                  id='endTime'
                  formName='BookingStartDateAndTimeForm'
                  options={endTime && endTime.length ? endTime : []}
                  intl={intl}
                  hidePlaceholder={true}
                  disabled={true}
                />
              </div>


              {bookingInfoMaybe}
              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingStartDateAndTimeForm.ownListing'
                      : 'BookingStartDateAndTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingStartDateAndTimeForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingStartDateAndTimeComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
  filterConfig: config.custom.filters,
};

BookingStartDateAndTimeComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingStartDateAndTimeForm = compose(injectIntl)(BookingStartDateAndTimeComponent);
BookingStartDateAndTimeForm.displayName = 'BookingStartDateAndTimeForm';

export default BookingStartDateAndTimeForm;
