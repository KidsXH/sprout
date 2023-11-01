"use client";

import * as d3 from "d3";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCodeScrollTop,
  selectTextScrollTop,
  updateHighlightNode,
} from "@/store/highlightSlice";
import {
  selectChainNodes,
  selectFocusChatID,
  selectMainChannelChats,
} from "@/store/chatSlice";
import { useTreeNodes } from "../VisView/outline";

const ChainVis = () => {
  const svgRef: MutableRefObject<SVGSVGElement | null> = useRef(null);
  const dispatch = useAppDispatch();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const codeScrollTop = useAppSelector(selectCodeScrollTop);
  const textScrollTop = useAppSelector(selectTextScrollTop);

  const [leftY, setLeftY] = useState<number>(0);
  const [rightY, setRightY] = useState<number>(0);
  const [chainScrollTop, setChainScrollTop] = useState<number>(0);
  const [codeSnippetHeight, setCodeSnippetHeight] = useState<number>(0);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const highlightNode = useAppSelector(
    (state) => state.highlight.highlightNode,
  );

  const chainNodes = useAppSelector(selectChainNodes);
  // const treeNodes = useTreeNodes();
  const focusChatID = useAppSelector(selectFocusChatID);
  // const mainChannelChats = useAppSelector(selectMainChannelChats);

  // mainChannelChats.filter((chat:, i) => {if(chat.)})

  useEffect(() => {
    chainNodes.forEach((element, index) => {
      if (element.requestID == focusChatID) {
        // console.log("index", index);
        setSelectedNode(index);
        // dispatch(updateHighlightNode(index));
      }
    });
    // console.log("chain", focusChatID, chainNodes);
  }, [focusChatID, chainNodes]);

  const width = 258;
  const height = 450;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const rectWidth = 48;
  const rectHeight = 34;

  const bigRectWidth = 120;
  const bigRectHeight = 54;

  const innerHeight = height - margin.top - margin.bottom;
  const interval =
    chainNodes.length < 7 ? innerHeight / chainNodes.length : innerHeight / 7;
  const upperHeight = (chainNodes.length + 1) * interval - height;

  const handleWheelEvent = (event: any) => {
    let deltaScale = event.deltaY;
    const svg = d3.select("#chain-svg");

    if (deltaScale > 0) {
      const newScrollTop =
        chainScrollTop + 3 <= upperHeight ? chainScrollTop + 3 : upperHeight;
      svg.attr("viewBox", [
        -width / 2,
        -margin.top + newScrollTop,
        width,
        height,
      ]);
      setChainScrollTop(newScrollTop);
    } else {
      const newScrollTop = chainScrollTop - 3 > 0 ? chainScrollTop - 3 : 0;
      svg.attr("viewBox", [
        -width / 2,
        -margin.top + newScrollTop,
        width,
        height,
      ]);
      setChainScrollTop(newScrollTop);
    }
  };

  useEffect(() => {
    if (selectedNode !== null) {
      dispatch(updateHighlightNode(selectedNode));
    }
  }, [selectedNode]);

  //block highlight
  useEffect(() => {
    if (highlightNode === -1) return;
    const textBlocks = document.getElementsByClassName("text-block");
    if (textBlocks.length !== 0 && highlightNode < textBlocks.length) {
      textBlocks[highlightNode].classList.add("text-block-highlight");
      // setTimeout(() => {

      // }, 0);
    }

    return () => {
      if (highlightNode === -1) return;
      if (textBlocks.length !== 0 && highlightNode < textBlocks.length) {
        textBlocks[highlightNode].classList.remove("text-block-highlight");
      }
    };
  }, [highlightNode]);

  //render chain
  useEffect(() => {
    // console.log("chain", highlightNode, chainNodes);
    const rectData = d3.map(chainNodes, (d, i) => {
      const w = i === highlightNode ? bigRectWidth : rectWidth;
      const h = i === highlightNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === highlightNode ? i * interval - 10 : i * interval;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        // color: d.color,
        color: "#C8F4D1",
        text: d.text,
        id: i,
      };
    });

    const svg = d3.select("#chain-svg");
    svg.selectAll("*").remove();
    svg.attr("viewBox", [
      -width / 2,
      -margin.top + chainScrollTop,
      width,
      height,
    ]);
    // const index = d3.local();

    svg
      .append("g")
      .append("line")
      .attr("class", "chain-node-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", (chainNodes.length - 1) * interval)
      .attr("stroke", "#D9D9D9")
      .attr("stroke-width", 4);

    svg
      .append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "chain-node-shadow")
      // .attr("x", () => -rectWidth / 2)
      // .attr("y", (d, i) => i * interval)
      // .attr("width", rectWidth)
      // .attr("height", rectHeight)
      .attr("fill", (d) => d.color)
      .attr("rx", 16)
      .attr("ry", 16)
      // .transition()
      // .duration(1000)
      // .ease(d3.easeCircle)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height);

    svg
      .append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "chain-node")
      // .attr("x", () => -rectWidth / 2)
      // .attr("y", (d, i) => i * interval)
      // .attr("width", rectWidth)
      // .attr("height", rectHeight - 5)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14)
      .on("click", function (event, d) {
        setSelectedNode(d.id);
      })
      // .transition()
      // .duration(800)
      // .ease(d3.easeCircle)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height - 5);

    svg
      .append("g")
      .selectAll("text")
      .data(rectData)
      .join("text")
      .attr("class", "chain-node-text select-none")
      .attr("x", 0)
      .attr("y", (d, i) => i * interval + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .text((d) => d.text)
      .on("click", function (event, d) {
        setSelectedNode(d.id);
      });

    if (highlightNode === -1 || highlightNode >= chainNodes.length) return;
    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;

    // get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[highlightNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = -(margin.top - (codeSnippetY - svgMarginTop));

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[highlightNode]?.getBoundingClientRect().top;
    const blockHeight =
      hightlightBlocks[highlightNode]?.getBoundingClientRect().height;

    // console.log("block Height in first render", blockHeight);
    const rightY = blockY - svgMarginTop - margin.top;

    if (Number.isNaN(rightY)) return;
    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY + chainScrollTop,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * highlightNode,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * highlightNode,
        x2: width / 2,
        y2: blockHeight / 2 + rightY + chainScrollTop,
        dx: 40,
        dy: 5,
        side: "right",
      },
    ];

    const pathData = d3.map(links, (d) => {
      const path = d3.path();
      path.moveTo(d.x1, d.y1);
      path.bezierCurveTo(
        d.x1 + d.dx,
        d.y1 + d.dy,
        d.x2 - d.dx,
        d.y2 - d.dy,
        d.x2,
        d.y2,
      );
      return {
        d: path.toString(),
        color: d.side === "left" ? "url(#svgGradientL)" : "url(#svgGradientR)",
        direction: d.side === "left" ? -1 : 1,
        //length: path.node().getTotalLength(),
      };
    });

    const connectors = [
      {
        x: -width / 2,
        y: leftY,
        width: 4,
        height: codeSnippetHeight,
        color: rectData[highlightNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY,
        width: 4,
        height: blockHeight,
        color: rectData[highlightNode].color,
        side: "right",
      },
    ];

    let defs = svg.append("defs");

    let gradient = defs
      .append("linearGradient")
      .attr("id", "svgGradientL")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", rectData[highlightNode].color)
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", "#f5f5f5")
      .attr("stop-opacity", 1);

    gradient = defs
      .append("linearGradient")
      .attr("id", "svgGradientR")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", "#f5f5f5")
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", rectData[highlightNode].color)
      .attr("stop-opacity", 1);

    //new path
    svg
      .append("g")
      .selectAll("path")
      .data(pathData)
      .join("path")
      .attr("class", "chain-node-link")
      .attr("d", (d) => d.d)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 4)
      .each(function (d) {
        var path = this;
        var pathLength = (path as SVGPathElement).getTotalLength();

        d3.select(path)
          .attr("stroke-dasharray", pathLength + " " + pathLength)
          // .attr("stroke-dashoffset", pathLength * d.direction)
          // .transition()
          // .duration(500)
          // .delay(800)
          // .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });

    //connectors
    svg
      .append("g")
      .selectAll("rect")
      .data(connectors)
      .join("rect")
      .attr("class", "chain-connector")
      .attr("x", (d) => (d.side == "left" ? d.x : d.x - d.width))
      .attr("y", (d) => d.y)
      // .attr("width", (d) => 0)
      .attr("height", (d) => d.height)
      .attr("fill", (d) => d.color)
      // .transition()
      // .duration(200)
      // .delay(1300)
      .attr("width", (d) => d.width);
  }, [highlightNode, chainNodes]);

  //update left and right y position
  useEffect(() => {
    if (highlightNode === -1 || highlightNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");
    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[highlightNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;
    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;

    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[highlightNode]?.getBoundingClientRect().top;
    const blockHeight =
      hightlightBlocks[highlightNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;

    setLeftY(leftY);
    setRightY(rightY);
    setCodeSnippetHeight(codeSnippetHeight);
    setBlockHeight(blockHeight);
  }, [codeScrollTop, textScrollTop, highlightNode, focusChatID]);

  // update connector
  useEffect(() => {
    if (highlightNode === -1 || highlightNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");

    const nodeData = chainNodes;

    const rectData = d3.map(nodeData, (d, i) => {
      const w = i === highlightNode ? bigRectWidth : rectWidth;
      const h = i === highlightNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === highlightNode ? i * interval - 10 : i * interval;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        color: d.color,
        text: d.text,
        id: i,
      };
    });
    if (highlightNode === -1 || highlightNode >= rectData.length) return;
    //todo:
    // console.log("highlightNode", highlightNode, "rectData", rectData);
    const connectors = [
      {
        x: -width / 2,
        y: leftY + chainScrollTop,
        width: 4,
        height: codeSnippetHeight,
        color: rectData[highlightNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY + chainScrollTop,
        width: 4,
        height: blockHeight,
        color: rectData[highlightNode].color,
        side: "right",
      },
    ];
    // console.log("rightY", rightY);
    //connectors
    svg
      .selectAll("rect.chain-connector")
      .data(connectors)
      .attr("y", (d) => d.y);
  }, [leftY, rightY, chainScrollTop]);

  //update links
  useEffect(() => {
    if (highlightNode === -1 || highlightNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");

    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[highlightNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeOffsetY = codeLines[highlightNode]?.scrollTop;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    if (highlightNode === -1 || highlightNode >= hightlightBlocks.length)
      return;
    const blockY = hightlightBlocks[highlightNode]?.getBoundingClientRect().top;
    // const blockOffsetY = hightlightBlocks[highlightNode]?.scrollTop;
    const blockHeight =
      hightlightBlocks[highlightNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;
    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY + chainScrollTop,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * highlightNode,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * highlightNode,
        x2: width / 2,
        y2: blockHeight / 2 + rightY + chainScrollTop,
        dx: 40,
        dy: 0,
        side: "right",
      },
    ];
    const pathData = d3.map(links, (d) => {
      const path = d3.path();
      path.moveTo(d.x1, d.y1);
      path.bezierCurveTo(
        d.x1 + d.dx,
        d.y1 + d.dy,
        d.x2 - d.dx,
        d.y2 - d.dy,
        d.x2,
        d.y2,
      );
      return {
        d: path.toString(),
        color: d.side === "left" ? "url(#svgGradientL)" : "url(#svgGradientR)",
        direction: d.side === "left" ? -1 : 1,
        //length: path.node().getTotalLength(),
      };
    });

    svg
      .selectAll("path.chain-node-link")
      .data(pathData)
      .attr("d", (d) => d.d)
      .attr("stroke-dasharray", "none");
  }, [codeScrollTop, textScrollTop, chainScrollTop]);

  return (
    <div
      className="mb-4 ml-px mr-px w-[20rem] pt-12"
      onWheel={handleWheelEvent}
      id="chainVis"
    >
      <svg id="chain-svg" className="h-[450px] w-[258px]" ref={svgRef} />
      {/* <TestView /> */}
    </div>
  );
};

export default ChainVis;
