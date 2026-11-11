/**
 * 参赛环境实测：界面规格 + 慢网
 *
 * 用法：node tests/competition-env-check.cjs
 * 前提：生产包跑在 http://localhost:4174/nanqiao-night-market/
 *        （npm run build && npm run preview -- --port 4174）
 *
 * 第一段：三档界面规格 1920×1080 / 1440×900 / 720×1280 × 5 个页面
 *         —— 横向溢出、关键元素是否就位、导览是否两列
 * 第二段：三档网速（正常 / 较慢 3G / 极慢）× 首页与导览页
 *         —— 首屏可见时间、整页 load 时间、图片完成率、传输体积
 */

const fs = require('node:fs')
const puppeteer = require('puppeteer-core')

const BASE = (process.env.BASE_URL || 'http://localhost:4174/nanqiao-night-market/').replace(/\/$/, '') + '/#'

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].filter(Boolean)

const SPECS = [
  { name: '1920×1080', w: 1920, h: 1080 },
  { name: '1440×900', w: 1440, h: 900 },
  { name: '720×1280', w: 720, h: 1280 }
]

const ROUTES = [
  { path: '/home', label: '首页' },
  { path: '/stalls', label: '导览' },
  { path: '/forum', label: '论坛' },
  { path: '/login', label: '登录' },
  { path: '/messages', label: '私信' }
]

const NETS = [
  { name: '正常', cdp: null },
  { name: '较慢3G', cdp: { latency: 300, download: 1.6 * 1024 * 1024 / 8, upload: 750 * 1024 / 8 } },
  { name: '极慢400k', cdp: { latency: 500, download: 400 * 1024 / 8, upload: 400 * 1024 / 8 } }
]

const NET_TIMEOUT = 45000
const sleep = ms => new Promise(r => setTimeout(r, ms))

;(async () => {
  const executablePath = CANDIDATES.find(p => fs.existsSync(p))
  if (!executablePath) {
    console.error('找不到 Chrome/Edge')
    process.exit(2)
  }

  const browser = await puppeteer.launch({ executablePath, headless: 'new' })
  const page = await browser.newPage()
  const cdp = await page.createCDPSession()
  await cdp.send('Network.enable')

  const errors = []
  page.on('pageerror', e => errors.push(e.message))

  // ========== 第一段：界面规格 ==========
  console.log('=== 一、界面规格（' + SPECS.map(s => s.name).join(' / ') + '）===')
  const specRows = []
  for (const spec of SPECS) {
    for (const route of ROUTES) {
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
      await page.setViewport({ width: spec.w, height: spec.h })
      try {
        await page.goto('about:blank')
        await page.goto(BASE + route.path, { waitUntil: 'domcontentloaded', timeout: 25000 })
      } catch (e) {
        specRows.push({ spec: spec.name, route: route.label, overflow: -1, note: 'NAV_FAIL' })
        continue
      }
      await sleep(700)
      const m = await page.evaluate(() => {
        const de = document.documentElement
        const q = s => document.querySelector(s)
        const grid = q('.stall-grid')
        const cols = grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length : 0
        return {
          overflow: de.scrollWidth - de.clientWidth,
          hero: !!q('.hero'),
          noticeTitle: !!q('.notice-section, .notice-list, .notice-item, #notices'),
          posts: document.querySelectorAll('.post-card').length,
          inputs: document.querySelectorAll('input').length,
          stallCards: document.querySelectorAll('.stall-card').length,
          gridCols: cols,
          navItems: document.querySelectorAll('.nav-link, .nav-item, .navbar a').length,
          bodyText: document.body.innerText.slice(0, 60).replace(/\s+/g, ' ')
        }
      })
      specRows.push({ spec: spec.name, route: route.label, ...m })
    }
  }

  const pad = (s, n) => String(s).padEnd(n)
  console.log(pad('规格', 12) + pad('页面', 8) + pad('横向溢出', 10) + pad('关键元素', 28) + '备注')
  for (const r of specRows) {
    let key = ''
    if (r.note) key = '导航失败'
    else if (r.route === '首页') key = 'hero=' + r.hero + ' 公告=' + r.noticeTitle + ' 导航项=' + r.navItems
    else if (r.route === '导览') key = '卡片=' + r.stallCards + ' 列数=' + r.gridCols
    else if (r.route === '论坛') key = '帖子=' + r.posts
    else if (r.route === '登录') key = '输入框=' + r.inputs
    else key = r.bodyText.slice(0, 20)
    console.log(pad(r.spec, 12) + pad(r.route, 8) + pad(r.overflow === -1 ? 'ERR' : r.overflow, 10) + pad(key, 28) + (r.note || ''))
  }

  // ========== 第二段：慢网 ==========
  console.log('\n=== 二、网速测试（首页 / 导览，1920×1080）===')
  const netRows = []
  for (const net of NETS) {
    for (const route of ['/home', '/stalls']) {
      await page.setViewport({ width: 1920, height: 1080 })
      // hash 路由下切页面不会重载，必须先回空白页再进目标页
      await page.goto('about:blank')
      await cdp.send('Network.clearBrowserCache')
      await cdp.send(
        'Network.emulateNetworkConditions',
        net.cdp
          ? { offline: false, latency: net.cdp.latency, downloadThroughput: net.cdp.download, uploadThroughput: net.cdp.upload }
          : { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }
      )
      const t0 = Date.now()
      let timedOut = false
      try {
        await page.goto(BASE + route, { waitUntil: 'load', timeout: NET_TIMEOUT })
      } catch (e) {
        timedOut = true
      }
      const elapsed = Date.now() - t0
      // 滚到底触发懒加载，再轮询图片完成时间（最多 25s）
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      const pollStart = Date.now()
      let imgDone = 0
      let imgTotal = 0
      let allDoneMs = -1
      while (Date.now() - pollStart < 25000) {
        const s = await page.evaluate(() => {
          const a = [...document.querySelectorAll('img')]
          return { d: a.filter(i => i.complete && i.naturalWidth > 0).length, t: a.length }
        })
        imgDone = s.d
        imgTotal = s.t
        if (s.d >= s.t) {
          allDoneMs = Date.now() - pollStart
          break
        }
        await sleep(1000)
      }
      const perf = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {}
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]
        const res = performance.getEntriesByType('resource')
        let transfer = 0
        let imgsBytes = 0
        for (const r of res) {
          transfer += r.transferSize || 0
          if (/\.jpg|\.png|\.jpeg|\.webp/.test(r.name)) imgsBytes += r.transferSize || 0
        }
        return {
          fcp: fcp ? Math.round(fcp.startTime) : null,
          dcl: nav.domContentLoadedEventEnd ? Math.round(nav.domContentLoadedEventEnd) : null,
          load: nav.loadEventEnd ? Math.round(nav.loadEventEnd) : null,
          msgTransfer: Math.round(transfer / 1024),
          msgImg: Math.round(imgsBytes / 1024),
          requests: res.length
        }
      })
      const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')]
        return { total: all.length, done: all.filter(i => i.complete && i.naturalWidth > 0).length }
      })
      const bodyOk = await page.evaluate(() => document.body.innerText.trim().length > 30)
      netRows.push({ net: net.name, route, elapsed, timedOut, perf, imgs: { done: imgDone, total: imgTotal }, allDoneMs, bodyOk })
    }
  }

  console.log(pad('网速', 12) + pad('页面', 8) + pad('整页load', 12) + pad('FCP', 8) + pad('DOM就绪', 10) + pad('图片完成', 12) + pad('全部图出', 12) + pad('传输KB', 10) + '正文')
  for (const r of netRows) {
    const p = r.perf
    console.log(
      pad(r.net, 12) +
      pad(r.route, 8) +
      pad((r.timedOut ? '超时>' + NET_TIMEOUT / 1000 + 's' : r.elapsed + 'ms'), 12) +
      pad((p.fcp == null ? '-' : p.fcp + 'ms'), 8) +
      pad((p.dcl == null ? '-' : p.dcl + 'ms'), 10) +
      pad(r.imgs.done + '/' + r.imgs.total, 12) +
      pad((r.allDoneMs < 0 ? '>25s' : r.allDoneMs + 'ms'), 12) +
      pad(p.msgTransfer, 10) +
      (r.bodyOk ? '是' : '否')
    )
  }

  console.log('\n资源传输量：' + netRows.map(r => r.route + '@' + r.net + '=' + r.perf.msgTransfer + 'KB(图' + r.perf.msgImg + 'KB,' + r.perf.requests + '请求)').join('  '))

  if (errors.length) {
    console.log('\n运行时错误: ' + [...new Set(errors)].slice(0, 5).join(' | '))
  }

  await browser.close()
})().catch(e => {
  console.error(e)
  process.exit(1)
})
