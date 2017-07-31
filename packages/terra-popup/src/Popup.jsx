import React from 'react';
import PropTypes from 'prop-types';
import Magic from 'terra-magic';
import PopupContent from './_PopupContent';
import PopupArrow from './_PopupArrow';
import PopupOverlay from './_PopupOverlay';
import PopupUtils from './_PopupUtils';
import PopupHeights from './_PopupHeights';
import PopupWidths from './_PopupWidths';
import './Popup.scss';

const propTypes = {
  /**
   * The children to be displayed as content within the popup.
   */
  children: PropTypes.node.isRequired,
  /**
   * Callback function indicating a close condition was met, should be combined with isOpen for state management.
   */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * Target element for the popup to anchor to.
   */
  targetRef: PropTypes.func.isRequired,
  /**
   * Bounding container for the popup, will use window if no value provided.
   */
  boundingRef: PropTypes.func,
  /**
   * CSS classnames that are append to the arrow.
   */
  classNameArrow: PropTypes.string,
  /**
   * CSS classnames that are append to the popup content inner.
   */
  classNameContent: PropTypes.string,
  /**
   * CSS classnames that are append to the overlay.
   */
  classNameOverlay: PropTypes.string,
  /**
   * Attachment point for the popup, this will be mirrored to the target.
   */
  contentAttachment: PropTypes.oneOf(Magic.attachmentPositions),
  /**
   * A string representation of the height in px, limited to:
   * 40, 80, 120, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880
   */
  contentHeight: PropTypes.oneOf(Object.keys(PopupHeights)),
  /**
   * A string representation of the width in px, limited to:
   * 160, 240, 320, 640, 960, 1280, 1760
   */
  contentWidth: PropTypes.oneOf(Object.keys(PopupWidths)),
  /**
   * Should an arrow be placed at the attachment point.
   */
  isArrowDisplayed: PropTypes.bool,
  /**
   * Should the default behavior, that inserts a header when constraints are breached, be disabled.
   */
  isHeaderDisabled: PropTypes.bool,
  /**
   * Should the popup be presented as open.
   */
  isOpen: PropTypes.bool,
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
  boundingRef: null,
  classNameArrow: null,
  classNameContent: null,
  classNameOverlay: null,
  contentAttachment: 'top center',
  contentHeight: '80',
  contentWidth: '240',
  isArrowDisplayed: false,
  isHeaderDisabled: false,
  isOpen: false,
};

class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.handleOnPosition = this.handleOnPosition.bind(this);
    this.setArrowNode = this.setArrowNode.bind(this);
    this.setContentNode = this.setContentNode.bind(this);
  }

  setArrowPosition(targetBounds, contentBounds) {
    const position = PopupUtils.arrowPositionFromBounds(targetBounds, contentBounds, PopupArrow.Opts.arrowSize, PopupContent.Opts.cornerSize);
    if (!position) {
      this.arrowNode.removeAttribute(PopupArrow.Opts.positionAttr);
      return;
    }
    this.arrowNode.setAttribute(PopupArrow.Opts.positionAttr, position);

    if (position === 'top' || position === 'bottom') {
      this.arrowNode.style.left = PopupUtils.leftOffset(targetBounds, contentBounds, PopupArrow.Opts.arrowSize, PopupContent.Opts.cornerSize, this.offset, this.attachment);
      this.arrowNode.style.top = '';
    } else {
      this.arrowNode.style.left = '';
      this.arrowNode.style.top = PopupUtils.topOffset(targetBounds, contentBounds, PopupArrow.Opts.arrowSize, PopupContent.Opts.cornerSize);
    }
  }

  setArrowNode(node) {
    this.arrowNode = node;
  }

  setContentNode(node) {
    this.contentNode = node;
  }

  handleOnPosition(event, targetBounds, contentBounds) {
    if (this.arrowNode && this.contentNode) {
      this.setArrowPosition(targetBounds, contentBounds);
    }
  }

  createPopupContent(boundingFrame, showArrow) {
    const boundsProps = {
      contentHeight: PopupHeights[this.props.contentHeight] || PopupHeights['80'],
      contentWidth: PopupWidths[this.props.contentWidth] || PopupWidths['240'],
    };

    if (boundingFrame) {
      boundsProps.contentHeightMax = boundingFrame.clientHeight;
      boundsProps.contentWidthMax = boundingFrame.clientWidth;
    } else {
      boundsProps.contentHeightMax = window.innerHeight;
      boundsProps.contentWidthMax = window.innerWidth;
    }

    let arrow;
    if (showArrow) {
      this.offset = PopupUtils.getContentOffset(this.attachment, this.props.targetRef(), PopupArrow.Opts.arrowSize, PopupContent.Opts.cornerSize);
      arrow = <PopupArrow className={this.props.classNameArrow} refCallback={this.setArrowNode} />;
    }

    return (
      <PopupContent
        {...boundsProps}
        arrow={arrow}
        classNameInner={this.props.classNameContent}
        closeOnEsc
        closeOnOutsideClick
        closeOnResize
        isHeaderDisabled={this.props.isHeaderDisabled}
        onRequestClose={this.props.onRequestClose}
        refCallback={this.setContentNode}
        releaseFocus={this.props.releaseFocus}
        requestFocus={this.props.requestFocus}
      >
        {this.props.children}
      </PopupContent>
    );
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      boundingRef,
      children,
      classNameArrow,
      classNameContent,
      classNameOverlay,
      contentAttachment,
      contentHeight,
      contentWidth,
      isArrowDisplayed,
      isHeaderDisabled,
      isOpen,
      onRequestClose,
      releaseFocus,
      requestFocus,
      targetRef,
    } = this.props;
    /* eslint-enable no-unused-vars */
    this.offset = { vertical: 0, horizontal: 0 };

    let bidiContentAttachment = contentAttachment;
    if (document.getElementsByTagName('html')[0].getAttribute('dir') === 'rtl') {
      bidiContentAttachment = PopupUtils.switchAttachmentToRTL(bidiContentAttachment);
    }
    this.attachment = PopupUtils.parseStringPair(bidiContentAttachment);

    let magicContent = children;
    const showArrow = isArrowDisplayed && this.attachment !== 'middle center';
    if (isOpen) {
      const boundingFrame = boundingRef ? boundingRef() : undefined;
      magicContent = this.createPopupContent(boundingFrame, showArrow);
    }

    return (
      <div>
        {isOpen && <PopupOverlay className={this.props.classNameOverlay} />}
        <Magic
          arrowDepth={showArrow ? PopupArrow.Opts.arrowMargin : 0}
          boundingRef={boundingRef}
          content={magicContent}
          contentAttachment={bidiContentAttachment}
          contentOffset={`${this.offset.vertical} ${this.offset.horizontal}`}
          isEnabled
          isOpen={isOpen}
          onPosition={this.handleOnPosition}
          targetRef={targetRef}
          targetAttachment={PopupUtils.mirrorAttachment(bidiContentAttachment)}
        />
      </div>
    );
  }
}

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;

export default Popup;
