const BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
const getActualBoundingClientRect = (node) => {
  const rect = Object.assign({}, node.getBoundingClientRect());

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
    return [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  const bounds = getBounds(boundingElement);
  const style = getComputedStyle(boundingElement);
  const rect = [bounds.left, bounds.top, bounds.width + bounds.left, bounds.height + bounds.top];

  // Account any parent Frames scroll offset
  if (boundingElement.ownerDocument !== document) {
    const win = boundingElement.ownerDocument.defaultView;
    rect[0] += win.pageXOffset;
    rect[1] += win.pageYOffset;
    rect[2] += win.pageXOffset;
    rect[3] += win.pageYOffset;
  }

  BOUNDS_FORMAT.forEach((side, i) => {
    const subSide = side[0].toUpperCase() + side.substr(1);
    if (subSide === 'Top' || subSide === 'Left') {
      rect[i] += parseFloat(style[`border${subSide}Width`]);
    } else {
      rect[i] -= parseFloat(style[`border${subSide}Width`]);
    }
  });

  return rect;
};

const parseStringPair = (value) => {
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
      attachmentCoords.x = targetCoords.x - (rect.width / 2);
    } else {
      attachmentCoords.x = targetCoords.x;
    }

    attachmentCoords.y = targetCoords.y + (rect.height / 2);
  } else {
    if (attachment.horizontal === 'center') {
      attachmentCoords.x = targetCoords.x - (rect.width / 2);
    } else if (attachment.horizontal === 'right') {
      attachmentCoords.x = targetCoords.x + rect.width;
    } else {
      attachmentCoords.x = targetCoords.x;
    }

    if (attachment.vertical === 'bottom') {
      attachmentCoords.y = targetCoords.y + rect.height;
    } else {
      attachmentCoords.y = targetCoords.y;
    }
  }

  return { x: attachmentCoords.x + offset.horizontal, y: attachmentCoords.y + offset.vertical };
};

const getAdjustContentCoords = (contentCoords, targetCoords, targetRect, contentRect, contentOffset, targetOffset, boundingRect) => {
  const attachmentCoords = {};
  if (boundingRect.left <= contentCoords.x) {
    attachmentCoords.x = boundingRect.left;
  } else if (boundingRect.left + boundingRect.width >= contentCoords.x) {
    attachmentCoords.x = (boundingRect.left + boundingRect.width) - contentRect.width;
  } else {
    attachmentCoords.x = contentCoords.x;
  }

  if (boundingRect.top <= contentCoords.y) {
    attachmentCoords.y = boundingRect.top;
  } else if (boundingRect.top + boundingRect.height >= contentCoords.y) {
    attachmentCoords.y = (boundingRect.top + boundingRect.height) - contentRect.height;
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
  const cOffset = parseStringPair(contentOffset);
  const tOffset = parseStringPair(targetOffset);
  const tCoords = getTargetCoords(targetRect, tAttachment, tOffset);
  const cCoords = getInitialContentCoords(contentRect, cAttachment, cOffset, tCoords);
  const cFinal = getAdjustContentCoords(cCoords, tCoords, targetRect, contentRect, cOffset, tOffset, boundingRect);

  return { position: 'fixed', left: `${cFinal.x}px`, top: `${cFinal.y}px` };
};

export default {
  getActualBoundingClientRect,
  getScrollParents,
  getBounds,
  getBoundingRect,
  positionStyleFromBounds,
};
