//获取dom
let $ = (() => {
  let DOM = new Map();
  return function (obj) {
    //已经获取直接返回
    if (DOM.has(obj)) {
      return DOM.get(obj);
    }
    let doc = typeof obj === "string" ? document.querySelector(obj) : null;
    DOM.set(obj, doc);
    return doc;
  };
})();
//获取css样式
function getStyleAttr(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return window.getComputedStyle(obj, null)[attr];
  }
}
function debounce(fn, outTime = 300) {
  let time = null;
  return function (...args) {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(this, args);
    }, outTime);
  };
}
function time(t) {
  if (!t) return "00:00";
  let F =
    parseInt(t / 60) < 10
      ? parseInt(t / 60)
          .toString()
          .padStart(2, 0)
      : parseInt(t / 60);
  let M = t % 60 < 10 ? (t % 60).toString().padStart(2, 0) : t % 60;
  return F + ":" + M;
}
