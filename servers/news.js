
const config = require('../common/config.json')
const common = require('../common/common.js') 

const _host = 'news.topurl.cn'
const output = './dataset/news/'



function formatHtml(body){
    return common.formatHtml(body, ($)=>{
        const news = []

        $('.news-wrap .line', '.content').each(function () {
            news.push({
                id: news.length + 1,
                href: $($('a',this).html())?.attr('href'),
                title:$('a', this).text()
            })
        })
        return news
    })
}

 


/**
 * 每日新闻简报
 */

module.exports = function main(){
    const today = common.dateFormat().format('YYYYMMDD') 
    const news = config.news || {}
    const update = news.updated 

    if(update >= today){ 
        return console.log('------>: News had Done!')
    }
    news.updated = today
    config.news = news 

    // Task start
    common.onGetSite({ host:_host }).then(async (res)=>{
        if(res.success){
            const infos = formatHtml(res.data);
  
            common.createFile(output + today + '.json', JSON.stringify(infos)); 
 
            common.createFile('./common/' + 'config.json', JSON.stringify(config)); 
        }
        console.log('------>: News had Done!')
    })
}