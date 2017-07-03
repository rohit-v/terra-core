import React from 'react';
import PropTypes from 'prop-types';
import SingleSelectList from 'terra-list/lib/SingleSelectList';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import ContentContainer from 'terra-content-container';
import IconClose from 'terra-icon/lib/icon/IconClose';
import Arrange from 'terra-arrange';
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

  let header;

  if (props.title || props.onBack || props.onClose) {
    const closeIcon = <IconClose tabIndex="0" height="30" width="30" />;
    const closeButton = props.onClose ? (
      <button className="terra-SubMenu-button" onClick={props.onClose}>
        {closeIcon}
      </button>
    ) : null;

    const backIcon = <IconLeft tabIndex="0" height="30" width="30" />;
    const backButton = props.onBack ? (
      <button className="terra-SubMenu-button" onClick={props.onBack}>
        {backIcon}
      </button>
    ) : null;

    const titleElement = <h1 className="terra-SubMenu-title">{props.title}</h1>;

    header = (
      <Arrange
        className="terra-SubMenu-header"
        fitStart={backButton}
        fitEnd={closeButton}
        fill={titleElement}
        align="center"
      />
    );
  }

  return (
    <ContentContainer header={header} fill>
      {content}
    </ContentContainer>
  );
};

SubMenu.propTypes = propTypes;
SubMenu.defaultProps = defaultProps;

export default SubMenu;
