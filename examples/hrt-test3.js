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
    // function cmpHrtime(a,b){
    //     console.log(a,b);
    //     const ns = a[1] - b[1]
    //     const sec = a[0] - b[0]
    //     return sec + ns / 1000000000
    // }
    const result = results.map((current, index, arr)=> {
        const offset = current.executed - current.scheduled
        return {
            offset,
        }
    }).filter(result => result)
    console.log(JSON.stringify(result))

}, 4001)