const MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left',
};

const MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top',
};

const parseStringPair = (value) => {
  const [vertical, horizontal] = value.split(' ');
  return { vertical, horizontal };
};

const isVerticalAttachment = attachment => (attachment.vertical !== 'middle');

const primaryArrowPosition = attachment => (isVerticalAttachment(attachment) ? attachment.vertical : attachment.horizontal);

const switchAttachmentToRTL = (attachment) => {
  const parsedValue = parseStringPair(attachment);
  return `${parsedValue.vertical} ${MIRROR_LR[parsedValue.horizontal]}`;
};

const mirrorAttachment = (attachment) => {
  const parsedValue = parseStringPair(attachment);
  let horizontal = parsedValue.horizontal;
  let vertical = parsedValue.vertical;

  if (isVerticalAttachment(parsedValue)) {
    vertical = MIRROR_TB[parsedValue.vertical];
  } else {
    horizontal = MIRROR_LR[parsedValue.horizontal];
  }

  return `${vertical} ${horizontal}`;
};

/**
 * This method calculates a positional offset to be applied if the target is smaller than the arrow.
 */
const getContentOffset = (cAttachment, tAttachment, targetNode, arrowOffset, cornerOffset) => {
  const offset = { vertical: 0, horizontal: 0 };
  
  if (targetNode) {
    const segment = arrowOffset + cornerOffset;
    if (isVerticalAttachment(cAttachment)) {
      if (cAttachment.horizontal !== tAttachment.horizontal ) {
        if (cAttachment.horizontal === 'left') {
          offset.horizontal = -segment;
        } if (cAttachment.horizontal === 'right') {
          offset.horizontal = segment;
        }
      } else if (targetNode.clientWidth < segment ) {
        if (cAttachment.horizontal === 'left') {
          offset.horizontal = segment;
        } else if (cAttachment.horizontal === 'right') {
          offset.horizontal = -segment;
        }
      }
    }
  }
  return offset;
};

const doesArrowFitHorizontal = (targetBounds, contentBounds, arrowOffset, cornerOffset) => (contentBounds.left + contentBounds.width) - arrowOffset - cornerOffset >= targetBounds.left && contentBounds.left + arrowOffset + cornerOffset <= targetBounds.left + targetBounds.width;

const doesArrowFitVertical = (targetBounds, contentBounds, arrowOffset, cornerOffset) => (contentBounds.top + contentBounds.height) - arrowOffset - cornerOffset >= targetBounds.top && contentBounds.top + arrowOffset + cornerOffset <= targetBounds.top + targetBounds.height;

/**
 * This method calculates the arrow position based on the content and targets relative position.
 */
const arrowPositionFromBounds = (targetBounds, contentBounds, arrowOffset, cornerOffset, attachment) => {
  if (contentBounds.top + contentBounds.height <= targetBounds.top) {
    // fully above
    if (doesArrowFitHorizontal(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      return 'bottom';
    }
  } else if (contentBounds.left + contentBounds.width <= targetBounds.left) {
    // fully left
    if (doesArrowFitVertical(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      return 'right';
    }
  } else if (contentBounds.top >= targetBounds.top + targetBounds.height) {
    // fully below
    if (doesArrowFitHorizontal(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      return 'top';
    }
  } else if (contentBounds.left >= targetBounds.left + targetBounds.width) {
    // fully right
    if (doesArrowFitVertical(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      return 'left';
    }
  }
  return getSecondaryArrowPosition(targetBounds, contentBounds, arrowOffset, cornerOffset, attachment);
};

const getSecondaryArrowPosition = (targetBounds, contentBounds, arrowOffset, cornerOffset, attachment) => {
  const overlaps = {};
  overlaps.right = contentBounds.left + contentBounds.width >= targetBounds.left && contentBounds.left + contentBounds.width < (targetBounds.left + targetBounds.width) - arrowOffset;
  overlaps.bottom = contentBounds.top + contentBounds.height >= targetBounds.top && contentBounds.top + contentBounds.height <= (targetBounds.top + targetBounds.height) - arrowOffset;
  overlaps.left = contentBounds.left >= targetBounds.left + arrowOffset && contentBounds.left <= targetBounds.left + targetBounds.width;
  overlaps.top = contentBounds.top >= targetBounds.top + arrowOffset && contentBounds.top <= targetBounds.top + targetBounds.height;

  const positions = [];
  if (overlaps.right || overlaps.left) {
    if (doesArrowFitVertical(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      if (overlaps.left) {positions.push('left');}
      if (overlaps.right) {positions.push('right');}
    }
  }

  if (overlaps.bottom || overlaps.top) {
    if (doesArrowFitHorizontal(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
      if (overlaps.top) {positions.push('top');}
      if (overlaps.bottom) {positions.push('bottom');}
    }
  }

  if (positions.length > 1) {
    if (attachment.vertical === 'middle' && positions.indexOf(attachment.horizontal) >= 0) {
      return attachment.horizontal;
    } else if (positions.indexOf(attachment.vertical) >= 0) {
      return attachment.vertical;
    }
  }
  return positions[0];
}

/**
 * This method caculates the value to be applied to the left position of the popup arrow.
 */
const leftOffset = (targetBounds, contentBounds, arrowOffset, cornerOffset, tAttachment) => {
  let offset;
  if (tAttachment.horizontal === 'center') { // might be able to update this to remove 0
    offset = (targetBounds.left - contentBounds.left) + arrowOffset + (targetBounds.width / 2);
  } else if (tAttachment.horizontal === 'right') {
    offset = (targetBounds.left - contentBounds.left) + arrowOffset + targetBounds.width;
  } else {
    offset = (targetBounds.left - contentBounds.left) + arrowOffset;
  }

  if (offset < (2 * arrowOffset) + cornerOffset) {
    offset = (2 * arrowOffset) + cornerOffset;
  } else if (offset > contentBounds.width - cornerOffset) {
    offset = contentBounds.width - cornerOffset;
  }
  return `${offset}px`;
};

/**
 * This method caculates the value to be applied to the top position of the popup arrow.
 */
const topOffset = (targetBounds, contentBounds, arrowOffset, cornerOffset, tAttachment) => {
  let offset;
  if (tAttachment.vertical === 'middle') {
    offset = (targetBounds.top - contentBounds.top) + arrowOffset + (targetBounds.height / 2);
  } else if (tAttachment.vertical === 'bottom') {
    offset = (targetBounds.top - contentBounds.top) + arrowOffset + targetBounds.height;
  } else {
    offset = (targetBounds.top - contentBounds.top) + arrowOffset;
  }

  if (offset < (2 * arrowOffset) + cornerOffset) {
    offset = (2 * arrowOffset) + cornerOffset;
  } else if (offset > contentBounds.height - cornerOffset) {
    offset = contentBounds.height - cornerOffset;
  }
  return (`${offset}px`);
};

const PopupUtils = {
  parseStringPair,
  isVerticalAttachment,
  primaryArrowPosition,
  switchAttachmentToRTL,
  mirrorAttachment,
  getContentOffset,
  arrowPositionFromBounds,
  leftOffset,
  topOffset,
};

export default PopupUtils;
