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

let onlyLine = null;


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
    animation: true,
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

let drawLine = (function () {
    let clickedTime = 10;
    return function () {
        console.log('Hi, pengjingchun');
        if (clickedTime < 1) {
            alert('NO line to draw anymore');
            return;
        } else {
            clickedTime--;
            seriesInOption.push({
                data: [
                    [0, Math.ceil(90 + 20 * Math.random())],
                    [Math.ceil(90 + 20 * Math.random()), 0]
                ],
                type: 'line'
            });
            option.series = seriesInOption;
            myChart.setOption(option);
        }
    }
})();

function leaveOneLine() {
    let numOfLine = 0;
    for (let i = seriesInOption.length - 1; i >= 0; i--) {

        if (seriesInOption[i].type === 'line') {
            if (numOfLine === 0) {
                onlyLine = seriesInOption[i];
                numOfLine++;
            } else {
                seriesInOption.splice(i, 1);
            }
        }
    }
    console.log(seriesInOption)
    option.series = seriesInOption;
    myChart.setOption(option, true);
}

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

function getDistance(line, point) {
    const X0 = line.data[0][0] !== 0 ? line.data[0][0] : line.data[1][0];
    const Y0 = line.data[0][1] !== 0 ? line.data[0][1] : line.data[1][1];
    console.log(line, X0, Y0);
    const distance = Math.abs(Y0 * point[0] / X0 + point[1] - Y0) / Math.pow(Math.pow(Y0 / X0, 2) + 1, 0.5);
    return distance;

}

function drawDistanceLine() {
    let shortestDistance = Number.MAX_VALUE;
    let indexOfShortest = -1;
    const X0 = onlyLine.data[0][0] !== 0 ? onlyLine.data[0][0] : onlyLine.data[1][0];
    const Y0 = onlyLine.data[0][1] !== 0 ? onlyLine.data[0][1] : onlyLine.data[1][1];
    for (let i = 0; i < dataset_echart[0].length; i++) {
        let tempDistance = getDistance(onlyLine, dataset_echart[0][i]);
        let tempX = dataset_echart[0][i][0];
        let tempY = dataset_echart[0][i][1];
        let cross_x = (X0 * Y0 * Y0 + X0 * X0 * tempX - X0 * Y0 * tempY) / (Y0 * Y0 + X0 * X0);
        let cross_y = (-Y0 * cross_x / X0 + Y0);
        seriesInOption.push({
            data: [
                [tempX, tempY],
                [cross_x, cross_y],
            ],
            type: 'line',
            label: {
                emphasis: {
                    show: true,
                    formatter: function () {
                        return 'Hi';
                        // return Math.pow(Math.pow(tempX - cross_x, 2), Math.pow(tempY - cross_y, 2)).toString()
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
            // itemStyle : {  
            //     normal : {  
            //         lineStyle:{  
            //             color:'rgba(120, 36, 50, 0.5)'
            //         }  
            //     }  
            // },  
        });
        if (tempDistance < shortestDistance) {
            seriesInOption.pop();
            option.series = seriesInOption;
            myChart.setOption(option);
            shortestDistance = tempDistance;
            indexOfShortest = i;
        }
    }
    let X1_1 = dataset_echart[0][indexOfShortest][0];
    let Y1_1 = dataset_echart[0][indexOfShortest][1];
    seriesInOption.push({
        data: [
            [0, Y1_1 + Y0 * X1_1 / X0],
            [X1_1 + X0 * Y1_1 / Y0, 0],
        ],
        type: 'line',
        label: {
            show: true,
            position: 'top',
            formatter: 'so handsome am i',
            emphasis: {
                show: true,
                formatter: 'how are you'
            }
        },
        itemStyle: {
            normal: {
                lineStyle: {
                    color: 'rgba(120, 36, 50, 0.5)'
                }
            }
        },
    });
    option.series = seriesInOption;
    myChart.setOption(option);
    shortestDistance = Number.MAX_VALUE;
    for (let i = 0; i < dataset_echart[1].length; i++) {
        let tempDistance = getDistance(onlyLine, dataset_echart[1][i]);
        if (tempDistance < shortestDistance) {
            shortestDistance = tempDistance;
            indexOfShortest = i;
        }
    }
    let X1_2 = dataset_echart[1][indexOfShortest][0];
    let Y1_2 = dataset_echart[1][indexOfShortest][1];
    seriesInOption.push({
        data: [
            [0, Y1_2 + Y0 * X1_2 / X0],
            [X1_2 + X0 * Y1_2 / Y0, 0],
        ],
        type: 'line',
        label: {
            show: true,
            position: 'top',
            formatter: 'so beautiful is she'
        },
        itemStyle: {
            normal: {
                lineStyle: {
                    color: 'rgba(120, 36, 50, 0.5)'
                }
            }
        },
    }, {
        data: [
            [0, (Y1_1 + Y0 * X1_1 / X0 + Y1_2 + Y0 * X1_2 / X0) / 2],
            [(X1_1 + X0 * Y1_1 / Y0 + X1_2 + X0 * Y1_2 / Y0) / 2, 0]
        ],
        type: 'line'
    });
    option.series = seriesInOption;
    myChart.setOption(option);
}

function drawNoLinear() {
    let tempOption = {
        tooltip: {},
        xAxis3D: {
            name: "x",
            type: 'value',
            //                min: 'dataMin',//获取数据中的最值
            //                max: 'dataMax'
        },
        yAxis3D: {
            name: "y",
            type: 'value',
            //                min: 'dataMin',
            //                max: 'dataMax'
        },
        zAxis3D: {
            name: "z",
            type: 'value',
            //                min: 'dataMin',
            //                max: 'dataMax'
        },
        grid3D: {
            axisLine: {
                lineStyle: {
                    color: '#000' //轴线颜色
                }
            },
            axisPointer: {
                lineStyle: {
                    color: '#f00' //坐标轴指示线
                },
                show: true //不坐标轴指示线
            },
            viewControl: {
                autoRotate: true, //旋转展示
                //                     projection: 'orthographic'
                beta: 10
            },
            boxWidth: 200,
            boxHeight: 100,
            boxDepth: 100,
            top: -100
        },

        series: [{
                type: 'scatter3D',
                dimensions: ['a', 'b', 'c'], //显示框信息
                data: mutiple_dataset_3D_echart[0],
                symbolSize: 15, //点的大小
                // symbol: 'triangle',
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(0, 51, 255,0.1)',
                    color: 'rgb(0, 51, 255)',
                    opacity: 0.7
                },
                emphasis: {
                    itemStyle: {
                        // color: '#ccc' //高亮
                    }
                }
            },
            {
                type: 'scatter3D',
                dimensions: ['a', 'b', 'c'], //显示框信息
                data: mutiple_dataset_3D_echart[1],
                symbolSize: 15, //点的大小
                // symbol: 'triangle',
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 0, 51,0.1)',
                    color: 'rgb(255, 0, 51)',
                    opacity: 0.7
                },
                emphasis: {
                    // itemStyle: {
                    //     color: '#ccc' //高亮
                    // }
                },
            },
            // 
        ],
        backgroundColor: "#fff"
    }
    myChart.setOption(tempOption, true);
}

function drawNoLinearWithAnimation() {
    let tempDataset = [[],[]];
    dataset_echart.forEach((arr, index) => {
        arr.forEach((item, index1) => {
            console.log(item,index)
            let temp = item.concat();
            temp.splice(2, 0, 0);
            tempDataset[index][index1] = temp;
        })
    });
    let tempMultipleData = [[],[]];
    let seriesOption = [];
    let tempOption = {
        tooltip: {},
        xAxis3D: {
            name: "x",
            type: 'value',
        },
        yAxis3D: {
            name: "y",
            type: 'value',
        },
        zAxis3D: {
            name: "z",
            type: 'value',
        },
        grid3D: {
            axisLine: {
                lineStyle: {
                    color: '#000' //轴线颜色
                }
            },
            axisPointer: {
                lineStyle: {
                    color: '#f00' //坐标轴指示线
                },
                show: true //不坐标轴指示线
            },
            viewControl: {
                autoRotate: true, //旋转展示
                beta: 10
            },
            boxWidth: 200,
            boxHeight: 100,
            boxDepth: 100,
            top: -100
        },

        series: [],
        backgroundColor: "#fff"
    }
    function render() {
        if (tempDataset[0].length > 0) {
            let temp = tempDataset[0].pop();
            tempMultipleData.push([
                temp[0] * temp[0],
                temp[1] * temp[1],
                2 * temp[0] * temp[1] + 50,
                'good'
            ]);
        }else{
            let temp = tempDataset[1].pop();
            tempMultipleData.push([
                temp[0] * temp[0],
                temp[1] * temp[1],
                2 * temp[0] * temp[1] - 50,
                'bad'
            ]);
        }
        seriesOption = [
            {
                type: 'scatter3D',
                dimensions: ['a', 'b', 'c'], //显示框信息
                data: tempDataset[0].concat(tempMultipleData[0]),
                symbolSize: 15, //点的大小
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(0, 51, 255,0.1)',
                    color: 'rgb(0, 51, 255)',
                    opacity: 0.7
                },
                emphasis: {
                    itemStyle: {}
                }
            },
            {
                type: 'scatter3D',
                dimensions: ['a', 'b', 'c'], //显示框信息
                data: tempDataset[1].concat(tempMultipleData[1]),
                symbolSize: 15, //点的大小
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 0, 51,0.1)',
                    color: 'rgb(255, 0, 51)',
                    opacity: 0.7
                },
                emphasis: {},
            },
        ];
        tempOption.series = seriesOption;
        myChart.setOption(tempOption, true);
        while ((tempDataset[0].length + tempDataset[1].length) > 0) {
            setTimeout(
                render, 100
            );
        }
    }
    render();
    
}