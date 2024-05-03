// Function to draw bar plot
function drawBarPlot(data) {
    // Increase dimensions and margins of the plot for better visibility
    const margin = {top: 30, right: 30, bottom: 100, left: 100},
        width = 1160 - margin.left - margin.right,  // Increased width
        height = 500 - margin.top - margin.bottom;  // Increased height

    // Append the SVG object to the body of the page
    const svg = d3.select("#visualization")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.track_name))
      .padding(0.2);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.popularity)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Tooltip div
    const tooltip = d3.select("#visualization").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background", 'lightgray')
      .style("padding", '5px')
      .style("position", 'absolute')
      .style("border-radius", '5px');

    // Bars


    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", d => x(d.track_name))
        .attr("y", d => y(d.popularity))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.popularity))
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            console.log(d);  // Log the data for the hovered element
            tooltip.html(`Track: ${d.track_name}<br>Artist: ${d.artist_name}<br>Release Date: ${d.album_release_date}<br>Popularity: ${d.popularity}`)
           .style("opacity", 1)
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 10) + "px");
})

        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        });
}

// Load data and use it
d3.json("data/Spotify.json").then(function(data) {
    // Call the function to draw the bar plot
    drawBarPlot(data);
});
