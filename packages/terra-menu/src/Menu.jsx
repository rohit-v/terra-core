import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'terra-popup';
import 'terra-base/lib/baseStyles';
import MenuItem from './MenuItem';
import MenuItemGroup from './MenuItemGroup';
import MenuDivider from './MenuDivider';
import MenuNavStack from './_MenuNavStack';
import MenuWidths from './_MenuWidths';

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
  /**
   * A string representation of the width in px, limited to:
   * 160, 240, 320, 640, 960, 1280, 1760
   */
  contentWidth: PropTypes.oneOf(Object.keys(MenuWidths)),
  /**
   * Indicates if the menu should have an center aligned arrow displayed on dropdown.
   * Otherwise, the menu will display without an arrow and right aligned.
   */
  isArrowDisplayed: PropTypes.bool,
};

const defaultProps = {
  isArrowDisplayed: false,
  children: [],
  isOpen: false,
};

const childContextTypes = {
  isSelectableMenu: PropTypes.bool,
};

const MENU_PADDING_TOP = 6;
const MENU_PADDING_BOTTOM = 6;
const MENU_ITEM_HEIGHT = 23;
const MENU_DIVIDER_HEIGHT = 10;

class Menu extends React.Component {
  static getPopupHeight(contentHeight) {
    if (contentHeight <= 40) {
      return 40;
    } else if (contentHeight <= 80) {
      return 80;
    } else if (contentHeight <= 120) {
      return 120;
    } else if (contentHeight <= 160) {
      return 160;
    } else if (contentHeight <= 240) {
      return 240;
    } else if (contentHeight <= 320) {
      return 320;
    } else if (contentHeight <= 400) {
      return 400;
    } else if (contentHeight <= 480) {
      return 480;
    } else if (contentHeight <= 560) {
      return 560;
    } else if (contentHeight <= 640) {
      return 640;
    } else if (contentHeight <= 720) {
      return 720;
    } else if (contentHeight <= 800) {
      return 800;
    }

    return 880;
  }

  static isFullScreen(boundingFrame, popupHeight, popupWidth) {
    const width = popupWidth;
    const height = popupHeight;
    let maxHeight;
    let maxWidth;

    if (boundingFrame) {
      maxHeight = boundingFrame.clientHeight;
      maxWidth = boundingFrame.clientWidth;
    } else {
      maxHeight = window.innerHeight;
      maxWidth = window.innerWidth;
    }

    if (maxHeight <= 0 || maxWidth <= 0) {
      return false;
    }

    return height >= maxHeight && width >= maxWidth;
  }

  constructor(props) {
    super(props);
    this.getContentHeight = this.getContentHeight.bind(this);
  }

  getChildContext() {
    return { isSelectableMenu: this.isSelectable() };
  }

  getContentHeight() {
    let itemCount = 0;
    let dividerCount = 0;

    for (let i = 0; i < this.props.children.length; i += 1) {
      const child = this.props.children[i];
      if (child.props.children && child.props.children.length > 0) {
        itemCount += child.props.children.length;
      } else if (child.type === <MenuDivider />.type) {
        dividerCount += 1;
      } else {
        itemCount += 1;
      }
    }

    return (itemCount * MENU_ITEM_HEIGHT) + (dividerCount * MENU_DIVIDER_HEIGHT) + MENU_PADDING_TOP + MENU_PADDING_BOTTOM;
  }

  isSelectable() {
    for (let i = 0; i < this.props.children.length; i += 1) {
      const child = this.props.children[i];
      if (child.type === <MenuItemGroup />.type || child.isSelectable) {
        return true;
      }
    }

    return false;
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
      isArrowDisplayed,
      contentWidth,
      ...customProps
    } = this.props;
    const attributes = Object.assign({}, customProps);
    const boundingFrame = this.props.boundingRef ? this.props.boundingRef() : undefined;

    const contentHeight = this.getContentHeight();
    const popupHeight = Menu.getPopupHeight(contentHeight);
    const isFullScreen = Menu.isFullScreen(boundingFrame, popupHeight, MenuWidths[contentWidth]);

    return (
      <Popup
        {...attributes}
        boundingRef={boundingRef}
        isArrowDisplayed={isArrowDisplayed}
        contentAttachment={isArrowDisplayed ? 'bottom center' : 'bottom right'}
        contentHeight={popupHeight.toString()}
        classNameArrow={classNameArrow}
        classNameContent={classNameContent}
        classNameOverlay={classNameOverlay}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        targetRef={targetRef}
        isHeaderDisabled
      >
        <MenuNavStack
          items={this.props.children}
          onRequestClose={this.props.onRequestClose}
          onRequestBack={this.pop}
          onRequestNext={this.push}
          isFullScreen={isFullScreen}
          isOpen={isOpen}
        />
      </Popup>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
Menu.childContextTypes = childContextTypes;
Menu.Item = MenuItem;
Menu.ItemGroup = MenuItemGroup;
Menu.Divider = MenuDivider;

export default Menu;
