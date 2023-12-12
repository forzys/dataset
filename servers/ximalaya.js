const cheerio = require('cheerio'); 
const common = require('../common/common')
const config = require('../common/config.json')

const output = './dataset/ximalaya/'
/**
 * @title 喜马拉雅全站排行前 100
 * @site https://www.ximalaya.com/top
 * @time 每月爬取一次
 */


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
   
 


module.exports = function main(){
    const month = common.dateFormat().format('YYYYMM') 
    const ximalaya = config.ximalaya || {}
    const update =  ximalaya.updated 
    if(update >= month){ 
        return console.log('------>Ximalaya had Done!')
    }
    ximalaya.updated = month
    config.ximalaya = ximalaya

    const host = 'www.ximalaya.com'

    // Task start
    common.onGetSite({ host, path: '/top' }).then(async (res)=>{
        if(res.success){
            const infos = formatHtml(res.data, { type: 'top' });
            for(let page= 0; page < infos.length; page +=1){
                const info = infos[page]
                const data = await common.onGetSite({ host, path: info.beforeApi, }) 
                const datas = JSON.parse(data.data)
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
               
                // 单线程 慢慢跑
                for(let i = 0; i < audios.length; i+=1){  
                    const item = audios[i]
                    console.log('---------->', item.trackName)
                    const track = await common.onGetSite({ path:item.beforeApi, host })
                    const tracks = JSON.parse(track?.data)
                    audios[i].src = tracks?.data?.src
                }

                console.log('---------->', info.title)
                // 保存音频信息文件
                common.createFile(output + 'top/' + info.id + '.json', JSON.stringify(audios)); 
            }

            const index = common.jsonFormat(common.readFile(output + 'index.json')) || {};
            const ids = index?.map(i=>i?.id) 
            const now = infos.filter(info=> !ids?.includes(info.id)) || [] 
            const _index = index.concat(now); 
            const menu = { total: _index.length, updated: new Date().getTime() }
             
            // index 音频文件索引
            common.createFile(output + 'index.json', JSON.stringify(_index)); 
            common.createFile(output + 'menu.json', JSON.stringify(menu));
            common.createFile('./common/' + 'config.json', JSON.stringify(config)); 
        }
        console.log('------>Ximalaya had Done!')
    })
}
 