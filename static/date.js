$.getJSON("data/timeline.json", function (total) {
    $.getJSON("data/timeline-deaths.json", function (deaths) {
        total.forEach(function (d) {
            d[0] = Date.parse(d[0]);
        });

        deaths.forEach(function (d) {
            d[0] = Date.parse(d[0]);
        });


        Highcharts.chart('timeline', {
            chart: {
                type: 'spline',
                zoomType: 'x',
            },
            title: {
                text: 'Documented Land Slides 1988 - 2017'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Total Landslides'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %Y}: {point.y:.2f}'
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    }
                }
            },

            colors: ['#6CF', '#F00'],

            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            series: [{
                name: "Total Landslides",
                data: total
            }, {
                name: "Tota Deaths",
                data: deaths
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        plotOptions: {
                            series: {
                                marker: {
                                    radius: 2.5
                                }
                            }
                        }
                    }
                }]
            }
        });
    });
});