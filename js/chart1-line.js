/**
 * Description: This is designed for chart 1 (Line chart of Temperature/humidity/pressure for 5 coming days)
 * Author:Emma(Yingying Wang/8903833)
 * Date: July 26
 */
//show the current infomation
// let tooltip = d3.select("#tooltip");

// set the dimensions and margins of the graph
let line_margin = { top: 10, right: 100, bottom: 30, left: 50 },
  line_width = 460 - line_margin.left - line_margin.right,
  line_height = 400 - line_margin.top - line_margin.bottom;

// append the svg object to the body of the page
let line_svg = d3
  .select("#line-temperature-of-last-week")
  .append("svg")
  .attr("width", line_width + line_margin.left + line_margin.right)
  .attr("height", line_height + line_margin.top + line_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + line_margin.left + "," + line_margin.top + ")");

//Read the data
d3.json("./data/forcast.json", function (data) {
  // List of groups (here I have one group per column)
  let allGroup = ["Temperature", "Humidity", "Pressure"];
  // add the options to the button
  d3.select("#select_type_of_data")
    .selectAll("myOptions")
    .data(allGroup)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }); // corresponding value returned by the button

  let fiveDaysData = data.list.filter((d) => d.dt_txt.endsWith("15:00:00"));

  // Parse the date and temperature
  const formatDate = d3.timeFormat("%Y-%m-%d");
  fiveDaysData.forEach((d) => {
    d.date = new Date(d.dt * 1000);
    d.temp = +d.main.temp;
    d.pressure = +d.main.pressure;
    d.humidity = +d.main.humidity;
  });

  // Add X axis --> it is a date format
  let x = d3
    .scaleTime()
    .domain(
      d3.extent(fiveDaysData, (d) => {
        return d.date;
      })
    ) // Use the correct date field
    .range([0, line_width]);

  // Add the X Axis
  line_svg
    .append("g")
    .attr("transform", `translate(0,${line_height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([d3.min(fiveDaysData, (d) => d.temp) - 1, d3.max(fiveDaysData, (d) => d[getSelectAttr()]) + 1])
    .range([line_height, 0]);

  // Add the Y Axis
  line_svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y)).selectAll("text");
  //draw the line
  let line = line_svg
    .append("g")
    .append("path")
    .datum(fiveDaysData)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.temp);
        })
    )
    .attr("stroke", "black")
    .style("stroke-width", 4)
    .style("fill", "none");

  // Initialize dots
  let dot = line_svg
    .selectAll("circle")
    .data(fiveDaysData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.date);
    })
    .attr("cy", function (d) {
      return y(d.temp);
    })
    .attr("r", 5)
    .style("fill", "#0d6efd")
    //add mouseover event to display the current detail
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Date: " + formatDate(event.date) + "<br/>Value: " + event[getSelectAttr()])
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    //add mouseout event to hide the current detail tooltip
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  //get the dropdownlist value
  function getSelectAttr() {
    let selectedGroup = d3.select("#select_type_of_data").property("value");
    let attrSelected = "temp";
    // Temperature","Humidity","Pressure"
    switch (selectedGroup) {
      case "Humidity":
        attrSelected = "humidity";
        break;
      case "Pressure":
        attrSelected = "pressure";
        break;
      default:
        attrSelected = "temp";
        break;
    }
    return attrSelected;
  }
  // A function that update the chart
  function update() {
    let attrSelected = getSelectAttr();

    const y = d3
      .scaleLinear()
      .domain([d3.min(fiveDaysData, (d) => d[attrSelected]) - 1, d3.max(fiveDaysData, (d) => d[attrSelected]) + 1])
      .range([line_height, 0]);

    // Add the Y Axis
    line_svg.selectAll(".y-axis").remove();
    let y_axis = line_svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    if ("pressure" === attrSelected) {
      y_axis.selectAll("text").style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", "0.15em").attr("transform", "rotate(-45)");
    }

    // Give these new data to update line
    line
      .datum(fiveDaysData)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d[attrSelected]);
          })
      );
    dot
      .data(fiveDaysData)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d[attrSelected]);
      });
  }

  // // When the button is changed, run the updateChart function
  d3.select("#select_type_of_data").on("change", update);
});
