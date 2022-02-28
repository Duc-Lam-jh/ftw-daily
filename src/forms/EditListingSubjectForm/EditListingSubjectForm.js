import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput } from '../../components';
import CustomClassLevelTypeSelectFieldMaybe from './CustomClassLevelTypeSelectFieldMaybe';
import CustomClassLevelSelectFieldMaybe from './CustomClassLevelSelectFieldMaybe';

import css from './EditListingSubjectForm.module.css';

const EditListingSubjectFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        typeOfLevels,
        classLevels,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
      } = formRenderProps;

      const subjectMessage = intl.formatMessage({ id: 'EditListingSubjectForm.subject' });
      const subjectPlaceholderMessage = intl.formatMessage({
        id: 'EditListingSubjectForm.subjectPlaceholder',
      });
      const subjectRequiredMessage = intl.formatMessage({
        id: 'EditListingSubjectForm.subjectRequired',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingSubjectForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingSubjectForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const levelType = values.typeOfLevel;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="subject"
            name="subject"
            className={css.subject}
            type="text"
            label={subjectMessage}
            placeholder={subjectPlaceholderMessage}
            validate={composeValidators(required(subjectRequiredMessage))}
            autoFocus
          />

          <CustomClassLevelTypeSelectFieldMaybe
            id="typeOfLevel"
            name="typeOfLevel"
            classLevelTypes={typeOfLevels}
            intl={intl}
          />

          {levelType ?
            <CustomClassLevelSelectFieldMaybe
              id="level"
              name="level"
              classLevels={
                levelType === 'level'
                ? classLevels.filter(item => item.type === 'level')
                : classLevels.filter(item => item.type === 'group')
              }
              intl={intl}
            />
            : null
          }

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingSubjectFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingSubjectFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingSubjectFormComponent);
