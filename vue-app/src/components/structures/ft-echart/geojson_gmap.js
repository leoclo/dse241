import _ from 'lodash';

function getPolygon(api, coords, bounds){
    let points = [];
    let is_visible = false;

    let point_pixel_ref = api.coord([0, 0])[0];
    for (let i = 0; i < coords.length; i++) {
        let point_pixel = api.coord(coords[i]);
        if(point_pixel[0] < point_pixel_ref && coords[i][0] > 0){
            continue;
        }

        if(point_pixel[0] > point_pixel_ref && coords[i][0] < 0){
            continue;
        }

        if(bounds){
            if(bounds.contains({lng: coords[i][0],lat: coords[i][1]})){
                is_visible = true;
            }
        }
        points.push(point_pixel);
    }

    if(!is_visible){
        return {
            type: 'polygon',
            shape: {
                points: []
            },
        };
    }

    // https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable


    let style = api.style();

    return {
        type: 'polygon',
        shape: {
            points: points
        },
        style: style,
        styleEmphasis: {
            shadowBlur: 4, fontWeight: 'bold',
        }
    }
}



export const dfToEchart = (data, gmap) => {
    let seriesData = data.data_order.map(n => { return {name: n}});

    let min = null;
    let max = null;
    data.df.forEach(row => {
        let val = parseInt(row[data.val_col]);
        if(val){
            if (min == null){ min = val};
            if (val < min){ min = val };
            if (max == null){ max = val};
            if (val > max){ max = val };
        }

        let ix = data.data_order.indexOf(row[data.level_col]);

        seriesData[ix] = {
            name: seriesData[ix].name,
            value: val,
            row: row
        }

    })

    const renderItem = (params, api) => {
        let bounds = gmap.getBounds();
        let children = [];

        data.chart_features[params.dataIndex].geometry.coordinates.forEach((coords, ix) => {
            if (data.chart_features[params.dataIndex].geometry.type === 'MultiPolygon') {
                coords.forEach(polygon_coords => {
                    children.push(getPolygon(api, polygon_coords, bounds));
                })
            }
            else{
                children.push(getPolygon(api, coords, bounds, 0));
            }
        });

        return {
            type: 'group',
            children: children
        }
    }

    let series = [{
        "type": "custom",
        'name': 'Piles',
        "coordinateSystem": "gmap",
        "silent": false,
        "animation": false,
        renderItem: renderItem,
        "itemStyle": {
            "opacity": 0.8,
            "borderWidth": 2,
            "borderColor": "#696969",
        },
        data: seriesData,
    }]

    return {
        visualMap: {
            itemHeight: 180,
            left: 'left',
            bottom: 22,
            calculable: true,
            show: true,
            orient: 'vertical',
            type: 'continuous',
            inRange: {
              "color": [
                "#fdc28c",
                "#fda762",
                "#fb8d3d",
                "#f2701d",
                "#e25609",
                "#c44103",
                "#9f3303",
                "#7f2704"
              ]
            },
            min: min,
            max: max
        },
        tooltip: {
            show: true,
            position: 'top',
            renderMode: 'html',
            appendToBody: true,
            formatter: (params) => {
                let row = params.data.row;
                const toolHtml = `
                    <div>
                        <span><b>${params.marker} ${row[data.level_col]}</b></span></br>
                        <span>${data.val_col}: ${row[data.val_col]}</span>
                    </div>
                `;
                return toolHtml
            }
        },
        series: series
    }
}

export const dfToEchartScatter = (data) => {
  let min = null;
  let max = null;
  let seriesData = []
  data.df.forEach(row => {
      let val = parseInt(row[data.val_col]);
      if(val){
          if (min == null){ min = val};
          if (val < min){ min = val };
          if (max == null){ max = val};
          if (val > max){ max = val };
      }
      seriesData.push({
          name: row[data.level_col],
          value: [row.center_area_long, row.center_area_lat, val],
          row: row
      })
  })
  let series = [{
    type: "scatter",
    name: 'Piles',
    coordinateSystem: "gmap",
    silent: false,
    animation: false,
    data: seriesData,
    symbolSize: function (val) {
      return 20;
    }
}]

return {
    visualMap: {
        itemHeight: 180,
        left: 'left',
        bottom: 22,
        calculable: true,
        show: true,
        orient: 'vertical',
        type: 'continuous',
        inRange: {
          "color": [
            "#fdc28c",
            "#fda762",
            "#fb8d3d",
            "#f2701d",
            "#e25609",
            "#c44103",
            "#9f3303",
            "#7f2704"
          ]
        },
        min: min,
        max: max
    },
    tooltip: {
        show: true,
        position: 'top',
        renderMode: 'html',
        appendToBody: true,
        formatter: (params) => {
            let row = params.data.row;
            const toolHtml = `
                <div>
                    <span><b>${params.marker} ${row[data.level_col]}</b></span></br>
                    <span>${data.val_col}: ${row[data.val_col]}</span>
                </div>
            `;
            return toolHtml
        }
    },
    series: series
  }
}

export const gmapsThemes = {
    "default": [
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "saturation": "-35"
            }
        ]
    }
    ],
    "lightBlueWater":[
      {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#444444"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#f2f2f2"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 45
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#b3cde0"
              },
              {
                  "visibility": "on"
              }
          ]
      }
  ],
    "lightMapStyle" : [
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 65
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": "50"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "30"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "40"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ffff00"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -97
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "lightness": -25
                },
                {
                    "saturation": -100
                }
            ]
        }
      ],
    "darkMapStyle" : [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [
            {
              saturation: 36
            },
            {
              color: '#000000'
            },
            {
              lightness: 40
            }
          ]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              visibility: 'on'
            },
            {
              color: '#000000'
            },
            {
              lightness: 16
            }
          ]
        },
        {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 17
            },
            {
              weight: 1.2
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 21
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 17
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 29
            },
            {
              weight: 0.2
            }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 18
            }
          ]
        },
        {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 16
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 19
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000'
            },
            {
              lightness: 17
            }
          ]
        }
      ]
}