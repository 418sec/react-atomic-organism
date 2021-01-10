/**
 * Returns true, if given key is included in the blacklisted
 * keys.
 * @param key key for check, string.
 */
function isPrototypePolluted(key) {
  return ['__proto__', 'prototype', 'constructor'].includes(key);
}

const replaceValue = (obj, arrKey, val, isAppend) => {
  const last = arrKey.pop();
  arrKey.forEach((k) => {
    if (isPrototypePolluted(k)) return;
    obj[k] = obj[k] || {};
    obj = obj[k];
  });
  if (isAppend && (!obj[last] || !obj[last].push)) {
    if (!obj[last]) {
      obj[last] = [val];
    } else {
      obj[last] = [obj[last], val];
    }
  } else if (isAppend && obj[last].push) {
    obj[last].push(val);
  } else {
    obj[last] = val;
  }
};

export default replaceValue;
