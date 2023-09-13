"use client";

import * as d3 from "d3";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import ClientLog from "../ModelViewer/log";
import chain from "@/mocks/chain";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCodeScrollTop,
  selectTextScrollTop,
  updateHighlightNode,
} from "@/store/highlightSlice";
import { selectChainNodes } from "@/store/selectionSlice";
import nodes from "@/mocks/nodes";
import { palatte } from "@/themes/palatte";

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
  const chainNodesIndex = useAppSelector(selectChainNodes);

  // const width = svgRef.current?.clientWidth || 0;
  //   const height = svgRef.current?.clientHeight || 0;
  const width = 258;
  const height = 484;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const rectWidth = 48;
  const rectHeight = 34;

  const bigRectWidth = 120;
  const bigRectHeight = 54;

  const innerHeight = height - margin.top - margin.bottom;
  const interval =
    chainNodesIndex.length < 7
      ? innerHeight / chainNodesIndex.length
      : innerHeight / 7;

  const handleWheelEvent = (event: any) => {
    // const codeEditor = CodeRef.current?.editor;
    const codeElement = document.getElementById("chainVis");
    const scrollTop: number = codeElement?.scrollTop || 0;
    setChainScrollTop(scrollTop);
  };
  useEffect(() => {
    if (selectedNode !== null) {
      dispatch(updateHighlightNode(selectedNode));
    }
  }, [selectedNode]);

  //block highlight
  useEffect(() => {
    if (selectedNode === null) return;
    const textBlocks = document.getElementsByClassName("text-block");
    if (textBlocks.length !== 0) {
      textBlocks[selectedNode].classList.add("text-block-highlight");
    }

    return () => {
      if (selectedNode === null) return;
      if (textBlocks.length !== 0) {
        textBlocks[selectedNode].classList.remove("text-block-highlight");
      }
    };
  }, [selectedNode]);

  useEffect(() => {
    const nodeData = chainNodesIndex.map((d, i) => {
      return {
        step: i,
        text: "S" + i,
        summary: nodes[d].content[nodes[d].contentID].summary,
        color: palatte[i],
      };
    });

    const rectData = d3.map(nodeData, (d, i) => {
      const w = i === selectedNode ? bigRectWidth : rectWidth;
      const h = i === selectedNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === selectedNode ? i * interval - 10 : i * interval;
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

    const svg = d3.select("#chain-svg");
    svg.selectAll("*").remove();
    svg.attr("viewBox", [-width / 2, -margin.top, width, height]);
    // const index = d3.local();

    svg
      .append("g")
      .append("line")
      .attr("class", "chain-node-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", innerHeight - rectHeight / 2)
      .attr("stroke", "#D9D9D9")
      .attr("stroke-width", 4);

    svg
      .append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "chain-node-shadow")
      .attr("x", () => -rectWidth / 2)
      .attr("y", (d, i) => i * interval)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", (d) => d.color)
      .attr("rx", 16)
      .attr("ry", 16)
      .transition()
      .duration(1000)
      .ease(d3.easeCircle)
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
      .attr("x", () => -rectWidth / 2)
      .attr("y", (d, i) => i * interval)
      .attr("width", rectWidth)
      .attr("height", rectHeight - 5)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14)
      .on("click", function (event, d) {
        setSelectedNode(d.id);
      })
      .transition()
      .duration(800)
      .ease(d3.easeCircle)
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

    if (selectedNode === null) return;
    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;

    // get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chain[selectedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = -(margin.top - (codeSnippetY - svgMarginTop));

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[selectedNode]?.getBoundingClientRect().top;
    const blockHeight =
      hightlightBlocks[selectedNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;

    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * selectedNode,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * selectedNode,
        x2: width / 2,
        y2: blockHeight / 2 + rightY,
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
        color: rectData[selectedNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY,
        width: 4,
        height: blockHeight,
        color: rectData[selectedNode].color,
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
      .attr("stop-color", rectData[selectedNode].color)
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
      .attr("stop-color", rectData[selectedNode].color)
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
          .attr("stroke-dashoffset", pathLength * d.direction)
          .transition()
          .duration(500)
          .delay(800)
          .ease(d3.easeLinear)
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
      .attr("width", (d) => 0)
      .attr("height", (d) => d.height)
      .attr("fill", (d) => d.color)
      .transition()
      .duration(200)
      .delay(1300)
      .attr("width", (d) => d.width);
    const cnct = document.getElementsByClassName("chain-connector");
    console.log("cnct bounding cilent", cnct[0].getBoundingClientRect().y);
  }, [selectedNode]);

  //update left and right y position
  useEffect(() => {
    if (selectedNode === null) return;
    const svg = d3.select("#chain-svg");
    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chain[selectedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;
    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;

    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[selectedNode]?.getBoundingClientRect().top;
    const blockHeight =
      hightlightBlocks[selectedNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;

    setLeftY(leftY);
    setRightY(rightY);
    setCodeSnippetHeight(codeSnippetHeight);
    setBlockHeight(blockHeight);
  }, [codeScrollTop, textScrollTop, selectedNode]);

  // update connector
  useEffect(() => {
    if (selectedNode === null) return;
    const svg = d3.select("#chain-svg");

    const nodeData = chainNodesIndex.map((d, i) => {
      return {
        step: i,
        text: "S" + i,
        summary: nodes[d].content[nodes[d].contentID].summary,
        color: palatte[i],
      };
    });
    const rectData = d3.map(nodeData, (d, i) => {
      const w = i === selectedNode ? bigRectWidth : rectWidth;
      const h = i === selectedNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === selectedNode ? i * interval - 10 : i * interval;
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
    if (selectedNode === null) return;

    const connectors = [
      {
        x: -width / 2,
        y: leftY,
        width: 4,
        height: codeSnippetHeight,
        color: rectData[selectedNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY,
        width: 4,
        height: blockHeight,
        color: rectData[selectedNode].color,
        side: "right",
      },
    ];
    //connectors
    svg
      .selectAll("rect.chain-connector")
      .data(connectors)
      .attr("y", (d) => d.y);
  }, [leftY, rightY]);

  //update links
  useEffect(() => {
    if (selectedNode === null) return;
    const svg = d3.select("#chain-svg");

    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chain[selectedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeOffsetY = codeLines[selectedNode]?.scrollTop;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[selectedNode]?.getBoundingClientRect().top;
    const blockOffsetY = hightlightBlocks[selectedNode]?.scrollTop;
    const blockHeight =
      hightlightBlocks[selectedNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;
    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * selectedNode,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * selectedNode,
        x2: width / 2,
        y2: blockHeight / 2 + rightY,
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
  }, [codeScrollTop, textScrollTop]);

  return (
    <div
      className="ml-px mr-px w-[20rem] pt-12 "
      onWheel={handleWheelEvent}
      id="chainVis"
    >
      <svg id="chain-svg" className="h-[484px] w-[258px]" ref={svgRef} />
      {/* <TestView /> */}
    </div>
  );
};

export default ChainVis;
