// 把 dist-offline 的后处理做完，使产物可直接双击（file://）运行：
// 1) 外链 CSS 内联进 <style>（file:// 下外链 CSS 会被 CORS 拦截）
// 2) 入口脚本改为普通 <script defer>（file:// 下 type="module" 会被 CORS 拦截）
// 用法：npm run build:offline
const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname, "..", "dist-offline");
const htmlPath = path.join(dir, "index.html");

if (!fs.existsSync(htmlPath)) {
  console.error("dist-offline/index.html 不存在，先运行 vite build --config vite.config.offline.mjs");
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, "utf8");

let inlined = 0;
html = html.replace(
  /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  (m, href) => {
    const cssPath = path.join(dir, href.replace(/^\.\//, ""));
    if (!fs.existsSync(cssPath)) {
      console.warn("跳过不存在的样式文件：" + href);
      return m;
    }
    const css = fs.readFileSync(cssPath, "utf8");
    fs.unlinkSync(cssPath);
    inlined += 1;
    return "<style>\n" + css + "\n</style>";
  }
);

html = html.replace(
  /<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/g,
  (m, src) => `<script defer src="${src}"></script>`
);
html = html.replace(/ type="module"/g, "").replace(/ crossorigin/g, "");

fs.writeFileSync(htmlPath, html, "utf8");

const checks = {
  inlinedCss: inlined,
  moduleLeft: (html.match(/type="module"/g) || []).length,
  externalCssLeft: (html.match(/rel="stylesheet"/g) || []).length,
  deferScript: /<script defer src=/.test(html),
  bytes: fs.statSync(htmlPath).size,
};
console.log("离线版后处理完成：", JSON.stringify(checks));
