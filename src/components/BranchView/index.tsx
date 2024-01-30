"use client";

// import { llmResults } from "@/server/mock";
import { useCallback, useEffect, useState } from "react";
import nodes from "@/mocks/nodes";

import * as d3 from "d3";
import { isTreeNodeInActiveChain, useTreeNodes } from "../VisView/outline";
// import { useAppSelector } from "@/hooks/redux";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectNodePool, selectRequestPool } from "@/store/nodeSlice";
// import { selectFocusChatID } from "@/store/chatSlice";
import {
  selectChainNodes,
  selectChatChannels,
  selectFocusChatID,
  selectMainChannelChats,
  selectMainChannelID,
  setFocusChatID,
  setMainChannelID,
} from "@/store/chatSlice";

export const BranchView = () => {
  // const parentNode = 2;
  const width = 512;
  const height = 300;

  const bigRectWidth = 150;
  const bigRectHeight = 72;
  const reasonBoxHeight = 70;
  const reasonBoxWidth = 150;
  const childBranchNodeY = 220;
  const interval = 15;
  const codeRangeOffsetX = 15;
  const codeRangeOffsetY = 25;
  // const phase1 = 300;
  // const phase2 = 400;
  const phase1 = 100;
  const phase2 = 100;
  const phase3 = 1500;
  const textOffsetY = (bigRectHeight / 4) * 3;

  const [parentNode, setParentNode] = useState<number>(-1);
  const [previewNode, setPreviewNode] = useState(4);
  const [childIndex, setChildIndex] = useState(-1); //0 for left,1 for middle,2 for right
  const [direction, setDirection] = useState(0); //0 for down,1 for up
  const dispatch = useAppDispatch();
  const mainChannelChats = useAppSelector(selectMainChannelChats);
  const requestPool = useAppSelector(selectRequestPool);
  const mainChannelID = useAppSelector(selectMainChannelID);

  const treeNodes = useTreeNodes();
  const focusChatNodeID = useAppSelector(selectFocusChatID);
  const chatNodes = useAppSelector(selectNodePool);
  // const chainNodes = useAppSelector(selectChainNodes);

  const nodes = treeNodes.map((node) => {
    // const request = requestPool[node.requestID[0] || 0];
    // let isActive = false;

    const isActive = isTreeNodeInActiveChain(node, mainChannelChats);
    const chatNode = chatNodes.find((d) => d.id === node.requestID[0]);
    // const isActive = mainChannelChats.find((d) => d === chatNode?.id);
    return {
      id: node.treeID,
      parent: node.parentID,
      children: node.childrenID,
      range: node.label,
      summary: chatNode?.action.summary || "no summary",
      content: chatNode?.thought || "",
      isActive: isActive ? 1 : 0,
    };
  });

  useEffect(() => {
    // console.log("[branch] focusChatNodeID", focusChatNodeID);
    // console.log("[branch] treeNodes", treeNodes);

    const focusTreeNodeID = treeNodes.findIndex((d) =>
      d.requestID.includes(focusChatNodeID),
    );
    if (focusTreeNodeID == -1) return;
    if (
      treeNodes[focusTreeNodeID].childrenID.length == 0 &&
      focusTreeNodeID !== 0
    ) {
      const parentTreeNodeID = treeNodes[focusTreeNodeID].parentID;
      if (parentTreeNodeID !== undefined) {
        setParentNode(parentTreeNodeID);
      }
    } else {
      setParentNode(focusTreeNodeID);
    }
    // return;
  }, [treeNodes, focusChatNodeID]);

  const xPosition = [
    {
      rectX: (-bigRectWidth / 2) * 3 - interval,
      linkX: -bigRectWidth - interval,
    },
    {
      rectX: -bigRectWidth / 2,
      linkX: 0,
    },
    {
      rectX: bigRectWidth / 2 + interval,
      linkX: bigRectWidth + interval,
    },
  ];

  const clickNodeFn = useCallback(
    (treeID: number) => {
      if (!isTreeNodeInActiveChain(treeNodes[treeID], mainChannelChats)) {
        const requestID = treeNodes[treeID].requestID[0];
        const channelID = requestPool[requestID].channelID;
        dispatch(setMainChannelID(channelID));
      }
      dispatch(setFocusChatID(treeNodes[treeID].requestID[0]));
    },
    [dispatch, mainChannelChats, requestPool, treeNodes],
  );

  const clickParentNodeFn = useCallback(
    (treeID: number) => {
      // if (!isTreeNodeInActiveChain(treeNodes[treeID], mainChannelChats)) {
      //   const requestID = treeNodes[treeID].requestID[0];
      //   const channelID = requestPool[requestID].channelID;
      //   dispatch(setMainChannelID(channelID));
      // }
      // dispatch(setFocusChatID(treeNodes[treeID].requestID[0]));
      console.log("[branch] clickParentNodeFn", treeID);
    },
    [dispatch, mainChannelChats, requestPool, treeNodes],
  );

  const clickLeafFn = useCallback(
    (treeID: number) => {
      const treeNode = treeNodes[treeID];
      const channelID = requestPool[treeNode.requestID[0]].channelID;
      dispatch(setMainChannelID(channelID));
      dispatch(setFocusChatID(treeNode.requestID[0]));
    },
    [dispatch, treeNodes, requestPool],
  );

  //TODO: set preview node after parent node change
  useEffect(() => {
    //TODO:for video
    if (nodes.length === 0 || parentNode === -1) {
      // const svg = d3
      //   .select("#ToT-branch")
      //   .attr("preserveAspectRatio", "xMinYMin meet")
      //   .attr("viewBox", `${-width / 2} -10 ${width} ${height + 10}`);
      return;
    }

    let siblingNodes = parentNode >= 0 ? nodes[parentNode].children : [];
    if (siblingNodes.length > 3) siblingNodes = siblingNodes.slice(0, 3);
    let xPositionListIndex = [0, 1, 2];
    switch (siblingNodes.length) {
      case 1:
        xPositionListIndex = [1];
        break;
      case 2:
        xPositionListIndex = [0, 2];
        break;
      default:
        break;
    }

    let links = [
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

    links = siblingNodes.map((d, i) => {
      return {
        x1: 0,
        y1: bigRectHeight / 2,
        x2: xPosition[xPositionListIndex[i]].linkX,
        y2: (bigRectHeight / 2) * 3,
        text: nodes[d].content,
      };
    });
    //get sibling nodes
    // const parentNode = nodes[focusBranchNode].parent;

    //branch node data
    const rectData = d3.map(siblingNodes, (d, i) => {
      const w = bigRectWidth;
      const h = bigRectHeight;
      const x = (-w / 2) * 3 - interval + i * (w + interval);
      const y = childBranchNodeY;
      return {
        x: xPosition[xPositionListIndex[i]].rectX,
        y: y,
        width: w,
        height: h,
        color: nodes[d].isActive ? "#C6EBD4" : "#f5f5f5",
        range: nodes[d].range,
        text: nodes[d].summary,
        id: d,
        positonIndex: xPositionListIndex[i],
        type: "child",
        parent: nodes[d].parent,
      };
    });

    rectData.push({
      x: -bigRectWidth / 2,
      y: 0,
      width: bigRectWidth,
      height: bigRectHeight,
      color: "#DADBDB",
      range: nodes[parentNode].range,
      text: nodes[parentNode].summary,
      id: parentNode,
      positonIndex: 3,
      type: "parent",
      parent: nodes[parentNode].parent,
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
              // .attr("stroke-dashoffset", pathLength)
              // .transition()
              // .delay(500)
              // .duration(500)
              // .ease(d3.easeLinear)
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
          // .style("opacity", (d, i) =>
          //   (d.type === "parent" && direction) ||
          //   (!direction && d.positonIndex === childIndex)
          //     ? 1
          //     : 0,
          // )
          // .on("click", (event, d) => {})
          // .transition()
          // .duration(phase3 / 2)
          // .ease(d3.easeLinear)
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
          // .style("opacity", (d, i) =>
          //   (d.type === "parent" && direction === 1) ||
          //   (!direction && d.positonIndex === childIndex)
          //     ? 1
          //     : 0,
          // )
          .on("click", (event, d) => {
            if (d.type === "parent") {
              // if (d.id !== 0) {
              //   const newChildIndex = getIndexInChildren(d.id);
              //   downAnimation(newChildIndex);
              //   setChildIndex(newChildIndex);
              //   setDirection(0);
              //   // d.childrenID.length > 0 ? clickNodeFn(d.treeID) : clickLeafFn(d.treeID);
              //   // setParentNode(nodes[d.id].parent || 0);
              // }
              console.log("[branch] clickParentNodeFn", d);
              if (d.parent !== undefined) {
                setParentNode(d.parent);
              }
            } else {
              // if (d.id !== previewNode) {
              //   setPreviewNode(d.id);
              // } else {
              //   upAnimation(d.positonIndex);
              //   setDirection(1);
              //   // setParentNode(d.id);
              // }
              // upAnimation(d.positonIndex);
              setDirection(1);
              setParentNode(d.id);
              clickNodeFn(d.id);
            }
          })
          // .transition()
          // .duration(phase3 / 2)
          // .ease(d3.easeLinear)
          .style("opacity", 1);

        svg
          .append("g")
          .selectAll("switch")
          .data(rectData)
          .join("switch")
          .append("foreignObject")
          .attr("x", (d) => d.x + 10)
          .attr("y", (d, i) => d.y + textOffsetY - 22)
          .attr("width", reasonBoxWidth - 10)
          .attr("height", reasonBoxHeight)
          .attr("class", "branch-node-text select-none")
          .append("xhtml:body")
          .style("font", "14px 'Helvetica Neue'")
          .style("line-height", "1.2")
          // .style("color", "#848484")
          .style("overflow", "scroll")
          .html(
            (d) =>
              "<p className='reason-p'>" +
              (d.text.length > 80 ? d.text.slice(0, 80) + "..." : d.text) +
              "</p>",
            // "<p className='reason-p'>" + d.text + "</p>",
          );

        //render branch node text
        // svg
        //   .append("g")
        //   .selectAll("text")
        //   .data(rectData)
        //   .join("text")
        //   .attr("class", "branch-node-text select-none")
        //   .attr("x", (d) => d.x + 15)
        //   .attr("y", (d, i) => d.y + textOffsetY)
        //   .attr("text-anchor", "start")
        //   .attr("fill", "#000")
        //   .attr("font-size", "14px")
        //   .text((d) => {
        //     const splitText = d.text.split(" ").slice(0, 3);
        //     return d.text.length > 20
        //       ? splitText[0] + " " + splitText[1] + " " + splitText[2]
        //       : d.text;
        //   })
        //   .style("opacity", 1);

        //render code range
        svg
          .append("g")
          .selectAll("text")
          .data(rectData)
          .join("text")
          .attr("class", "code-range-text select-none")
          .attr("x", (d) => d.x + codeRangeOffsetX - 5)
          .attr("y", (d, i) => d.y + codeRangeOffsetY)
          .attr("fill", "#000")
          .attr("font-size", "14px")
          .attr("text-anchor", "start")
          .text(
            (d) =>
              // d.range[0] + (d.range[0] === d.range[1] ? "" : "-" + d.range[1]),
              d.range,
          )
          // .style("opacity", (d, i) =>
          //   (d.type === "parent" && direction) ||
          //   (!direction && i === childIndex)
          //     ? 1
          //     : 0,
          // )
          // .transition()
          // .duration(phase3)
          // .ease(d3.easeLinear)
          .style("opacity", 1);

        //render reasoning text
        // svg
        //   .append("g")
        //   .selectAll("text")
        //   .data(reasonBoxData)
        //   .join("text")
        //   .attr("class", "reason-text select-none")
        //   .attr("x", (d) => d.x + 15)
        //   .attr("y", (d, i) => d.y + 25)
        //   .attr("width", reasonBoxWidth)
        //   .attr("fill", "#000")
        //   .attr("font-size", "14px")
        //   .attr("text-anchor", "start")
        //   .text((d) => d.text.slice(0, 20) + "...")
        //   .style("opacity", 0)
        //   .transition()
        //   .duration(phase3)
        //   .ease(d3.easeLinear)
        //   .style("opacity", 1);

        // svg.append("g").selectAll("switch").append('p').

        svg
          .append("g")
          .selectAll("switch")
          .data(reasonBoxData)
          .join("switch")
          .append("foreignObject")
          .attr("x", (d) => d.x + 15)
          .attr("y", (d, i) => d.y + 15)
          .attr("width", reasonBoxWidth)
          .attr("height", reasonBoxHeight)
          .attr("class", "reason-text select-none")
          // .append("p")
          // .attr("fill", "#000")
          // .attr("font-size", "14px")
          // .attr("text-anchor", "start")
          // .text((d) => d.text)
          .append("xhtml:body")
          .style("font", "12px 'Helvetica Neue'")
          .style("line-height", "1.2")
          .style("color", "#848484")
          .style("overflow", "scroll")
          .html(
            (d) =>
              "<p className='reason-p'>" +
              (d.text.length > 80 ? d.text.slice(0, 80) + "..." : d.text) +
              "</p>",
            // "<p className='reason-p'>" + d.text + "</p>",
          )

          .style("opacity", 1);
      },
      phase1 + 2 * phase2,
    );

    return () => {};
  }, [parentNode, chatNodes]);

  useEffect(() => {
    const svg = d3.select("#ToT-branch");

    svg
      .selectAll(".branch-node")
      .on("click", (event, d: any) => {
        if (d.id == previewNode) {
          // upAnimation(d.positonIndex);
          setDirection(1);
          // setParentNode(d.id);
        } else {
          if (d.type !== "parent") {
            setPreviewNode(d.id);
          } else {
            const newChildIndex = getIndexInChildren(d.id);
            // downAnimation(newChildIndex);
            setChildIndex(newChildIndex);
            setDirection(0);
            // setParentNode(nodes[d.id].parent || 0);
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

  // const upAnimation = (index: number) => {
  //   //remove elements
  //   const svg = d3.select("#ToT-branch");

  //   svg.selectAll(".branch-node").each(function (d: any, i) {
  //     if (d.positonIndex === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });
  //   svg.selectAll(".branch-node-shadow").each(function (d: any, i) {
  //     if (d.positonIndex === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });

  //   svg.selectAll(".branch-node-link").each(function (d, i) {
  //     if (i % 3 === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });

  //   svg.selectAll(".reason-text").each(function (d, i) {
  //     if (i % 3 === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });

  //   svg.selectAll(".branch-node-text").each(function (d: any, i) {
  //     if (d.positonIndex === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });

  //   svg.selectAll(".code-range-text").each(function (d: any, i) {
  //     if (d.positonIndex === index) return;
  //     d3.select(this)
  //       .transition()
  //       .duration(phase1)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //   });

  //   setTimeout(() => {
  //     svg
  //       .selectAll(".branch-node-link,.reason-text")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .style("opacity", 0);
  //     svg
  //       .selectAll(".branch-node,.branch-node-shadow")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) => d.y - bigRectHeight)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) =>
  //         d.positonIndex == index ? 0 : 0 - bigRectHeight * 2,
  //       )
  //       .attr("x", (d: any) => 0 - bigRectWidth / 2);

  //     svg
  //       .selectAll(".branch-node-text")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) => d.y - bigRectHeight + textOffsetY)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) =>
  //         d.positonIndex == index
  //           ? 0 + textOffsetY
  //           : d.y - bigRectHeight * 2 + textOffsetY,
  //       )
  //       .attr("x", (d: any) => 0 - bigRectWidth / 2 + codeRangeOffsetX);

  //     svg
  //       .selectAll(".code-range-text")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) => d.y - bigRectHeight + codeRangeOffsetY)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", (d: any) =>
  //         d.positonIndex === index
  //           ? 0 + codeRangeOffsetY
  //           : d.y - bigRectHeight * 2 + codeRangeOffsetY,
  //       )
  //       .attr("x", (d: any) => 0 - bigRectWidth / 2 + codeRangeOffsetX);
  //   }, phase1);

  //   // svg.selectAll("text").remove();
  // };

  // const downAnimation = (indexInChildren: number) => {
  //   const svg = d3.select("#ToT-branch");
  //   svg
  //     .selectAll(".reason-text,.branch-node-link")
  //     .transition()
  //     .duration(phase1)
  //     .ease(d3.easeLinear)
  //     .style("opacity", 0);

  //   svg
  //     .selectAll(".branch-node,.branch-node-shadow")
  //     .transition()
  //     .duration(phase1)
  //     .ease(d3.easeLinear)
  //     .style("opacity", (d: any) => (d.type === "parent" ? 1 : 0));
  //   svg
  //     .selectAll(".branch-node-text,.code-range-text")
  //     .transition()
  //     .duration(phase1)
  //     .ease(d3.easeLinear)
  //     .style("opacity", (d: any) => (d.type === "parent" ? 1 : 0));

  //   setTimeout(() => {
  //     svg
  //       .selectAll(".branch-node,.branch-node-shadow")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr(
  //         "x",
  //         (d: any) =>
  //           (-bigRectWidth / 2) * 3 -
  //           interval +
  //           indexInChildren * (bigRectWidth + interval),
  //       )
  //       .attr("y", (d: any) => (bigRectHeight / 2) * 3)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", childBranchNodeY);

  //     svg
  //       .selectAll(".branch-node-text")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr(
  //         "x",
  //         (d: any) =>
  //           (-bigRectWidth / 2) * 3 -
  //           interval +
  //           indexInChildren * (bigRectWidth + interval) +
  //           codeRangeOffsetX,
  //       )
  //       .attr("y", (d: any) => (bigRectHeight / 2) * 3 + textOffsetY)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", childBranchNodeY + textOffsetY);

  //     svg
  //       .selectAll(".code-range-text")
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr(
  //         "x",
  //         (d: any) =>
  //           (-bigRectWidth / 2) * 3 -
  //           interval +
  //           indexInChildren * (bigRectWidth + interval) +
  //           codeRangeOffsetX,
  //       )
  //       .attr("y", (d: any) => (bigRectHeight / 2) * 3 + codeRangeOffsetY)
  //       .transition()
  //       .duration(phase2)
  //       .ease(d3.easeLinear)
  //       .attr("y", childBranchNodeY + codeRangeOffsetY);
  //   }, 0);
  // };

  const getIndexInChildren = (originalParent: number) => {
    const newParent = nodes[originalParent].parent || 0;
    const siblingNodes = newParent >= 0 ? nodes[newParent].children : [];
    let index = siblingNodes.indexOf(originalParent);
    switch (siblingNodes.length) {
      case 1:
        index = 1;
        break;
      case 2:
        index = index === 0 ? 0 : 2;
        break;
      default:
        break;
    }
    return index;
  };
  return (
    <div className="mr-3 flex w-[32rem] flex-col">
      <div className="flex h-12 select-none items-center p-1 text-xl font-bold text-neutral-600">
        Branches
      </div>
      <svg
        className="h-full w-[32rem]"
        id="ToT-branch"
        onClick={() => {
          // handleBranchClick();
        }}
      >
        ;
      </svg>
    </div>
  );
};
