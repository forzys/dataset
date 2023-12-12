


// https://www.fonts.net.cn/commercial-free/fonts-zh-2.html

//  id[font-list] ul.site_font_list { li a [font-detail-link] }

// [post]
// id: 31655382814
// type: font
// ver: new
  

const common = require('../common/common.js')
 
function onGetFont(){

    common.onGetSite({
        host: 'www.fonts.net.cn',
        path: '/commercial-free/fonts-zh-$.html'?.replace('$', 1),
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
        },
    }).then((res)=>{ 

        common.formatHtml(res.data, ($)=>{
            const fonts = []
            $('.site_font_list li', '#font-list').each(function () {
                fonts.push({
                    title: $('a.site_font_name', this)?.attr('title'),
                    id: $('a.site_font_name', this)?.attr('font-detail-link'),
                    cover: $('a.site_font_cover>img', this)?.attr('src'),
                })
            })
            return fonts 
        })
 
    })
}
 

module.exports = function main(){
    onGetFont()
    console.log('------>: Font had done!')
};





