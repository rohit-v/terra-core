import React from 'react';
import PropTypes from 'prop-types';
import List from 'terra-list';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import ContentContainer from 'terra-content-container';
import IconClose from 'terra-icon/lib/icon/IconClose';
import Arrange from 'terra-arrange';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './MenuContent.scss';

const cx = classNames.bind(styles);

const propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
};

const defaultProps = {
  children: [],
};

class MenuContent extends React.Component {
  constructor(props) {
    super(props);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.wrapOnClick = this.wrapOnClick.bind(this);
    this.buildHeader = this.buildHeader.bind(this);
  }

  handleItemSelection(event, item) {
    const index = this.props.index + 1;

    this.props.onNext((
      <MenuContent
        key={`MenuPage-${index}`}
        title={item.props.text}
        index={index}
        onBack={this.props.onBack}
        onClose={this.props.onClose}
        onNext={this.props.onNext}
        isFullScreen={this.props.isFullScreen}
      >
        {item.props.subMenuItems}
      </MenuContent>
    ));
  }

  wrapOnClick(item) {
    const onClick = item.props.onClick;
    return (event) => {
      this.handleItemSelection(event, item);

      if (onClick) {
        onClick(event);
      }
    };
  }

  buildHeader() {
    const shouldDisplayBack = this.props.index > 0;
    if (this.props.title || shouldDisplayBack || this.props.isFullScreen) {
      const closeIcon = <IconClose tabIndex="0" />;
      const closeButton = this.props.isFullScreen ? (
        <button className={cx(['header-button'])} onClick={this.props.onClose}>
          {closeIcon}
        </button>
      ) : null;

      const backIcon = <IconLeft tabIndex="0" />;
      const backButton = shouldDisplayBack ? (
        <button className={cx(['header-button'])} onClick={this.props.onBack}>
          {backIcon}
        </button>
      ) : null;

      const titleElement = <h1 className={cx(['header-title'])}>{this.props.title}</h1>;

      return (
        <Arrange
          className={cx(['header', { fullscreen: this.props.onClose }])}
          fitStart={backButton}
          fitEnd={closeButton}
          fill={titleElement}
          align="center"
        />
      );
    }

    return null;
  }

  render() {
    const items = React.Children.map(this.props.children, (item) => {
      if (item.props.subMenuItems && item.props.subMenuItems.length > 0) {
        return React.cloneElement(item, { onClick: this.wrapOnClick(item) });
      }

      return item;
    });

    const header = this.buildHeader();

    const className = cx([
      { submenu: this.props.index > 0 },
      { 'main-menu': this.props.index === 0 },
    ]);

    return (
      <ContentContainer header={header} fill className={className}>
        <List className={cx(['content'])}>
          {items}
        </List>
      </ContentContainer>
    );
  }
}


MenuContent.propTypes = propTypes;
MenuContent.defaultProps = defaultProps;

export default MenuContent;
