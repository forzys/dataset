
## DATASET

### 当前已实现
#### 1. themes 主题色
        文件：dataset/themes/new/new_{0,12}.json | dataset/themes/popular/popular_{0,12}.json
        说明：新主题和受欢迎主题 分别为0-12页 每页40条数据
       
#### 2. Chinese Color 中国色
        文件：dataset/themes/chinese/color.json
        说明：直接请求

#### 3. bing 壁纸
        文件：dataset/bing/YYYYMM.json
        说明：按月份请求 每个文件30(月天数)条数据

#### 4. gexing 壁纸 
        文件：dataset/gexing/YYYYMM_{1|2|3}.json
        说明：123是将日期合并为一个文件 json内容分别为 1: 01 - 10， 2: 11 - 20， 3:21-30 
         

#### 5. 喜马拉雅排行榜
        文件：dataset/ximalaya/index.json | dataset/ximalaya/top/*.json
        说明：index.json索引title、cover、id等信息。根据id请求ximalaya/top/*.json 
        


### TODO

<del>1. update workflows 定时获取gexing壁纸数据<del>  

    2. 假期安排数据 
    3. douban 豆瓣新片榜
<del>4. 喜马拉雅排行榜<del> 
    
    5. 科技爱好者周刊 - 言论
    
    
