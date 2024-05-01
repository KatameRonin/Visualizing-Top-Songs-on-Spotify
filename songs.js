document.addEventListener('DOMContentLoaded', function() {
    // Load data from Spotify.json
    d3.json("/data/Spotify.json").then(function(data) {
        // Populate dropdown with song names
        var dropdown = d3.select("#selDataset");
        data.forEach((song) => {
            dropdown.append("option")
                    .text(song.track_name)
                    .attr("value", song.popularity);
        });

        // Create a bar plot
        var trace = {
            x: data.map(song => song.name),
            y: data.map(song => song.popularity),
            text: data.map(song => `Artist: ${song.artist} <br> Popularity: ${song.popularity}`),
            type: 'bar',
            marker: {
                color: '#17BECF'
            },
            hoverinfo: 'text+y'
        };

        var layout = {
            title: 'Popularity of Top 50 Songs on Spotify',
            xaxis: {
                title: 'Songs',
                tickangle: -45
            },
            yaxis: {
                title: 'Popularity'
            },
            margin: {
                b: 150 // Ensure x-axis labels are visible
            }
        };

        Plotly.newPlot('bar', [trace], layout);
    }).catch(function(error) {
        console.error('Error loading the data:', error);
    });
});
