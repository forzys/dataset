
const https = require('https') 
const qs = require('querystring');
const common = require('./common.js') 
const config = require('./config.json')


/**
 * @title 喜马拉雅全站排行前 100
 * @site https://www.ximalaya.com/top
 * @time 每月爬取一次
 */




function main(){
    const month = common.dateFormat().format('YYYYMM')
    getBing(`./bing/${month}.json`)
 
}