import * as d3 from "d3";

export const createLinearGradient = (svg: any, id: string, color: string) => {
  let defs = svg.append("defs");

  let gradient = defs
    .append("radialGradient")
    .attr("id", id)
    .attr("r", "65%")
    .attr("cx", "50%")
    .attr("cy", "0%");

  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "40%")
    .attr("stop-color", color)
    .attr("stop-opacity", 1);

  gradient
    .append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", "#f5f5f5")
    .attr("stop-opacity", 1);
};
