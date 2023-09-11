import {useCallback, useEffect, useRef, useState} from "react";
import data from "@/mocks/treeNodeData";
import * as d3 from "d3";

const OutlineView = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // @ts-ignore
  const measuredRef = (node: any) => {
      if (node !== null) {
        setWidth(node.getBoundingClientRect().width);
        setHeight(node.getBoundingClientRect().height);
      }
    }

  useEffect(() => {
    // const width = ref.current?.clientWidth || 0;
    // const height = 300;

    const nodeData = data;

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
      .select('#outline-svg')
      .attr('viewBox', `0 0 ${width} ${height}`);

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
    function dragended(event: any) {
    }

    drawLegend(svg, width);

    return () => {
      // simulation.stop();
    };
  }, [width, height]);
  return <>
    <svg
      className='w-[32rem] h-full'
      id='outline-svg'
      ref={measuredRef}
    />
  </>
}

export default OutlineView;

const drawSmNodeBg = (selection: any) => {
  selection
    .attr("width", 24)
    .attr("height", 18)
    .attr('fill', (d: any) => d.fill)
    .attr('x', (d: any) => d.x)
    .attr('y', (d: any) => d.y)
    .attr("rx", 8)
    .attr("ry", 8);
}

const drawSmNode = (selection: any) => {
  selection
    .attr("width", 24)
    .attr("height", 15)
    .attr('fill', '#f5f5f5')
    .attr('x', (d: any) => d.x)
    .attr('y', (d: any) => d.y)
    .attr("rx", 6)
    .attr("ry", 6);
}

const drawLegend = (svg: any, svgWidth: number) => {
  const g = svg.append('g');

  const node = [
    {x: 20, y: 0, r: 16, fill: '#CCFFDD'},
    {x: svgWidth / 3, y: 0, r: 16, fill: '#CCFFDD'},
    {x: svgWidth / 3 * 2, y: 0, r: 16, fill: '#CCFFDD'},
  ]
  // Legend 1: current chain
  const node1 = g.append('g');
  node1.append('rect')
    .attr("width", 36)
    .attr("height", 24)
    .attr('fill', '#CCFFDD')
    .attr('x', 5)
    .attr('y', 0)
    .attr("rx", 10)
    .attr("ry", 10);

  node1.append('rect')
    .attr("width", 36)
    .attr("height", 20)
    .attr('fill', '#f5f5f5')
    .attr('x', 5)
    .attr('y', 0)
    .attr("rx", 8)
    .attr("ry", 8);

  node1.append('text')
    .attr('class', 'text-sm')
    .attr('x', 5 + 44)
    .attr('y', 18)
    .text('current chain')

  // Legend2: selected node
  const node2 = g.append('g');
  node2.append('rect')
    .attr('class', 'drop-shadow-md')
    .attr("width", 36)
    .attr("height", 24)
    .attr('fill', '#f5f5f5')
    .attr('x', svgWidth / 3 + 10)
    .attr('y', 0)
    .attr("rx", 10)
    .attr("ry", 10);

  node2.append('text')
    .attr('class', 'text-sm')
    .attr('x', svgWidth / 3 + 10 + 44)
    .attr('y', 18)
    .text('selected node')

  // Legend3: selected node
  const node3 = g.append('g');
  node3.append('rect')
    .attr("width", 36)
    .attr("height", 24)
    .attr('fill', '#f5f5f5')
    .attr('x', svgWidth / 3 * 2)
    .attr('y', 0)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr('stroke', '#8BBD9E')
    .attr('stroke-width', 1.5);

  node3.append('text')
    .attr('class', 'text-sm')
    .attr('x', svgWidth / 3 * 2 + 44)
    .attr('y', 18)
    .text('highlighted node')
}