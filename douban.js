const fs = require('fs')
const request = require('request')

let sleepTime = 5000 // 过指定时间后返回结果，可以实现相邻请求有间隔时间
let errorCount = 0 // 失败计数
let errorMaxCount = 2 // 失败后尝试指定次数，依旧失败则停止
asyncGetAllFilms()

async function asyncGetAllFilms () {
  for (let i = 127; i < 500; i++) {
    let res = await getAllFilms(`https://movie.douban.com/j/new_search_subjects?start=${ i * 20 }`)

    // 保存数据到 json 文件
    await fs.writeFile(`./result/douban/page-${ i + 1 }.json`, JSON.stringify(res.data, null, 2), err => {
      if (err) {
        console.log('writeFile', err)
      } else {
        console.log(`第${ i + 1 }页数据保存成功`)
      }
    })
  }
}

// 获取所有电影
async function getAllFilms (url) {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        setTimeout(() => {
          resolve(JSON.parse(body))
        }, sleepTime)
      } else {
        console.log('error', error)
        if (errorCount < errorMaxCount) {
          setTimeout(() => {
            errorCount++
            getAllFilms(url)
          }, sleepTime)
        } else {
          reject(error)
        }
      }
    })
  }).catch(console.log)
}
