// Function to preprocess and aggregate data by genre
function preprocessData(data) {
    let genreInfo = {};

    data.forEach(song => {
        // Convert the genres string to an array if it's not already one
        if (typeof song.genres === 'string') {
            song.genres = JSON.parse(song.genres.replace(/'/g, '"'));  // Replacing single quotes with double quotes for valid JSON
        }

        song.genres.forEach(genre => {
            if (!genreInfo[genre]) {
                genreInfo[genre] = {
                    count: 0,
                    totalPopularity: 0,
                    attributes: {
                        danceability: 0,
                        energy: 0,
                        valence: 0
                    }
                };
            }
            genreInfo[genre].count++;
            genreInfo[genre].totalPopularity += song.popularity;
            genreInfo[genre].attributes.danceability += song.danceability;
            genreInfo[genre].attributes.energy += song.energy;
            genreInfo[genre].attributes.valence += song.valence;
        });
    });

    // Calculate averages for attributes
    Object.keys(genreInfo).forEach(genre => {
        const attr = genreInfo[genre].attributes;
        const count = genreInfo[genre].count;
        attr.danceability /= count;
        attr.energy /= count;
        attr.valence /= count;
    });

    return genreInfo;
}


// Draw Bar Chart for number of songs per genre
function drawSongsPerGenreChart(genreInfo) {
    const data = [{
        x: Object.keys(genreInfo),
        y: Object.values(genreInfo).map(info => info.count),
        type: 'bar',
        marker: { color: 'rgba(50, 171, 96, 0.7)' }
    }];

    const layout = {
        xaxis: {
            tickangle: -45,
            automargin: true,
            tickfont: {
                size: 12 // Adjust font size if necessary
            }
        },
        yaxis: { title: 'Number of Songs' },
        margin: { t: 30, l: 150, r: 30, b: 150 },
        automargin: true
    };

    Plotly.newPlot('songsPerGenre', data, layout);
}

// Draw Bubble Chart for normalized total popularity by genre
function drawPopularityByGenreChart(genreInfo) {
    const data = [{
        x: Object.keys(genreInfo),
        y: Object.values(genreInfo).map(info => info.totalPopularity / info.count), // Normalize popularity per song
        mode: 'markers',
        marker: {
            size: Object.values(genreInfo).map(info => info.count),
            sizemode: 'area',
            sizeref: 2 * Math.max(...Object.values(genreInfo).map(info => info.count)) / (40**2),
            color: Object.values(genreInfo).map(info => info.totalPopularity / info.count),
            colorscale: 'Portland'
        },
        text: Object.keys(genreInfo).map(genre => `Avg popularity per song in ${genre}: ${(genreInfo[genre].totalPopularity / genreInfo[genre].count).toFixed(2)}`)
    }];

    const layout = {
        xaxis: {
            tickangle: -45,
            automargin: true,
            tickfont: {
                size: 12 // Adjust font size if necessary
            }
        },
        yaxis: { title: 'Normalized Popularity per Song' },
        margin: { t: 30, l: 100, r: 30, b: 150 }
    };

    Plotly.newPlot('popularityByGenre', data, layout);
}



// Draw Radar Chart for average attributes by genre
function drawAttributeRadarChart(genreInfo) {
    const data = Object.keys(genreInfo).map(genre => ({
        type: 'scatterpolar',
        name: genre,
        r: [
            genreInfo[genre].attributes.danceability,
            genreInfo[genre].attributes.energy,
            genreInfo[genre].attributes.valence
        ],
        theta: ['Danceability', 'Energy', 'Valence'],
        fill: 'toself'
    }));

    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        }
    };

    Plotly.newPlot('attributeByGenre', data, layout);
}

// Load data and generate visualizations
d3.json('data/Spotify.json').then(data => {
    const genreInfo = preprocessData(data);
    drawSongsPerGenreChart(genreInfo);
    drawPopularityByGenreChart(genreInfo);
    drawAttributeRadarChart(genreInfo);
});
