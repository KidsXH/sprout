import { useCallback, useEffect, useRef, useState } from "react";
import data from "@/mocks/treeNodeData";
import * as d3 from "d3";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { pickChain, selectChainNodes } from "@/store/selectionSlice";
import chain from "@/mocks/chain";

const OutlineView = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const chainNodes = useAppSelector(selectChainNodes);
  const dispatch = useAppDispatch();

  const measuredRef = (node: any) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
      setHeight(node.getBoundingClientRect().height);
    }
  };

  useEffect(() => {
    createSVG();
  }, []);

  useEffect(() => {
    updateSVG(width, height, data, chainNodes);
  }, [width, height, chainNodes]);

  return (
    <>
      <svg
        className="h-[20rem] w-[32rem]"
        id="outline-svg"
        ref={measuredRef}
        onClick={() => {
          dispatch(pickChain([0, 1, 2]));
          console.log("click");
        }}
      />
    </>
  );
};

export default OutlineView;

const createSVG = () => {
  const svg = d3.selectAll("#outline-svg");
  svg.attr("viewBox", `0 0 500 300`);
  svg.selectAll("*").remove();
  svg.append("g").attr("class", "tree-link-group");
  svg.append("g").attr("class", "tree-node-shadow-group");
  svg.append("g").attr("class", "tree-node-bg-group");
  svg.append("g").attr("class", "tree-node-text-group");
  renderLegend(svg);
};

const updateSVG = (
  width: number,
  height: number,
  data: any,
  chainNodes: number[],
) => {
  const svg = d3.selectAll("#outline-svg");
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const offsetX = width / 2;
  const offsetY = 60;
  const dx = 70;
  const dy = 60;

  const nodeData = d3.map(data, (d: any) => {
    return {
      id: d.id,
      text: d.text,
      x: d.x * dx + offsetX,
      y: d.y * dy + offsetY,
      highlight:
        chainNodes.find((n: any) => n === d.id) !== undefined
          ? "#ccffdd"
          : "#f5f5f5",
    };
  });

  const linkData = [
    { source: 0, target: 3 },
    { source: 0, target: 1 },
    { source: 0, target: 4 },
    { source: 1, target: 2 },
    { source: 3, target: 5 },
    { source: 3, target: 6 },
    { source: 4, target: 7 },
    { source: 4, target: 8 },
  ];

  const renderNodeSd = (selection: any) => {
    selection
      .attr("class", "node-shadow")
      .attr("width", 48)
      .attr("height", 34)
      .attr("fill", (d: any) => d.highlight)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("rx", 16)
      .attr("ry", 16)
      .attr("x", (d: any) => d.x - 24)
      .attr("y", (d: any) => d.y);
  };

  const renderNodeBg = (selection: any) => {
    selection
      .attr("class", "node-bg")
      .attr("width", 48)
      .attr("height", 29)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("x", (d: any) => d.x - 24)
      .attr("y", (d: any) => d.y);
  };

  const renderNodeText = (selection: any) => {
    selection
      .attr("class", "select-none text-sm text-black")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y + 20)
      .attr("text-anchor", "middle")
      .text((d: any) => d.text);
  };

  const updateTreeLinks = (linkData: any) =>
    linkData.map((d: any) => {
      return d3.link(d3.curveLinear)({
        source: [
          // @ts-ignore
          nodeData.find((n) => n.id === d.source).x,
          // @ts-ignore
          nodeData.find((n) => n.id === d.source).y + 17,
        ],
        target: [
          // @ts-ignore
          nodeData.find((n) => n.id === d.target).x,
          // @ts-ignore
          nodeData.find((n) => n.id === d.target).y,
        ],
      });
    });

  let treeLinks = updateTreeLinks(linkData);

  svg
    .selectAll(".tree-link-group")
    .selectAll("path")
    .data(treeLinks)
    .join("path")
    .attr("class", "tree-link")
    .attr("d", (d: any) => d)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.5);

  svg
    .selectAll(".tree-node-shadow-group")
    .selectAll("rect")
    .data(nodeData)
    .join("rect")
    .call(renderNodeSd);

  svg
    .selectAll(".tree-node-bg-group")
    .selectAll("rect")
    .data(nodeData)
    .join("rect")
    .call(renderNodeBg);

  svg
    .selectAll(".tree-node-text-group")
    .selectAll("text")
    .data(nodeData)
    .join("text")
    .call(renderNodeText);
};

const renderLegend = (svg: any) => {
  const g = svg.append("g");

  // Legend 1: current chain
  const node1 = g.append("g");
  node1
    .append("rect")
    .attr("width", 36)
    .attr("height", 24)
    .attr("fill", "#CCFFDD")
    .attr("x", 5)
    .attr("y", 5)
    .attr("rx", 10)
    .attr("ry", 10);

  node1
    .append("rect")
    .attr("width", 36)
    .attr("height", 20)
    .attr("fill", "#f5f5f5")
    .attr("x", 5)
    .attr("y", 5)
    .attr("rx", 8)
    .attr("ry", 8);

  node1
    .append("text")
    .attr("class", "text-xs select-none")
    .attr("x", 49)
    .attr("y", 22)
    .text("current chain");

  // Legend2: selected node
  const node2 = g.append("g");
  node2
    .append("rect")
    .attr("class", "drop-shadow-md")
    .attr("width", 36)
    .attr("height", 24)
    .attr("fill", "#f5f5f5")
    .attr("x", 150)
    .attr("y", 5)
    .attr("rx", 10)
    .attr("ry", 10);

  node2
    .append("text")
    .attr("class", "text-xs select-none")
    .attr("x", 150 + 44)
    .attr("y", 22)
    .text("selected node");

  // Legend3: selected node
  const node3 = g.append("g");
  node3
    .append("rect")
    .attr("width", 36)
    .attr("height", 24)
    .attr("fill", "#f5f5f5")
    .attr("x", 295)
    .attr("y", 5)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("stroke", "#8BBD9E")
    .attr("stroke-width", 1.5);

  node3
    .append("text")
    .attr("class", "text-xs select-none")
    .attr("x", 295 + 44)
    .attr("y", 22)
    .text("highlighted node");
};
