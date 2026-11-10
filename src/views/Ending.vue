<template>
  <div class="ending-page">
    <!-- 未集齐：灯还没亮 -->
    <div v-if="!unlocked" class="ending-card">
      <span class="ending-lamp dim">🏮</span>
      <p class="blocked-text">灯还没亮。</p>
      <p class="blocked-sub">夜市的故事，还没到说再见的时候。</p>
      <hr class="ending-divider">
      <button class="ending-btn" @click="$router.push('/home')">回到夜市</button>
    </div>

    <!-- 已集齐：分幕结局 -->
    <div v-else class="ending-shell">
      <div class="ending-card" :key="stage">
        <p class="stage-tag">{{ stageLabel }}</p>

        <!-- 第一幕：桌上 -->
        <template v-if="stage === 0">
          <h1 class="ending-title">你把它们摊在桌上</h1>
          <p class="ending-text">十月三十日，夜里十一点。</p>
          <p class="ending-text">
            你把这几天的东西一样一样摊开：一张排班表，三张帖子截图，六个账号，一条地铁线。
          </p>
          <p class="ending-text">
            你在纸上写下几个词：陈伯。陈桂生。A1。糖粥藕。二十年。
          </p>
          <p class="ending-text">
            写完你才发现，这不像一个人的档案，倒像一个人被留在这世上的全部痕迹。
          </p>
          <p class="ending-text">你其实已经知道答案了。只是还没敢承认。</p>
          <div class="ending-actions">
            <button class="ending-btn primary" @click="stage = 1">往下看</button>
          </div>
        </template>

        <!-- 第二幕：真相 -->
        <template v-else-if="stage === 1">
          <h1 class="ending-title">真相是三件事</h1>

          <p class="ending-kicker">一 · 他有个儿子</p>
          <p class="ending-text">
            2006年8月16日，城南老街。四岁的陈念在人群里松开了父亲的手。那天他手腕上系着一根红绳，绳结里绣着一个「念」。
          </p>
          <p class="ending-text">
            之后的二十年，陈桂生没搬过家，没换过号码，没离开过这条街。他怕儿子回来，找不到门。
          </p>
          <p class="ending-text">
            今年十月，儿子回来了。他坐在离父亲三米远的地方，喝了一碗糖粥藕，说这个味道特别亲切。第二次来，他把袖子捋上去，露出手腕上那根红绳，问：认不认得这个字。
            <br>父亲低头搅着粥，说：不认得。
          </p>

          <p class="ending-kicker">二 · 他病了</p>
          <p class="ending-text">
            十月五日体检，他住了一个星期的院。这件事他没告诉任何人，只在手记里写了一句：认了，让他守着我走吗？
          </p>
          <p class="ending-text">
            他算得很清楚——认了，就是让孩子从相认那天起，开始守灵。
          </p>

          <p class="ending-kicker">三 · 他回了家</p>
          <p class="ending-text">
            10月26日晚上，他把最后一锅粥分给街坊，把灶台擦干净，给王主任留了张纸条。
          </p>
          <p class="ending-text">
            然后他坐上3号线，往城南，第五站，梧桐苑。那是他住了二十年、一直没搬过的老屋。
          </p>
          <p class="ending-text">
            他没有走远。他只是回了家，等一件他不想让任何人看见的事。
          </p>
          <div class="ending-actions">
            <button class="ending-btn primary" @click="stage = 2">往下看</button>
          </div>
        </template>

        <!-- 第三幕：你写的那条帖子 -->
        <template v-else-if="stage === 2">
          <h1 class="ending-title">凌晨一点，你写了一条帖子</h1>
          <p class="ending-text">
            你写A1，写那锅粥，写一根红绳，写一个在夜市站了二十年的父亲。
          </p>
          <p class="ending-text">你写：他没有失踪，他只是回家了。</p>
          <div class="post-preview">
            <p class="post-preview-title">陈伯没有失踪，他只是回家了</p>
            <p class="post-preview-body">
              前面那些都是真的。我一条一条核过。A1的灶台是他自己擦的，钥匙交给了王主任。他不是出事，他是自己走的。<br>
              他儿子不知道。这条街上的人也都不知道。
            </p>
            <p class="post-preview-addr">
              他住在城南梧桐苑，3号线南桥站往城南第五站，5号楼2单元101。
            </p>
          </div>
          <p class="ending-text">
            你盯着最后那一行看了很久。
          </p>
          <p class="ending-text">
            发出去，明天就会有人站在他家门口；删掉，这条街会继续等一个不会回来的人。
          </p>
          <p class="ending-text strong">删，还是不删？</p>
          <div class="ending-actions row">
            <button class="ending-btn" @click="choose('delete')">删掉这一行，发出去</button>
            <button class="ending-btn primary" @click="choose('keep')">留着，发出去</button>
          </div>
        </template>

        <!-- 第四幕：尾声 -->
        <template v-else>
          <h1 class="ending-title">{{ choice === 'delete' ? '他们把位置留着' : '那盏灯，从南桥亮到城南' }}</h1>

          <template v-if="choice === 'delete'">
            <p class="ending-text">你删掉了那一行。</p>
            <p class="ending-text">
              帖子发出去，论坛安静了一会儿。然后有人回：人没事就好。
            </p>
            <p class="ending-text">
              第二天，A1摊前放了一碗糖粥藕。第三天又多了一碗。没有人组织，也没有人说破。
            </p>
            <p class="ending-text">
              十一月一日，夜市五周年。A1的灯亮着——王主任把摊位留着，老张每天来擦一遍灶台，刘姐在灶上温着一锅粥。
            </p>
            <p class="ending-text">
              他们不知道他在哪儿。但他们把他的位置留着。
            </p>
            <p class="ending-text">
              有些人不告而别，是为了让别人好好过。<br>
              而有些人守着一个空摊子，是为了让不告而别的人回来时，还有个地方站。
            </p>
            <p class="ending-text">
              你关掉网页。窗外，南桥的灯一盏一盏亮起来。
            </p>
          </template>

          <template v-else>
            <p class="ending-text">你没有删。</p>
            <p class="ending-text">
              帖子在凌晨一点四十分发出去。第一个回复的人是「今天吃什么」，他只回了三个字：我明天去。
            </p>
            <p class="ending-text">
              十一月一日，夜市五周年。
            </p>
            <p class="ending-text">
              A1的灯亮了。灶前站着一个年轻人，手腕上系着一根褪色的红绳，正笨手笨脚地搅一锅粥。陈伯坐在旁边的小马扎上，裹着厚外套，看着他，没说话，一直在笑。
            </p>
            <p class="ending-text">
              王主任在人群外面站了很久，最后转过身，抹了一把脸。
            </p>
            <p class="ending-text">
              老张端来一碟卤蛋，放在灶台上：老陈，五周年，得有个样子。
            </p>
            <p class="ending-text">
              刘姐把一碗绿豆汤放在陈伯手边：喝吧，今年的。
            </p>
            <p class="ending-text strong">
              那盏灯，从南桥一直亮到城南。
            </p>
          </template>

          <hr class="ending-divider">
          <p class="ending-fin">— 完 —</p>
          <div class="ending-actions">
            <button class="ending-btn" @click="$router.push('/home')">再回夜市看看</button>
            <button class="ending-btn ghost" @click="restart">重新开始</button>
          </div>
        </template>
      </div>

      <!-- 进度指示 -->
      <div class="stage-dots">
        <span v-for="n in 4" :key="n" class="dot" :class="{ on: stage >= n - 1 }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isComplete } from '../utils/progress'

// 结局页守卫：线索没有集齐时，直接访问只会看到"灯还没亮"
const unlocked = ref(isComplete())
const stage = ref(0)
const choice = ref('')

const stageLabel = computed(() => {
  if (stage.value === 3) return '尾声'
  return ['一', '二', '三'][stage.value] || ''
})

function choose(v) {
  choice.value = v
  stage.value = 3
}

function restart() {
  localStorage.removeItem('nq_progress')
  localStorage.removeItem('nq_ending_prompted')
  localStorage.removeItem('nq_user')
  localStorage.removeItem('nq_notes')
  localStorage.removeItem('nq_posts')
  localStorage.removeItem('nq_comments')
  localStorage.removeItem('nq_sent_messages')
  window.dispatchEvent(new CustomEvent('nq-user-changed'))
  window.location.href = `${window.location.pathname}#/`
  window.location.reload()
}
</script>

<style scoped>
.ending-page {
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(720px 420px at 50% 0%, rgba(255, 190, 108, 0.22), transparent 70%),
    linear-gradient(165deg, #4C2515 0%, #351A0D 100%);
  color: #EFDDC2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 20px;
}
.ending-shell {
  width: 100%;
  max-width: 660px;
}
.ending-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 50px 44px 40px;
  border: 1px solid #E3CDA6;
  box-shadow: 0 40px 90px -46px rgba(20, 8, 2, 0.95);
  color: var(--color-text);
  animation: fadeUp 0.6s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.stage-tag {
  font-size: 11px;
  letter-spacing: 5px;
  color: var(--color-accent);
  margin-bottom: 18px;
}
.ending-title {
  font-family: var(--font-title);
  font-size: 27px;
  letter-spacing: 1.5px;
  color: var(--color-text);
  margin-bottom: 22px;
  line-height: 1.55;
}
.ending-kicker {
  font-family: var(--font-title);
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--color-accent);
  margin: 28px 0 10px;
  padding-left: 10px;
  border-left: 3px solid var(--amber);
}
.ending-text {
  font-size: 15px;
  line-height: 2.05;
  color: #4A3322;
  margin-bottom: 14px;
}
.ending-text.strong {
  color: var(--color-primary);
  font-weight: 600;
}
.ending-divider {
  border: none;
  border-top: 1px dashed var(--color-border-strong);
  margin: 32px 0 20px;
}
.ending-fin {
  text-align: center;
  color: var(--color-text-muted);
  letter-spacing: 8px;
  font-family: var(--font-title);
  margin-bottom: 24px;
}
.ending-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 26px;
}
.ending-actions.row {
  flex-direction: row;
}
.ending-actions.row .ending-btn {
  flex: 1;
}
.ending-btn {
  width: 100%;
  padding: 13px;
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius);
  font-size: 14px;
  letter-spacing: 1.5px;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background 0.2s;
}
.ending-btn:hover {
  background: rgba(180, 71, 42, 0.09);
}
.ending-btn.primary {
  background: var(--color-accent);
  border-color: var(--color-accent-dark);
  color: #FFF4E2;
  font-weight: 600;
}
.ending-btn.primary:hover {
  background: #C25232;
}
.ending-btn.ghost {
  color: var(--color-text-muted);
  border-color: var(--color-border-strong);
}

/* 帖子预览：抉择前的最后一眼 */
.post-preview {
  margin: 20px 0 24px;
  padding: 20px 22px;
  background: #F6E9CC;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--amber);
  border-radius: var(--radius);
}
.post-preview-title {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 10px;
}
.post-preview-body {
  font-size: 13px;
  line-height: 1.95;
  color: var(--color-text-secondary);
}
.post-preview-addr {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-border-strong);
  font-size: 13px;
  line-height: 1.8;
  color: var(--color-accent);
  font-weight: 600;
}

/* 进度点 */
.stage-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 226, 181, 0.25);
  transition: background 0.3s;
}
.dot.on {
  background: var(--amber);
  box-shadow: 0 0 10px rgba(255, 190, 92, 0.7);
}

/* 未解锁的挡板页 */
.ending-lamp {
  display: block;
  text-align: center;
  font-size: 44px;
  margin-bottom: 20px;
}
.ending-lamp.dim {
  filter: grayscale(1) brightness(0.75);
  opacity: 0.45;
}
.blocked-text {
  text-align: center;
  font-family: var(--font-title);
  font-size: 22px;
  letter-spacing: 3px;
  color: var(--color-text);
  margin-bottom: 8px;
}
.blocked-sub {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-muted);
}

@media (max-width: 720px) {
  .ending-card {
    padding: 32px 22px;
  }
  .ending-title {
    font-size: 22px;
  }
  .ending-actions.row {
    flex-direction: column;
  }
}
</style>
