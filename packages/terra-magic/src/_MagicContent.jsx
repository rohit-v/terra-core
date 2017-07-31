import React from 'react';
import PropTypes from 'prop-types';
import './MagicContent.scss';

const propTypes = {
  /**
   * Reference to the bonding container, wil use window if nothing is provided.
   */
  content: PropTypes.element.isRequired,
  /**
   * Reference to the bonding container, wil use window if nothing is provided.
   */
  refCallback: PropTypes.func,
};

const MagicContent = ({
    content,
    refCallback,
    ...customProps
  }) => {
  // Delete the closePortal prop that comes from react-portal.
  delete customProps.closePortal; // eslint-disable-line no-param-reassign

  return (
    <div {...customProps} className="terra-Magic-content" ref={refCallback}>
      {content}
    </div>
  );
};

MagicContent.propTypes = propTypes;

export default MagicContent;
