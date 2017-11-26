'use strict';

const mouse = (e, dom) => {
    if (!dom) {
        dom = e.currentTarget;
    }
    const svg = dom.ownerSVGElement || dom;
    const x = e.clientX;
    const y = e.clientY;
    if (svg.createSVGPoint) {
        let point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        point = point.matrixTransform(dom.getScreenCTM().inverse());
        return [point.x, point.y];
    }
    const domXY = getOffset(dom);
    return [
        x - domXY.left - dom.clientLeft,
        y - domXY.top - dom.clientTop
    ];
}

const getOffset = (dom) => {
    let top = 0;
    let left = 0;
    let el = dom;
    if (el.getBoundingClientRect) {
        let {top, left} = el.getBoundingClientRect();
    } else {
        do {
            const offsetTop = el.offsetTop || 0;
            const offsetLeft = el.offsetLeft || 0;
            top += offsetTop - el.scrollTop;
            left += offsetLeft - el.scrollLeft;
            el = el.offsetParent;
        } while (el);
    }
    const w = dom.offsetWidth;
    const h = dom.offsetHeight;
    return {
        w,
        h,
        top,
        right: left+ w,
        bottom: top+ h,
        left,
    };
}

export {mouse};
export default getOffset;
