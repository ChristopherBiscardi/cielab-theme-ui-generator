/** @jsx jsx */
import React, { useEffect, useRef } from "react";
import { jsx } from "theme-ui";
import { scaleLinear } from "d3-scale";
import { line as d3line, curveMonotoneX } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { hsluvToHex, hpluvToHex, hexToHsluv, hexToHpluv } from "hsluv";


export default ({
  width: propsWidth,
  height: propsHeight,
  dataset,
  title,
  yDomainMax,
  colorArray = [],
  ...props
}) => {
  const lineGraphEl = useRef(null);

  useEffect(() => {
    lineGraphEl.current.innerHTML = "";
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = propsWidth - margin.left - margin.right; // Use the window's width
    const height = propsHeight - margin.top - margin.bottom; // Use the window's height

    const n = dataset.length;

    // 5. X scale will use the index of our data
    var xScale = scaleLinear()
      .domain([0, n - 1]) // input
      .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = scaleLinear()
      .domain([0, yDomainMax]) // input
      .range([height, 0]); // output

    // 7. d3's line generator
    var line = d3line()
      .x(function(d, i) {
        // console.log(xScale(i));
        return xScale(i);
      }) // set the x values for the line generator
      .y(function(d) {
        return yScale(d.y);
      }) // set the y values for the line generator
      .curve(curveMonotoneX); // apply smoothing to the line

    // 1. Add the SVG to the page and employ #2
    var svg = select(lineGraphEl.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg
      .append("g")
      .attr("class", "y axis")
      .call(axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    // console.group("line");
    svg
      .append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

    // console.groupEnd("line");

    // 12. Appends a circle for each datapoint
    svg
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) {
        return xScale(i);
      })
      .attr("cy", function(d) {
        return yScale(d.y);
      })
      .attr("r", 5)
      .on("mouseover", function(a, b, c) {
        console.log(a);
        // this.attr("class", "focus");
      })
      .on("mouseout", function() {});
  });

  return (
    <div>
      <h3>{title}</h3>
      <div
        sx={{
          "& .line": {
            fill: "none",
            stroke: hpluvToHex(colorArray[0]),
            strokeWidth: 3
          },

          "& .overlay": {
            fill: "none",
            pointerEvents: "all"
          },
          ...colorArray
            .map((color, i) => ({
              [`& circle:nth-of-type(${i + 1})`]: {
                fill: hpluvToHex(color)
              }
            }))
            .reduce((acc, obj) => ({ ...acc, ...obj }), {}),
          /* Style the dots by assigning a fill and stroke */
          "& .dot": {
            // fill: "#ffab00",
            stroke: "#fff"
          },

          "& .focus circle": {
            fill: "none",
            stroke: "steelblue"
          }
        }}
        {...props}
        ref={lineGraphEl}
      />
    </div>
  );
};
