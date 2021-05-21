import createTreeMap from "./app/app";
import "./index.scss";

function ready() {
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      createTreeMap(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
