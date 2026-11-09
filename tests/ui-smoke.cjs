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
  const clickText = async (selector, text) => {
    const clicked = await page.evaluate((selector, text) => {
      const element = [...document.querySelectorAll(selector)].find(el => el.innerText.includes(text))
      element?.click()
      return Boolean(element)
    }, selector, text)
    if (!clicked) throw new Error(`找不到可点击的内容：${text}`)
  }

  console.log('— 站点可达 —')
  const res = await page.goto(BASE + '/home', { waitUntil: 'networkidle0' })
  check('首页能打开', res.status() === 200, String(res.status()))
  await go('/ending')
  check('集齐线索前结局锁定', await page.$eval('.blocked-text', el => el.innerText) === '灯还没亮。')

  await go('/home')

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
  check('在担心（心里不踏实）', /心里(?:也)?不踏实/.test(w), w.slice(0, 120))
  check('没有「藕都分给街坊」', !w.includes('藕都分给街坊'))
  await openConv('刘姐')
  check('小李私信保留刘姐的密码线索', (await body()).includes('0601'))

  console.log('— 刘姐：与陈伯的老对话还在 —')
  await login('B4', '0601')
  await go('/messages')
  await openConv('陈伯')
  const lj = await body()
  check('8 月那段还在', lj.includes('明儿又到那天了') && lj.includes('二十年'), lj.slice(0, 60))
  check('没有「早起熬粥」', !lj.includes('早起熬粥'))
  check('陈伯走后她没有再发消息', !lj.includes('今晚没见你出摊'), lj.slice(-80))

  console.log('— 老张：五站路 —')
  await login('B1', '1012')
  await go('/messages')
  await openConv('陈伯')
  const lz = await body()
  check(
    '老张提议捎一段，陈伯留下3号线和五站的线索',
    ['女婿今晚开车', '南桥上3号线，五站就到'].every(s => lz.includes(s)),
    lz.slice(0, 120)
  )

  console.log('— 手记：只读 —')
  await login('A1', '20060816')
  await go('/notes')
  const noteCount = await page.evaluate(() => document.querySelectorAll('.note-card').length)
  check('三篇手记', noteCount === 3, String(noteCount))
  const firstText = await page.evaluate(() => document.querySelector('.note-card .note-content').innerText)
  check('没有「房东换了三茬」', !firstText.includes('房东换了三茬'), firstText.slice(0, 40))
  check('红绳上的「念」字加粗显示', await page.$eval('.note-card strong', el => el.innerText) === '念')
  check('红绳是「袖子往上捋」露出来的', (await page.evaluate(() => document.body.innerText)).includes('袖子往上捋'))
  check('没有在线编辑入口', !(await page.evaluate(() => !!document.querySelector('.note-edit'))))

  console.log('— 截图 —')
  await go('/notes', 700)
  await page.screenshot({ path: path.join(SHOT_DIR, 'notes.png') })
  await go('/stalls', 700)
  await page.screenshot({ path: path.join(SHOT_DIR, 'stalls.png') })

  console.log('— 完整解锁与两种后续 —')
  for (const id of ['p1', 'p2', 'p3']) await go('/forum/' + id, 100)
  await go('/home')
  await clickText('.notice-item', '地铁3号线南桥站')
  await page.waitForSelector('.metro-img')
  await login('C4826', 'nian')
  await go('/notes')
  await login('M1', '20211101')
  await go('/manager')
  await clickText('.history-item', '寻人启事')
  check('最后一条寻人启事仍可阅读', await page.$eval('.modal-content', el => el.innerText.includes('红绳')))
  await page.click('.modal-close')
  await page.waitForSelector('.unlock-mask')
  check('通过原有页面集齐十条线索，显示结局入口', !!await page.$('.unlock-mask .unlock-btn.primary'))
  await page.click('.unlock-mask .unlock-btn.primary')
  await page.waitForSelector('.ending-title')
  const endingHeading = () => page.$eval('.ending-title', el => el.innerText)
  check('第一页面向玩家回顾线索', await endingHeading() === '关门以后')
  await clickText('.ending-btn', '看陈伯的故事')
  check('第二页交代地点与父子关系', await endingHeading() === '那碗粥是谁喝的' &&
    await page.$eval('.ending-card', el => el.innerText.includes('第五站是梧桐苑')))
  await clickText('.ending-btn', '看后续')
  check('第三页有两种后续，进度仍为三页', await endingHeading() === '把话捎给谁' &&
    (await page.$$('.stage-dots .dot')).length === 3)
  await clickText('.ending-btn', '私信告诉他梧桐苑')
  check('私信路线显示父子见面的后续', await endingHeading() === '你坐，我来')
  await clickText('.ending-btn', '回到选择')
  await clickText('.ending-btn', '请王主任先问陈伯')
  check('转达路线显示陈伯回信的后续', await endingHeading() === '有空就来喝粥')
  await page.setViewport({ width: 390, height: 844 })
  await sleep(650)
  check('手机宽度下结局没有横向溢出', await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth))
  await page.screenshot({ path: path.join(SHOT_DIR, 'ending.png'), fullPage: true })

  console.log(`\n结果：${pass} 通过 / ${fail} 失败`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})().catch(err => {
  console.error('跑挂了：', err.message)
  console.error('常见原因：站点没起（先 npm run dev），或端口/路径不对（试 BASE_URL）。')
  process.exit(2)
})
