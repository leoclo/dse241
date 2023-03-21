export const dfToEchart = (df, valColName, locColName) => {
    
    let timelineYears = [];    
    let options = [];

    Object.keys(df).forEach((year, i) => {
        let min = null;
        let max = null;
        let seriesData = [];
        
        timelineYears.push(year);
        df[year].forEach(row => {
            
            let val = row[valColName];
            if(val){
                if (min == null){ min = val};
                if (val < min){ min = val };
                if (max == null){ max = val};
                if (val > max){ max = val }
            }
            seriesData.push({name: row[locColName], value: val, row: row});
        })
        options.push({
            series: {data: seriesData},
            title: {
                text: `California Counties Nile Virus 2006-${year}`,
                subtext: "Use the timeline to navigate thorugh years",
            },
            visualMap: {max, min}
        })
    })
    
    return {
        'baseOption.timeline.data': timelineYears,
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
    "title":{
        "text": "California Counties Nile Virus 2006-2015",
        "subtext": "Use the timeline to navigate thorugh years",
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
            const toolHtml = `
                <div>
                    <span> ${params.marker} <b>County:</b> ${row.County}</span></br>
                    <span><b>Cumulative Cases (2006-${row.Year}): </b> ${row.Cumulative_Positive_Cases}<span>
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
            "color": [
                "#fee0d2", 
                "#fcbba1",
                "#fc9272",
                "#fb6a4a",
                "#ef3b2c",
                "#cb181d",
                "#a50f15",
                "#67000d"
            ]
        }
    },
    "series": [
        {
            "map": 'ca-counties',
            "name": "ca-counties",
            "type": "map",
            "selectedMode": false,
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