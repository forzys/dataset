

const proxyImage = require('./proxy-img')
 
const tasks = [
    proxyImage,
]

module.exports = {
    start: function(){
        for(const server of tasks){
            server()
        }
    }
}