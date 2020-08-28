/**
 * 淘宝福利买家秀
 */
const fs = require('fs')
const https = require('https')
const request = require('request')

const sleepTime = 1000 // 请求间隔时间
let picUrls = []
getPicsUrl()

async function getPicsUrl () {
  for (let i = 0; i < 20; i++) {
    let res = await getPicUrl('https://api.66mz8.com/api/rand.tbimg.php?format=json')
    picUrls.push(res.pic_url)
    console.log('url', res.pic_url)
    await downloadPic(res.pic_url, i)
  }
  savePicInfo()
}

// 随机获取图片链接
async function getPicUrl (url) {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        setTimeout(() => {
          resolve(JSON.parse(body))
        }, sleepTime)
      } else {
        console.log('error', error)
        reject(error)
      }
    })
  }).catch(console.log)
}

// 保存图片链接
async function savePicInfo () {
  await fs.writeFile(`./taobao/taobao-pic.json`, JSON.stringify(picUrls, null, 2), err => {
    err && console.log('writeFile', err)
  })
}

// 下载图片
async function downloadPic (url, no) {
  https.get(url, res => {
    res.setEncoding('binary')
    let str = ''

    res.on('data', chunk => {
      str += chunk
    })
    res.on('end', function () {
      fs.writeFile(`./taobao/images/${ no + 1 }.jpg`, str, 'binary', err => {
        err && console.log('downloadPic', err)
      })
    })
  })
}
