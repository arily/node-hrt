const { setHRT, clearHRT } = require('../')

const results = []

// worker.loop()

const tasks = Array.from({ length: 100 }, () => Math.floor(Math.random() * 3000));
tasks.map(to => {
    const random = Math.random()
    to = to + random + 1000
    const timeout = setHRT((taskSetTime) => {
        const delay = process.hrtime(taskSetTime)
        const ms = (delay[1] / 1000000) + delay[0] * 1000
        // console.log(ms, 'ms delay, should be', to)
        results.push({
            desire: to,
            real: ms
        })
    }, to)
    timeout.setArgs(timeout.now)
})


setHRT(() => {
    function getAvg(grades) {
        const total = grades.reduce((acc, c) => acc + c, 0);
        return total / grades.length;
    }
    const result = results.reduce((acc, result) => {
        acc.desire.push(result.desire)
        acc.real.push(result.real)
        return acc
    }, {
        desire: [],
        real: []
    })
    console.log(result)
    console.log('avg offset:', getAvg(result.real) - getAvg(result.desire), 'ms')
    console.log('start from 2:', getAvg(result.real.slice(1)) - getAvg(result.desire.slice(1)), 'ms')
}, 4001)

setTimeout(() => {
    setHRT(() => {
        console.log('still executed')
    }, 123)
}, 5000);