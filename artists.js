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
        bargap: 0.1,
        margin: {t: 30, r: 30, b: 100, l: 100},
    };

    Plotly.newPlot('barChartContainer', [trace], layout);
}

// Load data and setup
d3.json("data/Spotify.json").then(function(data) {
    initializePlot(data);
    initializeDropdown(data);
    drawArtistCountVsPopularity(data);
});
