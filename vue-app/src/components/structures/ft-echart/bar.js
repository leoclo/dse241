export const dfToEchart = (data, xColName, valColName) => {
    let xAxisLabels = data.countries;

    // let min = null;
    // let max = null;
    let options = []
    let timelineYears = [];
    let df = data.df;
    const defaultSeriesData = data.countries.map(country=> null);
    Object.keys(df).forEach(year => {
        timelineYears.push(year)
        let series = [];
        let city = '';
        data.series.forEach(s =>{
            let seriesData = [...defaultSeriesData];
            df[year][s].forEach(row => {
                city = row.City
                let country = row[xColName]
                let val = row[valColName];
                seriesData[data.countries.indexOf(country)] = {value: val, row: row};
            });
            series.push({data: seriesData, name: s });
        })
        options.push({
            'title': {
                text: `Top 10 Medalist Countries - Winter Olympics ${city} ${year}`,
                left: 'center'
            },
            'series': series
        })
    })
    let baseSeries = data.series.map(serie =>{
        return {
            "type": "bar"
        };
    })

    return {
        'baseOption.xAxis.data': xAxisLabels,
        'baseOption.timeline.data': timelineYears,
        'baseOption.series': baseSeries,
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
            },
            "magicType": { "type": ['line', 'bar', 'stack'] },
        }
    },
    "yAxis": {
        "name": "Amount Of Medals",
        // "axisTick": {
        //     "show": false
        // },
        // "axisLabel": {
        //     "fontSize": "13",
        //     "fontWeight": "bold"
        // }
    },
    "xAxis": {
        "data": [],
        "axisLine": {
            "show": false
        },
        "name": "Country",
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "fontSize": "13",
            "fontWeight": "bold"
        }
    },
    "legend": {
        "top": "middle",
        "right": "3%",
        "bottom": "auto",
        "show": true,
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
    ]
}