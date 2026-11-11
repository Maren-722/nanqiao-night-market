// 把 dist-offline 处理成「一个 index.html 就能玩」的自包含单文件：
// 1) 外链 CSS 内联进 <style>（file:// 下外链 CSS 会被 CORS 拦截）
// 2) 入口脚本内联进 <body> 末尾（file:// 下 type="module" 会被 CORS 拦截；内联脚本不能 defer，故移到 body 后）
// 3) 菜品图转成 data URI 注入 window.__NQ_FOOD_IMAGES__，代码里优先取用
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

// 1) 内联样式
let inlinedCss = 0;
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
    inlinedCss += 1;
    return "<style>\n" + css + "\n</style>";
  }
);

// 2) 菜品图 → data URI
const foodDir = path.join(dir, "images", "food");
const foodMap = {};
let foodInlined = 0;
if (fs.existsSync(foodDir)) {
  for (const name of fs.readdirSync(foodDir)) {
    const m = /^([a-z]+)\.webp$/.exec(name);
    if (!m) continue;
    const buf = fs.readFileSync(path.join(foodDir, name));
    foodMap[m[1]] = "data:image/webp;base64," + buf.toString("base64");
    foodInlined += 1;
  }
}
const foodScript =
  foodInlined > 0
    ? "<script>window.__NQ_FOOD_IMAGES__=" + JSON.stringify(foodMap) + ";</script>\n  "
    : "";

// 3) 内联入口脚本，移到 body 末尾（此时 #app 已解析完成）
let inlinedJs = 0;
let jsTail = "";
html = html.replace(
  /<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/g,
  (m, src) => {
    const jsPath = path.join(dir, src.replace(/^\.\//, ""));
    if (!fs.existsSync(jsPath)) {
      console.warn("跳过不存在的脚本：" + src);
      return m;
    }
    const js = fs.readFileSync(jsPath, "utf8").replace(/<\/script/gi, "<\\/script");
    fs.unlinkSync(jsPath);
    inlinedJs += 1;
    jsTail = "<script>\n" + js + "\n</script>\n  ";
    return "";
  }
);

html = html.replace(" crossorigin", "");
html = html.replace(/<\/body>/, () => "  " + foodScript + jsTail + "</body>");

fs.writeFileSync(htmlPath, html, "utf8");

const checks = {
  inlinedCss,
  inlinedJs,
  foodImages: foodInlined,
  moduleLeft: (html.match(/type="module"/g) || []).length,
  externalRefLeft:
    (html.match(/src="\.\//g) || []).length + (html.match(/rel="stylesheet"/g) || []).length,
  bytes: fs.statSync(htmlPath).size,
};
console.log("离线版后处理完成：", JSON.stringify(checks));
