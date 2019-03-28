let math_stats_dataset = [];
let dataset_echart = [
    [],
    []
];
for (let i = 80; i < 100; i += 2) {
    let tempI = i + Math.random();
    for (let j = 0; j < 3; j++) {
        math_stats_dataset.push({
            math_score: Math.ceil(tempI),
            stats_score: Math.ceil(100 * Math.random()),
            performance: 1
        })
    }
}
for (let i = 80; i < 100; i += 2) {
    let tempI = i + Math.random();
    for (let j = 0; j < 3; j++) {
        math_stats_dataset.push({
            math_score: Math.ceil(100 * Math.random()),
            stats_score: Math.ceil(tempI),
            performance: 1
        })
    }
}

for (let i = 40; i < 90; ) {
    let tempI = i;
    dataset_echart[0].push(
        [
            i,
            110 - i + (i - 20) * Math.random(),
            'good'
        ]
    );
    i += 40 / i
}
for (let i = 15; i < 55;) {

    dataset_echart[1].push(
        [
            i,
            20 + (70 - i) * Math.random(),
            'bad'
        ]
    );
    i += i / 40;
}
let allWords = [
    `假设你的大学开设了一门机器学习（ML）课程.`,
    `课程导师发现数学或统计学好的学生表现最佳。`,
    `随着时间的推移，积累了一些数据，包括参加课程的学生的数学成绩和统计学成绩，以及在ML课程上的表现（使用两个标签描述，“优”、“差”）。`,
    `现在，课程导师想要判定数学、统计学分数和ML课程表现之间的关系。`,
    `也许，基于这一发现，可以指定参加课程的前提条件。`,
    `这一问题如何求解？让我们从表示已有数据开始。`,
    `我们可以绘制一张二维图形，其中一根轴表示数学成绩，另一根表示统计学成绩。`,
    `<button id="drawPlot">click to draw</button>`,
    `这样每个学生就成了图上的一个点。`,
    `点的颜色——<span style="color:green">绿</span>或<span style="color:red">红</span>`,
    `表示学生在ML课程上的词表现：“优”或“差”。`
];