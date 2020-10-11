require('./highPriority')
const TimSort = require('timsort')

class HighResolutionTimeoutWorker {
    constructor() {
        this.tasks = []
        this.loop = this.loop.bind(this)
    }

    loop() {
        // const now = process.hrtime()
        // if (this.tasks[0].second > now[0] )
        const executingTasks = this.filterTasks()
        executingTasks.forEach(T => T.execute())
        // for (let i = 0; i < executingTasks.length; i++) {
        //     executingTasks[i].execute()
        // }
        if (this.execute) this.next = setImmediate(this.loop)
    }

    filterTasks() {
        const now = process.hrtime()
        // const { execute, leftover } = this.tasks.reduce((acc, T) => {
        //     if (T.second <= now[0] && T.ns <= now[1]) acc.execute.push(T)
        //     else acc.leftover.push(T)
        //     return acc
        // }, { execute: [], leftover: [] })
        // this.tasks = leftover
        const execute = []
        const _tasks = [...this.tasks]
        for (const T of _tasks) {
            if (T.second > now[0] || T.ns > now[1]) break
            execute.push(this.tasks.shift())
        }
        if (execute.length) this.taskLengthChanged()
        return execute
    }

    addTask(task) {
        this.tasks.push(task)
        this.onAddTask()
    }

    clearTask(task) {
        this.tasks.splice(this.tasks.findIndex(T => T === task), 1)
        this.onClearTask()
    }

    sortTasks() {
        // this.tasks.sort((a, b) => (a.second * 1000 + a.ns / 1000000000) - (b.second * 1000 + b.ns / 1000000000))
        TimSort.sort(this.tasks, (a, b) => (a.second * 1000 + a.ns / 1000000000) - (b.second * 1000 + b.ns / 1000000000))
    }

    onAddTask() {
        this.taskLengthChanged()
        this.sortTasks()
    }

    onClearTask() {
        this.taskLengthChanged()
    }

    taskLengthChanged() {
        this.execute = this.tasks.length > 0
        if (!this.execute) this.clearLoopTask();
        if (!this.next) this.next = setImmediate(this.loop)
    }

    clearLoopTask() {
        clearImmediate(this.next);
        this.next = undefined
    }
}

class HighResolutionTimeout {
    constructor(cb, delay, ...args) {
        this.now = process.hrtime()
        this.ns = delay * 1000000 + this.now[1]
        this.second = this.now[0]
        for (; this.ns > 999999999; this.ns -= 1000000000) {
            this.second += 1
        }
        this.cb = cb
        this.args = args
    }

    setArgs(...args) {
        this.args = args
    }

    execute() {
        this.cb.apply(null, this.args)
    }
}

// class HighResolutionInterval extends HighResolutionTimeout {
//     constructor(cb, interval, ...args){
//         super()
//         this.interval = this.interval
//     }
//     execute(){
//         super.execute()
//         this = new 
//     }
// }

const worker = new HighResolutionTimeoutWorker()
module.exports = {
    setHRT(cb, delay, ...args) {
        const task = new HighResolutionTimeout(cb, delay, ...args)
        worker.addTask(task)
        return task
    },

    clearHRT(task) {
        return worker.clearTask(task)
    }
}