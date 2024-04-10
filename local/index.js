

const proxyImage = require('./proxy-img')
// const eventStream = require('./event-stream')
const uploadServer = require('./upload')
 
const tasks = [
    // proxyImage,
    uploadServer,
    // eventStream,
]

module.exports = {
    start: function(){
        for(const server of tasks){
            server()
        }
    }
}