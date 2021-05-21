import createTreeMap from "./app/app";
import "./index.scss";

function ready() {
  createTreeMap();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
