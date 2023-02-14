export const dfToEchart = (data, xColName, valColName) => {
    let xAxisLabels = data.countries;

    // let min = null;
    // let max = null;
    let options = []
    let timelineYears = [];
    let df = data.df;
    const defaultSeriesData = data.all_countries.map(country=> null);
    let firstXaxis = [];

    Object.keys(df).forEach((year, i) => {
        if(i === 0){
            firstXaxis = Object.values(df[year].countries);
        }
        timelineYears.push(year)
        let series = [];
        let city = '';
        data.series.forEach(s =>{
            let seriesData = [...defaultSeriesData];
            df[year][s].forEach(row => {
                city = row.City
                let country = row[xColName]
                let val = row[valColName];
                seriesData[df[year].countries.indexOf(country)] = {value: val, row: row};
            });
            series.push({data: seriesData, name: s });
        })

        options.push({
            'title': {
                text: `Top 10 Medalist Countries Progression Over Time`,
                subtext: `Winter Olympics Medals From 1924 - ${year}`,
                left: 'center'
            },
            'series': series,
            'xAxis': {
                'data': Object.values(df[year].countries),
                "axisLine": {
                    "show": false
                },
                "name": "Country",
                "axisTick": {
                    "show": false
                },
                "axisLabel": {
                    "fontSize": "12",
                    "fontWeight": "bold"
                }
            }
        })
    })
    const colorMap = {
        'Gold': '#d4af37',
        'Silver': '#c0c0c0',
        'Bronze': '#cd7f32'
    }
    let baseSeries = data.series.map(serie =>{
        return {
            "stack": 'total',
            "type": "bar",
            "itemStyle": {"color": colorMap[serie]}
        };
    })

    return {
        'baseOption.xAxis.data': firstXaxis,
        'baseOption.timeline.data': timelineYears,
        'baseOption.series': baseSeries,
        'options': options 
    }
}

export const echartBaseOption = {
    "timeline": {
        "axisType": "time",
        "autoPlay": true,
        "calculable": true,
        "replaceMerge": "xAxis"
    },
    "tooltip": {
        "show": true,
        "position": "top",
        "renderMode": "html",
        "appendToBody": true, 
        formatter: (params) => {
            let row = params.data.row;
            const toolHtml = `
                <div>
                    <span><b>Olympics ${row.Year}</b></span><br>
                    <span>${params.marker} ${row.Country}: ${row.Sport} ${row.Medal} Medals<span>
                </div>
            `;
            return toolHtml
        }
    },
    "toolbox":{
        "show": true,
        "feature": {
            "saveAsImage": {
                "type": "png"
            },
            "magicType": { "type": ['stack'] },
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
    "xAxis": {},
    "legend": {
        "top": "middle",
        "right": "3%",
        "bottom": "auto",
        "show": true,
        "orient": "vertical"
    },
    "grid": {
        "left": 60,
        "top": 60,
        "bottom": 90,
        "right": 150
    }
}