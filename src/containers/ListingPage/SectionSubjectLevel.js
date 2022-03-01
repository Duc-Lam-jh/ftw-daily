import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';

const SectionSubjectLevel = props => {
  const { options, publicData } = props;
  if (!publicData || !publicData.subject || !publicData.level || !publicData.level.level) {
    return null;
  }

  const levelLabel = options.filter(item => item.key === publicData.level.level);

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.subjectTitle" />
      </h2>
      <p>
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
