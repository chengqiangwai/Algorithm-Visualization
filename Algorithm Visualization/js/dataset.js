let math_stats_dataset = [];
let dataset_echart = [
    [],
    []
];
for (let i = 80; i < 100; i += 2) {
    let tempI = i + Math.random();
    for (let j = 0; j < 3; j++) {
        // dataset_echart[0].push( [
        //     Math.ceil(tempI),
        //     Math.ceil(100 * Math.random()),
        //     'good'
        // ]);
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
        // dataset_echart[0].push( [
        //     Math.ceil(100 * Math.random()),
        //     Math.ceil(tempI),
        //     'good'
        // ]);
        math_stats_dataset.push({
            math_score: Math.ceil(100 * Math.random()),
            stats_score: Math.ceil(tempI),
            performance: 1
        })
    }
}

// for (let i = 0; i < 80; i += 2) {
//     let tempI = i + Math.random();
//     for (let j = 0; j < 2; j++) {
//         // dataset_echart[1].push( [
//         //     Math.ceil(80 * Math.random()),
//         //     Math.ceil(tempI),
//         //     'bad'
//         // ]);
//         math_stats_dataset.push({
//             math_score: Math.ceil(80 * Math.random()),
//             stats_score: Math.ceil(tempI),
//             performance: -1
//         })
//     }
// }


// for (let i = 0; i < 50; i+=3) {
//     let tempI = i;
//     let tempRandom = Math.random();
//     dataset_echart[0].push(
//         [
//             tempI,
//             100 * tempRandom + (1 - tempRandom) * (78 - tempI),
//             'good'
//         ]
//     );
// }

// for (let i = 50; i < 90; i+=1) {
//     let tempI = i;
//     let tempRandom = Math.random();
//     dataset_echart[0].push(
//         [
//             tempI,
//             100 * tempRandom + (1 - tempRandom) * (78 - tempI),
//             'good'
//         ]
//     );
// }

// for (let i = 90; i < 100; i+=3) {
//     let tempI = i;
//     let tempRandom = Math.random();
//     dataset_echart[0].push(
//         [
//             tempI,
//             100 * tempRandom + (1 - tempRandom) * (78 - tempI),
//             'good'
//         ]
//     );
// }

// for (let i = 0; i < 30; i+=1) {
//     let tempI = i;
//     dataset_echart[1].push(
//         [
//             tempI,
//             (78 - tempI - 15) * Math.random(),
//             'bad'
//         ]
//     );
// }
// for (let i = 30; i < 60; i+=1) {
//     let tempI = i;
//     dataset_echart[1].push(
//         [
//             tempI,
//             (78 - tempI - 5) * Math.random(),
//             'bad'
//         ]
//     );
// }
// for (let i = 60; i < 78; i+=3) {
//     let tempI = i;
//     dataset_echart[1].push(
//         [
//             tempI,
//             (78 - tempI - 5) * Math.random(),
//             'bad'
//         ]
//     );
// }
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
// console.log('math_stats_dataset', JSON.stringify(math_stats_dataset));