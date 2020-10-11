const { setHRT, clearHRT } = require('../')

const delay5000 = setHRT(() => console.log('delay 5000, executed'), 5000)

setHRT(() => {
    console.log('delay 4000, executed')
    console.log('clear 5000')
    clearHRT(delay5000)
}, 4000)