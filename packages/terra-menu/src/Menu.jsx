import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'terra-popup';
import SlideGroup from 'terra-slide-group';
import 'terra-base/lib/baseStyles';
import MenuItem from './MenuItem';
import MenuItemGroup from './MenuItemGroup';
import SubMenu from './_SubMenu';
import './Menu.scss';

const propTypes = {
  /**
   * List of Menu.Items/Menu.ItemGroups to be displayed as content within the Menu.
   */
  children: PropTypes.node.isRequired,
  /**
   * Callback function indicating a close condition was met, should be combined with isOpen for state management.
   */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * Target element for the menu to anchor to.
   */
  targetRef: PropTypes.func.isRequired,
  /**
   * Bounding container for the menu, will use window if no value provided.
   */
  boundingRef: PropTypes.func,
  /**
   * CSS classnames that are append to the arrow.
   */
  classNameArrow: PropTypes.string,
  /**
   * CSS classnames that are append to the menu content inner.
   */
  classNameContent: PropTypes.string,
  /**
   * CSS classnames that are append to the overlay.
   */
  classNameOverlay: PropTypes.string,
  /**
   * Should the menu be presented as open.
   */
  isOpen: PropTypes.bool,
};

const defaultProps = {
  children: [],
  isOpen: false,
};

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.wrapOnRequestClose = this.wrapOnRequestClose.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.wrapOnClick = this.wrapOnClick.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const items = this.props.children.map((item) => {
      if (item.props.subMenuItems && item.props.subMenuItems.length > 0) {
        return React.cloneElement(item, { onClick: this.wrapOnClick(item) });
      }

      return item;
    });

    const initialMenu = (
      <SubMenu key="MenuPage-0">
        {items}
      </SubMenu>
    );

    return {
      stack: [initialMenu],
    };
  }


  handleRequestClose() {
    this.setState(this.getInitialState());
  }

  handleItemSelection(event, item) {
    const index = this.state.stack.length;
    this.push(<SubMenu key={`MenuPage-${index}`} title={item.props.text} onBack={this.pop}>{item.props.subMenuItems}</SubMenu>);
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

  wrapOnRequestClose() {
    const onRequestClose = this.props.onRequestClose;

    return (event) => {
      this.handleRequestClose();
      onRequestClose(event);
    };
  }

  pop() {
    this.setState((prevState) => {
      prevState.stack.pop();
      return { stack: prevState.stack };
    });
  }

  push(content) {
    this.setState((prevState) => {
      prevState.stack.push(content);
      return { stack: prevState.stack };
    });
  }

  render() {
    const {
      boundingRef,
      classNameArrow,
      classNameContent,
      classNameOverlay,
      onRequestClose,
      isOpen,
      children,
      targetRef,
      ...customProps
    } = this.props;
    const attributes = Object.assign({}, customProps);

    return (
      <Popup
        {...attributes}
        boundingRef={boundingRef}
        isArrowDisplayed
        contentAttachment="bottom center"
        classNameArrow={classNameArrow}
        classNameContent={classNameContent}
        classNameOverlay={classNameOverlay}
        isOpen={isOpen}
        onRequestClose={this.wrapOnRequestClose}
        targetRef={targetRef}
        isHeaderDisabled
      >
        <SlideGroup items={this.state.stack} isAnimated />
      </Popup>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
Menu.Item = MenuItem;
Menu.ItemGroup = MenuItemGroup;

export default Menu;
