
## DATASET

### 当前已实现
    1. themes 主题色 (themes/new/new_{0,12}.json | themes/popular/popular_{0,12}.json)【新主题和受欢迎主题 分别为0-12页 每页40条数据】
    2. bing 壁纸 (bing/YYYYMM.json)【按月份请求 每个文件30(月天数)条数据】
    3. gexing 壁纸 (gexing/YYYYMM_{1|2|3}.json)【123是将日期合并为一个文件 json内容分别为 1: 01 - 10， 2: 11 - 20， 3:21-30】
    4. 喜马拉雅排行榜（ximalaya/index.json | ximalaya/top/*.json) [index.json索引title、cover、id等信息。根据id请求ximalaya/top/*.json]

### Other Data
    1. Chinese Color 中国色 （themes/chinese/color.json）


### TODO

<del>1. update workflows 定时获取gexing壁纸数据<del>  

    2. 假期安排数据 
    3. douban 豆瓣新片榜
<del>4. 喜马拉雅排行榜<del> 
    
    5. 科技爱好者周刊 - 言论
    
    
