import React from 'react';
import PropTypes from 'prop-types';
import MagicUtils from './_MagicUtils';

const ATTACHMENT_POSITIONS = [
  'top left',
  'top center',
  'top right',
  'middle left',
  'middle center',
  'middle right',
  'bottom left',
  'bottom center',
  'bottom right',
];

const propTypes = {
  /**
   * Reference to the bonding container, wil use window if nothing is provided.
   */
  boundingRef: PropTypes.function,
  /**
   * The content to be magicked.
   */
  content: PropTypes.element,
  /**
   * String pair seperated by a space using values of top, middle, bottom, and left, center, right.
   */
  contentAttachment: PropTypes.oneOf(ATTACHMENT_POSITIONS).isRequired,
  /**
   * String pair of top and left offset, ie "10px -4px".
   */
  contentOffset: PropTypes.string,
  /**
   * Should element be magicked to the page.
   */
  isEnabled: PropTypes.bool,
  /**
   * Required element to be presented and magicked to.
   */
  targetRef: PropTypes.func.isRequired,
  /**
   * String pair of top, middle, bottom, and left, center, right.
   */
  targetAttachment: PropTypes.oneOf(ATTACHMENT_POSITIONS),
  /**
   * String pair of top and left offset, ie "10px -4px".
   */
  targetOffset: PropTypes.string,
  /**
   * Callback function when the magic is moved.
   */
  onPosition: PropTypes.func,
};

const defaultProps = {
  isEnabled: false,
  disableOnPosition: false,
};

class Magic extends React.Component {
  constructor(props) {
    super(props);
    this.setContentNode = this.setContentNode.bind(this);
    this.handleOnPosition = this.handleOnPosition.bind(this);
  }

  componentDidMount() {
    this.addListeners();
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    this.destroy();
  }

  setContentNode(node) {
    this.contentNode = node;
  }

  getNodeBounds() {
    if (this.props.boundingRef) {

    }

    const targetBounds = MagicUtils.getBounds(this.props.targetRef());
    const contentBounds = MagicUtils.getBounds(this.contentNode);
    const boundingBounds = MagicUtils.getBounds(this.contentNode);
    return { targetBounds, contentBounds, boundingBounds };
  }

  handleOnPosition(event) {
    if (this.props.onPosition) {
      const bounds = this.getNodeBounds();
      this.props.onPosition(event, bounds.targetBounds, bounds.contentBounds);
    }
  }

  position() {
    // do stuff here
  }

  destroy() {
    // remove listeners here
    this.contentNode = null;
  }

  update() {
    if (!this.props.targetRef() || !this.contentNode) {
      return;
    }

    this.updateMagic();
  }

  updateMagic() {
    this.position();
  }

  render() {
    const {
      boundingRef,
      content,
      contentAttachment,
      contentOffset,
      isEnabled,
      targetRef,
      targetAttachment,
      targetOffset,
      onPosition,
      ...customProps
    } = this.props;

    // Delete the closePortal prop that comes from react-portal.
    delete customProps.closePortal;

    return (
      <div {...customProps} ref={this.setContentNode}>
        {content}
      </div>
    );
  }
}

Magic.propTypes = propTypes;
Magic.defaultProps = defaultProps;
Magic.attachmentPositions = ATTACHMENT_POSITIONS;

export default Magic;
