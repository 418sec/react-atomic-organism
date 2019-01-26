import getScrollInfo from 'get-scroll-info';
import get from 'get-object-value';

const UNDEFINED = 'undefined';

const unifyTouch = e => {
  if (!e.changedTouches) {
    return e;
  } else {
    return get(e, ['changedTouches', 0]);
  }
};

const mouse = (e, dom, scrollNode) => {
  if (!dom) {
    dom = e.currentTarget;
  }
  e = unifyTouch(e);
  const x = e.clientX;
  const y = e.clientY;
  const svgXY = toSvgXY(dom)(x, y);
  if (false !== svgXY) {
    return svgXY;
  } else {
    const domXY = getOffset(dom, scrollNode);
    return [x - domXY.left - dom.clientLeft, y - domXY.top - dom.clientTop];
  }
};

const toSvgXY = dom => (x, y) => {
  const svg = dom.ownerSVGElement || dom;
  if (svg.createSVGPoint) {
    let point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    point = point.matrixTransform(dom.getScreenCTM().inverse());
    return [point.x, point.y];
  } else {
    return false;
  }
};

const toSvgMatrixXY = dom => (x, y) => {
  const svg = dom.ownerSVGElement || dom;
  const offset = svg.getBoundingClientRect();
  const matrix = dom.getScreenCTM();
  return {
    x: matrix.a * x + matrix.c * y + matrix.e - offset.left,
    y: matrix.b * x + matrix.d * y + matrix.f - offset.top,
  };
};

const getRectWithElOffset = dom => {
  let top = 0;
  let left = 0;
  let el = dom;
  do {
    const offsetTop = el.offsetTop || 0;
    const offsetLeft = el.offsetLeft || 0;
    if ('BODY' === el.nodeName) {
      top += offsetTop;
      left += offsetLeft;
    } else {
      top += offsetTop - el.scrollTop;
      left += offsetLeft - el.scrollLeft;
    }
    el = el.offsetParent;
  } while (el);
  return {top, left};
};

const getOffset = (dom, scrollNode) => {
  let top = 0;
  let left = 0;
  let w;
  let h;
  const scrollInfo =
    UNDEFINED !== typeof scrollNode && !scrollNode
      ? {top: 0, left: 0}
      : getScrollInfo(scrollNode);
  if (UNDEFINED !== typeof SVGElement && dom instanceof SVGElement) {
    const rect = dom.getBoundingClientRect();
    top = rect.top + scrollInfo.top;
    left = rect.left + scrollInfo.left;
    w = rect.width;
    h = rect.height;
  } else {
    w = dom.offsetWidth;
    h = dom.offsetHeight;
    if (dom.getBoundingClientRect) {
      const rect = dom.getBoundingClientRect();
      top = parseInt(rect.top + scrollInfo.top, 10);
      left = parseInt(rect.left + scrollInfo.left, 10);
    } else {
      const rectOffset = getRectWithElOffset(dom);
      top = rectOffset.top;
      left = rectOffset.left;
    }
  }
  const result = {
    w,
    h,
    top,
    right: left + w,
    bottom: top + h,
    left,
  };
  return result;
};

export {mouse, toSvgXY, toSvgMatrixXY, unifyTouch};
export default getOffset;
