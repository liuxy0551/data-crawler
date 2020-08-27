const https = require('https')
const cheerio = require('cheerio')

https.get('https://movie.douban.com/top250', res => {
    // 分段返回的 自己拼接
    let html = ''
    // 有数据产生的时候 拼接
    res.on('data', chunk => {
      html += chunk
    })
    // 拼接完成
    res.on('end', () => {
      // console.log(html)

      const $ = cheerio.load(html)
      let allFilms = []
      $('li .item').each(function () {
        console.log(this)
      })
    })
})
