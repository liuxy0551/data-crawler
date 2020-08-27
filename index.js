const fs = require('fs')
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
      let films = []
      $('li .item').each(function () {
        const title = $('.title', this).text()
        const star = $('.rating_num', this).text()
        const pic = $('.pic img', this).attr('src')
        films.push({ title, star, pic })
      })

      downloadImage(films.map(i => i.pic))

      // 写入 json 文件
      fs.writeFile('./films.json', JSON.stringify(films, null, 2), err => {
        if (err) {
          console.log(err)
        } else {
          console.log('films.json 保存成功\n')
        }
      })
    })
})

// 下载图片
function downloadImage (pics) {
  for (let i in pics) {
    https.get(pics[i], res => {
      res.setEncoding('binary')
      let str = ''

      res.on('data', chunk => {
        str += chunk
      })
      res.on('end', function () {
        fs.writeFile(`./images/${ Number(i) + 1 }.png`, str, 'binary', err => {
          if (err) {
            console.log(err)
          } else {
            console.log(`第${ Number(i) + 1 }张图片下载成功`)
          }
        })
      })
    })
  }
}
