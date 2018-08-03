// 爬某个详情页的预告视频的子进程
const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

// 这个movies来自父进程的send
process.on('message', async movies => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId

    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2'
    })

    await sleep(1000)
 
    const result = await page.evaluate(() => {
      var $ = window.$
      var it = $('.related-pic-video')

      if (it && it.length > 0) {
        var link = it.attr('href')
        var cover = it.attr('style').slice(21,-2)

        return {
          link,
          cover
        }
      }

      return {}
    })

    let video

    // 注意这里是进入了一个新的url
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(2000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }

    const data = {
      video,
      doubanId,
      cover: result.cover
    }

    process.send(data)
  }

  browser.close()
  process.exit(0)
})
