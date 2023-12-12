const common = require('../common/common.js') 
const config = require('../common/config.json')
const output = './dataset/speech/'

/**
 * - 获取 科技爱好者周刊 言论内容
 * - 每周五 12:00 获取一次
 * - 每20期保存一个文件
 */

module.exports = function main(){
    // "speech":{"updated":"20231213", "page":13, "last": 263, idx:12}
    const speech = config?.speech || {}  
    const num = speech.num || 20
    // const host = 'cdn.jsdelivr.net', path = '/gh/ruanyf/weekly@master/README.md'
    let host = 'raw.githubusercontent.com', path = 'ruanyf/weekly/master/README.md'
    common.onGetSite({ path, host }).then(async (res)=>{ 
        const text = res.data  
        const infoRegex = /- (.+)/g; 
        const indexRegex = /第 (\d+) 期/;
        const titleRegex = /\[(.+)\]/;
        const urlRegex = /\((.+)\)/; 
        
        let match;
        const infos = []
        while ((match = infoRegex.exec(text)) !== null) {
            if( match && match[1] ){
                const info = match[1]
                const url = info.match(urlRegex);
                const index = info.match(indexRegex);
                const title = info.match(titleRegex); 
        
                if (index && index[1]) {
                    infos.push({
                        id: index[1],
                        url: url?.[1],
                        title: title?.[1],  
                    }) 
                }
            }
        }

        infos.reverse(); 
         
        let index = 0, jsonArr = [], idx = speech.idx < num ? speech.last - speech.idx : (speech.last || -1) + 1
   
        for(let i = idx; i < infos.length; i += 1){ 
            const info = infos[i]
            console.log(`          ${ Math.floor(i / infos.length * 100)}%   ----->`, info.title)
            const data = await common.onGetSite({ host, path:'/gh/ruanyf/weekly@master/'+ info?.url });

            if(data.success){
                // const artMatch1 = /^##\s*本周金句\s*(.*)\s^##/m.exec(data?.data); 
                const artMatch = /^##\s+(言论|本周金句|言论与数字|言论和数字)\s+(\d+\、[\s\S]*?)^##/m.exec(data?.data); 
                const speech = artMatch?.[2]?.replace(/\n/g, '').split(/\d、/).filter(Boolean); 
                jsonArr.push({ ...info, speech })
            }else{
                console.log('       ----------失败>', info.title); 
            } 

            if(i !== 0 && ( i % num === 0 || i === infos.length)){
                speech.idx = (i % num) || num 
                index = Math.floor(i / num);
                await common.createFile(output + 'speech_' + index + '.json', JSON.stringify(jsonArr))
                console.log('       ----------创建>', index); 
                jsonArr = [];
            }
 
        }
        speech.last = infos.length
        speech.updated = common.dateFormat().format('YYYYMMDD')
        config.speech = speech
        common.createFile('./common/config.json', JSON.stringify(config));
        console.log('------>: Speech had done!')
    })  
}
 