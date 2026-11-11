// 游戏内时间（统一出口）
// ------------------------------------------------------------
// 游戏设定：玩家来到南桥夜市的那一天固定为 10月30日（周五）。
// 首页排班表把 30 号标为「今天」，私信里最新的往来也都停在 10月30日。
// 所以玩家自己产生的所有内容（发帖、评论、手记、摊位评价、私信）
// 日期一律写 10月30日；钟点取本机当前时间，让"刚发的"看起来就是刚刚发生。
//
// 要改设定的日子，只改 GAME_DATE 这一个常量即可。
// ------------------------------------------------------------

export const GAME_DATE = '10月30日'

function pad(n) {
  return String(n).padStart(2, '0')
}

function toMinutes(hhmm) {
  const m = String(hhmm || '').match(/(\d{1,2}):(\d{2})\s*$/)
  return m ? (+m[1]) * 60 + (+m[2]) : null
}

function nowMinutes() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

// 10月30日
export function gameDate() {
  return GAME_DATE
}

// 18:42
export function gameClock() {
  const m = nowMinutes()
  return pad(Math.floor(m / 60)) + ':' + pad(m % 60)
}

// 10月30日 18:42
export function gameDateTime() {
  return GAME_DATE + ' ' + gameClock()
}

// 同上，但保证不早于 refDateTime（同一会话的上一条消息）。
// 场景：剧情里 10月30日 当天最后一条往来是 17:26，玩家若在白天打开游戏，
// 本机时间可能早于它，直接写上去会排在前面、显得时间倒挂，
// 这里把它顺延到参考时间之后一分钟。日期不同的则无需处理。
export function gameDateTimeAfter(refDateTime) {
  const ref = String(refDateTime || '')
  const refIsToday = ref.startsWith(GAME_DATE)
  const refMin = refIsToday ? toMinutes(ref) : null
  let m = nowMinutes()
  if (refMin !== null && m <= refMin) m = refMin + 1
  m = Math.min(m, 23 * 60 + 59)
  return GAME_DATE + ' ' + pad(Math.floor(m / 60)) + ':' + pad(m % 60)
}
