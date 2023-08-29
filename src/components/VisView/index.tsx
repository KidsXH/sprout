'use client';

import {llmResults} from '@/server/mock';
import {useEffect, useState} from 'react';

import * as d3 from 'd3';
import {link} from 'fs';

export const VisView = () => {
  const llmStates = JSON.parse(llmResults);
  const [stage, setStage] = useState(0);

  const handleClick = () => {
    setStage((stage + 1) % 10);
  };

  useEffect(() => {
    const width = 640;
    const height = 300;
    const curStates = llmStates.slice(0, stage + 1);

    const nodeData: Array<{ id: string; x: number; y: number; text: string }> = [
      {id: '[1, 1]', x: 0, y: 0, text: 'Start'},
      {id: '[2, 3]', x: 0, y: 50, text: 'Statements - Initialization'},
      {id: '[4, 11]', x: -50, y: 100, text: 'Statements - While'},
      {id: '[4, 4]', x: 50, y: 100, text: 'Loop Start'},
      {id: '[5, 11]', x: 25, y: 150, text: 'Statements - Loop Steps'},
      {id: '[5, 5]', x: 75, y: 125, text: 'Statements - Assignment'},
      {id: '[6, 7]', x: 75, y: 150, text: 'Statements - Check'},
      {id: '[8, 11]', x: 75, y: 175, text: 'Statements - Adjust'},
      {id: '[11, 11]', x: 75, y: 200, text: 'L-End'},
    ];
    const linkData: Array<{
      source: string;
      target: string;
    }> = [
      {source: '[1, 1]', target: '[2, 3]'},
      {source: '[2, 3]', target: '[4, 11]'},
      {source: '[2, 3]', target: '[4, 4]'},
      {source: '[4, 4]', target: '[5, 11]'},
      {source: '[4, 4]', target: '[5, 5]'},
      {source: '[5, 5]', target: '[6, 7]'},
      {source: '[6, 7]', target: '[8, 11]'},
      {source: '[8, 11]', target: '[11, 11]'},
    ];

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select('#ToT-graph')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `${-100} -10 ${width / 2} ${height + 10}`);

    svg.selectAll('*').remove();

    const updateTreeLinks = (linkData: any) => linkData.map((d: any) => {
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
      .append('g')
      .attr('class', 'tree-link-group')
      .selectAll('path')
      .data(treeLinks)
      .join('path')
      .attr('class', 'tree-link')
      .attr('d', (d: any) => d)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5);

    const draw = (selection: any) => {
      selection
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-dashoffset', 0);
    };

    treeLinks.push(
      d3.linkVertical()({
        source: [0, 0],
        target: [100, 100],
      })
    );

    const g = svg
      .selectAll('.tree-link-group')
      .selectAll('path')
      .data(treeLinks);

    g.enter()
      .append('path')
      .attr('class', 'tree-link')
      .attr('d', (d: any) => d)
      .attr('stroke-dasharray', function () {
        return `${this.getTotalLength()} ${this.getTotalLength()}`;
      })
      .attr('stroke-dashoffset', function () {
        return this.getTotalLength();
      })
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.5)
      .attr('stroke', '#999')
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    treeLink.transition().duration(1000).ease(d3.easeLinear).call(draw);

    treeLink.exit().transition().duration(1000).remove();

    const node = svg
      .append('g')
      .attr('class', 'tree-node-group')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodeData)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => color(d.text.slice(0, 5)))
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);

    node.append('title').text((d: any) => d.text);
    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
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
        .selectAll('.tree-node-group')
        .selectAll('circle')
        .data(nodeData)
        .join('circle')
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
      const link = svg
        .selectAll('.tree-link-group')
        .selectAll('path')
        .data(updateTreeLinks(linkData));
      link
        .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .attr('d', (d: any) => d);
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
    }

    return () => {
      // simulation.stop();
    };
  }, [stage]);

  return (
    <>
      <div className='flex bg-white w-full h-full m-1 shadow-sm p-1'>
        <div className='flex flex-col'>
          <div className='flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none'>Outline</div>
          <svg
            className='w-[32rem] h-full'
            id='ToT-graph'
            onClick={() => {
              handleClick();
            }}
          ></svg>
        </div>

        <div className='flex flex-col w-[32rem]'>
          <div className='flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none'>Branches</div>
        </div>
        <div className='flex flex-col'>
          <div className='flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none'>Context</div>
        </div>
      </div>
    </>
  );
};

export default VisView;

const creatGraph = (data: dataType[]) => {
  let nodeMap = new Map();
  Array.from(data).forEach((d: any) => {
    const key = JSON.stringify(d.lineno);
    if (!nodeMap.has(key)) {
      nodeMap.set(key, {
        id: d.lineno,
        index: nodeMap.size,
        text: d.explanation,
        step: d.step,
      });
    }
  });
  let nodes: any = [];

  nodeMap.forEach((value: any) => {
    let group = 1;
    if (value.text.startsWith('Start')) group = 2;
    if (value.text.startsWith('End')) group = 3;
    let lineno = value.id[0];
    nodes.push({
      id: JSON.stringify(value.id),
      group: group,
      step: lineno,
    });
  });

  let links: any = [];

  data.forEach((d1: any) => {
    data.forEach((d2: any) => {
      if (d2.prev === null) return;
      const key1 = JSON.stringify(d1.lineno);
      const key2 = JSON.stringify(d2.lineno);
      const key2p = JSON.stringify(d2.prev);
      if (key1 !== key2) {
        if (key2p === key1) {
          links.push({
            source: key1,
            target: key2,
            value: 5,
            strength: 0.5,
          });
        }
        if (d1.lineno[0] <= d2.lineno[0] && d1.lineno[1] >= d2.lineno[1]) {
          links.push({
            source: key1,
            target: key2,
            value: 1,
            strength: 1,
          });
        }
      }
    });
  });
  return {links, nodes};
};

interface dataType {
  step: number;
  explanation: string;
  prev: number;
  code: string;
  lineno: number;
}
