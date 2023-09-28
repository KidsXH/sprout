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
import { selectFocusChatID, selectMainChannelChats } from "@/store/chatSlice";

// cast length of content string across acceptable radius ranges relative to shortest and longest content strings
function calcNodeRadius(
  contentString: string,
  shortestContentLength: number,
  longestContentLength: number,
  minRadius: number = 5,
  maxRadius: number = 10,
): number {
  console.log(contentString);
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
  const focusChatID = useAppSelector(selectFocusChatID);
  // const mainChannelChats = useAppSelector(selectMainChannelChats);
  const chatNodes = useAppSelector(selectNodePool);
  // const requestPool = useAppSelector(selectNodePool);
  const treeNodes = useTreeNodes();
  // let matchedChatNodes = [];
  const [matchChatNodes, setMatchChatNodes] = useState<
    {
      content: string;
      type: string;
    }[]
  >([]);
  const [dotContent, setDotContent] = useState<string>("");

  useEffect(() => {
    const curContent =
      chatNodes.find((node) => node.id === focusChatID)?.action.content || "";
    setDotContent(curContent);
    const currentTreeNode = treeNodes.find((node) =>
      node.requestID.includes(focusChatID),
    );
    const alterInCurrent = currentTreeNode?.requestID.map((id) =>
      chatNodes.find((node) => node.id === id),
    );
    const currentChatNodes =
      alterInCurrent?.map((alter) => {
        return { content: alter?.action.content || "", type: "alterInCurrent" };
      }) || [];

    const otherTreeNode = treeNodes.find(
      (node) =>
        node.label == currentTreeNode?.label &&
        node.treeID != currentTreeNode?.treeID,
    );
    const alterInOther = otherTreeNode?.requestID.map((id) =>
      chatNodes.find((node) => node.id === id),
    );

    const otherChatNodes =
      alterInOther?.map((alter) => {
        return { content: alter?.action.content || "", type: "alterInOther" };
      }) || [];

    setMatchChatNodes(currentChatNodes.concat(otherChatNodes));
    console.log("current", currentChatNodes, "other", otherChatNodes);
  }, [focusChatID]);

  const width = 250;
  const height = 250;
  const margin = 10;

  // const nodes = useAppSelector(selectNodePool);
  const apiKey = useAppSelector(selectApiKey);

  // console.log("matchdata", matchedChatNodesData);
  //processData
  useEffect(() => {
    // console.log("[space] processData");
    let longestContentLength: number = -1;
    let shortestContentLength: number = -1;

    const contentArray = matchChatNodes.map((value, index) => {
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
      if (!res || res.length == 0) {
        return;
      }

      const dotData = contentArray.map((value, index) => {
        return {
          r: calcNodeRadius(value, 10, 125),
          x: width / 2 + margin + res[index][0],
          y: width / 2 + margin + res[index][1],
          stroke: matchChatNodes[index].type == "current" ? "#8BBD9E" : "#fff",
          fill:
            matchChatNodes[index].type == "alterInCurrent"
              ? "#C6EBD4"
              : "#FBE1B9",
          content: value,
        };
      });

      // setLoading(false);
      setDotCorData(dotData);
      return dotData;
    });
  }, [matchChatNodes]);

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

    // if (isLoading) {
    //   return;
    // }

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
      .on("click", (e, d) => {
        // console.log(d.content);
        setDotContent(d.content);
        // this.style("fill", "red");
      });
    // .append("title")
    // .text((d) => d.content);

    console.log("rerender");
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
    <div className="flex w-[31.5rem] flex-col">
      <div className="flex h-12 w-full select-none items-center p-1 text-xl font-bold text-neutral-600">
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
              <svg className=" " viewBox="0 0 10 20" width="10" height="20">
                <circle cx="5" cy="10" r="5" fill={"#C8F4D1"} />
              </svg>
              <div className="ml-2 flex items-center text-center text-xs">
                {" "}
                Alternatives in Current Node
              </div>
            </div>
            <div className="m-1 flex flex-row">
              <svg className=" " viewBox="0 0 10 20" width="10" height="20">
                <circle cx="5" cy="10" r="5" fill={"#FFF1CC"} />
              </svg>
              <div className="ml-2 flex items-center text-center text-xs">
                {" "}
                Alternatives in Other Nodes
              </div>
            </div>
          </div>
          <svg
            className="mt-2 h-full w-[14.5rem] flex-col"
            id="ToT-space"
            onClick={() => {
              // handleBranchClick();
            }}
          ></svg>
        </div>

        {/* <div className="flex h-full  flex-col">config panel</div> */}
        <ConfigPanel content={dotContent} />
      </div>
    </div>
  );
};
