// Simulated data loading function - replace with actual data loading logic
d3.json('data/Spotify.json').then(function(data) {
    let genreCounts = {};
    let genrePopularity = {};
    let genreAttributes = {};

    data.forEach(d => {
        d.genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            genrePopularity[genre] = (genrePopularity[genre] || 0) + d.popularity;
            if (!genreAttributes[genre]) {
                genreAttributes[genre] = { danceability: 0, energy: 0, count: 0 };
            }
            genreAttributes[genre].danceability += d.danceability;
            genreAttributes[genre].energy += d.energy;
            genreAttributes[genre].count++;
        });
    });

    Object.keys(genrePopularity).forEach(key => {
        genrePopularity[key] /= genreCounts[key];
        genreAttributes[key].danceability /= genreAttributes[key].count;
        genreAttributes[key].energy /= genreAttributes[key].count;
    });

    createPieChart(genreCounts);
    createBarChart(genrePopularity);
    createBubbleChart(genreAttributes);
});

function createPieChart(data) {
    var data = [{
        values: Object.values(data),
        labels: Object.keys(data),
        type: 'pie'
    }];

    var layout = {
        height: 400,
        width: 500,
        title: 'Distribution of Songs by Genre'
    };

    Plotly.newPlot('genrePieChart', data, layout);
}

function createBarChart(data) {
    var data = [{
        x: Object.keys(data),
        y: Object.values(data),
        type: 'bar'
    }];

    var layout = {
        title: 'Average Popularity by Genre',
        xaxis: { title: 'Genre' },
        yaxis: { title: 'Average Popularity' }
    };

    Plotly.newPlot('genreBarChart', data, layout);
}

function createBubbleChart(data) {
    var trace = {
        x: Object.values(data).map(d => d.danceability),
        y: Object.values(data).map(d => d.energy),
        text: Object.keys(data),
        mode: 'markers',
        marker: {
            size: Object.values(data).map(d => d.count),
            sizemode: 'area',
            sizeref: 2 * Math.max(...Object.values(data).map(d => d.count)) / (40**2),
            color: Object.values(data).map(d => d.energy)
        }
    };

    var layout = {
        title: 'Genres by Danceability and Energy',
        xaxis: { title: 'Danceability' },
        yaxis: { title: 'Energy' },
        showlegend: false
    };

    Plotly.newPlot('genreBubbleChart', [trace], layout);
}
