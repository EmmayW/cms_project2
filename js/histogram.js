// Anoop Krishnan Ramachandran
// Student ID: 8826078
const jsonData = {
    "cols": [
        {
            "label": "Year starting on",
            "type": "date"
        },
        {
            "label": "Total",
            "p": {
                "decimal_places": 1,
                "js_bar_function": "fb_normal",
                "js_enhance_function": "fe_normal",
                "js_format_function": "ff_snow1",
                "units": "cm"
            },
            "type": "number"
        }
    ],
    "rows": [
        { "c": [{ "v": [2024, 0, 1] }, { "v": 42 }] },
        { "c": [{ "v": [2023, 0, 1] }, { "v": 107 }] },
        { "c": [{ "v": [2022, 0, 1] }, { "v": 161 }] },
        { "c": [{ "v": [2021, 0, 1] }, { "v": 107 }] },
        { "c": [{ "v": [2020, 0, 1] }, { "v": 178 }] },
        { "c": [{ "v": [2019, 0, 1] }, { "v": 94 }] },
        { "c": [{ "v": [2018, 0, 1] }, { "v": 127 }] },
        { "c": [{ "v": [2017, 0, 1] }, { "v": 108.8 }] },
        { "c": [{ "v": [2016, 0, 1] }, { "v": 207.2 }] },
        { "c": [{ "v": [2015, 0, 1] }, { "v": 144.5 }] },
        { "c": [{ "v": [2014, 0, 1] }, { "v": 179.9 }] },
        { "c": [{ "v": [2013, 0, 1] }, { "v": 175.2 }] },
        { "c": [{ "v": [2012, 0, 1] }, { "v": 90.4 }] },
        { "c": [{ "v": [2011, 0, 1] }, { "v": 170.2 }] },
        { "c": [{ "v": [2010, 0, 1] }, { "v": 75.4 }] },
        { "c": [{ "v": [2009, 0, 1] }, { "v": 120 }] },
        { "c": [{ "v": [2008, 0, 1] }, { "v": 289.2 }] }
    ]
};

// Extract data from JSON
const data = jsonData.rows.map(row => ({
    year: new Date(row.c[0].v[0], row.c[0].v[1], row.c[0].v[2]).getFullYear(),
    snowfall: row.c[1].v
}));

// Set up dimensions and margins
const margin = { top: 20, right: 30, bottom: 40, left: 10 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#svg-div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const x = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.snowfall)])
    .nice()
    .range([height, 0]);

// Create axes
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", "white");

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", "white");

// Create bars with hover effect
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.snowfall))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.snowfall))
    .attr("fill", "white")
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "green");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "white");
    });

// Add labels
svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.year) + x.bandwidth() / 2)
    .attr("y", d => y(d.snowfall) - 5)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "10px")
    .text(d => d.snowfall);

// Set axis line colors to white
svg.selectAll(".x-axis path, .x-axis line")
    .style("stroke", "white");

svg.selectAll(".y-axis path, .y-axis line")
    .style("stroke", "white");
