 
const qs = require('querystring'); 
const https = require('https') 
const config = require('./theme.json') 
const common = require('./common.js') 

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
            const file = `./${config.folder}/${type}/${type}_${step}.json`
            common.createFile(file, text)
            resolve({type, step})
        }catch(e){
            console.error(e)
            resolve(false)
        }   
    })
}

async function main(){
    try{
        const {start, end, types = [], updated } = config
        const today =  common.dateFormat().format('YYYYMMDD')
        
        if(updated !== today){
            for(let i= 0; i < types.length; i++){
                const type = types[i] 
                for(let step= start; step <= end; step++){
                    await PostCode(step, type);
                }
            } 
        }
    
        config.updated = today
        common.createFile('./theme.json', JSON.stringify(config))
        console.log('Task had done!')
    }catch(e){ console.log('Task had error!') }
   
}

main() 


