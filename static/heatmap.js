$.getJSON("data/heatmap.json", function (data) {
    console.log(data);
    Highcharts.chart('heatmap', {

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },


        title: {
            text: 'Landslide Week Heatmap'
        },

        xAxis: {
        },

        yAxis: {
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.2, '#fffbbc'],
                [0.4, '#c4463a'],
                [1, '#551e19']
            ],
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },

        series: [{
            name: 'Number of Landslides',
            borderWidth: 1,
            data: data,
        }],


    });
});