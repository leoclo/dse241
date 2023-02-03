export const dfToEchart = (df, xColName, yColName, valColName) => {
    let xAxisLabels = [];
    let yAxisLabels = [];
    let min = null;
    let max = null;
    let options = []
    let timelineYears = [];

    Object.keys(df).forEach(year => {
        let seriesData = [];
        let city = '';
        timelineYears.push(year)
        df[year].forEach(row => {
            city = row.City
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
        options.push({
            'title': {
                text: `Top 10 Medalist Countries Heatmap - Winter Olympics ${city} ${year}`,
                left: 'center'
            },
            'series': {
                name: `Winter Olympics ${city} ${year}`,
                data: seriesData
            }
        })
    })


    return {
        'baseOption.visualMap.min': min,
        'baseOption.visualMap.max': max,
        'baseOption.yAxis.data': yAxisLabels,
        'baseOption.xAxis.data': xAxisLabels,
        'baseOption.timeline.data': timelineYears,
        'options': options 
    }
}

export const echartBaseOption = {
    "timeline": {
        "axisType": "category",
        "autoPlay": true,
        "playInterval": 1000,
        "calculable": true,
    },
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
                    <span>Sport: ${row.Sport}</span></br>
                    <span>${params.marker} ${row.Country}: ${row.Medal} Medals<span>
                </div>
            `;
            return toolHtml
        }
    },
    "title":{
        "text": "Top 10 Medalist Countries Heatmap - Winter Olympics",
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
          "type": "slider",
          "yAxisIndex": 0,
          "filterMode": "none",
          "left": 18
        }
    ],
    "series": [
        {
            "type": "heatmap",
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