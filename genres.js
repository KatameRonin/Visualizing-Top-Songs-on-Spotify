// Function to preprocess and aggregate data by genre
function preprocessData(data) {
    let genreInfo = {};

    data.forEach(song => {
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

    // Calculate averages
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
        title: 'Number of Songs per Genre',
        xaxis: { title: 'Genre' },
        yaxis: { title: 'Number of Songs' },
        margin: { t: 30, l: 150, r: 30, b: 150 },
        automargin: true
    };

    Plotly.newPlot('songsPerGenre', data, layout);
}

// Draw Bubble Chart for total popularity by genre
function drawPopularityByGenreChart(genreInfo) {
    const data = [{
        x: Object.keys(genreInfo),
        y: Object.values(genreInfo).map(info => info.totalPopularity),
        mode: 'markers',
        marker: {
            size: Object.values(genreInfo).map(info => info.count),
            sizemode: 'area',
            sizeref: 0.1,
            color: Object.values(genreInfo).map(info => info.totalPopularity),
            colorscale: 'Portland'
        },
        text: Object.keys(genreInfo)
    }];

    const layout = {
        title: 'Total Popularity by Genre',
        xaxis: { title: 'Genre' },
        yaxis: { title: 'Total Popularity' },
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
        },
        title: 'Average Attributes by Genre'
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
