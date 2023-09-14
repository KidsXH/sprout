"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState } from "react";
import nodes from "@/mocks/nodes";

import * as d3 from "d3";

export const BranchView = () => {
  // const parentNode = 2;
  const [parentNode, setParentNode] = useState(2);
  const [previewNode, setPreviewNode] = useState(4);

  useEffect(() => {
    const width = 512;
    const height = 300;

    const bigRectWidth = 150;
    const bigRectHeight = 72;
    const reasonBoxHeight = 80;
    const reasonBoxWidth = 150;
    const childBranchNodeY = 220;
    const interval = 15;

    const links = [
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: -bigRectWidth - interval,
        y2: (bigRectHeight / 2) * 3,
        text: "start from first ...",
      },
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: 0,
        y2: (bigRectHeight / 2) * 3,
        text: "Explain the role ...",
      },
      {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: bigRectWidth + interval,
        y2: (bigRectHeight / 2) * 3,
        text: "start from first l...",
      },
    ];
    //get sibling nodes
    // const parentNode = nodes[focusBranchNode].parent;
    const siblingNodes = parentNode >= 0 ? nodes[parentNode].children : [];

    //branch node data
    const rectData = d3.map(siblingNodes, (d, i) => {
      const w = bigRectWidth;
      const h = bigRectHeight;
      const x = (-w / 2) * 3 - interval + i * (w + interval);
      const y = childBranchNodeY;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        color: i == 1 ? "#C6EBD4" : "#f5f5f5",
        range: nodes[d].range,
        text: nodes[d].content[nodes[d].contentID].summary,
        id: d,
        type: "child",
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
      type: "parent",
    });

    //branch node link data
    var pathData = d3.map(links, (d) => {
      const path = d3.path();
      path.moveTo(d.x1, d.y1);
      path.lineTo(d.x2, d.y2);
      path.closePath();
      return {
        d: path.toString(),
        color: "#eaeaea",
      };
    });
    pathData = pathData.concat(
      d3.map(links, (d, i) => {
        const path = d3.path();

        path.moveTo(d.x2, d.y2 + reasonBoxHeight);
        path.lineTo(d.x2, childBranchNodeY);
        path.closePath();
        return { d: path.toString(), color: "#eaeaea" };
      }),
    );

    //reasoning box data
    const reasonBoxData = d3.map(links, (d, i) => {
      return {
        x: d.x2 - reasonBoxWidth / 2,
        y: d.y2,
        text: d.text,
      };
    });
    const svg = d3
      .select("#ToT-branch")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `${-width / 2} -10 ${width} ${height + 10}`);

    svg.selectAll("*").remove();

    //render branch link
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

    //render branch node
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
      .on("click", (event, d) => {
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
        if (d.type === "parent") {
          d.id == 0 ? 0 : setParentNode(nodes[d.id].parent);
        } else {
          if (d.id !== previewNode) {
            setPreviewNode(d.id);
          } else {
            setParentNode(d.id);
          }
        }
        // setParentNode(d.id);
        // console.log(d.id);
      });

    //render branch node text
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

    //render code range
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
        (d) => d.range[0] + (d.range[0] === d.range[1] ? "" : "-" + d.range[1]),
      )
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 100);

    //render reasoning text
    svg
      .append("g")
      .selectAll("text")
      .data(reasonBoxData)
      .join("text")
      .attr("class", "branch-node-text select-none")
      .attr("x", (d) => d.x + 15)
      .attr("y", (d, i) => d.y + 25)
      .attr("width", reasonBoxWidth)
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .attr("text-anchor", "start")
      .text((d) => d.text)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("opacity", 100);
  }, [parentNode]);

  useEffect(() => {
    const svg = d3.select("#ToT-branch");

    svg
      .selectAll(".branch-node")
      .on("click", (event, d: any) => {
        if (d.id == previewNode) {
          setParentNode(d.id);
        } else {
          if (d.type !== "parent") {
            setPreviewNode(d.id);
          } else {
            d.id == 0 ? 0 : setParentNode(nodes[d.id].parent);
          }
        }
      })
      .each(function (d: any) {
        const rect = this as SVGRectElement;
        // console.log("set style");
        if (d.id !== previewNode) {
          d3.select(rect).attr("class", "branch-node");
        } else {
          d3.select(rect).attr("class", "branch-node preview-branch-node");
        }
      });
  }, [previewNode]);
  return (
    <div className="flex w-[32rem] flex-col">
      <div className="flex h-12 select-none items-center p-1 text-xl font-bold text-neutral-600">
        Branches
      </div>
      <svg
        className="h-full w-[32rem]"
        id="ToT-branch"
        onClick={() => {
          // handleBranchClick();
        }}
      ></svg>
    </div>
  );
};
