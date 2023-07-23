const fs = require('fs');
const path = require('path')
const http = require('http')
const https = require('https')

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


const onGetSite = ({ host, path, port, method, ssl=true })=>{
    return new Promise((resolve)=>{
        const options = {
            method: method || 'GET', 
            hostname: host,
            path: path, 
            port: port || 443,
        }
   
        const get_req = (ssl ? https : http).request(options, function(res) {
            let raw = '';
            res.on('data', (chunk) => {raw += chunk});
            res.on('end', () => {
                try {
                    resolve({ success: true, data: raw })
                } catch (e) {
                    console.error(e.message);
                    resolve({ success: false, error: e })
                }
            }); 
        });

        get_req.on('error', (e) => { resolve({ success: false, error: e }) }) 
        get_req.end(); 
    })

}
 


exports.readFile = readFile
exports.onGetSite = onGetSite
exports.jsonFormat = jsonFormat
exports.dateFormat = dateFormat
exports.createFile = createFile