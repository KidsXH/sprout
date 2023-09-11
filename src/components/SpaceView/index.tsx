"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState } from "react";
import nodes from "@/mocks/nodes";

import * as d3 from "d3";

export const SpaceView = () => {
  const focusBranchNode = 3;

  useEffect(() => {
    const width = 250;
    const margin = 10;
    const contentSet = nodes[focusBranchNode].content;
    const dotData = contentSet.map((d, i) => {
      const pos = { x: i * 20, y: i * 20 };
      const radius = 5;
      return {
        x: pos.x + margin,
        y: pos.y + margin,
        r: radius,
        stroke: i === nodes[focusBranchNode].contentID ? "#8BBD9E" : "#fff",
        fill: d.node === focusBranchNode ? "#C6EBD4" : "#FBE1B9",
        content: d.content,
      };
    });

    const svg = d3
      .select("#ToT-space")
      .attr("preserveAspectRatio", "xMinYMin meet")
      // .attr("viewBox", `${-width / 2} -10 ${width} ${height + 10}`);
      .attr("viewBox", `0 0 256 256`);

    svg.selectAll("*").remove();

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", width)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "none")
      .attr("stroke", "#f5f5f5")
      .attr("stroke-width", 2)
      .attr("rx", 8)
      .attr("ry", 8);

    svg
      .selectAll("circle")
      .data(dotData)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.fill)
      .attr("stroke", (d) => d.stroke)
      .attr("stroke-width", 1)
      .append("title")
      .text((d) => d.content);
    // .on("hover", (d) => {})
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
        Context
      </div>
      <div className="flex h-full">
        <svg
          className="w-[16rem] h-full flex-col"
          id="ToT-space"
          onClick={() => {
            // handleBranchClick();
          }}
        ></svg>
        <div className="flex flex-col  h-full">config panel</div>
      </div>
    </div>
  );
};
