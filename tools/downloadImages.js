/**
 * 下载图片
 */
const fs = require('fs')
const https = require('https')

module.exports = function downloadImage (pics, pageNum) {
  for (let i in pics) {
    https.get(pics[i], res => {
      res.setEncoding('binary')
      let str = ''

      res.on('data', chunk => {
        str += chunk
      })
      res.on('end', function () {
        fs.writeFile(`./result/images/page-${ pageNum + 1 }-${ Number(i) + 1 }.jpg`, str, 'binary', err => {
          err && console.log(err)
        })
      })
    })
  }
}
