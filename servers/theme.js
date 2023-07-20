 

const https = require('https') 
const qs = require('querystring'); 
const config = require('../common/config.json') 
const common = require('../common/common.js') 

const output = './dataset/themes/' 


function PostCode(step, type='new') { 
    return new Promise((resolve)=>{
        const post_data = qs.stringify({
            step: step,
            sort: type,
            tags: '',
            timeframe: type == 'new' ? 30 :4000, 
        });
    
        const options = {
            hostname: 'colorhunt.co',
            path: '/php/feed.php',
            method: 'POST',
            headers: {
                "Referer": "https://colorhunt.co/",
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8", 
            },
        }
    
        const post_req = https.request(options, function(res) {
            const chunks = [];
            res.on('data',chunk=>chunks.push(chunk));
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                if(res.headers['content-type']?.includes('text/html')){ 
                    writeThemes(body.toString(), type, step).then(resolve)
                } 
            }); 
        });
     
        post_req.on('error', (error) => { console.error(error); })
        post_req.write(post_data);
        post_req.end();

    }) 
}

function writeThemes(text, type, step){ 
    return new Promise((resolve)=>{
        try{
            const name =  [type, step].join('_') + '.json'
            common.createFile(output + type + name, text)
            resolve({ type, step })
        }catch(e){
            console.error(e)
            resolve(false)
        }   
    })
}

async function main(){
    try{
        const theme = config?.theme || {}
        const { start, end, types = [], updated } = theme
        const today =  common.dateFormat().format('YYYYMMDD')
        
        if(updated !== today){
            for(let i= 0; i < types.length; i++){
                const type = types[i] 
                for(let step= start; step <= end; step++){
                    await PostCode(step, type);
                }
            } 
        }
    
        theme.updated = today
        config.theme = theme 
        common.createFile('./common/config.json', JSON.stringify(config))
        console.log('Task had done!')
    }catch(e){ console.log('Task had error!') }
}

main() 


