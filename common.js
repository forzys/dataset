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
 
    if (createDir(path.dirname(file))) {
        fs.writeFileSync(file, data) 
    }
}



exports.dateFormat = dateFormat
exports.createFile = createFile