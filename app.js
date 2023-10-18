
 
const servers = require("./servers") 


void (async () => {
    for (const task of servers) {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await task();
    }
})();