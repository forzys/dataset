
 
const servers = require("./servers") 
const locality  = require("./local") 

void (async () => {
    if(process.env.NODE_ENV === 'localhost'){
        return locality.start()
    }

    for (const task of servers) {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await task();
    }
})();