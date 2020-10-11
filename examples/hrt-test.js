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
            scheduled: to,
            executed: ms
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
        acc.scheduled.push(result.scheduled)
        acc.executed.push(result.executed)
        return acc
    }, {
        scheduled: [],
        executed: []
    })
    console.log(result)
    console.log('avg offset:', getAvg(result.executed) - getAvg(result.scheduled), 'ms')
    console.log('last 50%:', getAvg(result.executed.slice(Math.floor(result.executed.length / 2))) - getAvg(result.scheduled.slice(Math.floor(result.scheduled.length / 2))), 'ms')
}, 4001)
