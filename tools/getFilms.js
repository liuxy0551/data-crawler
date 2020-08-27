/**
 * 根据 url 抓取当前页面所有电影的信息
 */
const fs = require('fs')
const https = require('https')
const cheerio = require('cheerio')

// url 爬取的网址，pageNum 已存在多少条数据
module.exports = async function getFilms (url, pageNum) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      // 分段返回的 自己拼接
      let html = ''
  
      // 有数据产生的时候 拼接
      res.on('data', chunk => {
        html += chunk
      })
  
      // 拼接完成
      res.on('end', async () => {
        const $ = cheerio.load(html)
        let films = []
        $('li .item').each(function () {
          const title = $('.title', this).text()
          const star = $('.rating_num', this).text()
          const pic = $('.pic img', this).attr('src')
          films.push({ sort: pageNum * 25 + films.length + 1, title, star, pic })
        })
  
        // 按页码写入 json 文件
        let fileName = pageNum + 1
        await fs.writeFile(`./result/filmsInfo/page-${ fileName }.json`, JSON.stringify(films, null, 2), err => {
          if (err) {
            reject(err)
          } else {
            console.log(`第${ fileName }页数据保存成功`)
            resolve(films)
          }
        })
      })
    })
  })
}
