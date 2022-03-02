import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { ListingCard } from '../../components';

import css from './SectionRecommendListingsMaybe.module.css';

const SectionRecommendListingsMaybe = props => {
  const { recommendedListings } = props;

  return recommendedListings.length ? (
    <div className={css.sectionRecommendedListings}>
      <h2 className={css.recommendTitle}>
        <FormattedMessage id="ListingPage.recommendListingsTitle" />
      </h2>

      <div className={css.listingsContainer}>
        <ul className={css.listings}>
          {recommendedListings.map(l => (
            <li className={css.listing} key={l.id.uuid}>
              <ListingCard listing={l} />
            </li>
          ))}
        </ul>
      </div>

    </div>
  ) : null;
};

export default SectionRecommendListingsMaybe;
