var url = require('url');
var http = require("http");
var https = require("https");

var contentHeader = {
    'Access-Control-Allow-Origin':'*',
    'Content-Type': "application/json;charset=utf-8",
}

/**
 * 遇到 cross-origin resouce sharing (CORS) issue
 * 本地图片代理 
 * 图片添加 crossorigin ='anonymous'后无法访问
 * http://192.168.8.131:2233/image?url=https://img2.woyaogexing.com/2024/02/22/4b2d5031f3a72de1!400x400.jpg
 * 
 */

module.exports = function(){
    http.createServer(function(req, res){
        const img = req.url.slice(1);
        const image = url.parse(img.replace('image?url=',''));
        if(!img || !image.host){ 
            res.writeHead(200, contentHeader);
            res.write('输入地址（image?url=）开始代理')
            res.end()  
            return
        }
        const request = image.protocol === 'https:' ? https : http
        const options = {
            hostname: image.hostname,
            port: image.port || (image.protocol === 'https:' ? 443 : 80),
            path: image.path,
            method: 'GET',
        };
    
        var proxy = request.request(options, (proxyRes) => {
            res.writeHead(200, contentHeader);
            proxyRes.pipe(res);
        })
    
        proxy.on('error', (error) => {
            console.error('请求错误:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
        
        proxy.end();
    
    }).listen(2233, (res)=>{
        console.log(`图片代理服务已启动，监听端口 2233`, res);
    });
     
}