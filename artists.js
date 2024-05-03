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
            title: 'Track Name',
            tickangle: -45,
            automargin: true,
            tickfont: {
                size: 12 // Adjust font size if necessary
            }
        },
        yaxis: {title: 'Popularity'},
        showlegend: false,
        height: 800, // Same height for good visualization
        width: 1400,
        margin: {t: 30, r: 0, b: 100, l: 120} // Adjust left, right, top, and bottom margins // Increased width for a wider view
    };

    Plotly.newPlot('plot', traces, layout);
}

// Function to draw a pie chart for song distribution across artists
function drawArtistDistributionPieChart(data) {
    let artistCounts = data.reduce((acc, track) => {
        acc[track.artist_name] = (acc[track.artist_name] || 0) + 1;
        return acc;
    }, {});

    var data = [{
        labels: Object.keys(artistCounts),
        values: Object.values(artistCounts),
        type: 'pie',
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
    }];

    var layout = {
        height: 400,
        width: 400
    };

    Plotly.newPlot('pieChartContainer', data, layout);
}

function drawArtistCountVsPopularity(data) {
    // Calculate the number of songs per artist count
    let countMap = {};
    data.forEach(track => {
        let artistCount = track.artist_count;
        if (countMap[artistCount]) {
            countMap[artistCount].push(track.popularity);
        } else {
            countMap[artistCount] = [track.popularity];
        }
    });

    // Prepare data for the bar chart
    var trace = {
        x: Object.keys(countMap),
        y: Object.values(countMap).map(val => val.length),
        type: 'bar',
        marker: {
            color: 'blue' // You can choose any color
        },
        text: Object.values(countMap).map(val => val.length),
        textposition: 'auto',
    };

    var layout = {
        title: 'Number of Songs by Artist Count in Popularity List',
        xaxis: {
            title: 'Artist Count',
            type: 'category'
        },
        yaxis: {
            title: 'Number of Songs'
        },
        bargap: 0.1
    };

    Plotly.newPlot('barChartContainer', trace, layout);
}

// Load data and setup
d3.json("data/Spotify.json").then(function(data) {
    initializePlot(data);
    drawArtistDistributionPieChart(data);
});
