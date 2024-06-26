const fs = require('fs'); 
const path = require('path')
const http = require('http')
const https = require('https')
const qs = require('querystring');
const os = require('os');
const cheerio = require('cheerio'); 

const dateFormat = function(input) { 
    const date = new Date( input || Date.now())
    const formatType = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
    }
    
      return {
          format:(formatStr)=>{
            return formatStr ? formatStr.replace(
                /Y+|M+|D+|h+|m+|s+/g,
                target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
            ): date.getTime()
          }
      }
}

function jsonFormat(text='', init={}) {
    try{
        const isJson = /\[]|{}/.test(text.replace(/(?<=.).*(?=.$)/,''))
        return isJson ? JSON.parse(text) : init
    }catch(e){
        return init
    }
}

const createFile = function(file, data){
    function createDir (name) {
        if (fs.existsSync(name)) {
            return true
        }

        if (createDir(path.dirname(name))) {
            fs.mkdirSync(name)
            return true
        }
    }
 
    // const files = fs.readdirSync(externalDir); 

    if (createDir(path.dirname(file)) && !!data) {
        fs.writeFileSync(file, data) 

        return true
    }

    return true
}

const readFile = function(file){
    try{
        createFile(file, '')
        return fs.readFileSync(file).toString();
    }catch(e){
        return ''
    }
}

const wait = (delay)=> new Promise((resolve)=> setTimeout(resolve,delay))

const onGetSite = ({ host, path, port, method, query, params, headers, ssl=true })=>{
    return new Promise((resolve, reject)=>{
        const isPost = String(method).toUpperCase() === 'POST'
        const get_data = qs.stringify({ ...query });
        const post_data = qs.stringify({ ...params });
 
        const options = {
            hostname: host,
            method: method || 'GET',
            path: [path, get_data].filter(Boolean).join(path?.includes('?') ? '&' : '?'), 
            port: ssl ? 443 : (port || 80),
            headers,
        } 
      
            const method_req = (ssl ? https : http).request(options, function(res) {

                let raw = isPost ? [] : '';

                res.on('data', (chunk) => {
                    isPost ? raw.push(chunk) : raw += chunk 
                });

                res.on('end', () => {
                    resolve({ success: true, data: raw, headers: res?.headers })
                });

                res.on("error",(e)=>{
                    resolve({ success: false, error: e, headers: res?.headers }) 
                })
            });
 
            method_req.on('error', (e) => {
                resolve({ success: false, error: e }) 
            }) 
            isPost && method_req.write(post_data);
            method_req.end(); 
    })
}
 
exports.formatHtml = function formatHtml(body, callback){
    const $ = cheerio.load(body, { decodeEntities: false })
    return callback($)
}



const getIp = function(){
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = [];

    Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(interfaceInfo => {
        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        ipAddresses.push(interfaceInfo.address);
        }
    });
    });

    return ipAddresses
}
 
exports.wait = wait
exports.readFile = readFile
exports.onGetSite = onGetSite
exports.jsonFormat = jsonFormat
exports.dateFormat = dateFormat
exports.createFile = createFile
exports.getIp = getIp