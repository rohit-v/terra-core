import React from 'react';
import PropTypes from 'prop-types';
import SingleSelectList from 'terra-list/lib/SingleSelectList';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import ContentContainer from 'terra-content-container';
import IconClose from 'terra-icon/lib/icon/IconClose';
import './SubMenu.scss';

const propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  children: [],
};

const SubMenu = (props) => {
  const content = (
    <SingleSelectList>
      {props.children}
    </SingleSelectList>
  );

  if (props.title || props.onBack || props.onBack) {
    const closeIcon = <IconClose tabIndex="0" height="30" width="30" />;
    const closeButton = props.onClose ? (
      <button className="terra-SubMenu-button" onClick={props.onClose} style={{ float: 'right' }}>
        {closeIcon}
      </button>
    ) : null;

    const backIcon = <IconLeft tabIndex="0" height="30" width="30" />;
    const backButton = props.onBack ? (
      <button className="terra-SubMenu-button" onClick={props.onBack} style={{ float: 'left' }}>
        {backIcon}
      </button>
    ) : null;

    const header = <div className="terra-SubMenu-header">{backButton}{props.title}{closeButton}</div>;
    return <ContentContainer header={header} fill>{content}</ContentContainer>;
  }

  return content;
};

SubMenu.propTypes = propTypes;
SubMenu.defaultProps = defaultProps;

export default SubMenu;
