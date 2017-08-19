import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import IconClose from 'terra-icon/lib/icon/IconClose';
import FocusTrap from 'focus-trap-react';
import Magic from 'terra-magic';
import styles from './PopupContent.scss';

const cx = classNames.bind(styles);
/**
 * Rounded corner size to be used when calculating the arrow offset.
 */
const CORNER_SIZE = 3;

const propTypes = {
  /**
   * The children to be presented as the popup's content.
   */
  children: PropTypes.node.isRequired,
  /**
   * The height value in px, to be applied to the content container.
   */
  contentHeight: PropTypes.number.isRequired,
  /**
   * The width value in px, to be applied to the content container.
   */
  contentWidth: PropTypes.number.isRequired,
  /**
   * The function that should be triggered when a close is indicated.
   */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * The arrow to be placed within the popup frame.
   */
  arrow: PropTypes.element,
  /**
   * CSS classnames that are appended to the popup content body.
   */
  classNameInner: PropTypes.string,
  /**
   * The maximum height value in px, to be applied to the content container. Used with responsive behavior for actual height.
   */
  contentHeightMax: PropTypes.number,
  /**
   * The maximum width value in px, to be applied to the content container. Used with responsive behavior for actual width.
   */
  contentWidthMax: PropTypes.number,
  /**
   * Whether or not the sizes provided were using predefined values. Dictates whether or not the bounded props are added to children.
   */
  isCustomSize: PropTypes.bool,
  /**
   * Should the default behavior, that inserts a header when constraints are breached, be disabled.
   */
  isHeaderDisabled: PropTypes.bool,
  /**
   * The function returning the frame html reference.
   */
  refCallback: PropTypes.func,
  /**
   * A callback function to let the containing component (e.g. modal) to regain focus.
   */
  releaseFocus: PropTypes.func,
  /**
   * A callback function to request focus from the containing component (e.g. modal).
   */
  requestFocus: PropTypes.func,
};

const defaultProps = {
  classNameInner: null,
  closeOnEsc: false,
  closeOnOutsideClick: false,
  closeOnResize: false,
  contentHeightMax: -1,
  contentWidthMax: -1,
  isHeaderDisabled: false,
};

class PopupContent extends React.Component {
  static getContentStyle(height, maxHeight, width, maxWidth) {
    const contentStyle = {};
    let validHeight;
    if (height > 0) {
      validHeight = maxHeight <= 0 || height <= maxHeight ? height : maxHeight;
      contentStyle.height = `${validHeight.toString()}px`;
    }
    let validWidth;
    if (width > 0) {
      validWidth = maxWidth <= 0 || width <= maxWidth ? width : maxWidth;
      contentStyle.width = `${validWidth.toString()}px`;
    }
    return contentStyle;
  }

  static addPopupHeader(children, onRequestClose) {
    const icon = <IconClose height="20" width="20" />;
    const button = <button className={cx('close')} onClick={onRequestClose}>{icon}</button>;
    const header = <div className={cx('header')}>{button}</div>;
    return <ContentContainer header={header} fill>{children}</ContentContainer>;
  }

  static isBounded(value, maxValue) {
    return value > 0 && maxValue > 0 && value >= maxValue;
  }

  componentDidMount() {
    if (this.props.requestFocus) {
      this.props.requestFocus();
    }
  }

  componentWillUnmount() {
    if (this.props.releaseFocus) {
      this.props.releaseFocus();
    }
  }

  cloneChildren(children, isCustomSize, isHeightBounded, isWidthBounded) {
    if (!isCustomSize) {
      return children;
    }
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, { isHeightBounded, isWidthBounded });
    });
  }

  render() {
    const {
      arrow,
      children,
      classNameInner,
      contentHeight,
      contentHeightMax,
      contentWidth,
      contentWidthMax,
      isHeaderDisabled,
      isCustomSize,
      onRequestClose,
      refCallback,
      releaseFocus,
      requestFocus,
      ...customProps
    } = this.props;

    const contentStyle = PopupContent.getContentStyle(contentHeight, contentHeightMax, contentWidth, contentWidthMax);
    const isHeightBounded = PopupContent.isBounded(contentHeight, contentHeightMax);
    const isWidthBounded = PopupContent.isBounded(contentWidth, contentWidthMax);
    const isFullScreen = isHeightBounded && isWidthBounded;

    let content = this.cloneChildren(children, isCustomSize, isHeightBounded, isWidthBounded);
    if (isFullScreen && !isHeaderDisabled) {
      content = PopupContent.addPopupHeader(content, onRequestClose);
    }

    const roundedCorners = arrow && !isFullScreen;
    const arrowContent = roundedCorners ? arrow : undefined;
    const innerClassNames = cx([
      'inner',
      { isFullScreen },
      { roundedCorners },
      classNameInner,
    ]);

    return (
      <FocusTrap>
        <Magic.Content
          {...customProps}
          tabIndex="0"
          className={cx('popupContent')}
          closeOnEsc
          closeOnOutsideClick
          closeOnResize
          onRequestClose={onRequestClose}
          refCallback={refCallback}
        >
          {arrowContent}
          <div className={innerClassNames} style={contentStyle}>
            {content}
          </div>
        </Magic.Content>
      </FocusTrap>
    );
  }
}

PopupContent.propTypes = propTypes;
PopupContent.defaultProps = defaultProps;
PopupContent.Opts = {
  cornerSize: CORNER_SIZE,
};

export default PopupContent;
