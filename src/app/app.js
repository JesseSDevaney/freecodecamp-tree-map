import * as d3 from "d3";
import uid from "./uid";
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

  // Plot treemap
  const color = d3
    .scaleOrdinal()
    .range([...d3.schemeCategory10, ...d3.schemeSet2]);

  const padRight = 0.05 * width;
  const padLeft = 0.05 * width;
  const padTop = 0.13 * height;
  const padBottom = 0.15 * height;
  const treeMapWidth = width - padRight - padLeft;
  const treeMapHeight = height - padTop - padBottom;

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  const root = d3
    .treemap()
    .tile(d3.treemapBinary)
    .size([treeMapWidth, treeMapHeight])
    .padding(1)(hierarchy);

  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0 + padLeft}, ${d.y0 + padTop})`);

  leaf
    .append("rect")
    .attr("id", (d) => (d.leafUid = uid("leaf")).id)
    .attr("class", "tile")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("fill-opacity", 0.6)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => {
      while (d.depth > 1) d = d.parent;
      return d.data.name;
    })
    .attr("data-value", (d) => d.value);

  leaf
    .append("clipPath")
    .attr("id", (d) => (d.clipUid = uid("clip")).id)
    .append("use")
    .attr("xlink:href", (d) => d.leafUid.href);

  leaf
    .append("text")
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(d.value))
    .join("tspan")
    .attr("x", 3)
    .attr(
      "y",
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    )
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.7 : null
    )
    .text((d) => d);

  // plot legend
  const categories = root.children.map(({ data: { name } }) => [name]);

  const legendPadX = 10;
  const legendPadY = 10;

  const legendContainer = svg
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${padLeft + legendPadX}, ${height - padBottom + legendPadY})`
    );
  const legend = legendContainer.selectAll("g").data(categories).join("g");

  const legendKeyLength = 10;
  const changeInX =
    (width - padLeft - padRight - 2 * legendPadX) /
    Math.floor((categories.length - 1) / 3 + 1);
  const changeInY = (padBottom - 2 * legendPadY) / 3;

  // legend keys
  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", legendKeyLength)
    .attr("height", legendKeyLength)
    .attr("x", (d, i) => changeInX * Math.floor(i / 3))
    .attr("y", (d, i) => changeInY * (i % 3))
    .attr("fill", (d) => color(d));

  // legend values
  legend
    .append("text")
    .text((d) => d)
    .attr("x", (d, i) => changeInX * Math.floor(i / 3) + 15)
    .attr("y", (d, i) => changeInY * (i % 3) + legendKeyLength / 2)
    .attr("dominant-baseline", "middle");
}
