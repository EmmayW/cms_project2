window.onload = function() {
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    
    // Append the SVG object to the body of the page
    const svg = d3.select("#bubble-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Load the data
    d3.json("../data/samplepollution.json", function (error, data) {
      if (error) {
        console.error("Error loading or parsing data:", error);
        return;
      }
    
      // Check if the data is an array and contains objects
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    
        // Process the data
        const bubbleData = data.map(d => ({
          x: d.components.co,        // Use CO as x-axis data
          y: d.components.pm2_5,     // Use PM2.5 as y-axis data
          size: d.main.aqi,          // Use AQI as bubble size
          color: d.components.o3     // Use O3 as bubble color
        }));
    
        // Add X axis
        const x = d3.scaleLinear()
          .domain([0, d3.max(bubbleData, d => d.x)])
          .range([0, width]);
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));
    
        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(bubbleData, d => d.y)])
          .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));
    
        // Add a scale for bubble size
        const z = d3.scaleSqrt()
          .domain([0, d3.max(bubbleData, d => d.size)])
          .range([0, 40]);
    
        // Add a scale for bubble color
        const color = d3.scaleSequential()
          .domain([0, d3.max(bubbleData, d => d.color)])
          .interpolator(d3.interpolateViridis);
    
        // Add bubbles
        svg.append('g')
          .selectAll("dot")
          .data(bubbleData)
          .enter()
          .append("circle")
          .attr("cx", d => x(d.x))
          .attr("cy", d => y(d.y))
          .attr("r", d => z(d.size))
          .style("fill", d => color(d.color))
          .style("opacity", "0.7")
          .attr("stroke", "black");
    
      } else {
        console.error("Data format is incorrect. Ensure data is an array of objects.");
      }
    });
    
    };
    