const isElevated = require('is-elevated');

(async () => {
    if (!await isElevated()) return
    const os = require('os')
    os.setPriority(-20);
})();