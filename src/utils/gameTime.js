// 游戏内时间（统一出口）
// ------------------------------------------------------------
// 游戏设定：玩家来到南桥夜市的那一天固定为 10月30日（周五）。
// 首页排班表把 30 号标为「今天」，所以玩家自己产生的所有内容
// （发帖、评论、手记、摊位评价、私信）日期一律写 10月30日。
// 剧情里的私信往来止于 10月29日，玩家的动作自然排在其后。
//
// 显示口径：
//   - 论坛帖子 / 手记 / 摊位评价：只显示日期
//   - 帖子下的评论：日期 + 时刻（沿用剧情里"10月13日 20:05"的写法）
//   - 私信：只按天分段显示日期、不显示时刻，所以新消息只记日期
//
// 要改设定的日子，只改 GAME_DATE 这一个常量即可。
// ------------------------------------------------------------

export const GAME_DATE = '10月30日'

function pad(n) {
  return String(n).padStart(2, '0')
}

// 10月30日
export function gameDate() {
  return GAME_DATE
}

// 18:42（本机当前时刻）
export function gameClock() {
  const d = new Date()
  return pad(d.getHours()) + ':' + pad(d.getMinutes())
}

// 10月30日 18:42
export function gameDateTime() {
  return GAME_DATE + ' ' + gameClock()
}
