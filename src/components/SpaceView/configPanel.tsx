"use client";
import React from "react";
import * as d3 from "d3";
import { useEffect, useState } from "react";

export const ConfigPanel = () => {
  const svg = d3.select("#node-space");
  svg.selectAll("*").remove();

  const bigRectWidth = 150;
  const bigRectHeight = 72;
  const textOffsetY = (bigRectHeight / 4) * 3;
  const codeRangeOffsetX = 15;
  const codeRangeOffsetY = 25;
  const nodeRectData: { color: string; range: number[]; text: string } = {
    color: "#C6EBD4",
    range: [2, 4],
    text: "node",
  };
  svg

    .append("rect")
    .attr("class", "branch-node-shadow")
    .attr("x", (d) => 0)
    .attr("y", (d, i) => 0)
    .attr("width", (d) => bigRectWidth)
    .attr("height", (d) => bigRectHeight)
    .attr("fill", (d) => nodeRectData.color)
    .attr("rx", 16)
    .attr("ry", 16);

  svg

    .append("rect")
    .attr("class", "branch-node")
    .attr("x", (d) => 0)
    .attr("y", (d) => 0)
    .attr("width", (d) => bigRectWidth)
    .attr("height", (d) => bigRectHeight - 5)
    .attr("fill", "#f5f5f5")
    .attr("rx", 14)
    .attr("ry", 14);

  //render branch node text
  svg

    .append("rect")
    .attr("class", "branch-node-text select-none")
    .attr("x", (d) => 0 + 15)
    .attr("y", (d, i) => 0 + textOffsetY)
    .attr("text-anchor", "start")
    .attr("fill", "#000")
    .attr("font-size", "14px")
    .text((d) => nodeRectData.text);

  //render code range
  svg

    .append("text")
    .attr("class", "code-range-text select-none")
    .attr("x", (d) => 0 + codeRangeOffsetX)
    .attr("y", (d, i) => 0 + codeRangeOffsetY)
    .attr("fill", "#000")
    .attr("font-size", "14px")
    .attr("text-anchor", "start")
    .text(
      (d) =>
        nodeRectData.range[0] +
        (nodeRectData.range[0] === nodeRectData.range[1]
          ? ""
          : "-" + nodeRectData.range[1]),
    );

  return (
    <div className="m-3 mt-0 flex flex-col">
      <div className="flex flex-row">
        <svg
          className="h-[5rem] w-[10rem] "
          id="node-space"
          onClick={() => {
            // handleBranchClick();
          }}
        ></svg>
        <div className="flex w-20 flex-col">
          <div className="m-1 text-center">Type</div>
          <div className="flex h-9 w-20 items-center justify-center rounded-md border-2 border-solid border-black bg-green-100">
            Content
          </div>
        </div>
      </div>
      <div className="h-full w-full rounded-md border-2 border-solid border-gray-100">
        <div className="polish m-2">
          <div className="p-1 text-base">Polishing</div>
          <div className="p-1 text-sm text-gray-400"> Make it more</div>
          <div className="grid grid-flow-col grid-rows-2 gap-3">
            <div className="flex h-5  w-full  items-center justify-center text-xs underline decoration-green-100 decoration-solid decoration-4 underline-offset-1">
              Confirm
            </div>
            <div className="flex  h-5  w-full items-center justify-center text-xs">
              Confirm
            </div>
            <div className="flex  h-5  w-full items-center justify-center text-xs">
              Confirm
            </div>
            <div className="flex  h-5  w-full items-center justify-center text-xs">
              Confirm
            </div>
          </div>
          <div className="p-1 text-base">Length</div>
          <input className="w-10 border-2 border-gray-200" type="text" />
          <span className="p-1 text-sm text-gray-400">sentences</span>
        </div>
        <div className="lengthm-2"></div>
        <div className="confirmButton m-2 flex items-center justify-center">
          <div className="flex  h-7  w-16 items-center justify-center rounded-md border-2 border-gray-200 bg-gray-100 text-xs">
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
};
