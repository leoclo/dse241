export const dfToEchart = (df, valColName, locColName) => {
    let seriesData = [];
    let min = null;
    let max = null;
    
    df.forEach(row => {
        let val = row[valColName];
        if(val){
            if (min == null){ min = val};
            if (val < min){ min = val };
            if (max == null){ max = val};
            if (val > max){ max = val }
        }
        seriesData.push({name: row[locColName], value: val, row: row});
    })
    
    return {
        'series[0].data': seriesData,
        'visualMap.min': min,
        'visualMap.max': max
    }
}

export const echartBaseOption = {
    "title":{
        "text": "US States Carbon Emissions 1990-2010",
        "subtext": "Click on title or state to see progression through time",
        "textStyle": {
            "fontSize": 19
        },
        "subtextStyle": {
            "fontSize": 14
        },
        "left": "center",
        "triggerEvent": true
    },
    "tooltip": {
        "show": true,
        "position": "top",
        "renderMode": "html",
        "appendToBody": true,
        formatter: (params) => {
            let row = params.data.row;
            const v = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0, roundingIncrement: 100} ).format(row.Value)
            const toolHtml = `
                <div>
                    <span> ${params.marker} <b>State:</b> ${row.State}</span></br>
                    <span><b>Emission: </b> ${v} Million Metric Tons CO<sub>2</sub><span>
                </div>
            `;
            return toolHtml
        }
    },
    "visualMap": {
        "itemHeight": 280,
        "top": "middle",
        "right": "3%",
        "bottom": "auto",
        "show": true,
        "calculable": true,
        "orient": "vertical",
        "inRange": {
            "color": ["#fee8c8", "#fdbb84", "#e34a33"]
        }
    },
    "series": [
        {
            "map": 'us-states',
            "name": "USA",
            "type": "map",
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
    ],
    "toolbox":{
        "show": true,
        "feature": {
            "saveAsImage": {
                "type": "png"
            }
        }
    },
}