import {doc} from 'win-doc';
import callfunc from 'call-func';

const keys = Object.keys;

const inject = (base, isStart) => dNode => {
  base = callfunc(base);
  if (base && (base.nodeName === 'BODY' || base.nodeName === 'HEAD')) {
    if (isStart && base.firstChild) {
      base.insertBefore(dNode, base.firstChild);
      return;
    } else {
      base.appendChild(dNode);
      return;
    }
  } else {
    const d = doc();
    if (!base) {
      base = d.currentScript ? d.currentScript : d.body;
    }
    const parentNode = base.parentNode;
    if (parentNode) {
      if (!isStart) {
        if (base.nextSibling) {
          parentNode.insertBefore(dNode, base.nextSibling);
          return;
        } else {
          parentNode.appendChild(dNode);
          return;
        }
      } else {
        parentNode.insertBefore(dNode, base);
        return;
      }
    }
    d.body.appendChild(dNode);
  }
};

const create = tag => callback => attrs => {
  const d = doc();
  if (d) {
    const dNode = d.createElement(tag);
    if (attrs) {
      keys(attrs).forEach(key => (dNode[key] = attrs[key]));
    }
    if (callback) {
      dNode.onreadystatechange = dNode.onload = () => {
        const readyState = dNode.readyState;
        if (
          !readyState ||
          -1 !== '|loaded|complete|'.indexOf('|' + readyState + '|')
        ) {
          setTimeout(callback);
        }
      };
    }
    return dNode;
  }
};

const js = (base, isStart) => callback => (url, attrs) => {
  const dNode = create('script')(callback)(attrs);
  if (base) {
    inject(base, isStart)(dNode);
  }
  dNode.src = url;
  return dNode;
};

const css = (base, isStart) => callback => (url, attrs) => {
  const dNode = create('link')(callback)({
    rel: 'stylesheet',
    type: 'text/css',
    ...attrs,
  });
  if (base) {
    inject(base, isStart)(dNode);
  }
  dNode.href = url;
  return dNode;
};

export {js, css, inject, create};
