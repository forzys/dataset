 
const cheerio = require('cheerio'); 
const config = require('../common/config.json')
const common = require('../common/common.js')

const output = './dataset/gexing/'
 

function getGexing(index){ 
    return new Promise((resolve)=>{
 
        common.onGetSite({
            method: 'GET', 
            host: 'www.woyaogexing.com',
            path: '/shouji/' + (index === 1 ? 'index' : 'index_'+ index+'.html'),
        }).then((res)=>{ 
            if(res?.success){
                resolve({  success: true, gexing: formatHtml(res.data) })
            }else{
                console.log('---------->', {error})
                resolve({  success: false, error: res.error, gexing:'' })
            } 
        }) 
    }) 
}


function formatHtml(body){
    const imgs = [] 
    const $ = cheerio.load(body, { decodeEntities: false })

    $('.pMain .txList-sj', '#main').each(function () {
        imgs.push({
            title: $('a.img', this)?.attr('title'),
            href: $($('a.img',this).html())?.attr('src'),
            date: $('p span', this).text()?.replace('月','')?.replace('日',''),
            month:$('p span', this).text()?.split('月')?.shift(),
            day:$('p span', this).text()?.split('月')?.pop()?.replace('日', ''),

        })
    })

    return imgs 
}


function onGetName(info){
    const day = Number(info.day)
    if(day > 0 && day < 11){
        return info.month + '_' + 1
    }
    if(day > 10 && day < 21){
        return info.month + '_' + 2
    }
    if(day > 20){
        return info.month + '_' + 3
    }
}

// get 202301 - 202306 数据
// async function onGetAftre(){  
//     const date = common.dateFormat().format('YYYYMMDD')
//     const year = date.slice(0, 4) 
//     let page = 1;
//     const after = {}

//     while(page){ 
//         const data = await getGexing(page) 
//         const info = data?.gexing?.reduce((summ, item)=>{
//             const _name = onGetName(item);
//             const month = summ[_name] || [];
//             month.push(item);
//             summ[_name] = month;
//             return summ;
//         }, {});

//         Object.keys(info).forEach(k=>{
//             const mon = after[k] || []
//             after[k] = [].concat(mon, info[k])
//         });
 
//         console.log('-------->', page, Object.keys(after))
   
//         if(after['01_1'] || page === 100){ page = 0 }else{ page++ }
//     }

//     Object.keys(after).forEach(month=>{
//         const name = year + month + '.json' 
//         common.createFile(output+name , JSON.stringify(after[month]))
//     });
   

//     console.log('Task had done!!') 
// }


async function main(){
    try{
        const gexing = config?.gexing || {} 
        const date = common.dateFormat().format('YYYYMMDD')
        const base = onGetName({ month: date.slice(4, 6), day: date.slice(-2) })
        const year = date.slice(0, 4); 
        const after = {}  
        const updated = gexing.updated || base
 
        for(let page= 1; page < 20; page+=1){
            let back
            const data = await getGexing(page);
            const info = data?.gexing?.reduce((summ, item)=>{
                const _name = onGetName(item);
                if(_name >= updated){
                    const month = summ[_name] || [];
                    month.push(item);
                    summ[_name] = month; 
                }else{
                    back = true
                }
                return summ;
            }, {});
    
            Object.keys(info).forEach(k=>after[k] = []?.concat(after[k] || [], info[k]));
     
            if(back){
                break
            }
        } 
 
        const name = year + updated + '.json';

        gexing.updated = base
        config.gexing = gexing

 
        common.createFile(output + name , JSON.stringify(after[base]));
        common.createFile('./common/config.json', JSON.stringify(config));

        console.log('Task had done!', name);
    }catch(e){ console.log('Task had error!' ) }
}

module.exports = main;

 