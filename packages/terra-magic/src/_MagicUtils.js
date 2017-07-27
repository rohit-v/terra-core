const BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
const getActualBoundingClientRect = (node) => {
  let rect = Object.assign({}, node.getBoundingClientRect());

  if (node.ownerDocument !== document) {
    let frameElement = node.ownerDocument.defaultView.frameElement;
    if (frameElement) {
      let frameRect = getActualBoundingClientRect(frameElement);
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
  let parents = [];

  if (position === 'fixed') {
    return [element];
  }

  let parent = element;
  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
    let style;
    try {
      style = getComputedStyle(parent);
    } catch (err) {}

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    const {overflow, overflowX, overflowY} = style;
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent)
      }
    }
  }

  parents.push(element.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (el.ownerDocument !== document) {
    parents.push(el.ownerDocument.defaultView);
  }

  return parents;
};

const getBounds = (el) => {
  let doc;
  if (el === document) {
    doc = document;
    el = document.documentElement;
  } else {
    doc = el.ownerDocument;
  }

  const docEl = doc.documentElement;

  const box = getActualBoundingClientRect(el);

  // const origin = getOrigin(); // decide if needed later
  const origin = {top: 0, left: 0};

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top = box.top - docEl.clientTop;
  box.left = box.left - docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
};

const getBoundingRect = (boundingElement) => {
  let rect;
  if (boundingElement === 'window') {
    return [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  const bounds = getBounds(boundingElement);
  const style = getComputedStyle(boundingElement);
  rect = [bounds.left, bounds.top, bounds.width + bounds.left, bounds.height + bounds.top];

  // Account any parent Frames scroll offset
  if (boundingElement.ownerDocument !== document) {
    let win = to.ownerDocument.defaultView;
    rect[0] += win.pageXOffset;
    rect[1] += win.pageYOffset;
    rect[2] += win.pageXOffset;
    rect[3] += win.pageYOffset;
  }

  BOUNDS_FORMAT.forEach((side, i) => {
    side = side[0].toUpperCase() + side.substr(1);
    if (side === 'Top' || side === 'Left') {
      rect[i] += parseFloat(style[`border${ side }Width`]);
    } else {
      rect[i] -= parseFloat(style[`border${ side }Width`]);
    }
  });

  return rect;
};

const positionStyleFromBounds = (boundingRect, targetRect, contentRect, contentOffset, targetOffset, contentAttachment, targetAttachment) => {

};

export default {
  getActualBoundingClientRect,
  getScrollParents,
  getBounds,
  getBoundingRect,
  positionStyleFromBounds,
};
