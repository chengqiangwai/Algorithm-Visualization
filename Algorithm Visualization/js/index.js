// 定义一些常量
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


// 获取图表的容器，初始化echart对象
let dom = document.getElementById("container");
let myChart = echarts.init(dom);

// 声明一些变量
let onlyLine = null;
let seriesInOption = [];

// 基本配置
let option = {
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
// 监听页面大小变化，图表跟着改变
window.addEventListener("resize", function () {
    myChart.resize();
});

// 绘制随机直线
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

// 保留一条绘制直线
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

// 绘制 所有样本点
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

/**
 * 获取点到直线的距离
 * @param { type: string, data: [[x1,y1],[x2,y2]} line 
 * @param {[x,y]} point 
 */
function getDistance(line, point) {
    const X0 = line.data[0][0] !== 0 ? line.data[0][0] : line.data[1][0];
    const Y0 = line.data[0][1] !== 0 ? line.data[0][1] : line.data[1][1];
    console.log(line, X0, Y0);
    const distance = Math.abs(Y0 * point[0] / X0 + point[1] - Y0) / Math.pow(Math.pow(Y0 / X0, 2) + 1, 0.5);
    return distance;

}

// 绘制距离直线
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

// 绘制三维的样本点 及 分割面
function drawNoLinear() {
    let MinGood = Number.MAX_VALUE;
    let MinBad = -Number.MAX_VALUE;
    // console.log('MinValue', Number.MIN_VALUE)
    for (let i = 0; i < mutiple_dataset_3D_echart[0].length; i++) {
        if (MinGood > mutiple_dataset_3D_echart[0][i][2]) {
            MinGood = mutiple_dataset_3D_echart[0][i][2];
        }
    }
    for (let i = 0; i < mutiple_dataset_3D_echart[1].length; i++) {
        if (MinBad < mutiple_dataset_3D_echart[1][i][2]) {
            MinBad = mutiple_dataset_3D_echart[1][i][2];
        }
    }
    console.log(MinBad, MinGood);
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

        series: [{
            type: 'scatter3D',
            dimensions: ['a', 'b', 'c'], //显示框信息
            data: mutiple_dataset_3D_echart[0],
            symbolSize: 15, //点的大小
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
            },
            throttle: 0
        },
        {
            type: 'scatter3D',
            dimensions: ['a', 'b', 'c'], //显示框信息
            data: mutiple_dataset_3D_echart[1],
            symbolSize: 15, //点的大小
            itemStyle: {
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 51,0.1)',
                color: 'rgb(255, 0, 51)',
                opacity: 0.7
            },
            emphasis: {},
        },
        {
            type: 'surface',
            wireframe: {
                show: false
            },
            shading: 'color',
            equation: {
                x: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                y: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                z: function () {
                    return 0;
                }
            },
            itemStyle: {
                color: 'rgb(222,234,244)',
                opacity: 0.9
            },
            throttle: 0
        },
        {
            type: 'surface',
            wireframe: {
                show: false
            },
            shading: 'color',
            equation: {
                x: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                y: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                z: function () {
                    return MinBad;
                }
            },
            itemStyle: {
                color: 'rgb(222,234,244)',
                opacity: 1
            },
            throttle: 0
        },
        {
            type: 'surface',
            wireframe: {
                show: false
            },
            shading: 'color',
            equation: {
                x: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                y: {
                    step: 10,
                    min: 0,
                    max: 400,
                },
                z: function () {
                    return MinGood;
                }
            },
            itemStyle: {
                color: 'rgb(222,234,244)',
                opacity: 1
            },
            throttle: 0
        }
        ],
        backgroundColor: "#fff"
    }
    myChart.setOption(tempOption, true);
}

// 绘制有二维映射到三维的动画
function drawNoLinearWithAnimation() {
    let tempDataset = [
        [],
        []
    ];
    mutiple_dataset_echart.forEach((arr, index) => {
        arr.forEach((item, index1) => {
            let temp = item.concat();
            temp.splice(2, 0, 0);
            temp[0] *= 10;
            temp[1] *= 10;
            tempDataset[index][index1] = temp;
        })
    });
    let tempMultipleData = [
        [],
        []
    ];
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
                autoRotate: false, //旋转展示
                beta: 10
            },
            boxWidth: 200,
            boxHeight: 100,
            boxDepth: 100,
            top: -100
        },

        series: [],
        backgroundColor: "rgba(0, 0, 0,0.1)"
    };


    function render() {
        let randomI = Math.random();
        let times = Math.ceil(10 * randomI);
        if (randomI >= 0.5) {
            if (tempDataset[0].length > 0) {
                while (times-- && tempDataset[0].length > 0) {
                    let temp = tempDataset[0].pop();
                    tempMultipleData[0].push([
                        temp[0] * temp[0] / 100,
                        temp[1] * temp[1] / 100,
                        2 * temp[0] * temp[1] / 100 + 50,
                        'good'
                    ]);
                }

            } else {
                while (times-- && tempDataset[1].length > 0) {
                    let temp = tempDataset[1].pop();
                    tempMultipleData[1].push([
                        temp[0] * temp[0] / 100,
                        temp[1] * temp[1] / 100,
                        2 * temp[0] * temp[1] / 100 - 500,
                        'bad'
                    ]);
                }
            }
        } else {
            if (tempDataset[1].length > 0) {
                while (times-- && tempDataset[1].length > 0) {
                    let temp = tempDataset[1].pop();
                    tempMultipleData[1].push([
                        temp[0] * temp[0] / 100,
                        temp[1] * temp[1] / 100,
                        2 * temp[0] * temp[1] / 100 + 50,
                        'good'
                    ]);
                }
            } else {
                while (times-- && tempDataset[0].length > 0) {
                    let temp = tempDataset[0].pop();
                    tempMultipleData[0].push([
                        temp[0] * temp[0] / 100,
                        temp[1] * temp[1] / 100,
                        2 * temp[0] * temp[1] / 100 - 50,
                        'bad'
                    ]);
                }
            }
        }

        seriesOption = [{
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
        }
        ];
        tempOption.series = seriesOption;
        myChart.setOption(tempOption, true);
        if ((tempDataset[0].length + tempDataset[1].length) > 0) {
            setTimeout(
                render, 500 * Math.random()
            );
        }
    }
    render();
}

// 根据直线参数及x获取y
function getX2(b, w, x1) {
    return (-b - w[0] * x1) / w[1];
}

// 查找支持向量
function getSupportVector(alphas) {
    let tempSupportVectors = [];
    alphas.forEach((alpha, index) => {
        if (alpha !== 0) {
            tempSupportVectors.push(index);
        }
    })
    return tempSupportVectors
}

// SMO计算过程中的直线及支持向量的变化动画
function playSimpleSVM() {
    let times = outputResult.totalTimes;
    let points = outputResult.points;
    let labels = outputResult.labels;
    let up_label_points = [];
    let down_label_points = [];
    let seriesInOption = [];



    // 筛选出正负标签的样本
    for (let i = 0; i < points.length; i++) {
        console.log('point', i, ...points[i])
        if (labels[i] === 1) {
            up_label_points.push(
                [
                    ...points[i],
                    'good',
                    i
                ]
            )
        } else {
            down_label_points.push(
                [
                    ...points[i],
                    'bad',
                    i
                ]
            )
        }
    }


    // 绘制样本点
    for (let i = 0; i < 2; i++) {
        seriesInOption.push({
            name: i === 0 ? 'good' : 'bad',
            data: i === 0 ? up_label_points : down_label_points,
            type: 'scatter',
            symbolSize: function (data) {
                return 14;
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
    }
    let time = 0;
    let tempSupportVectors = null;

    // 循环绘制支持向量及分割线
    function render() {
        if (time > 0 && time < times - 1) {
            // 删除上一步绘制的直线
            seriesInOption.shift();
            // 删除上一步绘制的支持向量
            seriesInOption.pop();
        }


        // 绘制直线,放在数组的第一个
        seriesInOption.unshift({
            type: 'line',
            data: [
                [95, getX2(outputResult['time' + time].b, outputResult['time' + time].w, 95)],
                [5, getX2(outputResult['time' + time].b, outputResult['time' + time].w, 5)],
            ]
        })
        // 获取新的支持向量
        tempSupportVectors = getSupportVector(outputResult['time' + time].alphas);
        // 绘制支持向量
        seriesInOption.push({
            type: 'scatter',
            name: 'supportVector',
            data: points.filter((point, index) => {
                return tempSupportVectors.indexOf(index) != -1;
            }),
            symbolSize: function (data) {
                return 14;
            },
            label: {
                emphasis: {
                    show: true,
                    formatter: function (param) {
                        console.log('why nothing happen')
                        return `support vector: (${param.data[0]}, ${param.data[1]})`;
                    },
                    position: 'top',
                    color: 'black',
                    fontWeight: 800,
                    distance: 10
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(255,255,255,0)',
                    shadowOffsetY: 5,
                    color: 'rgba(0,255,255,1)',
                    borderColor: 'rgba(255,255,255,1)',
                    borderWidth: 2
                }
            }
        })
        option.series = seriesInOption;
        myChart.setOption(option, true);
        setTimeout(() => {
            if (time < times - 1) {
                time++;
                render();
            }
        }, 1000 * Math.random())
    }
    render();
}
function drawSankey() {
    let tempLinks = [];
    let tempNodes = [];
    for (let i = 0; i < 10; i++) {
        if (i < 6) {
            tempNodes.push({
                attributes: { modularity_class: 0 },
                category: 0,
                id: i.toString() + '1',
                itemStyle: null,
                label: {
                    normal: {
                        show: true,
                        formatter: i.toString() + '1'
                    }
                },
                symbol: 'image://../static/back8.jpg',
                symbolSize: 50,
                emphasis: {
                    label: {
                        formatter: function () {
                            // console.log(i.toString() + '1', 'was hovered');
                            // return 'Hello, pengjingchun'
                        }
                    },

                },
                onmouseover: function () {
                    // console.log('Hello, pengjingchun. How are you?');
                },
                name: "Myriel",
                value: 28.685715,
                x: 0,
                y: 100 * i,
            })
        } else {
            tempNodes.push({
                attributes: { modularity_class: 1 },
                category: 1,
                id: (i - 6).toString() + '2',
                itemStyle: null,
                label: {
                    normal: {
                        show: true,
                        formatter: (i - 6).toString() + '2'
                    }
                },
                symbol: 'image://../static/back8.jpg',
                name: "Myriel",
                symbolSize: 50,
                value: 28.685715,
                x: 200,
                y: 120 * (i - 6),
            })
        }
    }
    let tempColors = [
        "red",
        "blue",
        "yellow",
        "green",
        "gray",
        "silver"
    ]
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            tempLinks.push({
                id: i.toString() + "1 => " + j.toString() + "2",
                lineStyle: {
                    normal: {
                        width: 10 * Math.random(),
                        color: tempColors[i]
                    },
                    emphasis: {
                        width: 10
                    }
                },
                name: null,
                source: i.toString() + "1",
                target: j.toString() + "2",
                value: 10,
                label: {
                    position: 'middle',
                    formatter: 'Hi, pengjingchun!'
                },
                emphasis: {
                    normal: {

                    }
                }
            })
        }
    }
    let categories = [
        {
            name: "类目0"
        },
        {
            name: "类目1"
        }
    ]
    let seriesInOption = [
        {
            type: 'graph',
            layout: 'none',
            data: tempNodes,
            links: tempLinks,
            categories: categories,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            },
            label: {
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.0
            },
            edgeSymbol: ['none', 'arrow']
        },
    ];

    option.series = seriesInOption;
    myChart.on('mouseover', function (params) {
        let tempData = params.data;
        if (tempData.attributes) {
            console.log('Hi, 彭静纯. I miss you!', params.data);
        }
    })
    var image = new Image();
    myChart.setOption(option, true);
}

// 绘制 所有样本点
function drawPlotForBPNN() {
    let seriesInOption = [];
    seriesInOption.push({
        type: 'scatter',
        symbolSize: 14,
        data: dataSetForBPNN,
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
            color: function (item) {
                if (item.data[2] === 1) {
                    return GOOD_COLOR
                } else {
                    return BAD_COLOR
                }
            },
            show: true,
            shadowOffsetY: 5,
            shadowColor: GOOD_SHADOW_COLOR,
            shadowBlur: 10,
        }
    })
    option.series = seriesInOption;
    myChart.setOption(option);
}

function getNodesOfLayer(layer, numOfNodes) {
    let tempNodes = [];
    for (let i = 0; i < numOfNodes; i++) {
        let tempId = (i + 1).toString() + layer;
        tempNodes.push({
            attributes: { modularity_class: 0 },
            category: 0,
            id: tempId,
            itemStyle: null,
            label: {
                normal: {
                    show: true,
                    formatter: tempId
                }
            },
            // symbol: 'image://../static/back8.jpg',
            symbolSize: 50,
            emphasis: {
                label: {
                    formatter: function () {
                        // console.log(i.toString() + '1', 'was hovered');
                        // return 'Hello, pengjingchun'
                    }
                },

            },
            name: "Myriel",
            value: 28.685715,
            x: layer * 100,
            y: 100 * i,
        })
    }
    return tempNodes;
}
function getWeightsOfLayer(weight, layer, isOutputLayer) {
    let tempColors = [
        "red",
        "blue",
        "yellow",
        "green",
        "gray",
        "silver"
    ]
    let tempLinks = [];
    for (let i in weight) {
        let tempI = +i;

        for (let j = 0; j < weight[tempI].length - (isOutputLayer ? 0 : 1); j++) {
            let positiveWidth = Math.abs(weight[tempI][j])
            tempLinks.push({
                id: (j + 1).toString() + (layer - 1) + " => " + (tempI + 1).toString() + layer,
                lineStyle: {
                    width: positiveWidth < 1 ? 1 : positiveWidth,
                    color: 'red',//tempColors[tempI]
                    curveness: 0.1
                },
                name: null,
                source: (j + 1).toString() + (layer - 1),
                target: (tempI + 1).toString() + layer,
                value: 10,
                label: {
                    show: true,
                    position: 'middle',
                    formatter: "W = " + weight[i][j].toFixed(3),
                    color: 'blue'
                },
                emphasis: {
                    lineStyle: {
                        width: 10
                    }
                }
            })
        }
    }
    return tempLinks
}
let renderTime = 0
let lastRenderTime = +new Date();
// 绘制 所有样本点
function drawPlotForBPNNInAnimation(weights) {

    let currentTime = + new Date();
    if (currentTime - lastRenderTime > 100) {
        lastRenderTime = currentTime;
        // console.log("how are you", weights)
        let tempLinks = []
        tempLinks.push(...getWeightsOfLayer(weights.hiddenLayer, 2));
        tempLinks.push(...getWeightsOfLayer(weights.outputLayer, 3, true));

        let tempNodes = [];
        tempNodes.push(...getNodesOfLayer(1, 2));
        tempNodes.push(...getNodesOfLayer(2, 3));
        tempNodes.push(...getNodesOfLayer(3, 1));
        // console.log('tempNodes', tempNodes);
        // console.log('tempLinks', tempLinks);
        let categories = [
            {
                name: "类目0"
            },
            {
                name: "类目1"
            }
        ]
        let seriesInOption = [];
        seriesInOption.push({
            type: 'graph',
            layout: 'none',
            data: tempNodes,
            links: tempLinks,
            categories: categories,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            },
            label: {
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.0
            },
            animationDuration: 100
            // edgeSymbol: ['none', 'arrow']
        })
        renderTime++
        option.series = seriesInOption;
        option.title = {
            text: 'renderTime: ' + renderTime
        }
        myChart.setOption(option, true);
    }

}

function connectWebsocket() {
    var socket = new WebSocket('ws://localhost:3368');
    let i = 0
    let lastRenderTime = + new Date();

    socket.onmessage = function (result, nTime) {
        let currentTime = + new Date();
        if (currentTime - lastRenderTime > 100) {
            lastRenderTime = currentTime;
            drawPlotForBPNNInAnimation(JSON.parse(result.data).weights);
        }
    }
}
connectWebsocket()
// drawPlotForBPNNInAnimation(
//     { "hiddenLayer": { "0": [0.13798828014715492, 0.10339246342492395, -0.03178234464451879], "1": [-0.38893592021364165, -0.41563448690468185, 0.13319172605196328], "2": [-0.32196184025739844, -0.2666644607174584, 0.1788751851740511] }, "outputLayer": { "0": [-0.4461907509425785, 0.34697252035209836, -0.0544673669433659] } }
// )
