// Function to initialize the plot and dropdown
function initializePlot(data) {
    const uniqueArtists = [...new Set(data.map(item => item.artist_name))];

    const select = document.getElementById('artistSelector');
    // Adding default dropdown option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerHTML = "Choose an Artist";
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Add artist options to dropdown
    uniqueArtists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.innerHTML = artist;
        select.appendChild(option);
    });

    drawPlot(data, null); // Draw plot without any selection

    // Event listener for dropdown changes
    select.addEventListener('change', function() {
        if (this.value === "") {
            drawPlot(data, null); // No artist selected, draw without highlights
        } else {
            drawPlot(data, this.value); // Draw plot with the selected artist highlighted
        }
    });
}

// Function to draw or update the plot
function drawPlot(data, selectedArtist) {
    const traces = [];
    data.forEach(d => {
        traces.push({
            x: [d.track_name],
            y: [d.popularity],
            name: d.artist_name,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: d.artist_name === selectedArtist ? 'red' : 'blue',
                size: d.artist_name === selectedArtist ? 12 : 6
            }
        });
    });

    var layout = {
        xaxis: {
            tickangle: -45,
            automargin: true,
            tickfont: {
                size: 12 // Adjust font size if necessary
            }
        },
        yaxis: {title: 'Popularity'},
        showlegend: false,
        margin: {t: 30, r: 30, b: 100, l: 100},
        height: 800, // Same height for good visualization
        width: 1400
         // Adjust left, right, top, and bottom margins // Increased width for a wider view
    };

    Plotly.newPlot('plot', traces, layout);
}

function initializeDropdown(genreList) {
    const select = document.getElementById('genreSelector');
    genreList.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
    });

    // Event listener for dropdown changes
    select.addEventListener('change', function() {
        if (this.value === "Choose a genre") {
            Plotly.newPlot('pieChartContainer', []); // Clear the plot
        } else {
            updatePieChart(this.value);
        }
    });
}

function updatePieChart(genre) {
    const filteredData = data.filter(item => item.genres.includes(genre));
    const counts = filteredData.reduce((acc, item) => {
        acc[item.artist_name] = (acc[item.artist_name] || 0) + 1;
        return acc;
    }, {});

    const pieData = [{
        values: Object.values(counts),
        labels: Object.keys(counts),
        type: 'pie'
    }];

    const layout = {
        title: `${genre} Genre Distribution`,
        height: 400,
        width: 500
    };

    Plotly.newPlot('pieChartContainer', pieData, layout);
}

function drawArtistCountVsPopularity(data) {
    // Create a map to store total popularity and count of tracks for each artist count
    let popularityMap = {};

    // Aggregate popularity scores and count of entries for each artist count
    data.forEach(track => {
        let artistCount = track.artist_count;
        let popularity = track.popularity;
        if (popularityMap[artistCount]) {
            popularityMap[artistCount].total += popularity;
            popularityMap[artistCount].count += 1;
        } else {
            popularityMap[artistCount] = { total: popularity, count: 1 };
        }
    });

    // Calculate the average popularity for each artist count
    let averages = [];
    Object.keys(popularityMap).forEach(artistCount => {
        let avg = popularityMap[artistCount].total / popularityMap[artistCount].count;
        averages.push({
            artistCount: artistCount,
            averagePopularity: avg
        });
    });

    // Sort averages by artist count (assuming artist count is numeric)
    averages.sort((a, b) => a.artistCount - b.artistCount);

    // Prepare the trace for Plotly
    var trace = {
        x: averages.map(item => item.artistCount),
        y: averages.map(item => item.averagePopularity),
        type: 'scatter',  // 'bar' for bar chart, 'scatter' for line chart with mode set to 'lines+markers'
        mode: 'lines+markers', // This line is used if type is 'scatter'
        marker: {
            color: 'rgb(55, 128, 191)',
            size: 8
        },
        line: {
            color: 'rgb(55, 128, 191)'
        }
    };

    var layout = {
        title: 'Average Popularity vs. Artist Count',
        xaxis: {
            title: 'Artist Count',
            type: 'category' // Change to 'linear' if artist counts are numeric and a non-categorical display is desired
        },
        yaxis: {
            title: 'Average Popularity'
        },
        margin: { t: 40, r: 30, b: 50, l: 50 }
    };

    // Render the plot
    Plotly.newPlot('plotDiv', [trace], layout);
}


// Load data and setup
d3.json("data/Spotify.json").then(function(data) {
    initializePlot(data);
    initializeDropdown(data);
    drawArtistCountVsPopularity(data);
});
