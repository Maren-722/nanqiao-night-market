// Local assets retain the configured GitHub Pages base path.
// 离线单文件版会把菜品图以 data URI 注入 window.__NQ_FOOD_IMAGES__，存在时优先使用。
export const foodImage = id =>
  globalThis.__NQ_FOOD_IMAGES__?.[id] ||
  `${import.meta.env.BASE_URL}images/food/${id}.webp?v=webp-20261111`
export const foodLabels = {
  chenji: '糖粥藕', zhangjie: '凉面', zhaoji: '汤馄饨', zhenjie: '水果捞',
  awei: '烤冷面', laozhang: '卤味', xiaoli: '炒粉', wangji: '羊肉串',
  liujie: '麻辣烫', aqiang: '臭豆腐'
}
