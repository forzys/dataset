
const https = require('https') 
const qs = require('querystring');
const cheerio = require('cheerio'); 
const common = require('../common/common')
const config = require('../common/config.json')

const output = './dataset/ximalaya/'
/**
 * @title 喜马拉雅全站排行前 100
 * @site https://www.ximalaya.com/top
 * @time 每月爬取一次
 */



function onGetSite(path){
    return new Promise((resolve)=>{
        const options = {
            method: 'GET', 
            hostname: 'www.ximalaya.com',
            path: path,
        }

        const get_req = https.request(options, function(res) { 
            let raw = '';
            res.on('data', (chunk) => {raw += chunk});
            res.on('end', () => {
                try {
                    resolve({success: true, infos: raw })
                } catch (e) {
                    console.error(e.message);
                    resolve({ success: false })
                }
            }); 
        });

        get_req.on('error', (error) => { console.error(error); }) 
        get_req.end(); 
    })
}


function formatHtml(body, extra={}){
    const infos = []
    const $ = cheerio.load(body, { decodeEntities: false })
  
    $('.rank-tabs .rank-tab-content .album-item','#rankPage').each(function () {  
       const info = {
            id: $('a.album-right', this).attr('href').split('/')?.pop(),
            cover:  $('.album-cover>img', this)?.attr('src'),
            title: $('.album-info>.title', this)?.text(),
            category:$('.album-info>.user-category>.user-category_title', this)?.text(),
            playcount:$('.album-info>.user-playcount>.user-playcount', this)?.text(),
            description:$('.album-info>.description', this)?.text(),  
            ...extra,
        } 
        info.beforeApi = '/revision/play/v1/show?num=1&sort=0&size=30&ptype=0&id=' + info.id

        infos.push(info)
    });

    return infos 
}
   


function main(){
    const month = common.dateFormat().format('YYYYMM')
    
    onGetSite('/top').then(async (res)=>{
        if(res.success){
            const infos = formatHtml(res.infos, {type: 'top'})
            for(let page= 0; page < infos.length; page +=1){
                const info = infos[page]
                const data = await onGetSite(info.beforeApi)
  
                const datas = JSON.parse(data.infos)
                const audios = datas.data.tracksAudioPlay?.map(item=>{
                    return {
                        id: info.id,
                        index: item?.index,
                        trackId: item?.trackId,
                        trackName: item?.trackName,
                        createTime: item?.createTime, 
                        beforeApi: '/revision/play/v1/audio?ptype=1&id=' + item?.trackId,
                    }
                })
               
                for(let i = 0; i < audios.length; i+=1){ 
                    const item = audios[i]
                    const track = await onGetSite(item.beforeApi)
                    const tracks = JSON.parse(track.infos)
                    audios[i].src = tracks.data.src
                }

                common.createFile(output + 'top/' + info.id + '.json', JSON.stringify(audios));
                // 保存
            }   

            common.createFile(output + 'index.json', JSON.stringify(infos));

            // onFileSave( output + 'index.json', JSON.stringify(infos))
        } 
    })
}


main()