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
            automargin: true,
            dtick: 10
        },
        margin: {t: 30, r: 30, b: 100, l: 100},
        hovermode: 'closest',
        bargap: 0.1, // Increase the gap between bars if needed
        width: 1200, // Increased width
        height: 600 // Increased height
    };

    Plotly.newPlot('top50', [trace], layout);
}

// Function to draw a radial plot using Plotly
function drawRadialPlot(data) {
    // Prepare the data for the radial plot

     // Initialize sums
    var sums = {
        danceability: 0,
        valence: 0,
        energy: 0,
        loudness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        speechiness: 0
    };

    // Sum up all attributes
    data.forEach(track => {
        sums.danceability += track.danceability;
        sums.valence += track.valence;
        sums.energy += track.energy;
        sums.acousticness += track.acousticness;
        sums.instrumentalness += track.instrumentalness;
        sums.liveness += track.liveness;
        sums.speechiness += track.speechiness;
    });

    // Calculate averages
    var averages = {
        danceability: sums.danceability / data.length,
        valence: sums.valence / data.length,
        energy: sums.energy / data.length,
        acousticness: sums.acousticness / data.length,
        instrumentalness: sums.instrumentalness / data.length,
        liveness: sums.liveness / data.length,
        speechiness: sums.speechiness / data.length
    };

    var trace = {
        type: 'scatterpolar',
        r: [
            averages.danceability,
            averages.valence,
            averages.energy,
            averages.acousticness,
            averages.instrumentalness,
            averages.liveness,
            averages.speechiness
        ],
        theta: [
            'Danceability',
            'Valence',
            'Energy',
            'Acousticness',
            'Instrumentalness',
            'Liveness',
            'Speechiness'
        ],
        fill: 'toself',
        name: 'Track Attributes'
    };

    var layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1] // Adjust the range based on your data or keep it [0, 1] for normalized data
            }
        },
    };

    Plotly.newPlot('disbn', [trace], layout);
}

// Load data and use it
d3.json("data/Spotify.json").then(function(data) {
    // Call the function to draw the bar plot using Plotly
    drawBarPlotWithPlotly(data);
    drawRadialPlot(data);
});
