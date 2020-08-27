const fs = require('fs')
const request = require('request')

let sleepTime = 5000 // 过一定时间后返回结果，可以实现相邻请求带上间隔时间
asyncGetAllFilms()

async function asyncGetAllFilms () {
  for (let i = 0; i < 5; i++) {
    let res = await getAllFilms(`https://movie.douban.com/j/new_search_subjects?start=${ i * 20 }`)

    // 保存数据到 json 文件
    await fs.writeFile(`./result/douban/page-${ i + 1 }.json`, JSON.stringify(res.data, null, 2), err => {
      if (err) {
        console.log(err)
      } else {
        console.log(`第${ i + 1 }页数据保存成功`)
      }
    })
  }
}

// 获取所有电影
async function getAllFilms (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        setTimeout(() => {
          resolve(JSON.parse(body))
        }, sleepTime)
      } else {
        reject(err)
      }
    })
  })
}
