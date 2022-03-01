import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';

const SectionSubjectLevel = props => {
  const { options, publicData } = props;
  const [isSectionHidden, setIsSectionHidden] = useState(false);
  if (!publicData || !publicData.subject || !publicData.level || !publicData.level.level) {
    return null;
  }

  const handleToggleSection = () => {
    setIsSectionHidden(!isSectionHidden);
  }

  const toggleButtonRef = useRef(null);
  const levelLabel = options.filter(item => item.key === publicData.level.level);

  return (
    <div className={css.sectionSubject}>
        <div ref={toggleButtonRef} className={isSectionHidden ? classNames(css.toggleButton, css.hidden) : css.toggleButton} onClick={handleToggleSection}></div>
      <h2 className={css.subjectTitle}>
        <FormattedMessage id="ListingPage.subjectTitle" />
      </h2>
      <p className={isSectionHidden ? classNames(css.subjectAndLevel, css.hidden) : css.subjectAndLevel}>
        <FormattedMessage
          id="ListingPage.subjectAndLevel"
          values={{
            subject: publicData.subject,
            level: levelLabel[0].label
          }} />
      </p>
    </div>
  );
};

export default SectionSubjectLevel;
