// Sample data
const ScatterJsonData = {
    "cols": [
        {
            "label": "Year starting on",
            "type": "date"
        },
        {
            "label": "High Temperature",
            "p": {
                "decimal_places": 1,
                "js_bar_function": "fb_normal",
                "js_enhance_function": "fe_normal",
                "js_format_function": "ff_temp1",
                "units": "°C"
            },
            "type": "number"
        }
    ],
    "rows": [
        { "c": [{ "v": [2024, 0, 1] }, { "v": 32.5 }] },
        { "c": [{ "v": [2023, 0, 1] }, { "v": 30.1 }] },
        { "c": [{ "v": [2022, 0, 1] }, { "v": 34.2 }] },
        { "c": [{ "v": [2021, 0, 1] }, { "v": 31.8 }] },
        { "c": [{ "v": [2020, 0, 1] }, { "v": 29.4 }] },
        { "c": [{ "v": [2019, 0, 1] }, { "v": 28.7 }] },
        { "c": [{ "v": [2018, 0, 1] }, { "v": 33.0 }] },
        { "c": [{ "v": [2017, 0, 1] }, { "v": 31.5 }] },
        { "c": [{ "v": [2016, 0, 1] }, { "v": 35.1 }] },
        { "c": [{ "v": [2015, 0, 1] }, { "v": 32.8 }] },
        { "c": [{ "v": [2014, 0, 1] }, { "v": 30.4 }] },
        { "c": [{ "v": [2013, 0, 1] }, { "v": 33.3 }] },
        { "c": [{ "v": [2012, 0, 1] }, { "v": 31.0 }] },
        { "c": [{ "v": [2011, 0, 1] }, { "v": 29.9 }] },
        { "c": [{ "v": [2010, 0, 1] }, { "v": 32.0 }] },
        { "c": [{ "v": [2009, 0, 1] }, { "v": 30.5 }] },
        { "c": [{ "v": [2008, 0, 1] }, { "v": 34.0 }] }
    ]
};

// Extract data from JSON
const scatterdata = ScatterJsonData.rows.map(row => ({
    year: new Date(row.c[0].v[0], row.c[0].v[1], row.c[0].v[2]),
    temperature: row.c[1].v
}));

// Set up dimensions and margins
const scatter_margin = { top: 20, right: 30, bottom: 40, left: 50 }
const scatter_width = 600 - scatter_margin.left - scatter_margin.right
const scatter_height = 500 - scatter_margin.top - scatter_margin.bottom

// Create SVG container
const scatter_svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
    .append("g")
    .attr("transform", `translate(${scatter_margin.left},${scatter_margin.top})`);

// Set up scales
const scatter_x = d3.scaleTime()
    .domain(d3.extent(scatterdata, d => d.year))
    .range([0, scatter_width]);

const scatter_y = d3.scaleLinear()
    .domain([0, d3.max(scatterdata, d => d.temperature)])
    .nice()
    .range([scatter_height, 0]);

// Create axes
scatter_svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${scatter_height})`)
    .call(d3.axisBottom(scatter_x))
    .selectAll("text")
    .style("fill", "black");

scatter_svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(scatter_y))
    .selectAll("text")
    .style("fill", "black");

// Create scatter plot points
scatter_svg.selectAll(".dot")
    .data(scatterdata)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => scatter_x(d.year))
    .attr("cy", d => scatter_y(d.temperature))
    .attr("r", 5)
    .style("fill", "steelblue")
    .style("stroke", "#fff")
    .style("stroke-width", "1.5px")
    .on("mouseover", function (event, d) {
        tooltip2.transition().duration(500).style("opacity", 0.9);
        tooltip2.html(`Year: ${event.year.getFullYear()}<br/>Temperature: ${event.temperature}°C`)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function (d) {
        tooltip2.transition().duration(500).style("opacity", 0);
    });
