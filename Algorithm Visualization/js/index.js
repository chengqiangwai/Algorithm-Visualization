const GOOD_COLOR = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
    offset: 0,
    color: 'rgb(129, 227, 238)'
}, {
    offset: 1,
    color: 'rgb(25, 183, 207)'
}]);
const BAD_COLOR = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
    offset: 0,
    color: 'rgb(251, 118, 123)'
}, {
    offset: 1,
    color: 'rgb(204, 46, 72)'
}]);
const GOOD_SHADOW_COLOR = 'rgba(120, 36, 50, 0.5)';
const BAD_SHADOW_COLOR = 'rgba(25, 100, 150, 0.5)';


let dom = document.getElementById("container");
let myChart = echarts.init(dom);
option = null;
seriesInOption = [{
    data: [
        [0, 100],
        [100, 0]
    ],
    type: 'line'
},
{
    data: [
        [0, 95],
        [105, 0]
    ],
    type: 'line'
},
{
    data: [
        [0, 105],
        [95, 0]
    ],
    type: 'line'
},
{
    name: 'good',
    data: dataset_echart[0],
    type: 'scatter',
    symbolSize: function (data) {
        return 14;
        // return Math.sqrt(data[2]) / 5e2;
    },
    label: {
        emphasis: {
            show: true,
            formatter: function (param) {
                return param.data[2];
            },
            position: 'top'
        }
    },
    itemStyle: {
        normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(129, 227, 238)'
            }, {
                offset: 1,
                color: 'rgb(25, 183, 207)'
            }])
        }
    }
},
{
    name: 'bad',
    data: dataset_echart[1],
    type: 'scatter',
    symbolSize: function (data) {
        return 14;
        // return Math.sqrt(data[2]) / 5e2;
    },
    label: {
        emphasis: {
            show: true,
            formatter: function (param) {
                return param.data[2];
            },
            position: 'top'
        }
    },
    itemStyle: {
        normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(25, 100, 150, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(251, 118, 123)'
            }, {
                offset: 1,
                color: 'rgb(204, 46, 72)'
            }])

        }
    }
}
];
seriesInOption = [];
option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
        offset: 0,
        color: '#f7f8fa'
    }, {
        offset: 1,
        color: '#cdd0d5'
    }]),
    title: {
        left: 100,
        text: '数学和统计学成绩对机器学习的关系'
    },
    legend: {
        right: 100,
        data: ['good', 'bad']
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        scale: true
    },
    series: seriesInOption
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
window.addEventListener("resize", function () {
    myChart.resize();
});

function drawPlot() {
    for (let i = 0; i < 2; i++) {
        seriesInOption.push({
            name: i === 0 ? 'good' : 'bad',
            data: dataset_echart[i],
            type: 'scatter',
            symbolSize: function (data) {
                return 14;
                // return Math.sqrt(data[2]) / 5e2;
            },
            label: {
                emphasis: {
                    show: true,
                    formatter: function (param) {
                        return param.data[2];
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: i === 0 ? GOOD_SHADOW_COLOR : BAD_SHADOW_COLOR,
                    shadowOffsetY: 5,
                    color: i === 0 ? GOOD_COLOR : BAD_COLOR
                }
            }
        });
        option.series = seriesInOption;
        myChart.setOption(option);
    }


}