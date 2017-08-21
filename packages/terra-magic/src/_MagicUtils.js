const BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];
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

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
const getActualBoundingClientRect = (node) => {
  const clientRect = node.getBoundingClientRect();
  const rect = {
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
    width: clientRect.width,
    height: clientRect.height,
  };

  if (node.ownerDocument !== document) {
    const frameElement = node.ownerDocument.defaultView.frameElement;
    if (frameElement) {
      const frameRect = getActualBoundingClientRect(frameElement);
      rect.top += frameRect.top;
      rect.bottom += frameRect.top;
      rect.left += frameRect.left;
      rect.right += frameRect.left;
    }
  }

  return rect;
};

const getScrollParents = (element) => {
  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  const computedStyle = getComputedStyle(element) || {};
  const position = computedStyle.position;
  const parents = [];

  if (position === 'fixed') {
    return [element];
  }

  let parent = element.parentNode;
  while (parent && parent.nodeType === 1) {
    let style;
    try {
      style = getComputedStyle(parent);
    } catch (err) {
      style = null;
    }

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    const { overflow, overflowX, overflowY } = style;
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent);
      }
    }
    parent = parent.parentNode;
  }

  parents.push(element.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (element.ownerDocument !== document) {
    parents.push(element.ownerDocument.defaultView);
  }

  return parents;
};

const getBounds = (element) => {
  let doc;
  let currentElement = element;
  if (element === document) {
    doc = document;
    currentElement = document.documentElement;
  } else {
    doc = element.ownerDocument;
  }

  const docEl = doc.documentElement;
  const box = getActualBoundingClientRect(currentElement);
  const origin = { top: 0, left: 0 };

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top -= docEl.clientTop;
  box.left -= docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
};

const getBoundingRect = (boundingElement) => {
  if (boundingElement === 'window') {
    return {
      top: 0,
      bottom: innerHeight,
      left: 0,
      right: innerWidth,
    };
  }

  const bounds = getBounds(boundingElement);
  const style = getComputedStyle(boundingElement);
  const rect = {
    top: bounds.top,
    bottom: bounds.top + bounds.height,
    left: bounds.left,
    right: bounds.left + bounds.width,
  };

  // Account any parent Frames scroll offset
  if (boundingElement.ownerDocument !== document) {
    const win = boundingElement.ownerDocument.defaultView;
    rect.left += win.pageXOffset;
    rect.top += win.pageYOffset;
    rect.right += win.pageXOffset;
    rect.bottom += win.pageYOffset;
  }

  BOUNDS_FORMAT.forEach((side) => {
    const subSide = side[0].toUpperCase() + side.substr(1);
    if (subSide === 'Top' || subSide === 'Left') {
      rect[side] += parseFloat(style[`border${subSide}Width`]);
    } else {
      rect[side] -= parseFloat(style[`border${subSide}Width`]);
    }
  });

  return rect;
};

const parseStringPair = (value) => {
  if (!value) {
    return { vertical: '', horizontal: '' };
  }
  const [vertical, horizontal] = value.split(' ');
  return { vertical, horizontal };
};

const parseOffset = (value) => {
  if (!value) {
    return { vertical: 0, horizontal: 0 };
  }

  const pair = parseStringPair(value);
  return { vertical: Number.parseFloat(pair.vertical), horizontal: Number.parseFloat(pair.horizontal) };
};

const getTargetCoords = (rect, attachment, offset) => {
  const attachmentCoords = {};
  if (attachment.vertical === 'middle') {
    attachmentCoords.y = rect.top + (rect.height / 2);
  } else if (attachment.vertical === 'bottom') {
    attachmentCoords.y = rect.top + rect.height;
  } else {
    attachmentCoords.y = rect.top;
  }

  if (attachment.horizontal === 'center') {
    attachmentCoords.x = rect.left + (rect.width / 2);
  } else if (attachment.horizontal === 'right') {
    attachmentCoords.x = rect.left + rect.width;
  } else {
    attachmentCoords.x = rect.left;
  }
  return { x: attachmentCoords.x + offset.horizontal, y: attachmentCoords.y + offset.vertical, tAttachment: attachment, offset };
};

const isValidCoords = (cAttachment, cCoords, cRect, bRect) => {
  if (cAttachment.vertical === 'middle') {
    if (cAttachment.horizontal === 'right') {
      return cCoords.x >= bRect.left;
    } else if (cAttachment.horizontal === 'left') {
      return cCoords.x + cRect.width  <= bRect.right;
    }
    return true;
  } else if (cAttachment.vertical === 'top') {
    return cCoords.y + cRect.height <= bRect.bottom;
  }
  return cCoords.y >= bRect.top;
};

const mirrorAttachment = (attachment) => {
  const mAttachment = {};
  if (attachment.vertical !== 'middle') {
    mAttachment.horizontal = attachment.horizontal;
    mAttachment.vertical = MIRROR_TB[attachment.vertical];
  } else {
    mAttachment.horizontal = MIRROR_LR[attachment.horizontal];
    mAttachment.vertical = attachment.vertical;
  }
  return mAttachment;
};

const mirrorTargetCoords = (tRect, tAttachment, tOffset) => {
  const mOffset = { vertical: -tOffset.vertical, horizontal: -tOffset.horizontal };
  const mAttachment = mirrorAttachment(tAttachment);
  return getTargetCoords(tRect, mAttachment, mOffset);
};

const rotateContentAttachment = (attachment, angle) => {
  const rAttachment = {};
  if (attachment.vertical === 'middle') {
    if (angle === '90') {
      rAttachment.vertical = attachment.horizontal === 'left' ? 'bottom' : 'top';
    } else if (angle === '-90') {
      rAttachment.vertical = attachment.horizontal === 'left' ? 'top' : 'bottom';
    }
    rAttachment.horizontal = 'center';
  } else {
    if (angle === '90') {
      rAttachment.horizontal = attachment.vertical === 'top' ? 'left' : 'right';
    } else if (angle === '-90') {
      rAttachment.horizontal = attachment.vertical === 'top' ? 'right' : 'left';
    }
    rAttachment.vertical = 'middle';
  }
  return rAttachment;
};

const getBasicContentCoords = (rect, attachment, offset, targetCoords, arrowDepth) => {
  const attachmentCoords = {};
  if (attachment.vertical === 'middle') {
    if (attachment.horizontal === 'center') {
      attachmentCoords.x = targetCoords.x - (rect.width / 2);
    } else if (attachment.horizontal === 'right') {
      attachmentCoords.x = targetCoords.x - rect.width - arrowDepth;
    } else {
      attachmentCoords.x = targetCoords.x + arrowDepth;
    }

    attachmentCoords.y = targetCoords.y - (rect.height / 2);
  } else {
    if (attachment.horizontal === 'center') {
      attachmentCoords.x = targetCoords.x - (rect.width / 2);
    } else if (attachment.horizontal === 'right') {
      attachmentCoords.x = targetCoords.x - rect.width;
    } else {
      attachmentCoords.x = targetCoords.x;
    }

    if (attachment.vertical === 'bottom') {
      attachmentCoords.y = targetCoords.y - rect.height - arrowDepth;
    } else {
      attachmentCoords.y = targetCoords.y + arrowDepth;
    }
  }

  return { x: attachmentCoords.x + offset.horizontal, y: attachmentCoords.y + offset.vertical, cAttachment: attachment, tAttachment: targetCoords.tAttachment, cOffset: offset, tOffset: targetCoords.offset };
};

const getRotatedContentCoords = (tRect, tAttachment, tOffset, cCoords, cRect, cAttachment, cOffset, bRect, arrowDepth) => {
  if (isValidCoords(cAttachment, cCoords, cRect, bRect)) {
    return cCoords; // default valid
  }

  const mtCoords = mirrorTargetCoords(tRect, tAttachment, tOffset);
  const mcAttachment = mirrorAttachment(cAttachment);
  const mcOffset = { vertical: -cOffset.vertical, horizontal: -cOffset.horizontal };
  const mcCoords = getBasicContentCoords(cRect, mcAttachment, mcOffset, mtCoords, arrowDepth);

  if (isValidCoords(mcAttachment, mcCoords, cRect, bRect)) {
    return mcCoords; // 180 degree valid
  }

  const noOffset = { vertical: 0, horizontal: 0 };
  let rcAttachment = rotateContentAttachment(cAttachment, '90');
  let rtCoords = getTargetCoords(tRect, mirrorAttachment(rcAttachment), noOffset);
  let rcCoords = getBasicContentCoords(cRect, rcAttachment, noOffset, rtCoords, arrowDepth);

  if (isValidCoords(rcAttachment, rcCoords, cRect, bRect)) {
    return rcCoords; // 90degree valid
  }

  rcAttachment = rotateContentAttachment(cAttachment, '-90');
  rtCoords = getTargetCoords(tRect, mirrorAttachment(rcAttachment), noOffset);
  rcCoords = getBasicContentCoords(cRect, rcAttachment, noOffset, rtCoords, arrowDepth);

  if (isValidCoords(rcAttachment, rcCoords, cRect, bRect)) {
    return rcCoords; // -90degree valid
  }

  return cCoords;
};

const getBoundedContentCoords = (cCoords, cRect, bRect) => {
  const attachmentCoords = {};

  // Bounds Checks Horizontal
  if (bRect.left >= cCoords.x) {
    attachmentCoords.x = bRect.left;
  } else if (bRect.right <= cCoords.x + cRect.width) {
    attachmentCoords.x = bRect.right - cRect.width;
  } else {
    attachmentCoords.x = cCoords.x;
  }

  // Bounds Checks Vertical
  if (bRect.top >= cCoords.y) {
    attachmentCoords.y = bRect.top;
  } else if (bRect.bottom <= cCoords.y + cRect.height) {
    attachmentCoords.y = bRect.bottom - cRect.height;
  } else {
    attachmentCoords.y = cCoords.y;
  }

  return { x: attachmentCoords.x, y: attachmentCoords.y, cAttachment: cCoords.cAttachment, tAttachment: cCoords.tAttachment, cOffset: cCoords.cOffset, tOffset: cCoords.tOffset };
};

const positionStyleFromBounds = (boundingRect, targetRect, contentRect, contentOffset, targetOffset, contentAttachment, targetAttachment, arrowDepth) => {
  const cAttachment = parseStringPair(contentAttachment);
  const tAttachment = parseStringPair(targetAttachment);
  const cOffset = parseOffset(contentOffset);
  const tOffset = parseOffset(targetOffset);
  const tCoords = getTargetCoords(targetRect, tAttachment, tOffset);
  const cCoords = getBasicContentCoords(contentRect, cAttachment, cOffset, tCoords, arrowDepth);
  const cRotated = getRotatedContentCoords(targetRect, tAttachment, tOffset, cCoords, contentRect, cAttachment, cOffset, boundingRect, arrowDepth);
  const cFinal = getBoundedContentCoords(cRotated, contentRect, boundingRect, arrowDepth);

  // Account for mobile zoom, this plays havoc with page offsets, so adjusting to fixed positioning.
  if (document.body.clientWidth / window.innerWidth > 1.0) {
    return { position: 'fixed', left: `${cFinal.x}px`, top: `${cFinal.y}px`, cAttachment: cFinal.attachment, tAttachment: cFinal.attachment, offset: cFinal.offset };
  }
  return { position: 'absolute', left: `${cFinal.x + pageXOffset}px`, top: `${cFinal.y + pageYOffset}px`, cAttachment: cFinal.cAttachment, tAttachment: cFinal.tAttachment, cOffset: cFinal.cOffset, tOffset: cFinal.tOffset };
};

export default {
  getScrollParents,
  getBounds,
  getBoundingRect,
  mirrorAttachment,
  parseStringPair,
  positionStyleFromBounds,
};
