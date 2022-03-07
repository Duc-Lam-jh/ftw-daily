import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ResponsiveImage, Modal, ImageCarousel } from '../../components';

import css from './ListingPage.module.css';

const SectionSubImages = props => {
  const {
    title,
    listing,
    handleViewPhotosClick,
    imageCarouselOpen,
    onImageCarouselClose,
    onManageDisableScrolling,
  } = props;

  const [isSectionHidden, setIsSectionHidden] = useState(false);

  const { publicData } = listing.attributes;
  const mainImageId = publicData && publicData.mainImage;
  const subImages = listing.images ? listing.images.filter(item => item.id.uuid !== mainImageId) : [];
  const hasImages = subImages && subImages.length > 0;
  const firstImage = hasImages ? subImages[0] : null;

  const handleToggleSection = () => {
    setIsSectionHidden(!isSectionHidden);
  }

  const viewPhotosButton = hasImages ? (
    <button className={css.viewPhotos} onClick={handleViewPhotosClick}>
      <FormattedMessage
        id="ListingPage.viewImagesButton"
        values={{ count: subImages.length }}
      />
    </button>
  ) : null;

  return (
    <div className={css.sectionSubImages}>
      <div className={isSectionHidden ? classNames(css.toggleButton, css.hidden) : css.toggleButton} 
        onClick={handleToggleSection}></div>
      <h2 className={css.imagesTitle}>
        <FormattedMessage id="ListingPage.imagesTitle" />
      </h2>

      <div className={isSectionHidden ? classNames(css.threeToTwoWrapper, css.hidden) : css.threeToTwoWrapper}>
        <div className={css.aspectWrapper} onClick={handleViewPhotosClick}>
          <ResponsiveImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={[
              'landscape-crop',
              'landscape-crop2x',
              'landscape-crop4x',
              'landscape-crop6x',
            ]}
          />
          {viewPhotosButton}
        </div>
      </div>
      <Modal
        id="ListingPage.imageCarousel"
        scrollLayerClassName={css.carouselModalScrollLayer}
        containerClassName={css.carouselModalContainer}
        lightCloseButton
        isOpen={imageCarouselOpen}
        onClose={onImageCarouselClose}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <ImageCarousel images={subImages} />
      </Modal>
    </div>
  );
};

export default SectionSubImages;
