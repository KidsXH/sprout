"use client";

import * as d3 from "d3";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectNodePool } from "@/store/nodeSlice";
import { selectApiKey } from "@/store/modelSlice";
import { getCoordinates } from "@/models/embeddings";
import { isUndefined } from "util";
import { ConfigPanel } from "./configPanel";
import { TreeNode, useTreeNodes } from "../VisView/outline";
import { selectMainChannelChats } from "@/store/chatSlice";

// cast length of content string across acceptable radius ranges relative to shortest and longest content strings
function calcNodeRadius(
  contentString: string,
  shortestContentLength: number,
  longestContentLength: number,
  minRadius: number = 1,
  maxRadius: number = 5,
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
  // const mainChannelChats = useAppSelector(selectMainChannelChats);
  const chatNodes = useAppSelector(selectNodePool);
  // const requestPool = useAppSelector(selectNodePool);
  const treeNodes = useTreeNodes();

  const selectedTreeNodeId = 0;
  // const selectedChatNodeId = useAppSelector(select)

  // if (treeNodes.length == 0) return;
  const selectedTreeNode = treeNodes[selectedTreeNodeId];
  let matchedChatNodes: { content: string; type: string }[] = [];

  if (selectedTreeNode === undefined) {
    console.log("[node spcace] selected TreeNode is undefined");
  } else {
    selectedTreeNode.requestID.forEach((index) => {
      const chatNode = chatNodes.find((node) => node.id == index);
      matchedChatNodes.push({
        content: chatNode?.action.content || "",
        type: "current",
      });
    });
  }

  treeNodes.forEach((node: TreeNode) => {
    if (node.label == treeNodes[selectedTreeNodeId].label) {
      if (node.treeID !== selectedTreeNode.treeID) {
        node.requestID.forEach((index) => {
          const chatNode = chatNodes.find((node) => node.id == index);
          matchedChatNodes.push({
            content: chatNode?.action.content || "",
            type: "other",
          });
        });
      }
    }
  });

  const focusBranchNode = 3;
  const width = 250;
  const height = 250;
  const margin = 10;

  // const nodes = useAppSelector(selectNodePool);
  const apiKey = useAppSelector(selectApiKey);

  // console.log("matchdata", matchedChatNodesData);
  //processData
  useEffect(() => {
    console.log("[space] processData");
    let longestContentLength: number = -1;
    let shortestContentLength: number = -1;

    const contentArray = matchedChatNodes.map((value, index) => {
      // filter out irrelevant nodes

      // find shortest and longest content length to calc node radius
      if (
        shortestContentLength == -1 ||
        value.content.length < shortestContentLength
      ) {
        shortestContentLength = value.content.length;
      }
      if (
        longestContentLength == -1 ||
        value.content.length > longestContentLength
      ) {
        longestContentLength = value.content.length;
      }

      return value.content;
    });

    if (contentArray.length == 0) return;

    const dotData = getCoordinates(contentArray, apiKey).then((res) => {
      if (!res) {
        return;
      }

      const dotData = contentArray.map((value, index) => {
        return {
          r: calcNodeRadius(value, 5, 25),
          x: width / 2 + margin + res[index][0],
          y: width / 2 + margin + res[index][1],
          stroke:
            matchedChatNodes[index].type == "current"
              ? "#8BBD9E"
              : "transparent",
          fill:
            matchedChatNodes[index].type == "current" ? "#C6EBD4" : "#FBE1B9",
          content: value,
        };
      });

      setLoading(false);
      setDotCorData(dotData);
      return dotData;
    });
  }, [chatNodes]);

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

    const g = svg
      .append("g")
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

  useEffect(() => {
    const svg = d3.select("#ToT-space");
    // @ts-ignore
    svg.call(
      // @ts-ignore
      d3
        .zoom()
        .extent([
          [0, 0],
          [250, 250],
        ])
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed),
    );
    // @ts-ignore
    function zoomed({ transform }) {
      console.log("zoom");
      const g = svg.select("g");
      g.attr("transform", transform);
      g.selectAll("circle").attr("stroke-width", 1 / transform.k);
      g.selectAll("circle").attr("r", (d: any) => d.r / transform.k);
    }
  }, []);

  return (
    <div className="flex w-[30rem] flex-col">
      <div className="flex h-12 select-none items-center p-1 text-xl font-bold text-neutral-600">
        Context
      </div>
      <div className="flex h-full w-full">
        <div className="flex flex-col">
          <div className="legend mb-1">
            <div className="m-1 flex flex-row">
              <svg className="m=2 " viewBox="0 0 10 20" width="10" height="20">
                <circle
                  cx="5"
                  cy="10"
                  r="4.5"
                  fill={"#C8F4D1"}
                  stroke={"green"}
                />
              </svg>
              <div className="ml-2 flex items-center text-center text-xs">
                {" "}
                Current Node
              </div>
            </div>
            <div className="m-1 flex flex-row">
              <svg className="m=2 " viewBox="0 0 10 20" width="10" height="20">
                <circle cx="5" cy="10" r="5" fill={"#C8F4D1"} />
              </svg>
              <div className="ml-2 flex items-center text-center text-xs">
                {" "}
                Alternatives in Current Node
              </div>
            </div>
            <div className="m-1 flex flex-row">
              <svg className="m=2 " viewBox="0 0 10 20" width="10" height="20">
                <circle cx="5" cy="10" r="5" fill={"#FFF1CC"} />
              </svg>
              <div className="ml-2 flex items-center text-center text-xs">
                {" "}
                Alternatives in Other Nodes
              </div>
            </div>
          </div>
          <svg
            className="h-full w-[16rem] flex-col"
            id="ToT-space"
            onClick={() => {
              // handleBranchClick();
            }}
          ></svg>
        </div>

        {/* <div className="flex h-full  flex-col">config panel</div> */}
        <ConfigPanel />
      </div>
    </div>
  );
};
