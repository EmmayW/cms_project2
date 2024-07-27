/**
 * Description: This is designed for chart 2 (Pie chart of Temperature/humidity/pressure for 5 coming days)
 * Author:Emma(Yingying Wang/8903833)
 * Date: July 26
 */

// set the dimensions and margins of the graph
var donut_width = 480;
donut_height = 480;
donut_margin = 50;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var donut_radius = Math.min(donut_width, donut_height) / 2 - donut_margin;

// append the svg object to the div called 'my_dataviz'
var donut_svg = d3
  .select("#condition_donut_chart")
  .append("svg")
  .attr("width", donut_width)
  .attr("height", donut_height)
  .append("g")
  .attr("transform", "translate(" + donut_width / 2 + "," + donut_height / 2 + ")");

d3.json("./data/forcast.json", function (data) {
  let fiveDaysData = data.list.filter((d) => d.dt_txt.endsWith("15:00:00"));

  fiveDaysData.forEach((d) => {
    d.weatherType = d.weather[0].main;
  });

  let weatherCount = {};
  fiveDaysData.forEach((d) => {
    let type = d.weatherType;
    if (weatherCount[type]) {
      weatherCount[type]++;
    } else {
      weatherCount[type] = 1;
    }
  });

  var color = d3.scaleOrdinal().domain(Object.keys(weatherCount)).range(d3.schemeDark2);

  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    });

  var data_ready = pie(d3.entries(weatherCount));

  var arc = d3
    .arc()
    .innerRadius(donut_radius * 0.5)
    .outerRadius(donut_radius * 0.8);

  var outerArc = d3
    .arc()
    .innerRadius(donut_radius * 0.9)
    .outerRadius(donut_radius * 0.9);

  donut_svg
    .selectAll("allSlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d) {
      return color(d.data.key);
    })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(500).style("opacity", 0.9);
      tooltip
        .html("Type: " + event.data.key + "<br/>Count: " + event.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  donut_svg
    .selectAll("allPolylines")
    .data(data_ready)
    .enter()
    .append("polyline")
    .attr("stroke", "white")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      var posA = arc.centroid(d);
      var posB = outerArc.centroid(d);
      var posC = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      posC[0] = donut_radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return [posA, posB, posC];
    });

  donut_svg
    .selectAll("allLabels")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return d.data.key;
    })
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = donut_radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    })
    .style("fill", "white");
});
