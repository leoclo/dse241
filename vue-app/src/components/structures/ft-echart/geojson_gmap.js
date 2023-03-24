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
        series: series[0],
        "toolbox":{
          "show": true,
          "feature": {
              "saveAsImage": {
                  "type": "png"
              }
          }
      }
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


// {
//     "gmap": {
//         "center": [
//             108.39,
//             39.9
//         ],
//         "zoom": 4,
//         "renderOnMoving": true,
//         "echartsLayerZIndex": 2019,
//         "roam": true
//     },
//     "tooltip": {
//         "trigger": "item"
//     },
//     "animation": true,
//     "series": [
//         {
//             "name": "PM2.5",
//             "type": "scatter",
//             "coordinateSystem": "gmap",
//             "data": [
//                 {
//                     "name": "海门",
//                     "value": [
//                         121.15,
//                         31.89,
//                         9
//                     ]
//                 },
//                 {
//                     "name": "鄂尔多斯",
//                     "value": [
//                         109.781327,
//                         39.608266,
//                         12
//                     ]
//                 },
//                 {
//                     "name": "招远",
//                     "value": [
//                         120.38,
//                         37.35,
//                         12
//                     ]
//                 },
//                 {
//                     "name": "舟山",
//                     "value": [
//                         122.207216,
//                         29.985295,
//                         12
//                     ]
//                 },
//                 {
//                     "name": "齐齐哈尔",
//                     "value": [
//                         123.97,
//                         47.33,
//                         14
//                     ]
//                 },
//                 {
//                     "name": "盐城",
//                     "value": [
//                         120.13,
//                         33.38,
//                         15
//                     ]
//                 },
//                 {
//                     "name": "赤峰",
//                     "value": [
//                         118.87,
//                         42.28,
//                         16
//                     ]
//                 },
//                 {
//                     "name": "青岛",
//                     "value": [
//                         120.33,
//                         36.07,
//                         18
//                     ]
//                 },
//                 {
//                     "name": "乳山",
//                     "value": [
//                         121.52,
//                         36.89,
//                         18
//                     ]
//                 },
//                 {
//                     "name": "金昌",
//                     "value": [
//                         102.188043,
//                         38.520089,
//                         19
//                     ]
//                 },
//                 {
//                     "name": "泉州",
//                     "value": [
//                         118.58,
//                         24.93,
//                         21
//                     ]
//                 },
//                 {
//                     "name": "莱西",
//                     "value": [
//                         120.53,
//                         36.86,
//                         21
//                     ]
//                 },
//                 {
//                     "name": "日照",
//                     "value": [
//                         119.46,
//                         35.42,
//                         21
//                     ]
//                 },
//                 {
//                     "name": "胶南",
//                     "value": [
//                         119.97,
//                         35.88,
//                         22
//                     ]
//                 },
//                 {
//                     "name": "南通",
//                     "value": [
//                         121.05,
//                         32.08,
//                         23
//                     ]
//                 },
//                 {
//                     "name": "拉萨",
//                     "value": [
//                         91.11,
//                         29.97,
//                         24
//                     ]
//                 },
//                 {
//                     "name": "云浮",
//                     "value": [
//                         112.02,
//                         22.93,
//                         24
//                     ]
//                 },
//                 {
//                     "name": "梅州",
//                     "value": [
//                         116.1,
//                         24.55,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "文登",
//                     "value": [
//                         122.05,
//                         37.2,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "上海",
//                     "value": [
//                         121.48,
//                         31.22,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "攀枝花",
//                     "value": [
//                         101.718637,
//                         26.582347,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "威海",
//                     "value": [
//                         122.1,
//                         37.5,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "承德",
//                     "value": [
//                         117.93,
//                         40.97,
//                         25
//                     ]
//                 },
//                 {
//                     "name": "厦门",
//                     "value": [
//                         118.1,
//                         24.46,
//                         26
//                     ]
//                 },
//                 {
//                     "name": "汕尾",
//                     "value": [
//                         115.375279,
//                         22.786211,
//                         26
//                     ]
//                 },
//                 {
//                     "name": "潮州",
//                     "value": [
//                         116.63,
//                         23.68,
//                         26
//                     ]
//                 },
//                 {
//                     "name": "丹东",
//                     "value": [
//                         124.37,
//                         40.13,
//                         27
//                     ]
//                 },
//                 {
//                     "name": "太仓",
//                     "value": [
//                         121.1,
//                         31.45,
//                         27
//                     ]
//                 },
//                 {
//                     "name": "曲靖",
//                     "value": [
//                         103.79,
//                         25.51,
//                         27
//                     ]
//                 },
//                 {
//                     "name": "烟台",
//                     "value": [
//                         121.39,
//                         37.52,
//                         28
//                     ]
//                 },
//                 {
//                     "name": "福州",
//                     "value": [
//                         119.3,
//                         26.08,
//                         29
//                     ]
//                 },
//                 {
//                     "name": "瓦房店",
//                     "value": [
//                         121.979603,
//                         39.627114,
//                         30
//                     ]
//                 },
//                 {
//                     "name": "即墨",
//                     "value": [
//                         120.45,
//                         36.38,
//                         30
//                     ]
//                 },
//                 {
//                     "name": "抚顺",
//                     "value": [
//                         123.97,
//                         41.97,
//                         31
//                     ]
//                 },
//                 {
//                     "name": "玉溪",
//                     "value": [
//                         102.52,
//                         24.35,
//                         31
//                     ]
//                 },
//                 {
//                     "name": "张家口",
//                     "value": [
//                         114.87,
//                         40.82,
//                         31
//                     ]
//                 },
//                 {
//                     "name": "阳泉",
//                     "value": [
//                         113.57,
//                         37.85,
//                         31
//                     ]
//                 },
//                 {
//                     "name": "莱州",
//                     "value": [
//                         119.942327,
//                         37.177017,
//                         32
//                     ]
//                 },
//                 {
//                     "name": "湖州",
//                     "value": [
//                         120.1,
//                         30.86,
//                         32
//                     ]
//                 },
//                 {
//                     "name": "汕头",
//                     "value": [
//                         116.69,
//                         23.39,
//                         32
//                     ]
//                 },
//                 {
//                     "name": "昆山",
//                     "value": [
//                         120.95,
//                         31.39,
//                         33
//                     ]
//                 },
//                 {
//                     "name": "宁波",
//                     "value": [
//                         121.56,
//                         29.86,
//                         33
//                     ]
//                 },
//                 {
//                     "name": "湛江",
//                     "value": [
//                         110.359377,
//                         21.270708,
//                         33
//                     ]
//                 },
//                 {
//                     "name": "揭阳",
//                     "value": [
//                         116.35,
//                         23.55,
//                         34
//                     ]
//                 },
//                 {
//                     "name": "荣成",
//                     "value": [
//                         122.41,
//                         37.16,
//                         34
//                     ]
//                 },
//                 {
//                     "name": "连云港",
//                     "value": [
//                         119.16,
//                         34.59,
//                         35
//                     ]
//                 },
//                 {
//                     "name": "葫芦岛",
//                     "value": [
//                         120.836932,
//                         40.711052,
//                         35
//                     ]
//                 },
//                 {
//                     "name": "常熟",
//                     "value": [
//                         120.74,
//                         31.64,
//                         36
//                     ]
//                 },
//                 {
//                     "name": "东莞",
//                     "value": [
//                         113.75,
//                         23.04,
//                         36
//                     ]
//                 },
//                 {
//                     "name": "河源",
//                     "value": [
//                         114.68,
//                         23.73,
//                         36
//                     ]
//                 },
//                 {
//                     "name": "淮安",
//                     "value": [
//                         119.15,
//                         33.5,
//                         36
//                     ]
//                 },
//                 {
//                     "name": "泰州",
//                     "value": [
//                         119.9,
//                         32.49,
//                         36
//                     ]
//                 },
//                 {
//                     "name": "南宁",
//                     "value": [
//                         108.33,
//                         22.84,
//                         37
//                     ]
//                 },
//                 {
//                     "name": "营口",
//                     "value": [
//                         122.18,
//                         40.65,
//                         37
//                     ]
//                 },
//                 {
//                     "name": "惠州",
//                     "value": [
//                         114.4,
//                         23.09,
//                         37
//                     ]
//                 },
//                 {
//                     "name": "江阴",
//                     "value": [
//                         120.26,
//                         31.91,
//                         37
//                     ]
//                 },
//                 {
//                     "name": "蓬莱",
//                     "value": [
//                         120.75,
//                         37.8,
//                         37
//                     ]
//                 },
//                 {
//                     "name": "韶关",
//                     "value": [
//                         113.62,
//                         24.84,
//                         38
//                     ]
//                 },
//                 {
//                     "name": "嘉峪关",
//                     "value": [
//                         98.289152,
//                         39.77313,
//                         38
//                     ]
//                 },
//                 {
//                     "name": "广州",
//                     "value": [
//                         113.23,
//                         23.16,
//                         38
//                     ]
//                 },
//                 {
//                     "name": "延安",
//                     "value": [
//                         109.47,
//                         36.6,
//                         38
//                     ]
//                 },
//                 {
//                     "name": "太原",
//                     "value": [
//                         112.53,
//                         37.87,
//                         39
//                     ]
//                 },
//                 {
//                     "name": "清远",
//                     "value": [
//                         113.01,
//                         23.7,
//                         39
//                     ]
//                 },
//                 {
//                     "name": "中山",
//                     "value": [
//                         113.38,
//                         22.52,
//                         39
//                     ]
//                 },
//                 {
//                     "name": "昆明",
//                     "value": [
//                         102.73,
//                         25.04,
//                         39
//                     ]
//                 },
//                 {
//                     "name": "寿光",
//                     "value": [
//                         118.73,
//                         36.86,
//                         40
//                     ]
//                 },
//                 {
//                     "name": "盘锦",
//                     "value": [
//                         122.070714,
//                         41.119997,
//                         40
//                     ]
//                 },
//                 {
//                     "name": "长治",
//                     "value": [
//                         113.08,
//                         36.18,
//                         41
//                     ]
//                 },
//                 {
//                     "name": "深圳",
//                     "value": [
//                         114.07,
//                         22.62,
//                         41
//                     ]
//                 },
//                 {
//                     "name": "珠海",
//                     "value": [
//                         113.52,
//                         22.3,
//                         42
//                     ]
//                 },
//                 {
//                     "name": "宿迁",
//                     "value": [
//                         118.3,
//                         33.96,
//                         43
//                     ]
//                 },
//                 {
//                     "name": "咸阳",
//                     "value": [
//                         108.72,
//                         34.36,
//                         43
//                     ]
//                 },
//                 {
//                     "name": "铜川",
//                     "value": [
//                         109.11,
//                         35.09,
//                         44
//                     ]
//                 },
//                 {
//                     "name": "平度",
//                     "value": [
//                         119.97,
//                         36.77,
//                         44
//                     ]
//                 },
//                 {
//                     "name": "佛山",
//                     "value": [
//                         113.11,
//                         23.05,
//                         44
//                     ]
//                 },
//                 {
//                     "name": "海口",
//                     "value": [
//                         110.35,
//                         20.02,
//                         44
//                     ]
//                 },
//                 {
//                     "name": "江门",
//                     "value": [
//                         113.06,
//                         22.61,
//                         45
//                     ]
//                 },
//                 {
//                     "name": "章丘",
//                     "value": [
//                         117.53,
//                         36.72,
//                         45
//                     ]
//                 },
//                 {
//                     "name": "肇庆",
//                     "value": [
//                         112.44,
//                         23.05,
//                         46
//                     ]
//                 },
//                 {
//                     "name": "大连",
//                     "value": [
//                         121.62,
//                         38.92,
//                         47
//                     ]
//                 },
//                 {
//                     "name": "临汾",
//                     "value": [
//                         111.5,
//                         36.08,
//                         47
//                     ]
//                 },
//                 {
//                     "name": "吴江",
//                     "value": [
//                         120.63,
//                         31.16,
//                         47
//                     ]
//                 },
//                 {
//                     "name": "石嘴山",
//                     "value": [
//                         106.39,
//                         39.04,
//                         49
//                     ]
//                 },
//                 {
//                     "name": "沈阳",
//                     "value": [
//                         123.38,
//                         41.8,
//                         50
//                     ]
//                 },
//                 {
//                     "name": "苏州",
//                     "value": [
//                         120.62,
//                         31.32,
//                         50
//                     ]
//                 },
//                 {
//                     "name": "茂名",
//                     "value": [
//                         110.88,
//                         21.68,
//                         50
//                     ]
//                 },
//                 {
//                     "name": "嘉兴",
//                     "value": [
//                         120.76,
//                         30.77,
//                         51
//                     ]
//                 },
//                 {
//                     "name": "长春",
//                     "value": [
//                         125.35,
//                         43.88,
//                         51
//                     ]
//                 },
//                 {
//                     "name": "胶州",
//                     "value": [
//                         120.03336,
//                         36.264622,
//                         52
//                     ]
//                 },
//                 {
//                     "name": "银川",
//                     "value": [
//                         106.27,
//                         38.47,
//                         52
//                     ]
//                 },
//                 {
//                     "name": "张家港",
//                     "value": [
//                         120.555821,
//                         31.875428,
//                         52
//                     ]
//                 },
//                 {
//                     "name": "三门峡",
//                     "value": [
//                         111.19,
//                         34.76,
//                         53
//                     ]
//                 },
//                 {
//                     "name": "锦州",
//                     "value": [
//                         121.15,
//                         41.13,
//                         54
//                     ]
//                 },
//                 {
//                     "name": "南昌",
//                     "value": [
//                         115.89,
//                         28.68,
//                         54
//                     ]
//                 },
//                 {
//                     "name": "柳州",
//                     "value": [
//                         109.4,
//                         24.33,
//                         54
//                     ]
//                 },
//                 {
//                     "name": "三亚",
//                     "value": [
//                         109.511909,
//                         18.252847,
//                         54
//                     ]
//                 },
//                 {
//                     "name": "自贡",
//                     "value": [
//                         104.778442,
//                         29.33903,
//                         56
//                     ]
//                 },
//                 {
//                     "name": "吉林",
//                     "value": [
//                         126.57,
//                         43.87,
//                         56
//                     ]
//                 },
//                 {
//                     "name": "阳江",
//                     "value": [
//                         111.95,
//                         21.85,
//                         57
//                     ]
//                 },
//                 {
//                     "name": "泸州",
//                     "value": [
//                         105.39,
//                         28.91,
//                         57
//                     ]
//                 },
//                 {
//                     "name": "西宁",
//                     "value": [
//                         101.74,
//                         36.56,
//                         57
//                     ]
//                 },
//                 {
//                     "name": "宜宾",
//                     "value": [
//                         104.56,
//                         29.77,
//                         58
//                     ]
//                 },
//                 {
//                     "name": "呼和浩特",
//                     "value": [
//                         111.65,
//                         40.82,
//                         58
//                     ]
//                 },
//                 {
//                     "name": "成都",
//                     "value": [
//                         104.06,
//                         30.67,
//                         58
//                     ]
//                 },
//                 {
//                     "name": "大同",
//                     "value": [
//                         113.3,
//                         40.12,
//                         58
//                     ]
//                 },
//                 {
//                     "name": "镇江",
//                     "value": [
//                         119.44,
//                         32.2,
//                         59
//                     ]
//                 },
//                 {
//                     "name": "桂林",
//                     "value": [
//                         110.28,
//                         25.29,
//                         59
//                     ]
//                 },
//                 {
//                     "name": "张家界",
//                     "value": [
//                         110.479191,
//                         29.117096,
//                         59
//                     ]
//                 },
//                 {
//                     "name": "宜兴",
//                     "value": [
//                         119.82,
//                         31.36,
//                         59
//                     ]
//                 },
//                 {
//                     "name": "北海",
//                     "value": [
//                         109.12,
//                         21.49,
//                         60
//                     ]
//                 },
//                 {
//                     "name": "西安",
//                     "value": [
//                         108.95,
//                         34.27,
//                         61
//                     ]
//                 },
//                 {
//                     "name": "金坛",
//                     "value": [
//                         119.56,
//                         31.74,
//                         62
//                     ]
//                 },
//                 {
//                     "name": "东营",
//                     "value": [
//                         118.49,
//                         37.46,
//                         62
//                     ]
//                 },
//                 {
//                     "name": "牡丹江",
//                     "value": [
//                         129.58,
//                         44.6,
//                         63
//                     ]
//                 },
//                 {
//                     "name": "遵义",
//                     "value": [
//                         106.9,
//                         27.7,
//                         63
//                     ]
//                 },
//                 {
//                     "name": "绍兴",
//                     "value": [
//                         120.58,
//                         30.01,
//                         63
//                     ]
//                 },
//                 {
//                     "name": "扬州",
//                     "value": [
//                         119.42,
//                         32.39,
//                         64
//                     ]
//                 },
//                 {
//                     "name": "常州",
//                     "value": [
//                         119.95,
//                         31.79,
//                         64
//                     ]
//                 },
//                 {
//                     "name": "潍坊",
//                     "value": [
//                         119.1,
//                         36.62,
//                         65
//                     ]
//                 },
//                 {
//                     "name": "重庆",
//                     "value": [
//                         106.54,
//                         29.59,
//                         66
//                     ]
//                 },
//                 {
//                     "name": "台州",
//                     "value": [
//                         121.420757,
//                         28.656386,
//                         67
//                     ]
//                 },
//                 {
//                     "name": "南京",
//                     "value": [
//                         118.78,
//                         32.04,
//                         67
//                     ]
//                 },
//                 {
//                     "name": "滨州",
//                     "value": [
//                         118.03,
//                         37.36,
//                         70
//                     ]
//                 },
//                 {
//                     "name": "贵阳",
//                     "value": [
//                         106.71,
//                         26.57,
//                         71
//                     ]
//                 },
//                 {
//                     "name": "无锡",
//                     "value": [
//                         120.29,
//                         31.59,
//                         71
//                     ]
//                 },
//                 {
//                     "name": "本溪",
//                     "value": [
//                         123.73,
//                         41.3,
//                         71
//                     ]
//                 },
//                 {
//                     "name": "克拉玛依",
//                     "value": [
//                         84.77,
//                         45.59,
//                         72
//                     ]
//                 },
//                 {
//                     "name": "渭南",
//                     "value": [
//                         109.5,
//                         34.52,
//                         72
//                     ]
//                 },
//                 {
//                     "name": "马鞍山",
//                     "value": [
//                         118.48,
//                         31.56,
//                         72
//                     ]
//                 },
//                 {
//                     "name": "宝鸡",
//                     "value": [
//                         107.15,
//                         34.38,
//                         72
//                     ]
//                 },
//                 {
//                     "name": "焦作",
//                     "value": [
//                         113.21,
//                         35.24,
//                         75
//                     ]
//                 },
//                 {
//                     "name": "句容",
//                     "value": [
//                         119.16,
//                         31.95,
//                         75
//                     ]
//                 },
//                 {
//                     "name": "北京",
//                     "value": [
//                         116.46,
//                         39.92,
//                         79
//                     ]
//                 },
//                 {
//                     "name": "徐州",
//                     "value": [
//                         117.2,
//                         34.26,
//                         79
//                     ]
//                 },
//                 {
//                     "name": "衡水",
//                     "value": [
//                         115.72,
//                         37.72,
//                         80
//                     ]
//                 },
//                 {
//                     "name": "包头",
//                     "value": [
//                         110,
//                         40.58,
//                         80
//                     ]
//                 },
//                 {
//                     "name": "绵阳",
//                     "value": [
//                         104.73,
//                         31.48,
//                         80
//                     ]
//                 },
//                 {
//                     "name": "乌鲁木齐",
//                     "value": [
//                         87.68,
//                         43.77,
//                         84
//                     ]
//                 },
//                 {
//                     "name": "枣庄",
//                     "value": [
//                         117.57,
//                         34.86,
//                         84
//                     ]
//                 },
//                 {
//                     "name": "杭州",
//                     "value": [
//                         120.19,
//                         30.26,
//                         84
//                     ]
//                 },
//                 {
//                     "name": "淄博",
//                     "value": [
//                         118.05,
//                         36.78,
//                         85
//                     ]
//                 },
//                 {
//                     "name": "鞍山",
//                     "value": [
//                         122.85,
//                         41.12,
//                         86
//                     ]
//                 },
//                 {
//                     "name": "溧阳",
//                     "value": [
//                         119.48,
//                         31.43,
//                         86
//                     ]
//                 },
//                 {
//                     "name": "库尔勒",
//                     "value": [
//                         86.06,
//                         41.68,
//                         86
//                     ]
//                 },
//                 {
//                     "name": "安阳",
//                     "value": [
//                         114.35,
//                         36.1,
//                         90
//                     ]
//                 },
//                 {
//                     "name": "开封",
//                     "value": [
//                         114.35,
//                         34.79,
//                         90
//                     ]
//                 },
//                 {
//                     "name": "济南",
//                     "value": [
//                         117,
//                         36.65,
//                         92
//                     ]
//                 },
//                 {
//                     "name": "德阳",
//                     "value": [
//                         104.37,
//                         31.13,
//                         93
//                     ]
//                 },
//                 {
//                     "name": "温州",
//                     "value": [
//                         120.65,
//                         28.01,
//                         95
//                     ]
//                 },
//                 {
//                     "name": "九江",
//                     "value": [
//                         115.97,
//                         29.71,
//                         96
//                     ]
//                 },
//                 {
//                     "name": "邯郸",
//                     "value": [
//                         114.47,
//                         36.6,
//                         98
//                     ]
//                 },
//                 {
//                     "name": "临安",
//                     "value": [
//                         119.72,
//                         30.23,
//                         99
//                     ]
//                 },
//                 {
//                     "name": "兰州",
//                     "value": [
//                         103.73,
//                         36.03,
//                         99
//                     ]
//                 },
//                 {
//                     "name": "沧州",
//                     "value": [
//                         116.83,
//                         38.33,
//                         100
//                     ]
//                 },
//                 {
//                     "name": "临沂",
//                     "value": [
//                         118.35,
//                         35.05,
//                         103
//                     ]
//                 },
//                 {
//                     "name": "南充",
//                     "value": [
//                         106.110698,
//                         30.837793,
//                         104
//                     ]
//                 },
//                 {
//                     "name": "天津",
//                     "value": [
//                         117.2,
//                         39.13,
//                         105
//                     ]
//                 },
//                 {
//                     "name": "富阳",
//                     "value": [
//                         119.95,
//                         30.07,
//                         106
//                     ]
//                 },
//                 {
//                     "name": "泰安",
//                     "value": [
//                         117.13,
//                         36.18,
//                         112
//                     ]
//                 },
//                 {
//                     "name": "诸暨",
//                     "value": [
//                         120.23,
//                         29.71,
//                         112
//                     ]
//                 },
//                 {
//                     "name": "郑州",
//                     "value": [
//                         113.65,
//                         34.76,
//                         113
//                     ]
//                 },
//                 {
//                     "name": "哈尔滨",
//                     "value": [
//                         126.63,
//                         45.75,
//                         114
//                     ]
//                 },
//                 {
//                     "name": "聊城",
//                     "value": [
//                         115.97,
//                         36.45,
//                         116
//                     ]
//                 },
//                 {
//                     "name": "芜湖",
//                     "value": [
//                         118.38,
//                         31.33,
//                         117
//                     ]
//                 },
//                 {
//                     "name": "唐山",
//                     "value": [
//                         118.02,
//                         39.63,
//                         119
//                     ]
//                 },
//                 {
//                     "name": "平顶山",
//                     "value": [
//                         113.29,
//                         33.75,
//                         119
//                     ]
//                 },
//                 {
//                     "name": "邢台",
//                     "value": [
//                         114.48,
//                         37.05,
//                         119
//                     ]
//                 },
//                 {
//                     "name": "德州",
//                     "value": [
//                         116.29,
//                         37.45,
//                         120
//                     ]
//                 },
//                 {
//                     "name": "济宁",
//                     "value": [
//                         116.59,
//                         35.38,
//                         120
//                     ]
//                 },
//                 {
//                     "name": "荆州",
//                     "value": [
//                         112.239741,
//                         30.335165,
//                         127
//                     ]
//                 },
//                 {
//                     "name": "宜昌",
//                     "value": [
//                         111.3,
//                         30.7,
//                         130
//                     ]
//                 },
//                 {
//                     "name": "义乌",
//                     "value": [
//                         120.06,
//                         29.32,
//                         132
//                     ]
//                 },
//                 {
//                     "name": "丽水",
//                     "value": [
//                         119.92,
//                         28.45,
//                         133
//                     ]
//                 },
//                 {
//                     "name": "洛阳",
//                     "value": [
//                         112.44,
//                         34.7,
//                         134
//                     ]
//                 },
//                 {
//                     "name": "秦皇岛",
//                     "value": [
//                         119.57,
//                         39.95,
//                         136
//                     ]
//                 },
//                 {
//                     "name": "株洲",
//                     "value": [
//                         113.16,
//                         27.83,
//                         143
//                     ]
//                 },
//                 {
//                     "name": "石家庄",
//                     "value": [
//                         114.48,
//                         38.03,
//                         147
//                     ]
//                 },
//                 {
//                     "name": "莱芜",
//                     "value": [
//                         117.67,
//                         36.19,
//                         148
//                     ]
//                 },
//                 {
//                     "name": "常德",
//                     "value": [
//                         111.69,
//                         29.05,
//                         152
//                     ]
//                 },
//                 {
//                     "name": "保定",
//                     "value": [
//                         115.48,
//                         38.85,
//                         153
//                     ]
//                 },
//                 {
//                     "name": "湘潭",
//                     "value": [
//                         112.91,
//                         27.87,
//                         154
//                     ]
//                 },
//                 {
//                     "name": "金华",
//                     "value": [
//                         119.64,
//                         29.12,
//                         157
//                     ]
//                 },
//                 {
//                     "name": "岳阳",
//                     "value": [
//                         113.09,
//                         29.37,
//                         169
//                     ]
//                 },
//                 {
//                     "name": "长沙",
//                     "value": [
//                         113,
//                         28.21,
//                         175
//                     ]
//                 },
//                 {
//                     "name": "衢州",
//                     "value": [
//                         118.88,
//                         28.97,
//                         177
//                     ]
//                 },
//                 {
//                     "name": "廊坊",
//                     "value": [
//                         116.7,
//                         39.53,
//                         193
//                     ]
//                 },
//                 {
//                     "name": "菏泽",
//                     "value": [
//                         115.480656,
//                         35.23375,
//                         194
//                     ]
//                 },
//                 {
//                     "name": "合肥",
//                     "value": [
//                         117.27,
//                         31.86,
//                         229
//                     ]
//                 },
//                 {
//                     "name": "武汉",
//                     "value": [
//                         114.31,
//                         30.52,
//                         273
//                     ]
//                 },
//                 {
//                     "name": "大庆",
//                     "value": [
//                         125.03,
//                         46.58,
//                         279
//                     ]
//                 }
//             ],
//             "encode": {
//                 "value": 2,
//                 "lng": 0,
//                 "lat": 1
//             },
//             "label": {
//                 "formatter": "{b}",
//                 "position": "right",
//                 "show": false
//             },
//             "itemStyle": {
//                 "color": "#00c1de"
//             },
//             "emphasis": {
//                 "label": {
//                     "show": true
//                 }
//             }
//         },
//         {
//             "name": "Top 5",
//             "type": "effectScatter",
//             "coordinateSystem": "gmap",
//             "data": [
//                 {
//                     "name": "大庆",
//                     "value": [
//                         125.03,
//                         46.58,
//                         279
//                     ]
//                 },
//                 {
//                     "name": "武汉",
//                     "value": [
//                         114.31,
//                         30.52,
//                         273
//                     ]
//                 },
//                 {
//                     "name": "合肥",
//                     "value": [
//                         117.27,
//                         31.86,
//                         229
//                     ]
//                 },
//                 {
//                     "name": "菏泽",
//                     "value": [
//                         115.480656,
//                         35.23375,
//                         194
//                     ]
//                 },
//                 {
//                     "name": "廊坊",
//                     "value": [
//                         116.7,
//                         39.53,
//                         193
//                     ]
//                 },
//                 {
//                     "name": "衢州",
//                     "value": [
//                         118.88,
//                         28.97,
//                         177
//                     ]
//                 }
//             ],
//             "encode": {
//                 "value": 2,
//                 "lng": 0,
//                 "lat": 1
//             },
//             "showEffectOn": "render",
//             "rippleEffect": {
//                 "brushType": "stroke"
//             },
//             "label": {
//                 "formatter": "{b}",
//                 "position": "right",
//                 "show": true
//             },
//             "itemStyle": {
//                 "color": "#fff",
//                 "shadowBlur": 10,
//                 "shadowColor": "#333"
//             },
//             "zlevel": 1
//         },
//         {
//             "type": "pie",
//             "name": "Category",
//             "coordinateSystem": "gmap",
//             "center": [
//                 121,
//                 23
//             ],
//             "radius": 20,
//             "data": [
//                 {
//                     "name": "A",
//                     "value": 100
//                 },
//                 {
//                     "name": "B",
//                     "value": 80
//                 },
//                 {
//                     "name": "C",
//                     "value": 120
//                 }
//             ]
//         }
//     ]
// }