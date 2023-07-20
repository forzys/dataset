const https = require('https') 
const qs = require('querystring');
const common = require('../common/common.js') 

const output = './dataset/bing/'

function getBing(path){ 
    return new Promise((resolve)=>{
        const bing_data = qs.stringify({
            mkt:'zh-CN'
        });
    
        const options = {
            hostname: 'www.bing.com',
            path: '/hp/api/model'+'?'+bing_data,
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
            },
        }

        const get_req = https.request(options, function(res) { 
            let raw = '';
            res.on('data', (chunk) => {raw += chunk});
            res.on('end', () => {
              try {
                writeBing(raw, path)
                resolve({ success: true })
              } catch (e) {
                resolve({ success: false })
                console.error(e.message);
              }
            }); 
        });
     
        get_req.on('error', (error) => { console.error(error); }) 
        get_req.end(); 
    }) 
}

function writeBing(text, path){
    const file = common.readFile(path);
   
    const current = common.jsonFormat(file, []) 
    const max = Math.max(...current.map(i=> common.dateFormat(i?.date).format('YYYYMMDD')))

    const data = common.jsonFormat(text, [])
    const find = data?.MediaContents?.filter(item=>Number(item.Ssd.slice(0,8)) > max)
     
    const needAdd = find.map(item=>{
        return {
            "date": item?.Ssd?.slice(0,8)?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
            "headline":item?.ImageContent?.Headline,
            "title": item?.ImageContent?.Title, 
            "description":item?.ImageContent?.Description,
            "image_url":'https://cn.bing.com' + item?.ImageContent?.Image?.Url, 
            "main_text": item?.ImageContent?.QuickFact?.MainText,
        }
    }).reverse()

    common.createFile(path, JSON.stringify([].concat(current, needAdd)))
}


function main(){
    const month = common.dateFormat().format('YYYYMM')
    getBing(output + month + '.json')
}
 

main()