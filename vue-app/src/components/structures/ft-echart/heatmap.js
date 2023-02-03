export const dfToEchart = (df, xColName, yColName, valColName) => {
    let xAxisLabels = [];
    let yAxisLabels = [];
    let seriesData = [];
    let min = null;
    let max = null;

    df.forEach(row => {
        let labelX = row[xColName];
        let labelY = row[yColName];
        if(!labelX || !labelY){
            return;
        }
        let indexX = xAxisLabels.indexOf(labelX);
        if(indexX < 0){
            xAxisLabels.push(row[xColName]);
            indexX = xAxisLabels.indexOf(labelX);
        }
        let indexY = yAxisLabels.indexOf(labelY);
        if(indexY < 0){
            yAxisLabels.push(row[yColName]);
            indexY = yAxisLabels.indexOf(labelY);
        }
        let val = row[valColName];
        if(val){
            if (min == null){ min = val};
            if (val < min){ min = val };
            if (max == null){ max = val};
            if (val > max){ max = val }
        }
        seriesData.push({value: [indexX, indexY, val], row: row});
    });

    return {
        'visualMap.min': min,
        'visualMap.max': max,
        'series[0].data': seriesData,
        'yAxis.data': yAxisLabels,
        'xAxis.data': xAxisLabels
    }
}

export const echartBaseOption = {
    "tooltip": {
        "show": true,
        "position": "top",
        "renderMode": "html",
        formatter: (params) => {
            let row = params.data.row;
            console.log({params})
            const toolHtml = `
                <div>
                    <b>Olympics ${row.City} ${row.Year}</b></br>
                    <p>${params.marker} ${row.Country}: ${row.Medal} Medals<p>
                </div>
            `;
            return toolHtml
        }
    },
    "title":{
        "text": "Total Amount of Medals Heatmap - Winter Olympics",
        "left": "center",
    },
    "toolbox":{
        "show": true,
        "feature": {
            "saveAsImage": {
                "type": "png"
            }
        }
    },
    "yAxis": {
        "data": [],
        "name": "Country",
        "axisTick": {
            "show": false
        },
        "axisLine": {
            "show": false
        },
        "axisLabel": {
            "fontSize": "13",
            "fontWeight": "bold"
        }
    },
    "xAxis": {
        "data": [],
        "axisLine": {
            "show": false
        },
        "name": "Year",
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "fontSize": "13",
            "fontWeight": "bold"
        }
    },
    "visualMap": {
        "itemHeight": 280,
        "top": "middle",
        "right": "3%",
        "bottom": "auto",
        "show": true,
        "calculable": true,
        "orient": "vertical"
    },
    "grid": {
        "left": 220,
        "top": 60,
        "bottom": 90,
        "right": "7%"
    },
    "dataZoom": [
        {
          "type": 'slider',
          "xAxisIndex": 0,
          "filterMode": "none",
          "bottom": 20
        },
        {
          "type": "slider",
          "yAxisIndex": 0,
          "filterMode": "none",
          "left": 18
        }
    ],
    "series": [
        {
            "name": "olympics",
            "type": "heatmap",
            "coordinateSystem": "cartesian2d",
            "itemStyle": {
                "borderColor": "rgba(255, 255, 255, 1)",
                "borderWidth": 2
            },
            "emphasis": {
                "itemStyle": {
                    "shadowBlur": 7
                }
            }
        }
    ]
}