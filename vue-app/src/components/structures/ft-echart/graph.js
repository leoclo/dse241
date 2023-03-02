export const dfToEchart = (data) => {
    return {
        'series[0].data': data.nodes.map(node => {
            return {
                ...node,
                symbolSize: node.value * 3
            }
        }),
        'series[0].links': data.edges.map(edge => {
            return {
                ...edge
            }
        })
    }
}

export const echartBaseOption = {
    series: [
        {
            name: 'Sheep Graph',
            type: 'graph',
            layout: 'force',
            animation: true,
            draggable: false,
            width: '100%',
            roam: true,
            force: {
                edgeLength: 400,
                repulsion: 40,
                gravity: 0.1
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 10
                }
            }
            
        }
    ],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    "toolbox":{
        "show": true,
        "feature": {
            "saveAsImage": {
                "type": "png"
            }
        }
    }
};