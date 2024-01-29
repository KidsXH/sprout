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
  const [focusHeight, setFocusHeight] = useState<number>(0);
  const [clickedNode, setClickedNode] = useState<number>(-1);
  const highlightNode = useAppSelector(
    (state) => state.highlight.highlightNode,
  );
  const highlightBlockHeight = useAppSelector(
    (state) => state.highlight.highlightBlockHeight,
  );
  const chainNodes = useAppSelector(selectChainNodes);
  // console.log("chainNodes", chainNodes);
  // const treeNodes = useTreeNodes();
  const focusChatID = useAppSelector(selectFocusChatID);
  // const mainChannelChats = useAppSelector(selectMainChannelChats);

  // mainChannelChats.filter((chat:, i) => {if(chat.)})

  useEffect(() => {
    chainNodes.forEach((element, index) => {
      if (element.requestID == focusChatID) {
        setSelectedNode(index);
        // dispatch(updateHighlightNode(index));
      }
    });
    // console.log("chain", focusChatID, chainNodes);
  }, [focusChatID, chainNodes]);

  const width = 258;
  const height = 450;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  // const rectWidth = 48;
  // const rectHeight = 34;

  const rectWidth = 120;
  const rectHeight = 54;

  const bigRectWidth = 120;
  const bigRectHeight = 54;

  const innerHeight = height - margin.top - margin.bottom;
  const interval =
    chainNodes.length < 5 ? innerHeight / chainNodes.length : innerHeight / 5;
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

  useEffect(() => {
    if (clickedNode !== -1) {
      dispatch(updateHighlightNode(clickedNode));
    }
  }, [clickedNode]);

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
      // const y = i === highlightNode ? i * interval - 10 : i * interval;
      const y = i * interval - 10;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        // color: d.color,
        color: "#C8F4D1",
        text: d.text,
        sum: d.summary,
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
        setClickedNode(d.id);
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
      .attr("x", -45)
      .attr("y", (d, i) => i * interval + 10)
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .attr("font-size", "12px")
      .text((d) => d.text)
      .on("click", function (event, d) {
        setClickedNode(d.id);
      });

    svg
      .append("g")
      .selectAll("summary")
      .data(rectData)
      .join("text")
      .attr("class", "chain-node-text select-none")
      .attr("x", -45)
      .attr("y", (d, i) => i * interval + 30)
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .attr("font-size", "12px")
      .text((d) => d.sum)
      .on("click", function (event, d) {
        setClickedNode(d.id);
      });
  }, [chainNodes]);

  //render connector
  useEffect(() => {
    if (clickedNode === -1 || clickedNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");

    const nodeData = chainNodes;

    const rectData = d3.map(nodeData, (d, i) => {
      const w = i === clickedNode ? bigRectWidth : rectWidth;
      const h = i === clickedNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === clickedNode ? i * interval - 10 : i * interval;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        color: "#C8F4D1",
        text: d.text,
        id: i,
      };
    });

    const svgElement = document.getElementById("chain-svg");

    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;

    // get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[clickedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = -(margin.top - (codeSnippetY - svgMarginTop));

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockY = hightlightBlocks[clickedNode]?.getBoundingClientRect().top;
    const blockHeight =
      hightlightBlocks[clickedNode]?.getBoundingClientRect().height;

    // console.log("block Height in first render", blockHeight);
    const rightY = blockY - svgMarginTop - margin.top;

    if (Number.isNaN(rightY)) return;
    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY + chainScrollTop,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * clickedNode - 10,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * clickedNode - 10,
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
        y: leftY + chainScrollTop,
        width: 4,
        height: codeSnippetHeight,
        color: rectData[clickedNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY + chainScrollTop,
        width: 4,
        height: blockHeight,
        color: rectData[clickedNode].color,
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
      .attr("stop-color", rectData[clickedNode].color)
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
      .attr("stop-color", rectData[clickedNode].color)
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

    return () => {
      svg.selectAll(".chain-connector").remove();
      svg.selectAll(".chain-node-link").remove();
      setClickedNode(-1);
    };
  }, [clickedNode, chainNodes]);

  // update left and right y position
  // useEffect(() => {
  //   if (clickedNode === -1 || clickedNode >= chainNodes.length) return;
  //   const svg = d3.select("#chain-svg");
  //   const svgElement = document.getElementById("chain-svg");
  //   const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
  //   //get code highlight position
  //   const codeLines = document.getElementsByClassName("cm-line");
  //   const codeRange = chainNodes[clickedNode].range;
  //   const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;
  //   const codeSnippetY =
  //     codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;

  //   const codeSnippetHeight =
  //     (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
  //   const leftY = codeSnippetY - svgMarginTop - margin.top;

  //   //get block heighlight position
  //   const hightlightBlocks = document.getElementsByClassName("text-block");
  //   const blockY = hightlightBlocks[clickedNode]?.getBoundingClientRect().top;
  //   const blockHeight =
  //     hightlightBlocks[clickedNode]?.getBoundingClientRect().height;

  //   const rightY = blockY - svgMarginTop - margin.top;

  //   // console.log("blockY", blockY);
  //   // console.log("rightY", rightY);
  //   setLeftY(leftY);
  //   setRightY(rightY);
  //   setCodeSnippetHeight(codeSnippetHeight);
  //   setBlockHeight(blockHeight);
  // }, [codeScrollTop, textScrollTop, clickedNode]);

  // update connector
  useEffect(() => {
    if (clickedNode === -1 || clickedNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");

    const nodeData = chainNodes;

    const rectData = d3.map(nodeData, (d, i) => {
      const w = i === clickedNode ? bigRectWidth : rectWidth;
      const h = i === clickedNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === clickedNode ? i * interval - 10 : i * interval;
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

    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[clickedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;
    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;

    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    const blockHeight =
      hightlightBlocks[clickedNode]?.getBoundingClientRect().height;
    const blockY = hightlightBlocks[clickedNode]?.getBoundingClientRect().top;

    const rightY = blockY - svgMarginTop - margin.top;

    const connectors = [
      {
        x: -width / 2,
        y: leftY + chainScrollTop,
        width: 4,
        height: codeSnippetHeight,
        color: rectData[clickedNode].color,
        side: "left",
      },
      {
        x: width / 2,
        y: rightY + chainScrollTop,
        width: 4,
        height: blockHeight,
        color: rectData[clickedNode].color,
        side: "right",
      },
    ];

    //connectors
    svg
      .selectAll("rect.chain-connector")
      .data(connectors)
      .attr("y", (d) => d.y);
  }, [codeScrollTop, textScrollTop, chainScrollTop]);

  // update links
  useEffect(() => {
    if (clickedNode === -1 || clickedNode >= chainNodes.length) return;
    const svg = d3.select("#chain-svg");

    const svgElement = document.getElementById("chain-svg");
    const svgMarginTop = svgElement?.getBoundingClientRect().y || 0;
    //get code highlight position
    const codeLines = document.getElementsByClassName("cm-line");
    const codeRange = chainNodes[clickedNode].range;
    const codeLineHeight = codeLines[0]?.getBoundingClientRect().height || 1;

    const codeSnippetY =
      codeLines[codeRange[0] - 1]?.getBoundingClientRect().y || 0;
    const codeOffsetY = codeLines[clickedNode]?.scrollTop;
    const codeSnippetHeight =
      (codeRange[1] - codeRange[0] + 1) * codeLineHeight;
    const leftY = codeSnippetY - svgMarginTop - margin.top;

    //get block heighlight position
    const hightlightBlocks = document.getElementsByClassName("text-block");
    if (clickedNode === -1 || clickedNode >= hightlightBlocks.length) return;
    const blockY = hightlightBlocks[clickedNode]?.getBoundingClientRect().top;
    // const blockOffsetY = hightlightBlocks[highlightNode]?.scrollTop;
    const blockHeight =
      hightlightBlocks[clickedNode]?.getBoundingClientRect().height;

    const rightY = blockY - svgMarginTop - margin.top;
    const links = [
      {
        x1: -width / 2,
        y1: codeSnippetHeight / 2 + leftY + chainScrollTop,
        x2: -bigRectWidth / 2,
        y2: rectHeight / 2 + interval * clickedNode,
        dx: 40,
        dy: 5,
        side: "left",
      },
      {
        x1: bigRectWidth / 2,
        y1: rectHeight / 2 + interval * clickedNode,
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

  // useEffect(() => {
  //   let elementsArray = document.getElementsByClassName("text-block");

  //   const observer = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       const newHeight = entry.contentRect.height;
  //       setFocusHeight(newHeight);
  //       console.log(
  //         `[chain view]Block at index ${highlightNode} height changed to: ${newHeight}`,
  //       );
  //       // console.log(first)
  //     }
  //   });
  //   const targetElement = elementsArray[highlightNode];
  //   console.log("[chain view] target", targetElement);
  //   if (targetElement) {
  //     observer.observe(targetElement);
  //   }

  //   return () => {
  //     if (targetElement) {
  //       observer.unobserve(targetElement);
  //     }
  //   };
  // }, [highlightNode]);

  return (
    <div
      className="mb-4 ml-px mr-px w-[20rem] pt-[2.5rem]"
      onWheel={handleWheelEvent}
      id="chainVis"
    >
      <svg id="chain-svg" className="h-[450px] w-[258px]" ref={svgRef} />
      {/* <TestView /> */}
    </div>
  );
};

export default ChainVis;
