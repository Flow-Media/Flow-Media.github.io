"use strict";
function _toConsumableArray(r) {
  return (
    _arrayWithoutHoles(r) ||
    _iterableToArray(r) ||
    _unsupportedIterableToArray(r) ||
    _nonIterableSpread()
  );
}
function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _unsupportedIterableToArray(r, t) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, t);
    var e = Object.prototype.toString.call(r).slice(8, -1);
    return (
      "Object" === e && r.constructor && (e = r.constructor.name),
      "Map" === e || "Set" === e
        ? Array.from(r)
        : "Arguments" === e ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)
        ? _arrayLikeToArray(r, t)
        : void 0
    );
  }
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && Symbol.iterator in Object(r))
    return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, t) {
  (null == t || t > r.length) && (t = r.length);
  for (var e = 0, n = new Array(t); e < t; e++) n[e] = r[e];
  return n;
}
document.addEventListener("DOMContentLoaded", function () {
  var r = document.querySelector("header nav"),
    t = r.querySelectorAll("nav ul li a");
  function e() {
    _toConsumableArray(t).forEach(function (r) {
      return r.hasAttribute("active") && r.removeAttribute("active");
    });
  }
  window.addEventListener("hashchange", function (t) {
    e();
    try {
      r.querySelector('a[href="'.concat(location.hash, '"]')).setAttribute(
        "active",
        ""
      );
    } catch (r) {}
  }),
    window.addEventListener("scroll", function (r) {
      var n = t[~~(window.scrollY / window.innerHeight)];
      n && (e(), n.setAttribute("active", ""));
    });
});
