 
 
const common = require('../common/common.js') 

const output = './dataset/speech/'

/**
 * - 获取 科技爱好者周刊 言论内容
 * - 每周五 12:00 获取一次
 * - 每20期保存一个文件
 */

function main(){
   
    const host = 'cdn.jsdelivr.net'
  
    common.onGetSite({ path: '/gh/ruanyf/weekly@master/README.md', host }).then(async (res)=>{ 
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
 
        let index = 0, jsonArr = [];
      
        for(let i = 0; i < infos.length; i += 1){ 
            const info = infos[i]
            console.log('----->', info.title)
            const data = await common.onGetSite({ host, path:'/gh/ruanyf/weekly@master/'+ info?.url });

            if(data.success){
                const artMatch = /^##\s+(言论|本周金句|言论与数字)\s+(\d+\、[\s\S]*?)^##/m.exec(data?.data); 
                const speech = artMatch?.[2].replace(/\n/g, '').split(/\d、/).filter(Boolean);
                
                jsonArr.push({ ...info, speech })
            }
                
            if(index != Math.floor(i / 19) || i === infos.length - 1){
                index = Math.floor(i / 19);
                common.createFile(output + 'speech' + index + '.json', JSON.stringify(jsonArr))
                console.log('----------创建>', index);
                jsonArr = [];
            } 
        } 

        console.log('Task Had Done!') 
    }) 
    
}


main()