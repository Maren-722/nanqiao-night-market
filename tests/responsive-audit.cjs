/**
 * 南桥夜市 · 自适应（多尺寸）审计
 *
 * 用法：node tests/responsive-audit.cjs
 * 前提：站点跑在 http://localhost:5173/nanqiao-night-market/
 *
 * 第一段：游客态下 10 个主页面 × 9 个宽度的横向溢出检查。
 * 第二段：登录后（消息 / 手记 / 摊位详情 / 管理页）在 5 个宽度下的溢出检查。
 */

const fs = require('node:fs')
const puppeteer = require('puppeteer-core')

const BASE = (process.env.BASE_URL || 'http://localhost:5173/nanqiao-night-market/').replace(/\/$/, '') + '/#'

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
].filter(Boolean)

const WIDTHS = [360, 390, 430, 768, 820, 1024, 1280, 1440, 1920]
const ROUTES = ['/', '/home', '/stalls', '/forum', '/messages', '/notes', '/login', '/register', '/ending', '/manager']
const WIDTHS_2 = [360, 390, 768, 1024, 1440]

const sleep = ms => new Promise(r => setTimeout(r, ms))

const measure = () => {
  const de = document.documentElement
  const cw = de.clientWidth
  const sw = de.scrollWidth
  const offenders = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (getComputedStyle(el).position === 'fixed') continue
    if (r.right > cw + 1.5 || r.left < -1.5) {
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : ''
      offenders.push({ tag: el.tagName.toLowerCase() + cls, left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) })
    }
  }
  offenders.sort((a, b) => b.right - a.right)
  return { cw, sw, count: offenders.length, offenders: offenders.slice(0, 4) }
}

const printMatrix = (label, routes, widths, rows) => {
  console.log('\n=== ' + label + '（scrollWidth - clientWidth，· 为 0）===')
  console.log('route'.padEnd(22) + widths.map(w => String(w).padStart(7)).join(''))
  for (const route of routes) {
    const cells = widths.map(w => {
      const r = rows.find(x => x.route === route && x.width === w && x.stage === label)
      if (!r) return ''.padStart(7)
      const v = r.overflow < 0 ? 'ERR' : String(r.overflow)
      return (v === '0' ? '·' : v).padStart(7)
    })
    console.log(route.padEnd(22) + cells.join(''))
  }
  const bad = rows.filter(r => r.stage === label && r.overflow > 0)
  console.log('')
  if (!bad.length) {
    console.log('无横向溢出')
  } else {
    for (const r of bad) {
      console.log(`[${r.route} @ ${r.width}] 溢出 ${r.overflow}px，可疑元素 ${r.count} 个：`)
      for (const o of r.offenders) console.log(`    ${o.tag}  left=${o.left} right=${o.right} w=${o.w}`)
    }
  }
}

;(async () => {
  const executablePath = CANDIDATES.find(p => fs.existsSync(p))
  if (!executablePath) {
    console.error('找不到 Chrome/Edge，请用 CHROME_PATH 指定路径')
    process.exit(2)
  }

  const browser = await puppeteer.launch({ executablePath, headless: 'new' })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))

  const rows = []

  const visit = async (route, width, stage) => {
    await page.setViewport({ width, height: 900 })
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 })
    } catch (e) {
      rows.push({ stage, route, width, overflow: -1, offenders: [], count: 0 })
      return
    }
    await sleep(650)
    const info = await page.evaluate(measure)
    rows.push({ stage, route, width, overflow: info.sw - info.cw, offenders: info.offenders, count: info.count })
  }

  // ---- 第一段：游客态 ----
  for (const route of ROUTES) {
    for (const width of WIDTHS) await visit(route, width, '游客态')
  }

  // ---- 登录 ----
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.removeItem('nq_user'))
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' })
  await sleep(600)
  const inputs = await page.$$('input')
  let loggedIn = false
  if (inputs.length >= 2) {
    await inputs[0].click({ clickCount: 3 })
    await inputs[0].type('A1')
    await inputs[1].click({ clickCount: 3 })
    await inputs[1].type('20060816')
    await page.click('button.btn-block')
    await sleep(1200)
    loggedIn = await page.evaluate(() => !!localStorage.getItem('nq_user'))
  }

  // ---- 取真实详情页 id ----
  await page.goto(BASE + '/stalls', { waitUntil: 'domcontentloaded' })
  await sleep(700)
  const stallId = await page.evaluate(() => {
    const a = document.querySelector('.stall-card')
    return a ? a.getAttribute('href').split('/').pop() : ''
  })
  const postsData = require('../src/data/posts.json')
  const postId = (postsData.find(p => p && p.id) || {}).id || ''

  const routes2 = ['/messages', '/notes', '/manager']
  if (stallId) routes2.push('/stalls/' + stallId)
  if (postId) routes2.push('/forum/' + postId)

  // ---- 第二段：登录态 ----
  for (const route of routes2) {
    for (const width of WIDTHS_2) await visit(route, width, '登录态')
  }

  printMatrix('游客态', ROUTES, WIDTHS, rows)
  printMatrix('登录态', routes2, WIDTHS_2, rows)

  console.log('\n登录成功: ' + loggedIn + '；详情页 id: stall=' + (stallId || '未取到') + ' / post=' + (postId || '未取到'))

  if (errors.length) {
    console.log('\n=== 运行时错误 ===')
    console.log([...new Set(errors)].slice(0, 8).join('\n'))
  }

  await browser.close()
})().catch(e => {
  console.error(e)
  process.exit(1)
})
