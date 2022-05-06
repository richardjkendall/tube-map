import React, { useEffect } from "react";
import * as d3 from "d3";

const PointOnCircle = (radius, theta, centre = {x: 0, y: 0}) => {
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

    svg.append("circle")
      .style("stroke", "grey")
      .style("stroke-width", 1)
      .style("fill", "none")
      .attr("r", 40)
      .attr("cx", 100)
      .attr("cy", 100);
    
    let circlePoint = PointOnCircle(40, 90, {x: 100, y: 100});
    console.log(circlePoint);
    svg.append("line")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr("x1", 100)
      .attr("y1", 100)
      .attr("x2", circlePoint[0])
      .attr("y2", circlePoint[1]);

    /*
    svg.append('line')
      .style("stroke", "darkblue")
      .style("stroke-width", 8)
      .attr("x1", 10)
      .attr("y1", 100)
      .attr("x2", 100)
      .attr("y2", 100);
    */

    let arc = d3.arc()
      .innerRadius(20)
      .outerRadius(20)
      .startAngle(Math.PI/1.5)
      .endAngle(Math.PI);

    svg.append("path")
      .attr("d", arc)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("transform", "translate(100,80)");
    
    
    /*
    let coords = PointOnCircle(50, 45)
    console.log(coords);
    svg.append('line')
      .style("stroke", "darkblue")
      .style("stroke-width", 8)
      .attr("x1", 50)
      .attr("y1", 50)
      .attr("x2", coords[0])
      .attr("y2", coords[1]);

    /*
    svg.append('line')
      .style("stroke", "darkblue")
      .style("stroke-width", 8)
      .attr("x1", 117)
      .attr("y1", 90)
      .attr("x2", 137)
      .attr("y2", 60);
    */

  }, [data]); 
 
  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};
 
export default Map;