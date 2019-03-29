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
    `<button class="normalButton" onclick="drawPlot()">click to draw</button>`,
    `这样每个学生就成了图上的一个点。`,
    `点的颜色——<span style="color:green">绿</span>或<span style="color:red">红</span>`,
    `表示学生在ML课程上的词表现：“优”或“差”。`,
    `当一名学生申请加入课程时，会被要求提供数学成绩和统计学成绩。`,
    `基于现有的数据，可以对学生在ML课程上的表现进行有根据的猜测。`,
    `基本上我们想要的是某种“算法”，接受“评分元组”(math_score, stats_score)输入，预测学生在图中是红点还是绿点（绿/红也称为分类或标签）。`,
    `当然，这一算法某种程度上包括了已有数据中的模式，已有数据也称为训练数据。`,
    `在这个例子中，找到一条红聚类和绿聚类之间的<span style="color:red">直线</span>，然后判断成绩元组位于线的哪一边，是一个好算法。`,
    `根据红绿点的分布，我们可以很容易找到很多条这样的曲线：`,
    `<button class="normalButton" onclick="drawLine()">click to show line</button>`,
    `这里的直线是我们的分界（separating boundary）（因为它分离了标签）或者分类器（classifier）（我们使用它分类数据点）。`,
    `这些直线都可以将样本分类，但那一条更好呢？`,
    `<button class="normalButton" onclick="leaveOneLine()">click to leave just one line</button>`,
    `<button class="normalButton" onclick="drawDistanceLine()">find shortest point</button>`
];