const fs = require('fs');
const path = require('path')


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

const jsonFormat = function(text='', init={}) {
    try{
        const isJson = ['{}', '[]'].includes(text?.slice(0, 1) + text?.slice(-1)) 
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
    }
}

const readFile = function(file){
    try{
        createFile(file, '')
        return fs.readFileSync(file).toString();
    }catch(e){
        return ''
    }
}


exports.readFile = readFile
exports.jsonFormat = jsonFormat
exports.dateFormat = dateFormat
exports.createFile = createFile