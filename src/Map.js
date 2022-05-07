import React, { useEffect } from "react";
import * as d3 from "d3";

const DegToRad = (angle) => {
  return angle * (Math.PI / 180);
}

const PointOnCircle = (radius, theta, centre = {x: 0, y: 0}) => {
  theta = DegToRad(theta);
  return [
    (radius * Math.sin(theta)) + centre.x, 
    (radius * Math.cos(theta)) + centre.y
  ]
}

const DrawGrid = (svg, spacing, width, height) => {
  for(let x = 0;x <= width; x+=spacing) {
    svg.append("line")
      .style("stroke", "lightgrey")
      .style("stroke-width", 1)
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", height);
    
    svg.append("text")
      .attr("x", x+5)
      .attr("y", 13)
      .attr("style", "font-size: 8pt")
      .text(x/spacing)
  }

  for(let y = 0; y <= height; y+=spacing) {
    svg.append("line")
      .style("stroke", "lightgrey")
      .style("stroke-width", 1)
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", width)
      .attr("y2", y);
    
    if(y > 0) {
      svg.append("text")
        .attr("x", 5)
        .attr("y", y+13)
        .attr("style", "font-size: 8pt")
        .text(y/spacing)
    }
  }
}

const DrawSimpleLine = (svg, from, to, width, colour) => {
  svg.append("line")
    .style("stroke", colour)
    .style("stroke-width", width)
    .attr("x1", from.x)
    .attr("y1", from.y)
    .attr("x2", to.x)
    .attr("y2", to.y);
}

const DrawBranch = (svg, start, direction, length, width, colour, debug = false) => {
  const radius = width * 3; // per TFL standard

  let firstArcOrigin = [
    start.x,
    direction === "up" ? start.y - (radius + width/2 +0.5) : start.y + (radius + width/2 +0.5)
  ]

  // draw a helper cirle
  debug && svg.append("circle")
    .style("stroke", "grey")
    .style("stroke-width", 1)
    .style("fill", "none")
    .attr("r", radius)
    .attr("cx", firstArcOrigin[0])
    .attr("cy", firstArcOrigin[1]);
  
  // draw start of the branch
  let arc = d3.arc()
    .innerRadius(radius + 1)
    .outerRadius(radius + width)
    .startAngle(DegToRad(direction === "up" ? 180 : 0))
    .endAngle(DegToRad(direction === "up" ? 180-45 : 45))
  svg.append("path")
    .attr("d", arc)
    .attr("stroke", colour)
    .attr("stroke-width", 1)
    .attr("fill", colour)
    .attr("transform", `translate(${firstArcOrigin[0]},${firstArcOrigin[1]})`);
  
  // need to find point on circle that we are starting from
  let startOfBranchLine = PointOnCircle(radius + width/2 +0.5, direction === "up" ? 45 : 135, {x: firstArcOrigin[0], y: firstArcOrigin[1]});
  debug && DrawSimpleLine(svg, {x: firstArcOrigin[0], y: firstArcOrigin[1]}, {x: startOfBranchLine[0], y: startOfBranchLine[1]}, 1, colour);

  let endOfBranchLine = PointOnCircle(length, direction === "up" ? 135 : 45, {x: startOfBranchLine[0], y: startOfBranchLine[1]});
  DrawSimpleLine(svg, {x: startOfBranchLine[0], y: startOfBranchLine[1]}, {x: endOfBranchLine[0], y: endOfBranchLine[1]}, width, colour)

  debug && svg.append("circle")
    .style("stroke", "grey")
    .style("stroke-width", 1)
    .style("fill", "none")
    .attr("r", radius)
    .attr("cx", endOfBranchLine[0])
    .attr("cy", endOfBranchLine[1]);
  
  let secondArcOrigin = PointOnCircle(radius + width/2 + 0.5, direction === "up" ? 45 : 135, {x: endOfBranchLine[0], y: endOfBranchLine[1]});
  debug && DrawSimpleLine(svg, {x: endOfBranchLine[0], y: endOfBranchLine[1]}, {x: secondArcOrigin[0], y: secondArcOrigin[1]}, 1, colour);

  debug && svg.append("circle")
    .style("stroke", "grey")
    .style("stroke-width", 1)
    .style("fill", "none")
    .attr("r", radius)
    .attr("cx", secondArcOrigin[0])
    .attr("cy", secondArcOrigin[1]);
  
  // draw end of the branch
  let arc2 = d3.arc()
    .innerRadius(radius + 1)
    .outerRadius(radius + width)
    .startAngle(DegToRad(direction === "up" ? 360-45 : 180))
    .endAngle(DegToRad(direction === "up" ? 360 : 180 + 45))
  svg.append("path")
    .attr("d", arc2)
    .attr("stroke", colour)
    .attr("stroke-width", 1)
    .attr("fill", colour)
    .attr("transform", `translate(${secondArcOrigin[0]},${secondArcOrigin[1]})`);
  
  let endOfSecondArc = PointOnCircle(radius + width/2 + 0.5, direction === "up" ? 180 : 0, {x: secondArcOrigin[0], y: secondArcOrigin[1]});
  debug && DrawSimpleLine(svg, {x: secondArcOrigin[0], y: secondArcOrigin[1]}, {x: endOfSecondArc[0], y: endOfSecondArc[1]}, 1, colour);

  return endOfSecondArc;

}

const LINE_WIDTH = 5;

const Map = ({ data, dimensions }) => {
  const svgRef = React.useRef(null);

  const { width, height, margin } = dimensions;

  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
 
  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // draw grid to help
    DrawGrid(svg, 20, width, height);

    // intial track
    DrawSimpleLine(svg, {x: 40, y: 120}, {x: 100, y: 120}, LINE_WIDTH, "black");
    let end = DrawBranch(svg, {x: 100, y: 120}, "up", 40, LINE_WIDTH, "black");
    DrawSimpleLine(svg, {x: end[0], y: end[1]}, {x: end[0] + 60, y: end[1]}, LINE_WIDTH, "black");

    // second track
    DrawSimpleLine(svg, {x: 40, y: 125}, {x: 120, y: 125}, LINE_WIDTH, "red");
    end = DrawBranch(svg, {x: 120, y: 125}, "down", 40, LINE_WIDTH, "red");
    DrawSimpleLine(svg, {x: end[0], y: end[1]}, {x: end[0] + 60, y: end[1]}, LINE_WIDTH, "red");

  }, [data]); 
 
  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};
 
export default Map;