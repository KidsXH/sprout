"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState } from "react";
import nodes from "@/mocks/nodes";

import * as d3 from "d3";

export const BranchView = () => {
  const parentNode = 2;

  useEffect(() => {
    const width = 512;
    const height = 300;

    const bigRectWidth = 150;
    const bigRectHeight = 72;
    const interval = 15;

    const links = [
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: -bigRectWidth - interval,
        y2: (bigRectHeight / 2) * 3,
      },
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: 0,
        y2: (bigRectHeight / 2) * 3,
      },
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: bigRectWidth + interval,
        y2: (bigRectHeight / 2) * 3,
      },
    ];
    //get sibling nodes
    // const parentNode = nodes[focusBranchNode].parent;
    const siblingNodes = parentNode ? nodes[parentNode].children : [];

    const rectData = d3.map(siblingNodes, (d, i) => {
      const w = bigRectWidth;
      const h = bigRectHeight;
      const x = (-w / 2) * 3 - interval + i * (w + interval);
      const y = 170;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        color: i == 1 ? "#C6EBD4" : "#f5f5f5",
        range: nodes[d].range,
        text: nodes[d].content[nodes[d].contentID].summary,
        id: d,
      };
    });

    rectData.push({
      x: -bigRectWidth / 2,
      y: 0,
      width: bigRectWidth,
      height: bigRectHeight,
      color: "#DADBDB",
      range: nodes[parentNode].range,
      text: nodes[parentNode].content[nodes[parentNode].contentID].summary,
      id: parentNode,
    });

    const pathData = d3.map(links, (d) => {
      const path = d3.path();
      path.moveTo(d.x1, d.y1);
      path.lineTo(d.x2, d.y2);
      path.closePath();
      return {
        d: path.toString(),
        color: "#eaeaea",
      };
    });

    const svg = d3
      .select("#ToT-branch")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `${-width / 2} -10 ${width} ${height + 10}`);

    svg.selectAll("*").remove();

    svg
      .append("g")
      .selectAll("path")
      .data(pathData)
      .join("path")
      .attr("class", "branch-node-link")
      .attr("d", (d) => d.d)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 4)
      .each(function (d) {
        var path = this;
        var pathLength = (path as SVGPathElement).getTotalLength();

        d3.select(path)
          .attr("stroke-dasharray", pathLength + " " + pathLength)
          .attr("stroke-dashoffset", pathLength)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });
    svg
      .append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "branch-node-shadow")
      .attr("x", (d) => d.x)
      .attr("y", (d, i) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("fill", (d) => d.color)
      .attr("rx", 16)
      .attr("ry", 16)
      .on("click", (evenrt, d) => {
        // setFocusBranchNode(d.id);
        // console.log(d.id);
        // setParentNode(d.id);
      });

    svg
      .append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "branch-node")
      .attr("x", (d) => d.x)
      .attr("y", (d, i) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height - 5)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14)
      .on("click", (event, d) => {
        // setParentNode(d.id);
        // console.log(d.id);
      });

    svg
      .append("g")
      .selectAll("text")
      .data(rectData)
      .join("text")
      .attr("class", "branch-node-text select-none")
      .attr("x", (d) => d.x + 15)
      .attr("y", (d, i) => d.y + (d.height / 4) * 3)
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .text((d) => d.text)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 100);

    svg
      .append("g")
      .selectAll("text")
      .data(rectData)
      .join("text")
      .attr("class", "branch-node-text select-none")
      .attr("x", (d) => d.x + 15)
      .attr("y", (d, i) => d.y + 25)
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .attr("text-anchor", "start")
      .text(
        (d) => d.range[0] + (d.range[0] === d.range[1] ? "" : "-" + d.range[1])
      )
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 100);
  }, [parentNode]);

  return (
    <div className="flex flex-col w-[32rem]">
      <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
        Branches
      </div>
      <svg
        className="w-[32rem] h-full"
        id="ToT-branch"
        onClick={() => {
          // handleBranchClick();
        }}
      ></svg>
    </div>
  );
};
