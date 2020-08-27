const getFilms = require('./tools/getFilms')
const downloadImages = require('./tools/downloadImages')

getAllFilms()

/**
 * https://movie.douban.com/top250 页面分页的规则
 * get 请求，参数为 start，含义是每页25条数据，从第几条开始
 * 如 https://movie.douban.com/top250?start=25, https://movie.douban.com/top250?start=100
 */
// 根据 url 抓取当前页面所有电影的信息
async function getAllFilms () {
  for (let pageNum = 0; pageNum < 10; pageNum++) {
    // 爬取数据并将需要的数据写到 json 文件
    let films = await getFilms(`https://movie.douban.com/top250?start=${ pageNum * 25 }`, pageNum)
  
    // 下载图片
    await downloadImages(films.map(i => i.pic), pageNum)
  }
}
