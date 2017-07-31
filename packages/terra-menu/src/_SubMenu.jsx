import React from 'react';
import PropTypes from 'prop-types';
import List from 'terra-list';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import ContentContainer from 'terra-content-container';
import IconClose from 'terra-icon/lib/icon/IconClose';
import Arrange from 'terra-arrange';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './SubMenu.scss';

const cx = classNames.bind(styles);

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
    <List className={cx(['content'])}>
      {props.children}
    </List>
  );

  let header;

  if (props.title || props.onBack || props.onClose) {
    const closeIcon = <IconClose tabIndex="0" />;
    const closeButton = props.onClose ? (
      <button className={cx(['header-button'])} onClick={props.onClose}>
        {closeIcon}
      </button>
    ) : null;

    const backIcon = <IconLeft tabIndex="0" />;
    const backButton = props.onBack ? (
      <button className={cx(['header-button'])} onClick={props.onBack}>
        {backIcon}
      </button>
    ) : null;

    const titleElement = <h1 className={cx(['header-title'])}>{props.title}</h1>;

    header = (
      <Arrange
        className={cx(['header', { fullscreen: props.onClose }])}
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
