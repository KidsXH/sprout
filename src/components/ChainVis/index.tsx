'use client';

import * as d3 from "d3";
import {MutableRefObject, useEffect, useRef, useState} from "react";

const ChainVis = () => {
  const data = [
    {step: 1, text: 'S1', color: '#f5f5f5'},
    {step: 2, text: 'S2', color: '#CCFFDD'},
    {step: 3, text: 'S3', color: '#FFF1CC'},
    {step: 4, text: 'S4', color: '#CCF0FF'},
    {step: 5, text: 'S5', color: '#FFCCCC'},
    {step: 6, text: 'S6', color: '#f5f5f5'},
  ]
  const svgRef: MutableRefObject<SVGSVGElement | null> = useRef(null);

  const [selectedNode, setSelectedNode] = useState<number>(3);

  useEffect(() => {
    const svg = d3.select("#chain-svg");
    svg.selectAll("*").remove();

    const width = svgRef.current?.clientWidth || 0;
    const height = svgRef.current?.clientHeight || 0;
    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("viewBox", [-width / 2, -margin.top, width, height])

    const rectWidth = 48;
    const rectHeight = 34;

    const bigRectWidth = 120;
    const bigRectHeight = 54;

    const rectData = d3.map(data, (d, i) => {
      const w = i === selectedNode ? bigRectWidth : rectWidth;
      const h = i === selectedNode ? bigRectHeight : rectHeight;
      const x = -w / 2;
      const y = i === selectedNode ? i * (innerHeight / data.length) - 10 : i * (innerHeight / data.length);
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        color: d.color,
        text: d.text,
      }
    })

    svg.append("g")
      .append("line")
      .attr("class", "chain-node-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", innerHeight - rectHeight / 2)
      .attr("stroke", "#D9D9D9")
      .attr("stroke-width", 4)


    svg.append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "chain-node-shadow")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("fill", (d) => d.color)
      .attr("rx", 16)
      .attr("ry", 16);

    svg.append("g")
      .selectAll("rect")
      .data(rectData)
      .join("rect")
      .attr("class", "chain-node")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height - 5)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14)

    svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "chain-node-text select-none")
      .attr("x", 0)
      .attr("y", (d, i) => i * (innerHeight / data.length) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .text((d) => d.text);

    const links = [
      {x1: -width / 2, y1: 50, x2: -bigRectWidth / 2, y2: 225, dx: 40, dy: 5, side: 'left'},
      {x1: bigRectWidth / 2, y1: 225, x2: width / 2, y2: 300, dx: 40, dy: 5, side: 'right'},
    ]

    const pathData = d3.map(links, (d) => {
      const path = d3.path();
      path.moveTo(d.x1, d.y1);
      path.bezierCurveTo(d.x1 + d.dx, d.y1 + d.dy, d.x2 - d.dx, d.y2 - d.dy, d.x2, d.y2);
      return {d: path.toString(), color: d.side ==='left'? 'url(#svgGradientL)' : 'url(#svgGradientR)'}
    })

    let defs = svg.append("defs");

    let gradient = defs.append("linearGradient")
      .attr("id", "svgGradientL")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", "#CCF0FF")
      .attr("stop-opacity", 1);

    gradient.append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", "#f5f5f5")
      .attr("stop-opacity", 1);

    gradient = defs.append("linearGradient")
      .attr("id", "svgGradientR")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", "#f5f5f5")
      .attr("stop-opacity", 1);

    gradient.append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", "#CCF0FF")
      .attr("stop-opacity", 1);

    svg.append("g")
      .selectAll("path")
      .data(pathData)
      .join("path")
      .attr("class", "chain-node-link")
      .attr("d", (d) => d.d)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 4);

  }, [svgRef, data, selectedNode])


  return (
    <div className="flex w-[20rem] m-1 items-center justify-center pt-12">
      <svg id="chain-svg" className="w-full h-full" ref={svgRef}/>
    </div>
  )
}

export default ChainVis;