import { useCallback, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createLinearGradient } from "@/components/VisView/gradient";
import {
  ChatNodeWithID,
  RequestWithChannelID,
  selectNodePool,
  selectRequestPool,
} from "@/store/nodeSlice";
import { selectMainChannelChats, setMainChannelID } from "@/store/chatSlice";

type TreeNode = {
  requestID: number[];
  treeID: number;
  depth: number;
  key: string;
  label: string;
  parentID?: number;
  childrenID: number[];
  x: number;
  y: number;
};

const OutlineView = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const dispatch = useAppDispatch();
  const mainChannelChats = useAppSelector(selectMainChannelChats);
  const nodeData = useAppSelector(selectNodePool);
  const requestPool = useAppSelector(selectRequestPool);

  const treeNodes = useMemo(
    () => calculateTreeNode(nodeData, requestPool),
    [nodeData, requestPool, mainChannelChats],
  );

  useEffect(() => {
    calculateNodePosition(treeNodes, mainChannelChats);
  }, [treeNodes, mainChannelChats]);

  const measuredRef = (node: any) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
      setHeight(node.getBoundingClientRect().height);
    }
  };

  const clickNodeFn = useCallback((nodeID: number) => {}, []);

  const clickLeafFn = useCallback(
    (treeID: number) => {
      const treeNode = treeNodes[treeID];
      const channelID = requestPool[treeNode.requestID[0]].channelID;
      dispatch(setMainChannelID(channelID));
    },
    [dispatch, treeNodes, requestPool],
  );

  useEffect(() => {
    createSVG();
  }, []);

  useEffect(() => {
    updateSVG(
      width,
      height,
      treeNodes,
      mainChannelChats,
      clickNodeFn,
      clickLeafFn,
    );
  }, [width, height, mainChannelChats, clickNodeFn, treeNodes, clickLeafFn]);

  return (
    <>
      <svg className="h-[20rem] w-[32rem]" id="outline-svg" ref={measuredRef} />
    </>
  );
};

export default OutlineView;

const createSVG = () => {
  const width = 500;
  const height = 300;
  const svg = d3.select("#outline-svg");
  svg.attr("viewBox", `0 0 500 300`);
  svg.selectAll("*").remove();
  const g = svg.append("g");
  g.append("g").attr("class", "tree-link-group");
  g.append("g").attr("class", "tree-node-shadow-group");
  g.append("g").attr("class", "tree-node-bg-group");
  g.append("g").attr("class", "tree-node-text-group");
  g.append("g").attr("class", "tree-node-highlight-group");
  createLinearGradient(svg, "linkGradient", "#C6EBD4");
  renderLegend(svg);
  // @ts-ignore
  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 8])
    .on("zoom", zoomed));
  // @ts-ignore
  function zoomed({transform}) {
    g.attr("transform", transform);
  }
};

const updateSVG = (
  width: number,
  height: number,
  data: TreeNode[],
  mainChannelChats: number[],
  clickNodeFn: (treeID: number) => void,
  clickLeafFn: (treeID: number) => void,
) => {
  const svg = d3.selectAll("#outline-svg");
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const offsetX = width / 2;
  const offsetY = 60;
  const dx = 70;
  const dy = 60;

  const nodeData = d3.map(data, (d) => {
    return {
      requestID: d.requestID,
      treeID: d.treeID,
      childrenID: d.childrenID,
      text: d.label,
      x: d.x * dx + offsetX,
      y: d.y * dy + offsetY,
      highlight:
        mainChannelChats.find((n) => d.requestID.includes(n)) !== undefined
          ? "#C6EBD4"
          : "#f5f5f5",
    };
  });

  const focusNode =
    mainChannelChats.length === 0
      ? null
      : data.find((n) =>
          n.requestID.includes(mainChannelChats[mainChannelChats.length - 1]),
        );

  let highlightNodeData = focusNode
    ? d3.map(
        data.filter((d) => d.label === focusNode.label),
        (d) => {
          return {
            requestID: d.requestID,
            treeID: d.treeID,
            text: d.label,
            x: d.x * dx + offsetX,
            y: d.y * dy + offsetY,
            highlight: d.treeID === focusNode.treeID ? "#8BBD9E" : "#EECD9C",
          };
        },
      )
    : [];

  const linkData: { source: number; target: number }[] = [];

  const renderNodeSd = (selection: any) => {
    selection
      .attr("class", (d: any) =>
        d.treeID === focusNode?.treeID
          ? "drop-shadow-sm cursor-pointer"
          : "hover:drop-shadow-sm cursor-pointer",
      )
      .attr("width", 48)
      .attr("height", 34)
      .attr("fill", (d: any) => d.highlight)
      .attr("rx", 16)
      .attr("ry", 16)
      .attr("x", (d: any) => d.x - 24)
      .attr("y", (d: any) => d.y)
      .on("click", (event: any, d: any) => {
        d.childrenID.length > 0 ? clickNodeFn(d.treeID) : clickLeafFn(d.treeID);
      });
  };

  const renderNodeBg = (selection: any) => {
    selection
      .attr("class", "node-bg cursor-pointer pointer-events-none")
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
      .attr("class", "select-none text-sm text-black pointer-events-none")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y + 20)
      .attr("text-anchor", "middle")
      .text((d: any) => d.text)
      .on("click", (event: any, d: any) => {
        d.childrenID.length > 0 ? clickNodeFn(d.treeID) : clickLeafFn(d.treeID);
      });
  };

  const renderNodeHighlight = (selection: any) => {
    selection
      .attr("width", 48)
      .attr("height", 34)
      .attr("fill", "none")
      .attr("rx", 16)
      .attr("ry", 16)
      .attr("x", (d: any) => d.x - 24)
      .attr("y", (d: any) => d.y)
      .attr("stroke", (d: any) => d.highlight)
      .attr("stroke-width", 2);
  };

  const updateTreeLinks = (linkData: any) =>
    linkData.map((d: any) => {
      const highlighted =
        mainChannelChats.find((n: any) => n === d.source) !== undefined &&
        mainChannelChats.find((n: any) => n === d.target) !== undefined;

      const source = nodeData.find((n) => n.treeID === d.source);
      const target = nodeData.find((n) => n.treeID === d.target);
      if (!source || !target) {
        return;
      }
      const type =
        source.x === target.x || source.y === target.y ? "fill" : "stroke";
      const lineColor = highlighted ? "url(#linkGradient)" : "#eaeaea";
      const lineWidth = highlighted ? 4 : 2;
      return {
        data:
          type === "stroke"
            ? d3.line()([
                [source.x, source.y + 17],
                [target.x, target.y + 17],
              ])
            : source.x === target.x
            ? d3.line()([
                [source.x - lineWidth / 2, source.y + 17],
                [target.x - lineWidth / 2, target.y + 17],
                [target.x + lineWidth / 2, target.y + 17],
                [source.x + lineWidth / 2, source.y + 17],
              ])
            : d3.line()([
                [source.x, source.y + 17 - lineWidth / 2],
                [target.x, target.y + 17 - lineWidth / 2],
                [target.x, target.y + 17 + lineWidth / 2],
                [source.x, source.y + 17 + lineWidth / 2],
              ]),
        // if the source and target nodes is in the chain, then the link is highlighted
        color: lineColor,
        fill: type === "fill" ? lineColor : "none",
        stokeWidth: type === "fill" ? 0 : lineWidth,
        colorType: type,
      };
    });

  let treeLinks = updateTreeLinks(linkData);

  const renderLink = (selection: any) => {
    selection
      .attr("d", (d: any) => d.data)
      .attr("fill", (d: any) => d.fill)
      .attr("stroke", (d: any) => d.color)
      .attr("stroke-width", (d: any) => d.stokeWidth);
  };

  svg
    .selectAll(".tree-link-group")
    .selectAll("path")
    .data(treeLinks)
    .join("path")
    .call(renderLink);

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

  svg
    .selectAll(".tree-node-highlight-group")
    .selectAll("rect")
    .data(highlightNodeData)
    .join("rect")
    .call(renderNodeHighlight);
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
    .attr("class", "drop-shadow-sm")
    .attr("width", 36)
    .attr("height", 24)
    .attr("fill", "#f5f5f5")
    .attr("x", 150)
    .attr("y", 5)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("stroke", "#8BBD9E")
    .attr("stroke-width", 1.5);

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
    .attr("stroke", "#EECD9C")
    .attr("stroke-width", 1.5);

  node3
    .append("text")
    .attr("class", "text-xs select-none")
    .attr("x", 295 + 44)
    .attr("y", 22)
    .text("highlighted node");
};

const calculateTreeNode = (
  nodeData: ChatNodeWithID[],
  requestPool: RequestWithChannelID[],
) => {
  const nodeList: TreeNode[] = [];
  const lastNodeMap: Map<number, TreeNode> = new Map();
  const layerWidth = Array(nodeData.length).fill(0);
  nodeData.forEach((node, i) => {
    const { id, codeRange, action } = node;
    const channelID = requestPool[id].channelID;
    const key = `${action.type}-${codeRange}`;
    const label = codeRange ? `${codeRange[0]}-${codeRange[1]}` : action.type;

    const lastNode = lastNodeMap.get(channelID);

    let depth = 0;
    let parentID = undefined;
    let treeID = -1;

    if (lastNode) {
      depth = lastNode.depth + 1;
      parentID = lastNode.treeID;
      lastNode.childrenID.find((id) => {
        const node = nodeList[id];
        if (node.key === key) {
          treeID = id;
          return true;
        }
        return false;
      });
    } else {
      depth = 0;
      nodeList
        .filter((node) => node.depth === 0)
        .forEach((node) => {
          if (node.key === key) {
            treeID = node.treeID;
            return true;
          }
          return false;
        });
    }

    if (treeID === -1) {
      treeID = nodeList.length;
      let x = 0;
      if (parentID !== undefined) {
        x = nodeList[parentID].x + nodeList[parentID].childrenID.length;
        nodeList[parentID].childrenID.push(treeID);
      }
      nodeList.push({
        requestID: [id],
        treeID: treeID,
        depth: depth,
        parentID: parentID,
        childrenID: [],
        key: key,
        label: label,
        x: x,
        y: depth,
      });
      layerWidth[depth] += 1;
    } else {
      nodeList[treeID].requestID.push(id);
    }
    lastNodeMap.set(channelID, nodeList[treeID]);
  });

  return nodeList;
};

const calculateNodePosition = (
  data: TreeNode[],
  mainChannelChats: number[],
) => {
  const offsetX = Array(data.length).fill(0); // the offset of each layer
  data.forEach((node) => {
    node.requestID.forEach((id) => {
      if (mainChannelChats.includes(id)) {
        offsetX[node.depth] = 0 - node.x;
      }
    });
  });
  data.forEach((node) => {
    node.x += offsetX[node.depth];
  });
};
