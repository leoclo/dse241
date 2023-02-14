
export const dfToEchart = (data) => {
    
    let xAxisData = data.xAxisData;
    let seriesData = [];

    data.series.forEach((serie, i) => {
        let series = {
            name: serie,
            emphasis: {
                focus: 'series'
            },
            areaStyle: {},
            type: 'line',
            stack: 'Total',
            data: xAxisData.map(v => null)
        }

        data.df_series[serie].forEach((row, j) => {
            series.data[xAxisData.indexOf(row[data.xColName])] = {
                value: row[data.valColName], row: row
            }
        });

        seriesData.push(series)
    });

    return {
        'xAxis.data': xAxisData,
        'series': seriesData,
        'title.text': `${data.spec} Carbon Emission By Sector Yearly`
    }
}

export const echartBaseOption = {
    "title":{
        "left": "center"
    },
    "tooltip": {
        "trigger": "axis",
        "show": true,
    },
    "legend": {
        "top": "bottom",
        "left": "center",
        "show": true
    },
    "yAxis": {
        "name": "Emission",
    },
    "xAxis": {
        "name": "Year"
    },
    "toolbox":{
        "show": true,
        "feature": {
            "saveAsImage": {
                "type": "png"
            }
        }
    }
}