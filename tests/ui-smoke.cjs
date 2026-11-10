/**
 * 南桥夜市 · 界面回归自检
 *
 * 用法：
 *   npm i -D puppeteer-core        # 只装库，用你本机已装的 Chrome
 *   node tests/ui-smoke.cjs        # 先确保站点跑在 http://localhost:5173/nanqiao-night-market/
 *
 * 可选环境变量：
 *   CHROME_PATH  本机 Chrome 路径（不填则按系统常见位置找）
 *   BASE_URL     站点根地址（默认 http://localhost:5173/nanqiao-night-market/）
 *
 * 它做的是"真的点"：登录、点会话、翻页面、读 DOM 文本，不是静态检查。
 * 改完文案/聊天/结局之后跑一遍，红了就是哪条设定被改回去了。
 */

const path = require('node:path')
const fs = require('node:fs')
const puppeteer = require('puppeteer-core')

const BASE = (process.env.BASE_URL || 'http://localhost:5173/nanqiao-night-market/').replace(/\/$/, '') + '/#'
const SHOT_DIR = path.join(__dirname, 'screenshots')

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean)

const sleep = ms => new Promise(r => setTimeout(r, ms))

let pass = 0
let fail = 0
function check(name, ok, extra = '') {
  if (ok) {
    pass++
    console.log('  ✓ ' + name)
  } else {
    fail++
    console.log('  ✗ ' + name + (extra ? '  → ' + extra : ''))
  }
}

;(async () => {
  const executablePath = CANDIDATES.find(p => fs.existsSync(p))
  if (!executablePath) {
    console.error('找不到 Chrome，请用 CHROME_PATH 指定路径')
    process.exit(2)
  }
  fs.mkdirSync(SHOT_DIR, { recursive: true })

  const browser = await puppeteer.launch({ executablePath, headless: 'new' })
  const page = await browser.newPage()
  const runtimeErrors = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  await page.setViewport({ width: 1440, height: 950 })

  const go = async (route, wait = 900) => {
    await page.goto('about:blank')
    await page.goto(BASE + route, { waitUntil: 'networkidle0' })
    await sleep(wait)
  }
  const login = async (id, pwd) => {
    await go('/login')
    await page.evaluate(() => localStorage.removeItem('nq_user'))
    await go('/login')
    const inputs = await page.$$('input')
    await inputs[0].click({ clickCount: 3 })
    await inputs[0].type(id)
    await inputs[1].click({ clickCount: 3 })
    await inputs[1].type(pwd)
    await page.click('button.btn-block')
    await sleep(1000)
  }
  const openConv = async name => {
    await page.evaluate(n => {
      const el = [...document.querySelectorAll('.chat-list-item')].find(e => e.innerText.includes(n))
      if (el) el.click()
    }, name)
    await sleep(600)
  }
  const body = () => page.evaluate(() => document.querySelector('.chat-window-body')?.innerText || '')

  console.log('— 站点可达 —')
  const res = await page.goto(BASE + '/home', { waitUntil: 'networkidle0' })
  check('首页能打开', res.status() === 200, String(res.status()))

  console.log('— 置顶通知 —')
  await page.evaluate(() => document.querySelector('.pinned-card')?.click())
  await sleep(600)
  const modal = await page.evaluate(
    () => document.querySelector('.modal-body, .notice-modal, .modal')?.innerText || document.body.innerText
  )
  check('不写具体开市日期', !modal.includes('2021年11月1日'), modal.slice(0, 60))
  check('不写「铁皮棚」', !modal.includes('铁皮棚'))
  check('写「五年前」', modal.includes('五年前'))
  await page.keyboard.press('Escape').catch(() => {})

  console.log('— 导览：老板与 ID 同一行同字号 —')
  await go('/stalls')
  const ownerLines = await page.evaluate(() =>
    [...document.querySelectorAll('.stall-owner')].map(e => ({
      text: e.innerText.replace(/\s+/g, ' ').trim(),
      size: getComputedStyle(e).fontSize,
      idSize: e.querySelector('.stall-id') ? getComputedStyle(e.querySelector('.stall-id')).fontSize : ''
    }))
  )
  check('十家摊位都有 ID', ownerLines.length === 10 && ownerLines.every(l => l.text.includes('ID:')), JSON.stringify(ownerLines[0]))
  check('ID 与「老板」同字号', ownerLines.every(l => l.size === l.idSize), JSON.stringify(ownerLines[0]))

  await go('/stalls/laozhang')
  const detail = await page.evaluate(() => document.body.innerText)
  check('老张评论用 emoji，不是【抱拳】', detail.includes('🙏') && !detail.includes('抱拳'))

  console.log('— 陈伯手机：记录已清空，只剩别人后来发的话 —')
  await login('A1', '20060816')
  await go('/messages')
  const names = await page.evaluate(() =>
    [...document.querySelectorAll('.chat-list-item')].map(e => e.innerText.split('\n')[0])
  )
  check('四个会话', names.length === 4, JSON.stringify(names))
  await openConv('刘姐')
  check('刘姐：显示记录已清空', (await body()).includes('记录已清空'), (await body()).slice(0, 40))
  await openConv('老张')
  check('老张：显示记录已清空', (await body()).includes('记录已清空'))
  await openConv('小李')
  const liText = await body()
  check('小李：只有对方发来的', liText.includes('都快七点了') && !liText.includes('等回去了'), liText.slice(0, 60))
  const dates = await page.evaluate(() => [...document.querySelectorAll('.chat-date')].map(e => e.innerText.trim()))
  check('日期像微信一样居中分隔', dates.length === 4, JSON.stringify(dates))
  check('分隔只有日期不含时刻', dates.every(d => /^\d+月\d+日$/.test(d)), JSON.stringify(dates))
  const bubbleTimes = await page.evaluate(() => document.querySelectorAll('.bubble-time').length)
  check('气泡上不显示时刻', bubbleTimes === 0, String(bubbleTimes))

  console.log('— 王主任：担心，不是「闹脾气」 —')
  await login('B2', '20260420')
  await go('/messages')
  await openConv('王主任')
  const w = await body()
  check('没有「闹脾气」', !w.includes('闹脾气'), w.slice(0, 80))
  check('在担心（心里不踏实）', w.includes('心里不踏实'), w.slice(0, 120))
  check('没有「藕都分给街坊」', !w.includes('藕都分给街坊'))

  console.log('— 刘姐：与陈伯的老对话还在 —')
  await login('B4', '0601')
  await go('/messages')
  await openConv('陈伯')
  const lj = await body()
  check('8 月那段还在', lj.includes('每年就你记得'), lj.slice(0, 60))
  check('没有「早起熬粥」', !lj.includes('早起熬粥'))
  check('陈伯走后她没有再发消息', !lj.includes('今晚没见你出摊'), lj.slice(-80))

  console.log('— 老张：五站路 —')
  await login('B1', '1012')
  await go('/messages')
  await openConv('陈伯')
  const lz = await body()
  check(
    '四句对话完整',
    [
      '不用，我家离这儿不远。',
      '跟我还客气啥？走吧。',
      '真不用，也就五站路，你赶紧回去吧。',
      '哎，你这人，真是拗不过你。'
    ].every(s => lz.includes(s)),
    lz.slice(0, 120)
  )

  console.log('— 手记：只读 —')
  await login('A1', '20060816')
  await go('/notes')
  const noteCount = await page.evaluate(() => document.querySelectorAll('.note-card').length)
  check('三篇手记', noteCount === 3, String(noteCount))
  const firstText = await page.evaluate(() => document.querySelector('.note-card .note-content').innerText)
  check('没有「房东换了三茬」', !firstText.includes('房东换了三茬'), firstText.slice(0, 40))
  check('红绳是「袖子往上捋」露出来的', (await page.evaluate(() => document.body.innerText)).includes('袖子往上捋'))
  check('没有在线编辑入口', !(await page.evaluate(() => !!document.querySelector('.note-edit'))))

  console.log('— 截图 —')
  await go('/notes', 700)
  await page.screenshot({ path: path.join(SHOT_DIR, 'notes.png') })
  await go('/stalls', 700)
  await page.screenshot({ path: path.join(SHOT_DIR, 'stalls.png') })

  console.log('— 新开场、食物图片与响应式布局 —')
  await page.evaluate(async () => {
    const images = [...document.querySelectorAll('.stall-photo img')]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map(image => image.decode()))
  })
  check('十家摊位的本地图片全部加载', await page.$$eval('.stall-photo img', images => images.length === 10 && images.every(image => image.naturalWidth > 0 && image.src.includes('/nanqiao-night-market/images/food/'))))
  await page.screenshot({ path: path.join(SHOT_DIR, 'stalls-desktop.png'), fullPage: true })
  await page.click('.stall-card')
  await page.waitForSelector('.detail-photo img')
  check('点击带图摊位卡片仍能打开正确详情', page.url().endsWith('/stalls/chenji'))
  await page.screenshot({ path: path.join(SHOT_DIR, 'detail-desktop.png'), fullPage: true })
  await go('/')
  check('开场说明是推理游戏且有三条玩法提示', (await page.$eval('.game-intro', e => e.textContent)).includes('网页推理游戏') && (await page.$$('.how-to-play li')).length === 3)
  await page.screenshot({ path: path.join(SHOT_DIR, 'intro-desktop.png'), fullPage: true })
  await page.click('.intro-start')
  await page.waitForSelector('.hero')
  check('新开场按钮进入首页', page.url().endsWith('/home'))
  await page.screenshot({ path: path.join(SHOT_DIR, 'home-desktop.png'), fullPage: true })
  for (const width of [390, 320]) {
    await page.setViewport({ width, height: 844 })
    for (const route of ['/', '/home', '/stalls', '/stalls/chenji']) {
      await go(route, 100)
      check(`${width}px ${route} 没有横向溢出`, await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
      if (width === 390) await page.screenshot({ path: path.join(SHOT_DIR, 'mobile-' + (route.replaceAll('/', '-') || 'intro') + '.png'), fullPage: true })
    }
  }
  await page.setViewport({ width: 1440, height: 950 })

  console.log('— 恢复原稿后的完整解谜流程 —')
  const clickText = async (selector, text) => {
    const clicked = await page.evaluate((selector, text) => {
      const el = [...document.querySelectorAll(selector)].find(el => el.textContent.includes(text))
      el?.click()
      return !!el
    }, selector, text)
    if (!clicked) throw new Error('找不到按钮：' + text)
  }
  for (const id of ['p1', 'p2', 'p3']) await go('/forum/' + id, 100)
  await go('/home')
  await clickText('.notice-item', '地铁3号线南桥站')
  await page.waitForSelector('.metro-img')
  await login('B2', '20260420')
  await go('/messages')
  await openConv('刘姐')
  await login('C4826', 'nian')
  await go('/notes')
  check('儿子的三篇手记仍是保留版本', (await page.$$('.note-card')).length === 3 && (await page.$eval('.note-content', e => e.textContent)).includes('怕她以为我过得不好'))
  await login('M1', '20211101')
  await go('/manager')
  await clickText('.history-item', '寻人启事')
  await page.click('.modal-close')
  await page.waitForSelector('.unlock-mask')
  check('正常浏览可以集齐十条线索', await page.evaluate(() => JSON.parse(localStorage.getItem('nq_progress')).length === 10))
  await page.click('.unlock-mask .unlock-btn.primary')
  await page.waitForSelector('.ending-title')
  check('恢复原四幕结局', await page.$eval('.ending-title', e => e.textContent) === '你把它们摊在桌上')
  await clickText('.ending-btn', '往下看')
  await clickText('.ending-btn', '往下看')
  await clickText('.ending-btn', '留着，发出去')
  check('原结局保留地址分支可达', await page.$eval('.ending-title', e => e.textContent) === '那盏灯，从南桥亮到城南')
  await go('/ending')
  await clickText('.ending-btn', '往下看')
  await clickText('.ending-btn', '往下看')
  await clickText('.ending-btn', '删掉这一行')
  check('原结局删除地址分支可达', await page.$eval('.ending-title', e => e.textContent) === '他们把位置留着')
  check('浏览流程没有脚本运行错误', runtimeErrors.length === 0, runtimeErrors.join('; '))

  console.log(`\n结果：${pass} 通过 / ${fail} 失败`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})().catch(err => {
  console.error('跑挂了：', err.message)
  console.error('常见原因：站点没起（先 npm run dev），或端口/路径不对（试 BASE_URL）。')
  process.exit(2)
})
