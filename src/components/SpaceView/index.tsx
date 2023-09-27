"use client";

import * as d3 from "d3";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectNodePool } from "@/store/nodeSlice";
import { selectApiKey } from "@/store/modelSlice";
import { getCoordinates } from "@/models/embeddings";
import { isUndefined } from "util";
import { ConfigPanel } from "./configPanel";

// cast length of content string across acceptable radius ranges relative to shortest and longest content strings
function calcNodeRadius(
  contentString: string,
  shortestContentLength: number,
  longestContentLength: number,
  minRadius: number = 3,
  maxRadius: number = 15,
): number {
  if (contentString.length >= longestContentLength) {
    return maxRadius;
  } else if (contentString.length <= shortestContentLength) {
    return minRadius;
  } else {
    return (
      ((contentString.length - shortestContentLength) / longestContentLength) *
        maxRadius +
      minRadius
    );
  }
}

export const SpaceView = () => {
  const [isLoading, setLoading] = useState(true);
  const [dotCorData, setDotCorData] = useState<
    {
      r: number;
      x: number;
      y: number;
      stroke: string;
      fill: string;
      content: string;
    }[]
  >([]);

  const focusBranchNode = 3;
  const width = 250;
  const height = 250;
  const margin = 10;

  // const nodes = useAppSelector(selectNodePool);
  const apiKey = useAppSelector(selectApiKey);

  const nodes = [
    { action: { content: "This is a test" } },
    { action: { content: "This is a longer test" } },
    { action: { content: "Short test" } },
    { action: { content: "This is another even longer test" } },
    { action: { content: "This is a test" } },
  ];

  useEffect(() => {
    let longestContentLength: number = -1;
    let shortestContentLength: number = -1;

    const contentArray = nodes.map((value, index) => {
      // filter out irrelevant nodes

      // find shortest and longest content length to calc node radius
      if (
        shortestContentLength == -1 ||
        value.action.content.length < shortestContentLength
      ) {
        shortestContentLength = value.action.content.length;
      }
      if (
        longestContentLength == -1 ||
        value.action.content.length > longestContentLength
      ) {
        longestContentLength = value.action.content.length;
      }

      return value.action.content;
    });

    const dotData = getCoordinates(contentArray, apiKey).then((res) => {
      if (!res) {
        return;
      }

      const dotData = contentArray.map((value, index) => {
        return {
          r: calcNodeRadius(value, 5, 25),
          x: width / 2 + margin + res[index][0],
          y: width / 2 + margin + res[index][1],
          stroke: "#8BBD9E",
          fill: index == focusBranchNode ? "#C6EBD4" : "#FBE1B9",
          content: value,
        };
      });

      setLoading(false);
      setDotCorData(dotData);
      return dotData;
    });
  }, []);

  useEffect(() => {
    // const contentSet = nodes[focusBranchNode].content;
    // const dotData = contentSet.map((d, i) => {
    //   const pos = { x: i * 20, y: i * 20 };
    //   const radius = 5;
    //   return {
    //     x: pos.x + margin,
    //     y: pos.y + margin,
    //     r: radius,
    //     stroke: i === nodes[focusBranchNode].contentID ? "#8BBD9E" : "#fff",
    //     fill: d.node === focusBranchNode ? "#C6EBD4" : "#FBE1B9",
    //     content: d.content,
    //   };
    // });

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

    if (isLoading) {
      return;
    }

    svg
      .selectAll("circle")
      .data(dotCorData)
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
  }),
    [dotCorData];

  return (
    <div className="flex w-[30rem] flex-col">
      <div className="flex h-12 select-none items-center p-1 text-xl font-bold text-neutral-600">
        Context
      </div>
      <div className="flex h-full w-full">
        <svg
          className="h-full w-[16rem] flex-col"
          id="ToT-space"
          onClick={() => {
            // handleBranchClick();
          }}
        ></svg>
        {/* <div className="flex h-full  flex-col">config panel</div> */}
        <ConfigPanel />
      </div>
    </div>
  );
};
