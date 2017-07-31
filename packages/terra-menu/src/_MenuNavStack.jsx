import React from 'react';
import PropTypes from 'prop-types';
import SlideGroup from 'terra-slide-group';

const propTypes = {
  /**
   * A the px value of height to be applied to the content container.
   */
  contentHeight: PropTypes.number.isRequired,
  /**
   * The maximum height to set for popup content in px, also used with responsive behavior for actual height.
   */
  contentHeightMax: PropTypes.number,
  /**
   * A the px value of width to be applied to the content container.
   */
  contentWidth: PropTypes.number.isRequired,
  /**
   * The maximum width of the popup content in px, also used with responsive behavior for actual width.
   */
  contentWidthMax: PropTypes.number,
  /**
   * The function that should be triggered when a close is indicated.
   */
  onRequestClose: PropTypes.func.isRequired,

  /**
   * The function that should be triggered when a back is indicated.
   */
  onRequestBack: PropTypes.func.isRequired,

  /**
   * List of menus to be placed in the stack.
   */
  items: PropTypes.array,
};

class MenuNavStack extends React.Component {
  static isFullScreen(height, maxHeight, width, maxWidth) {
    if (maxHeight <= 0 || maxWidth <= 0) {
      return false;
    }
    return height >= maxHeight && width >= maxWidth;
  }

  render() {
    const onRequestClose = MenuNavStack.isFullScreen(
      this.props.contentHeight,
      this.props.contentHeightMax,
      this.props.contentWidth,
      this.props.contentWidthMax,
    ) ? this.props.onRequestClose : null;
    const cloneItems = this.props.items.map((item, i) => (
      React.cloneElement(item, {
        onBack: i > 0 ? this.props.onRequestBack : null,
        onClose: onRequestClose,
      })
    ));
    return (
      <SlideGroup items={cloneItems} isAnimated />
    );
  }

}

MenuNavStack.propTypes = propTypes;

export default MenuNavStack;
