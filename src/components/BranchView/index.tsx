"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState } from "react";
import nodes from "@/mocks/nodes";

import * as d3 from "d3";

export const BranchView = () => {
  // const parentNode = 2;
  const width = 512;
  const height = 300;

  const bigRectWidth = 150;
  const bigRectHeight = 72;
  const reasonBoxHeight = 80;
  const reasonBoxWidth = 150;
  const childBranchNodeY = 220;
  const interval = 15;
  const codeRangeOffsetX = 15;
  const codeRangeOffsetY = 25;
  const phase1 = 300;
  const phase2 = 400;
  const phase3 = 1500;
  const textOffsetY = (bigRectHeight / 4) * 3;
  const [parentNode, setParentNode] = useState(2);
  const [previewNode, setPreviewNode] = useState(4);
  const [childIndex, setChildIndex] = useState(-1); //0 for left,1 for middle,2 for right
  //const [oldIndex, setOldIndex] = useState(-1);
  const [direction, setDirection] = useState(0); //0 for down,1 for up

  //TODO: set preview node after parent node change
  useEffect(() => {
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
        indexInList: i,
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
      indexInList: rectData.length,
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

    setTimeout(
      () => {
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
              .delay(500)
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
          .style("opacity", (d, i) =>
            (d.type === "parent" && direction) ||
            (!direction && i === childIndex)
              ? 1
              : 0,
          )
          .on("click", (event, d) => {})
          .transition()
          .duration(phase3 / 2)
          .ease(d3.easeLinear)
          .style("opacity", 1);

        svg
          .append("g")
          .selectAll("rect")
          .data(rectData)
          .join("rect")
          .attr("class", "branch-node")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("width", (d) => d.width)
          .attr("height", (d) => d.height - 5)
          .attr("fill", "#f5f5f5")
          .attr("rx", 14)
          .attr("ry", 14)
          .style("opacity", (d, i) =>
            (d.type === "parent" && direction === 1) ||
            (!direction && i === childIndex)
              ? 1
              : 0,
          )
          .on("click", (event, d) => {
            if (d.type === "parent") {
              if (d.id !== 0) {
                downAnimation(0);
                setDirection(0);
                setChildIndex(0);
                setParentNode(nodes[d.id].parent);
              }
            } else {
              if (d.id !== previewNode) {
                setPreviewNode(d.id);
              } else {
                upAnimation(d.indexInList);
                setDirection(1);
                setParentNode(d.id);
              }
            }
          })
          .transition()
          .duration(phase3 / 2)
          .ease(d3.easeLinear)
          .style("opacity", 1);

        //render branch node text
        svg
          .append("g")
          .selectAll("text")
          .data(rectData)
          .join("text")
          .attr("class", "branch-node-text select-none")
          .attr("x", (d) => d.x + 15)
          .attr("y", (d, i) => d.y + textOffsetY)
          .attr("text-anchor", "start")
          .attr("fill", "#000")
          .attr("font-size", "14px")
          .text((d) => d.text)
          .style("opacity", (d, i) =>
            (d.type === "parent" && direction) ||
            (!direction && i === childIndex)
              ? 1
              : 0,
          )
          .transition()
          .duration(phase3)
          .ease(d3.easeLinear)
          .style("opacity", 1);

        //render code range
        svg
          .append("g")
          .selectAll("text")
          .data(rectData)
          .join("text")
          .attr("class", "code-range-text select-none")
          .attr("x", (d) => d.x + codeRangeOffsetX)
          .attr("y", (d, i) => d.y + codeRangeOffsetY)
          .attr("fill", "#000")
          .attr("font-size", "14px")
          .attr("text-anchor", "start")
          .text(
            (d) =>
              d.range[0] + (d.range[0] === d.range[1] ? "" : "-" + d.range[1]),
          )
          .style("opacity", (d, i) =>
            (d.type === "parent" && direction) ||
            (!direction && i === childIndex)
              ? 1
              : 0,
          )
          .transition()
          .duration(phase3)
          .ease(d3.easeLinear)
          .style("opacity", 1);

        //render reasoning text
        svg
          .append("g")
          .selectAll("text")
          .data(reasonBoxData)
          .join("text")
          .attr("class", "reason-text select-none")
          .attr("x", (d) => d.x + 15)
          .attr("y", (d, i) => d.y + 25)
          .attr("width", reasonBoxWidth)
          .attr("fill", "#000")
          .attr("font-size", "14px")
          .attr("text-anchor", "start")
          .text((d) => d.text)
          .style("opacity", 0)
          .transition()
          .duration(phase3)
          .ease(d3.easeLinear)
          .style("opacity", 1);
      },
      phase1 + 2 * phase2,
    );

    return () => {};
  }, [parentNode]);

  useEffect(() => {
    const svg = d3.select("#ToT-branch");

    svg
      .selectAll(".branch-node")
      .on("click", (event, d: any) => {
        if (d.id == previewNode) {
          upAnimation(d.indexInList);
          setDirection(1);
          setParentNode(d.id);
        } else {
          if (d.type !== "parent") {
            setPreviewNode(d.id);
          } else {
            downAnimation(1);
            setChildIndex(1);
            setDirection(0);
            setParentNode(nodes[d.id].parent);
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

  const upAnimation = (index: number) => {
    //remove elements
    const svg = d3.select("#ToT-branch");

    svg.selectAll(".branch-node").each(function (d: any, i) {
      if (i === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });
    svg.selectAll(".branch-node-shadow").each(function (d: any, i) {
      if (i === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });

    svg.selectAll(".branch-node-link").each(function (d, i) {
      if (i % 3 === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });

    svg.selectAll(".reason-text").each(function (d, i) {
      if (i % 3 === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });

    svg.selectAll(".branch-node-text").each(function (d: any, i) {
      if (i === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });

    svg.selectAll(".code-range-text").each(function (d: any, i) {
      if (i === index) return;
      d3.select(this)
        .transition()
        .duration(phase1)
        .ease(d3.easeLinear)
        .style("opacity", 0);
    });

    setTimeout(() => {
      svg
        .selectAll(".branch-node-link,.reason-text")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .style("opacity", 0);
      svg
        .selectAll(".branch-node,.branch-node-shadow")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) => d.y - bigRectHeight)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) =>
          d.indexInList == index ? 0 : 0 - bigRectHeight * 2,
        )
        .attr("x", (d: any) => 0 - bigRectWidth / 2);

      svg
        .selectAll(".branch-node-text")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) => d.y - bigRectHeight + textOffsetY)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) =>
          d.indexInList == index
            ? 0 + textOffsetY
            : d.y - bigRectHeight * 2 + textOffsetY,
        )
        .attr("x", (d: any) => 0 - bigRectWidth / 2 + codeRangeOffsetX);
      svg
        .selectAll(".code-range-text")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) => d.y - bigRectHeight + codeRangeOffsetY)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", (d: any) =>
          d.indexInList === index
            ? 0 + codeRangeOffsetY
            : d.y - bigRectHeight * 2 + codeRangeOffsetY,
        )
        .attr("x", (d: any) => 0 - bigRectWidth / 2 + codeRangeOffsetX);
    }, phase1);

    // svg.selectAll("text").remove();
  };

  const downAnimation = (indexInChildren: number) => {
    const svg = d3.select("#ToT-branch");
    svg
      .selectAll(".reason-text,.branch-node-link")
      .transition()
      .duration(phase1)
      .ease(d3.easeLinear)
      .style("opacity", 0);

    svg
      .selectAll(".branch-node,.branch-node-shadow")
      .transition()
      .duration(phase1)
      .ease(d3.easeLinear)
      .style("opacity", (d: any) => (d.type === "parent" ? 1 : 0));
    svg
      .selectAll(".branch-node-text,.code-range-text")
      .transition()
      .duration(phase1)
      .ease(d3.easeLinear)
      .style("opacity", (d: any) => (d.type === "parent" ? 1 : 0));

    setTimeout(() => {
      svg
        .selectAll(".branch-node,.branch-node-shadow")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr(
          "x",
          (d: any) =>
            (-bigRectWidth / 2) * 3 -
            interval +
            indexInChildren * (bigRectWidth + interval),
        )
        .attr("y", (d: any) => (bigRectHeight / 2) * 3)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", childBranchNodeY);

      svg
        .selectAll(".branch-node-text")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr(
          "x",
          (d: any) =>
            (-bigRectWidth / 2) * 3 -
            interval +
            indexInChildren * (bigRectWidth + interval) +
            codeRangeOffsetX,
        )
        .attr("y", (d: any) => (bigRectHeight / 2) * 3 + textOffsetY)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", childBranchNodeY + textOffsetY);

      svg
        .selectAll(".code-range-text")
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr(
          "x",
          (d: any) =>
            (-bigRectWidth / 2) * 3 -
            interval +
            indexInChildren * (bigRectWidth + interval) +
            codeRangeOffsetX,
        )
        .attr("y", (d: any) => (bigRectHeight / 2) * 3 + codeRangeOffsetY)
        .transition()
        .duration(phase2)
        .ease(d3.easeLinear)
        .attr("y", childBranchNodeY + codeRangeOffsetY);
    }, phase1);
  };
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
