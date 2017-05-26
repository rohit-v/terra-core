import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactDOM from 'react-dom'
import onClickOutside from 'react-onclickoutside'
import PopupFrame from './PopupFrame'
import PopupArrow from './PopupArrow'
import TetherComponent from './TetherComponent'
import Portal from 'react-portal';

const propTypes = {
  /**
   * Bounding container for the popup.
   */
  boundingRef: PropTypes.func,
  /**
   * Should the popup trigger a close event on esc keydown.
   */
  closeOnEsc: PropTypes.bool,
  /**
   * Should the popup trigger a close event click outside.
   */
  closeOnOutsideClick: PropTypes.bool,
  /**
   * Content to be displayed within the popup.
   */
  content: PropTypes.element,
  /**
   * Attachment point for the popup, this will be mirrored to the target.
   */
  contentAttachment: PropTypes.oneOf(TetherComponent.attachmentPositions).isRequired,
  /**
   * Should the popup be presented as open.
   */
  isOpen: PropTypes.bool,
  /**
   * Callback function indicating a close condition was met, should be combined with isOpen for state management.
   */
  onRequestClose: PropTypes.func,
  /**
   * Should an arrow be placed at the attachment point.
   */
  showArrow: PropTypes.bool,
  /**
   * Presenting element for the popup.
   */
  targetRef: PropTypes.func,
  /**
   * String representation of the z-index.
   */
  zIndex: PropTypes.string,
};

const MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left'
};

const MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top'
};

const defaultProps = {
  isOpen: false,
  showArrow: false,
  zIndex: '1',
};

const WrappedPopupFrame = onClickOutside(PopupFrame);

class PopupPresenter extends React.Component {

  static mirrorAttachment(attachment) {
    const parsedValue = PopupPresenter.parseStringPosition(attachment);
    let horizontal = parsedValue.horizontal;
    let vertical = parsedValue.vertical;

    if (parsedValue.vertical === 'middle') {
      horizontal = MIRROR_LR[parsedValue.horizontal];
    } else {
      vertical = MIRROR_TB[parsedValue.vertical];
    }

    return vertical + ' ' + horizontal;
  }

  static parseStringPosition(value) {
    const [vertical, horizontal] = value.split(' ');
    return {vertical, horizontal};
  }

  static attachPositionFromAlignment(alignment, start, length) {
    if (alignment === 'center') {
      return start + length / 2;
    }else if (alignment === 'right'){
      return start + length;
    }
    return start;
  }

  static arrowPositionFromBounds(targetBounds, popUpBounds, attachment, offset) {
    if (['top', 'bottom'].indexOf(attachment.vertical) >= 0) {
      if (popUpBounds.left + popUpBounds.width - offset >= targetBounds.left && popUpBounds.left + offset <= targetBounds.left + targetBounds.width) {
        if (targetBounds.top < popUpBounds.top) {
          return 'top'
        } else if (targetBounds.bottom < popUpBounds.bottom) {
          return 'bottom'
        }
      }
    } else {
      if (popUpBounds.top + popUpBounds.height - offset >= targetBounds.top && popUpBounds.top + offset <= targetBounds.top + targetBounds.height) {
        if (targetBounds.left < popUpBounds.left) {
          return 'left'
        } else if (targetBounds.right < popUpBounds.right) {
          return 'right'
        }
      }
    }
  }

  static leftOffset(targetBounds, popUpBounds, arrowAlignment, offset) {
    const targetAttachPosition = PopupPresenter.attachPositionFromAlignment(arrowAlignment, targetBounds.left, targetBounds.width);
    const popupAttachPosition = PopupPresenter.attachPositionFromAlignment(arrowAlignment, popUpBounds.left, popUpBounds.width);

    const leftOffset = targetAttachPosition - popupAttachPosition;

    let leftPosition = 0;
    if (arrowAlignment === 'right') {
      leftPosition = popUpBounds.width;
    } else if (arrowAlignment === 'center') {
      leftPosition = popUpBounds.width / 2;
    }

    let newLeftPosition = leftPosition + leftOffset;
    if (newLeftPosition > popUpBounds.width - offset) {
      newLeftPosition = popUpBounds.width - offset;
    } else if (newLeftPosition < offset) {
      newLeftPosition = offset;
    }

    return (offset + newLeftPosition).toString() + 'px';
  }

  static topOffset(targetBounds, popUpBounds, offset) {
    const targetAttachPosition = targetBounds.top + targetBounds.height / 2;
    const popupAttachPosition = popUpBounds.top + popUpBounds.height / 2;

    const topOffset = targetAttachPosition - popupAttachPosition;
    const topPosition = popUpBounds.height / 2;

    let newTopPosition = topPosition + topOffset;
    if (newTopPosition > popUpBounds.height - offset) {
      newTopPosition = popUpBounds.height - offset;
    } else if (newTopPosition < offset) {
      newTopPosition = offset;
    }

    return (offset + newTopPosition).toString() + 'px';
  }

  static setArrowPosition(targetBounds, popUpBounds, attachment, arrowNode, frameNode) {
    const parsedAttachment = PopupPresenter.parseStringPosition(attachment);
    const position = PopupPresenter.arrowPositionFromBounds(targetBounds, popUpBounds, parsedAttachment, PopupArrow.arrowSize);

    if (!position) {
      arrowNode.classList.remove(PopupArrow.positionClasses['top']);
      arrowNode.classList.remove(PopupArrow.positionClasses['bottom']);
      arrowNode.classList.remove(PopupArrow.positionClasses['left']);
      arrowNode.classList.remove(PopupArrow.positionClasses['right']);
      return;
    }

    arrowNode.classList.remove(PopupArrow.oppositePositionClasses[position])
    frameNode.classList.remove(PopupFrame.oppositePositionClasses[position])

    arrowNode.classList.add(PopupArrow.positionClasses[position]);
    frameNode.classList.add(PopupFrame.positionClasses[position]);

    if (['top', 'bottom'].indexOf(position) >= 0) {
      arrowNode.style.left = PopupPresenter.leftOffset(targetBounds, popUpBounds, parsedAttachment.horizontal, PopupArrow.arrowSize); 
    } else {
      arrowNode.style.top = PopupPresenter.topOffset(targetBounds, popUpBounds, PopupArrow.arrowSize);
    }
  }

  constructor(props) {
    super(props);
    this.handleTetherRepositioned = this.handleTetherRepositioned.bind(this);
    this.setArrowNode = this.setArrowNode.bind(this);
    this.setFrameNode = this.setFrameNode.bind(this);
  }

  handleTetherRepositioned(event, targetBounds, presenterBounds) {
    if (this._arrowNode && this._frameNode) {
      PopupPresenter.setArrowPosition(targetBounds, presenterBounds, this.props.contentAttachment, this._arrowNode, this._frameNode);
    }
  }

  setArrowNode(node) {
    this._arrowNode = node;
  }

  setFrameNode(node) {
    this._frameNode = node;
  }

  createFrame(content, attachment, arrow, closeOnEsc, closeOnOutsideClick, onRequestClose) {
    let frameClasses;
    if (arrow) {
      const parsedAttachment = PopupPresenter.parseStringPosition(this.props.contentAttachment);
      const isVerticalPosition = ['top', 'bottom'].indexOf(parsedAttachment.vertical) >= 0;
      const position = isVerticalPosition ? parsedAttachment.vertical : parsedAttachment.horizontal;
      frameClasses = PopupFrame.positionClasses[position];
    }

    const frameProps = {
      arrow,
      className: frameClasses,
      closeOnEsc,
      closeOnOutsideClick,
      content,
      onRequestClose,
      refCallback: this.setFrameNode,
    };

    return <WrappedPopupFrame {...frameProps} />; //maybe need additional div, not sure
  }

  render () {
    const {
      boundingRef,
      classes,
      closeOnEsc,
      closeOnOutsideClick,
      content,
      contentOffset,
      isOpen,
      onRequestClose,
      onUpdate,
      optimizations,
      renderElementTag,
      renderElementTo,
      showArrow,
      targetModifier,
      targetOffset,
      zIndex,
      ...customProps,
    } = this.props; // eslint-disable-line no-unused-vars

    let popupFrame;
    if (isOpen && content) {
      let arrow;
      if (showArrow) {
        arrow = <PopupArrow refCallback={this.setArrowNode} />;
      }

      popupFrame = this.createFrame(content, this.props.contentAttachment, arrow, closeOnEsc, closeOnOutsideClick, onRequestClose);
    }
  
    const bounding = boundingRef ? boundingRef() : undefined;
    const container = bounding || 'window';

    const constraints = [
      {
        to: container,
        attachment: 'together',
        pin: true,
      },
    ];  

    const tetherOptions = {
      ...customProps,
      classPrefix: 'terra-Popup',
      constraints,
      content: popupFrame,
      // disableOnPosition: true,
      // disablePageScroll: true,
      isEnabled: true,
      onRepositioned: this.handleTetherRepositioned,
      targetAttachment: PopupPresenter.mirrorAttachment(this.props.contentAttachment),
      style: {zIndex},
    };

    return (
      <Portal {...customProps} isOpened={isOpen}>
        <TetherComponent {...tetherOptions}>
          {popupFrame}
        </TetherComponent>
      </Portal>
    );
  }
}

PopupPresenter.propTypes = propTypes;
PopupPresenter.defaultProps = defaultProps;

export default PopupPresenter;
