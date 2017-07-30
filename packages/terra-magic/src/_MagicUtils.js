const BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

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
    height: clientRect.height
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

  // const origin = getOrigin(); // decide if needed later
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
    // return {
    //   top: pageYOffset,
    //   bottom: innerHeight + pageYOffset,
    //   left: pageXOffset,
    //   right: innerWidth + pageXOffset,
    // };
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
    rect['left'] += win.pageXOffset;
    rect['top'] += win.pageYOffset;
    rect['right'] += win.pageXOffset;
    rect['bottom'] += win.pageYOffset;
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

const parseOffset = (value) => {
  if (!value) {
    return { vertical: 0, horizontal: 0 };
  }

  const pair = parseStringPair(value);
  return { vertical: Number.parseFloat(pair.vertical), horizontal: Number.parseFloat(pair.horizontal) };
};

const parseStringPair = (value) => {
  if (!value) {
    return { vertical: '', horizontal: '' };
  }
  const [vertical, horizontal] = value.split(' ');
  return { vertical, horizontal };
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
  return { x: attachmentCoords.x + offset.horizontal, y: attachmentCoords.y + offset.vertical };
};

const getInitialContentCoords = (rect, attachment, offset, targetCoords) => {
  const attachmentCoords = {};
  if (attachment.vertical === 'middle') {
    if (attachment.horizontal === 'center') {
      attachmentCoords.x = targetCoords.x - (rect.width / 2);
    } else if (attachment.horizontal === 'right') {
      attachmentCoords.x = targetCoords.x - rect.width;
    } else {
      attachmentCoords.x = targetCoords.x;
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
      attachmentCoords.y = targetCoords.y - rect.height;
    } else {
      attachmentCoords.y = targetCoords.y;
    }
  }

  return { x: attachmentCoords.x + offset.horizontal, y: attachmentCoords.y + offset.vertical };
};

const getAdjustContentCoords = (contentCoords, targetCoords, targetRect, contentRect, contentOffset, targetOffset, boundingRect) => {
  const attachmentCoords = {};
  if (boundingRect.left >= contentCoords.x) {
    attachmentCoords.x = boundingRect.left;
  } else if (boundingRect.right <= contentCoords.x + contentRect.width) {
    attachmentCoords.x = boundingRect.right - contentRect.width;
  } else {
    attachmentCoords.x = contentCoords.x;
  }

  if (boundingRect.top >= contentCoords.y) {
    attachmentCoords.y = boundingRect.top;
  } else if (boundingRect.bottom <= contentCoords.y + contentRect.height) {
    attachmentCoords.y = boundingRect.bottom - contentRect.height;
  } else {
    attachmentCoords.y = contentCoords.y;
  }

  // const validAttachments = ['top', 'bottom', 'left', 'right'];
  // also need to determine adjust for offset
  // const availableSpace = {
  //   top: boundingRect.top - targetRect.top,
  //   bottom: (boundingRect.top + boundingRect.height) - (targetRect.top + targetRect.height),
  //   left: boundingRect.left - targetRect.left,
  //   right: (boundingRect.left + boundingRect.width) - (targetRect.left + targetRect.width),
  // };

  return { x: attachmentCoords.x, y: attachmentCoords.y };
};

const positionStyleFromBounds = (boundingRect, targetRect, contentRect, contentOffset, targetOffset, contentAttachment, targetAttachment) => {
  const cAttachment = parseStringPair(contentAttachment);
  const tAttachment = parseStringPair(targetAttachment);
  const cOffset = parseOffset(contentOffset);
  const tOffset = parseOffset(targetOffset);
  const tCoords = getTargetCoords(targetRect, tAttachment, tOffset);
  const cCoords = getInitialContentCoords(contentRect, cAttachment, cOffset, tCoords);
  const cFinal = getAdjustContentCoords(cCoords, tCoords, targetRect, contentRect, cOffset, tOffset, boundingRect);

  // Account for mobile zoom, this plays havoc with page offsets, so adjusting to fixed positioning.
  if (document.body.clientWidth / window.innerWidth > 1.0) {
    return { position: 'fixed', left: `${cFinal.x}px`, top: `${cFinal.y}px` };
  }
  return { position: 'absolute', left: `${cFinal.x + pageXOffset}px`, top: `${cFinal.y + pageYOffset}px` };
};

export default {
  getActualBoundingClientRect,
  getScrollParents,
  getBounds,
  getBoundingRect,
  positionStyleFromBounds,
};
