$.getJSON("data/map.json", function (data) {

    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
                        [x, -90],
                        [x, 0],
                        [x, 90]
                    ] : [
                        [x, -80],
                        [x, 80]
                    ]
                }
            });
        }

        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates
                },
                lineWidth: y === 0 ? 2 : undefined
            });
        }

        return data;
    };

    Highcharts.getJSON(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@2e11000c966a20f08afc4e0927b91df99821de99/samples/data/world-countries.topo.json',
        topology => {

            // Convert the topoJSON feature into geoJSON
            const geojson = window.topojson.feature(
                topology,
                // For this demo, get the first of the named objects
                topology.objects[Object.keys(topology.objects)[0]]
            );
            geojson.copyrightUrl = topology.copyrightUrl;
            geojson.copyrightShort = topology.copyrightShort;

            const chart = Highcharts.mapChart('world-map', {
                chart: {
                    map: geojson
                },

                title: {
                    text: 'Landslide by Country',
                    floating: true,
                    align: 'left',
                    style: {
                        textOutline: '2px white'
                    }
                },

                subtitle: {
                    text: 'Source: <a href="http://www.citypopulation.de/en/world/bymap/airports/">citypopulation.de</a><br>' +
                        'Click and drag to rotate globe<br>',
                    floating: true,
                    y: 34,
                    align: 'left'
                },

                legend: {
                    enabled: false
                },

                mapNavigation: {
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                mapView: {
                    maxZoom: 30,
                    projection: {
                        name: 'Orthographic',
                        rotation: [60, -30]
                    }
                },

                colorAxis: {
                    tickPixelInterval: 100,
                    minColor: '#BFCFAD',
                    maxColor: '#31784B',
                    max: 1000
                },

                tooltip: {
                    pointFormat: '{point.name}: {point.value}'
                },

                plotOptions: {
                    series: {
                        animation: {
                            duration: 750
                        },
                        clip: false
                    }
                },

                series: [{
                    name: 'Graticule',
                    id: 'graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    nullColor: 'rgba(0, 0, 0, 0.05)'
                }, {
                    data,
                    joinBy: 'name',
                    name: 'Landslides',
                    states: {
                        hover: {
                            color: '#a4edba',
                            borderColor: '#333333'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}'
                    },
                }]
            });

            // Render a circle filled with a radial gradient behind the globe to
            // make it appear as the sea around the continents
            const renderSea = () => {
                let verb = 'animate';
                if (!chart.sea) {
                    chart.sea = chart.renderer
                        .circle()
                        .attr({
                            fill: {
                                radialGradient: {
                                    cx: 0.4,
                                    cy: 0.4,
                                    r: 1
                                },
                                stops: [
                                    [0, 'white'],
                                    [1, 'lightblue']
                                ]
                            },
                            zIndex: -1
                        })
                        .add(chart.get('graticule').group);
                    verb = 'attr';
                }

                const bounds = chart.get('graticule').bounds,
                    p1 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x1,
                        y: bounds.y1
                    }),
                    p2 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x2,
                        y: bounds.y2
                    });
                chart.sea[verb]({
                    cx: (p1.x + p2.x) / 2,
                    cy: (p1.y + p2.y) / 2,
                    r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
                });
            };
            renderSea();
            Highcharts.addEvent(chart, 'redraw', renderSea);

        }
    );
});