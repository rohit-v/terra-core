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

const primaryMarginStyle = (attachment, margin) => {
  if (isVerticalAttachment(attachment)) {
    return attachment.vertical === 'top' ? { margin: `${margin}px 0 0 0` } : { margin: `0 0 ${margin}px 0` };
  }
  return attachment.horizontal === 'left' ? { margin: `0 0 0 ${margin}px` } : { margin: `0 ${margin}px 0 0` };
};

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
const getContentOffset = (attachment, targetAttachment, targetNode, arrowOffset, cornerOffset) => {
  const offset = { vertical: 0, horizontal: 0 };
  if (targetNode) {
    if (isVerticalAttachment(attachment) && targetNode.clientWidth <= (arrowOffset * 2) + cornerOffset) {
      if (attachment.horizontal === 'left') {
        offset.horizontal = (arrowOffset + cornerOffset) - (targetNode.clientWidth / 2);
      } else if (attachment.horizontal === 'right') {
        offset.horizontal = -((arrowOffset + cornerOffset) - (targetNode.clientWidth / 2));
      }
    } else {
      if (attachment.horizontal !== targetAttachment.horizontal ) {
        if (attachment.horizontal === 'left') {
          offset.horizontal = - arrowOffset - cornerOffset;
        } if (attachment.horizontal === 'right') {
          offset.horizontal = arrowOffset + cornerOffset;
        } else if (targetAttachment.horizontal === 'left'){
          offset.horizontal = -arrowOffset + cornerOffset;
        } else if (targetAttachment.horizontal === 'right'){
          offset.horizontal = - arrowOffset - cornerOffset;
        }
      }

      // TODO: investigate why this needs to be 2 instead of 1
      if (attachment.vertical === targetAttachment.vertical) {
        if (attachment.vertical === 'top') {
          offset.vertical = 2;
        } if (attachment.vertical === 'bottom') {
          offset.vertical = -2;
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
  } else {
    const overlaps = [];
    // break the tie with a default attachment calculation
    if (contentBounds.left + contentBounds.width > targetBounds.left && contentBounds.left + contentBounds.width < (targetBounds.left + targetBounds.width) - arrowOffset) {
      if (doesArrowFitVertical(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
        overlaps.push('right');
      }
    }
    if (contentBounds.top + contentBounds.height > targetBounds.top && contentBounds.top + contentBounds.height < (targetBounds.top + targetBounds.height) - arrowOffset) {
      if (doesArrowFitHorizontal(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
        overlaps.push('bottom');
      }
    }
    if (contentBounds.left > targetBounds.left + arrowOffset && contentBounds.left < targetBounds.left + targetBounds.width) {
      if (doesArrowFitVertical(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
        overlaps.push('left');
      }
    }
    if (contentBounds.top > targetBounds.top + arrowOffset && contentBounds.top < targetBounds.top + targetBounds.height) {
      if (doesArrowFitHorizontal(targetBounds, contentBounds, arrowOffset, cornerOffset)) {
        overlaps.push('top');
      }
    }

    if (overlaps.length === 1) {
      return overlaps[0];
    } else if (overlaps.length >= 2) {
      if (attachment.vertical === 'middle' && overlaps.indexOf(attachment.horizontal) >= 0) {
        // check for left or right
        return attachment.horizontal;
      } else if (overlaps.indexOf(attachment.vertical) >= 0) {
        // check for top or bottom
        return attachment.vertical;
      }
      return overlaps[0];
    }
  }

  return undefined;
};

/**
 * This method caculates the value to be applied to the left position of the popup arrow.
 */
const leftOffset = (targetBounds, contentBounds, arrowOffset, cornerOffset, contentOffset, attachment) => {
  let offset;
  if (contentOffset.horizontal !== 0 || attachment.horizontal === 'center') {
    offset = (targetBounds.left - contentBounds.left) + arrowOffset + (targetBounds.width / 2);
  } else if (attachment.horizontal === 'right') {
    offset = (targetBounds.left - contentBounds.left) + (targetBounds.width - cornerOffset);
  } else {
    offset = (targetBounds.left - contentBounds.left) + (2 * arrowOffset) + cornerOffset;
  }

  if (offset < 2 * arrowOffset) {
    offset = (2 * arrowOffset) + cornerOffset;
  } else if (offset > contentBounds.width) {
    offset = contentBounds.width - cornerOffset;
  }
  return `${offset}px`;
};

// TODO: needs revision, now that alternate values are possible
/**
 * This method caculates the value to be applied to the top position of the popup arrow.
 */
const topOffset = (targetBounds, contentBounds, arrowOffset, cornerOffset) => {
  let offset = (targetBounds.top - contentBounds.top) + arrowOffset + (targetBounds.height / 2);
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
  primaryMarginStyle,
  switchAttachmentToRTL,
  mirrorAttachment,
  getContentOffset,
  arrowPositionFromBounds,
  leftOffset,
  topOffset,
};

export default PopupUtils;
