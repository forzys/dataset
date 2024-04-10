 


const theme = require('./theme') 
const bing  = require('./bing')
const gexing = require('./gexing')
const ximalaya = require('./ximalaya')
const speech = require('./speech')
const news = require('./news')

const tasks = [
    news,
    theme,
    bing,
    gexing,
    ximalaya,
    speech,
];

module.exports = tasks;

