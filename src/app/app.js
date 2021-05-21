import * as d3 from "d3";
import "./app.scss";

export default function createTreeMap(data) {
  const width = 800;
  const height = 600;

  const svg = d3
    .select("#root")
    .append("svg")
    .attr("id", "chart")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, width, height]);

  // border
  svg
    .append("rect")
    .attr("id", "chart-border")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

}
