"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState, useRef, MutableRefObject } from "react";
import nodes from "@/mocks/nodes";
import { BranchView } from "@/components/BranchView";
import { SpaceView } from "@/components/SpaceView";

import * as d3 from 'd3';

import data from '@/mocks/treeNodeData'

export const VisView = () => {
  const llmStates = JSON.parse(llmResults);
  const [stage, setStage] = useState(0);
  const [focusBranchNode, setFocusBranchNode] = useState(3);
  const [parentNode, setParentNode] = useState(2);

  const svgRef: MutableRefObject<SVGSVGElement | null> = useRef(null);
  const handleClick = () => {
    setStage((stage + 1) % 10);
  };

  //graph rendering
  useEffect(() => {
    const width = svgRef.current?.clientWidth || 0;
    const height = svgRef.current?.clientHeight || 0;
    const curStates = llmStates.slice(0, stage + 1);

    // const nodeData: Array<{ id: string; x: number; y: number; text: string }> = [
    //   {id: '[1, 1]', x: 0, y: 0, text: 'Start'},
    //   {id: '[2, 3]', x: 0, y: 50, text: 'Statements - Initialization'},
    //   {id: '[4, 11]', x: -50, y: 100, text: 'Statements - While'},
    //   {id: '[4, 4]', x: 50, y: 100, text: 'Loop Start'},
    //   {id: '[5, 11]', x: 25, y: 150, text: 'Statements - Loop Steps'},
    //   {id: '[5, 5]', x: 75, y: 125, text: 'Statements - Assignment'},
    //   {id: '[6, 7]', x: 75, y: 150, text: 'Statements - Check'},
    //   {id: '[8, 11]', x: 75, y: 175, text: 'Statements - Adjust'},
    //   {id: '[11, 11]', x: 75, y: 200, text: 'L-End'},
    // ];

    const nodeData = data;

    // const linkData: Array<{
    //   source: string;
    //   target: string;
    // }> = [
    //   {source: '[1, 1]', target: '[2, 3]'},
    //   {source: '[2, 3]', target: '[4, 11]'},
    //   {source: '[2, 3]', target: '[4, 4]'},
    //   {source: '[4, 4]', target: '[5, 11]'},
    //   {source: '[4, 4]', target: '[5, 5]'},
    //   {source: '[5, 5]', target: '[6, 7]'},
    //   {source: '[6, 7]', target: '[8, 11]'},
    //   {source: '[8, 11]', target: '[11, 11]'},
    // ];

    const linkData = [
      {source: '1', target: '2'},
      {source: '1', target: '2-3'},
      {source: '1', target: '2-4'},
      {source: '2-3', target: '4'},
    ]

    const drawNodeSd = (selection: any) => {
      selection
        .attr("width", 48)
        .attr("height", 34)
        .attr("fill", '#CCFFDD')
        .attr("rx", 16)
        .attr("ry", 16)
        .attr('x', (d: any) => d.x - 24)
        .attr('y', (d: any) => d.y);
    };

    const drawNodeBg = (selection: any) => {
      selection
        .attr("width", 48)
        .attr("height", 29)
        .attr("fill", "#f5f5f5")
        .attr("rx", 14)
        .attr("ry", 14)
        .attr('x', (d: any) => d.x - 24)
        .attr('y', (d: any) => d.y)
    };

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select('#ToT-graph')
      .attr('viewBox', `${-100} -10 ${width} ${height}`);

    svg.selectAll("*").remove();

    const updateTreeLinks = (linkData: any) =>
      linkData.map((d: any) => {
        return d3.linkVertical()({
          source: [
            // @ts-ignore
            nodeData.find((n) => n.id === d.source).x,
            // @ts-ignore
            nodeData.find((n) => n.id === d.source).y,
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

    const treeLink = svg
      .append("g")
      .attr("class", "tree-link-group")
      .selectAll("path")
      .data(treeLinks)
      .join("path")
      .attr("class", "tree-link")
      .attr("d", (d: any) => d)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.5);



    // treeLinks.push(
    //   d3.linkVertical()({
    //     source: [0, 0],
    //     target: [100, 100],
    //   })
    // );

    // const g = svg
    //   .selectAll('.tree-link-group')
    //   .selectAll('path')
    //   .data(treeLinks);
    //
    // g.enter()
    //   .append('path')
    //   .attr('class', 'tree-link')
    //   .attr('d', (d: any) => d)
    //   .attr('stroke-dasharray', function () {
    //     return `${this.getTotalLength()} ${this.getTotalLength()}`;
    //   })
    //   .attr('stroke-dashoffset', function () {
    //     return this.getTotalLength();
    //   })
    //   .attr('fill', 'none')
    //   .attr('stroke-width', 2)
    //   .attr('stroke-opacity', 0.5)
    //   .attr('stroke', '#999')
    //   .transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr('stroke-dashoffset', 0);

    // treeLink.transition().duration(1000).ease(d3.easeLinear).call(draw);
    //
    // treeLink.exit().transition().duration(1000).remove();

    const node = svg
      .append('g')
      .attr('class', 'tree-node-sd-group')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodeData)
      // .join('circle')
      // .attr('r', 5)
      // .attr('fill', (d: any) => color(d.text.slice(0, 5)))
      // .attr('cx', (d: any) => d.x)
      // .attr('cy', (d: any) => d.y);
      .join('rect')
      .call(drawNodeSd);

    svg
      .append('g')
      .attr('class', 'tree-node-bg-group')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodeData)
      .join('rect')
      .call(drawNodeBg)

    node.append("title").text((d: any) => d.text);
    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: any) {
      // if (!event.active) simulation.alphaTarget(0.3).restart();
      // event.subject.fx = event.subject.x;
      // event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      console.log(event, nodeData);
      event.subject.x = event.x;
      event.subject.y = event.y;
      const node = svg
        .selectAll(".tree-node-group")
        .selectAll("circle")
        .data(nodeData)
        .join("circle")
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      const link = svg
        .selectAll(".tree-link-group")
        .selectAll("path")
        .data(updateTreeLinks(linkData));
      link
        .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .attr("d", (d: any) => d);
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {}

    return () => {
      // simulation.stop();
    };
  }, [stage]);

  return (
    <>
      <div className="flex bg-white w-full h-full m-1 shadow-sm p-1">
        <div className="flex flex-col">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
            Outline
          </div>
          <svg
            className='w-[32rem] h-full'
            id='ToT-graph'
            ref={svgRef}
            onClick={() => {
              handleClick();
            }}
          ></svg>
        </div>
        <BranchView />
        <SpaceView />
        {/* 
        <div className="flex flex-col w-[32rem]">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
            Branches
          </div>
          <svg
            className="w-[32rem] h-full"
            id="ToT-branch"
            onClick={() => {
              // handleBranchClick();
            }}
          ></svg>
        </div> */}
        {/* <div className="flex flex-col">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
            Context
          </div>
          <div className="flex h-full">
            <svg
              className="w-[16rem] h-full flex-col"
              id="ToT-space"
              onClick={() => {
                // handleBranchClick();
              }}
            ></svg>
            <div className="flex flex-col  h-full">config panel</div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default VisView;
