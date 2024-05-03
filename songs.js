// Function to draw bar plot using Plotly
function drawBarPlotWithPlotly(data) {

    const maxPopularity = Math.max(...data.map(d => d.popularity));
    const colors = data.map(d => {
        const normalizedPopularity = d.popularity / maxPopularity;
        return `rgba(${255 * (1 - normalizedPopularity)}, ${255 * normalizedPopularity}, 100, 0.7)`;
    });


    var trace = {
        x: data.map(d => d.track_name),
        y: data.map(d => d.popularity),
        text: data.map(d => `Artist: ${d.artist_name}<br>Release Date: ${d.album_release_date}`),
        type: 'bar',
        marker: {color: colors}
    };

    var layout = {
        xaxis: {
            tickangle: -45,
            automargin: true
        },
        yaxis: {
            title: 'Popularity',
            type: 'linear', // Change to 'log' if needed: type: 'log'
            automargin: true
        },
        margin: {t: 30, r: 30, b: 100, l: 100},
        hovermode: 'closest',
        bargap: 0.1, // Increase the gap between bars if needed
        width: 1200, // Increased width
        height: 600 // Increased height
    };

    Plotly.newPlot('visualization', [trace], layout);
}

// Load data and use it
d3.json("data/Spotify.json").then(function(data) {
    // Call the function to draw the bar plot using Plotly
    drawBarPlotWithPlotly(data);
});
