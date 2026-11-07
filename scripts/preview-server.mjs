// 南桥夜市 · 本地常驻预览服务
// 零依赖：只用 Node 内置模块，托管 dist/ 里的构建产物。
// 固定端口 5173，地址 http://localhost:5173/nanqiao-night-market/
// 崩溃后由 start-preview.bat / 计划任务自动拉起。

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const BASE = '/nanqiao-night-market/'
const PORT = Number(process.env.PREVIEW_PORT || 5173)
const HOST = process.env.PREVIEW_HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
}

function stamp() {
  return new Date().toLocaleString('zh-CN', { hour12: false })
}

function log(...args) {
  console.log(`[${stamp()}]`, ...args)
}


function sendText(res, code, text, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(text)
}

function sendFile(res, file) {
  const ext = path.extname(file).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const noCache = ext === '.html' ? 'no-store' : 'public, max-age=3600'
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': noCache })
  fs.createReadStream(file).pipe(res)
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  log('✗ 找不到 dist/index.html，请先在项目根目录执行 npm run build')
  process.exit(1)
}

const server = http.createServer((req, res) => {
  const urlPath = (() => {
    try {
      return decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    } catch {
      return ''
    }
  })()

  if (urlPath === '/__health') return sendText(res, 200, 'ok')

  // 根路径跳到带 base 的地址，避免用户少打一段就 404
  if (urlPath === '/' || urlPath === '') {
    res.writeHead(302, { Location: BASE })
    return res.end()
  }

  if (!urlPath.startsWith(BASE)) {
    return sendText(res, 404, `只提供 ${BASE} 下的内容`)
  }

  let rel = urlPath.slice(BASE.length)
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'
  const file = path.join(DIST, rel)

  // 防目录穿越
  if (!file.startsWith(DIST)) {
    return sendText(res, 403, 'forbidden')
  }

  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return sendFile(res, file)
    // 前端用 hash 路由，任何未知路径都回 index.html
    return sendFile(res, path.join(DIST, 'index.html'))
  })
})

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    log(`✗ 端口 ${PORT} 已被占用（可能已经有预览服务在跑），本次退出`)
  } else {
    log('✗ 服务出错：', err.message)
  }
  process.exit(1)
})

server.listen(PORT, HOST, () => {
  const nets = os.networkInterfaces()
  const lan = []
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) lan.push(net.address)
    }
  }
  log(`✓ 南桥夜市已启动，端口 ${PORT}`)
  log(`  本机：  http://localhost:${PORT}${BASE}`)
  for (const ip of lan) log(`  局域网：http://${ip}:${PORT}${BASE}`)
})

// 保持进程常驻
setInterval(() => {}, 1 << 30)
