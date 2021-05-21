// Source: https://github.com/observablehq/stdlib/blob/main/src/dom/uid.js
// License: ISC
var count = 0;

export default function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, location) + "";
}

Id.prototype.toString = function () {
  return "url(" + this.href + ")";
};
