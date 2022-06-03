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

const DrawBranch = (svg, start, direction, length, height, width, colour, debug = false) => {
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


  // find the length of the line based on a*a = b*b + c*c
  // b = segment length
  // c = branch height
  let hyp = Math.sqrt(length*length + height*height);
  console.log("hypotenuse = ", hyp);
  let arcTriangleB = Math.max(start.x, startOfBranchLine[0]) - Math.min(start.x, startOfBranchLine[0]);
  let arcTriangleC = Math.max(start.y, startOfBranchLine[1]) - Math.min(start.y, startOfBranchLine[1]);
  let arcHyp = Math.sqrt(arcTriangleB*arcTriangleB, arcTriangleC*arcTriangleC);
  console.log("arc hypotenuse = ", arcHyp);

  let endOfBranchLine = PointOnCircle(hyp - (arcHyp * 2), direction === "up" ? 135 : 45, {x: startOfBranchLine[0], y: startOfBranchLine[1]});
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

const DrawStation = (svg, position, text, width, textAnchor = "top", fill = null) => {
  let radius = width * 2;

  const tooltip = svg.select(".tooltip");

  const mouseover = (event, d) => {
    console.log("tooltip", tooltip);
    tooltip.style("opacity", 1);
    tooltip.raise();
  };

  const mouseleave = (event, d) => {
    //tooltip.style('opacity', 0);
  }

  const mousemove = (event, d) => {
    //const text = d3.select('.tooltip-area__text');
    //text.text(`Sales were ${d.sales} in ${d.year}`);
    const [x, y] = d3.pointer(event);
    //console.log("x", x, "y", y);
    tooltip.attr('transform', `translate(${x}, ${y})`);
  };

  svg.append("circle")
    .style("stroke", "black")
    .style("stroke-width", width / 2)
    .style("fill", fill === null ? "white" : fill)
    .attr("r", radius)
    .attr("cx", position.x + radius)
    .attr("cy", position.y)
    //.on("mousemove", mousemove)
    //.on("mouseleave", mouseleave)
    //.on("mouseover", mouseover);
  
  let textAnchorX = position.x + radius + (width / 2);
  let textAnchorY = position.y - radius - (width / 2);
  if(textAnchor === "bottom") {
    textAnchorY = position.y + width + (width / 2) + 12;
  }

  svg.append("text")
    .attr("style", "font-size: 8pt")
    .attr("text-anchor", textAnchor === "top" ? "start" : "end")
    .attr("transform", `translate(${textAnchorX},${textAnchorY}) rotate(315)`)
    .text(text)
}

const DrawBranchName = (svg, position, text, colour, rotate = "none") => {
  svg.append("text")
    .attr("style", "font-size: 8pt; font-weight: bold;")
    .attr("fill", colour)
    .attr("text-anchor", "start")
    .attr("transform", `translate(${position.x},${position.y}) rotate(${rotate === "up" ? 315 : rotate === "down" ? 45 : 0})`)
    .text(text)
}

const LINE_WIDTH = 6;
const START_X = 40;
const SEGMENT_LENGTH = 50;
const BRANCH_HEIGHT = 80;

const Map = ({ data, dimensions, debug = false }) => {
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
    
    // add the tooltip
    /*
    let tt = svg.append("g")
      .attr("class", "tooltip");
    tt.append("rect")
      .attr("fill", "red")
      .attr("height", 30)
      .attr("width", 100);
    tt.append("text")
      .attr("class", "tooltip__text")
      .attr("style", "font-size: 10pt; color: black;")
      .text("testing");
      */

    // draw grid to help
    debug && DrawGrid(svg, 20, width, height);

    // get start point
    let startY = 0;
    let numberOfBranches = Object.entries(data.branches).length;
    console.log("Number of branches", numberOfBranches);
    if(numberOfBranches % 2 === 1) {
      // number of branches is odd so midpoint is 1/2
      let mid = height / 2;
      startY = mid - (((numberOfBranches - 1) / 2) * LINE_WIDTH);
    } else {
      let mid = (height / 2) - (LINE_WIDTH / 2);
      startY = mid - ((numberOfBranches / 2) * LINE_WIDTH);
    }
    console.log("Start Y will be", startY);

    let stations = [];
    let lastStationX = 0;

    Object.entries(data.branches).forEach(b => {
      const branch = b[1];
      const colour = branch.colour;
      let startX = START_X;
      const seq = branch.seq.split(",");
      let textDir = 0;
      let firstBranch = true;
      seq.forEach((s, i) => {
        switch(s) {
          case "-":
            // draw straight line segment
            DrawSimpleLine(svg, {x: startX, y: startY}, {x: startX + SEGMENT_LENGTH, y: startY}, LINE_WIDTH, colour);
            startX += SEGMENT_LENGTH;
            break;
          case "/":
            // draw 'up' branch
            let upEnd = DrawBranch(svg, {x: startX, y: startY}, "up", SEGMENT_LENGTH, BRANCH_HEIGHT, LINE_WIDTH, colour, debug);
            // we need to label the branch, and this is a good place to do it
            if(firstBranch && branch?.name) {
              DrawBranchName(svg, {x: startX + LINE_WIDTH, y: startY - LINE_WIDTH}, branch.name, colour, "up");
              firstBranch = false;
            }
            startX = upEnd[0];
            startY = upEnd[1];
            textDir += 1;
            break;
          case "\\":
            // draw 'down' branch
            let downEnd = DrawBranch(svg, {x: startX, y: startY}, "down", SEGMENT_LENGTH, BRANCH_HEIGHT, LINE_WIDTH, colour, debug);
            // we need to label the branch, and this is a good place to do it
            if(firstBranch && branch?.name) {
              DrawBranchName(svg, {x: startX, y: startY + LINE_WIDTH*2}, branch.name, colour, "down");
              firstBranch = false;
            }
            startX = downEnd[0];
            startY = downEnd[1];
            textDir -= 1;
            break;
          case " ":
            // no line, just move x along
            startX += SEGMENT_LENGTH;
            break;
          case "$":
            // don't do anything, this symbol indicates the end of the flow
            break;
          default:
            // this is a milestone
            // check if it is the terminal milestone (next seq value should be $)
            let noLine = false;
            if(i + 1 < seq.length) {
              if(seq[i+1] === "$") {
                noLine = true;
              }
            }
            !noLine && DrawSimpleLine(svg, {x: startX, y: startY}, {x: startX + SEGMENT_LENGTH, y: startY}, LINE_WIDTH, colour);
            // get milestone
            let m = data.milestones[s];
            console.log("got milestone", m, "text dir", textDir);
            stations.push({
              pos: {x: startX, y: startY},
              name: m.name,
              dir: textDir < 0 ? "bottom" : "top",
              colour: m?.colour
            });
            startX += SEGMENT_LENGTH;
        }
      })
      // if we get here and the firstbranch is still true then we've not labelled the track
      if(branch?.name && firstBranch) {
        // not sure how to do this yet, so just do a hack job
        DrawBranchName(svg, {x: SEGMENT_LENGTH*2.5, y: startY - (LINE_WIDTH + 1)}, branch.name, colour);
      }
      startY += LINE_WIDTH;
    })

    lastStationX = stations.reduce((p, s) => {
      return Math.min(p, s.pos.x);
    }, stations[0].pos.x);

    stations.forEach(s => {
      let offset = s.pos.x === lastStationX ? 10 : 0;
      DrawStation(svg, {x: s.pos.x - offset, y: s.pos.y}, s.name, LINE_WIDTH, s.dir, s.colour);
    })

  }, [data]); 
 
  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};
 
export default Map;