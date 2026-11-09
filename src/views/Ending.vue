<template>
  <div class="ending-page">
    <div v-if="!unlocked" class="ending-card">
      <span class="ending-lamp dim">🏮</span>
      <p class="blocked-text">灯还没亮。</p>
      <p class="blocked-sub">还有线索没看完。回夜市再找找。</p>
      <hr class="ending-divider">
      <button class="ending-btn" @click="$router.push('/home')">回到夜市</button>
    </div>

    <div v-else class="ending-shell">
      <div class="ending-card" :key="stage">
        <p class="stage-tag">{{ stageLabel }}</p>

        <template v-if="stage === 0">
          <h1 ref="title" tabindex="-1" class="ending-title">关门以后</h1>
          <p class="ending-text">10月30日，夜市快收摊了。你又点开问陈伯去哪儿的帖子。有人回说，A1门口的凳子已经替他收好了，回来去隔壁拿。</p>
          <p class="ending-text">排班表上，陈伯月初缺过班，回来摆了些日子，27日那格又被划掉。那天小李等到快七点，发消息问他还来不来。王主任已经拿到了他留下的钥匙和纸条。</p>
          <p class="ending-text">你翻回那份旧寻人启事。上面写着孩子手腕系红绳，绳上有个「念」字。陈伯十月的手记里，也写到了这个字。老张的聊天还留着陈伯回家的走法，你拿线路图对了一遍。</p>
          <div class="ending-actions">
            <button class="ending-btn primary" @click="goToStage(1)">看陈伯的故事</button>
          </div>
        </template>

        <template v-else-if="stage === 1">
          <h1 ref="title" tabindex="-1" class="ending-title">那碗粥是谁喝的</h1>
          <p class="ending-text">2006年8月16日，四岁的陈念在城南老街走失。后来他进了福利院，被邻市一家人领养，换了名字。陈伯一直住在老屋，怕他还记得门，却找不着人。</p>
          <p class="ending-text">10月14日，论坛上的「今天吃什么」来A1喝粥。接碗的时候，他腕上那根接长过的红绳露了出来。过了几天，他又来，把袖子捋上去问：「您认得这个字吗？」陈伯低头搅着锅，说不认得。</p>
          <p class="ending-text">陈伯认得。十月初他去体检，在医院住了几天，出院时医生跟他说这病治不好。那孩子好不容易回来，他怕一开口，孩子就得请假陪他跑医院。年轻人走后，他连名字都没问到。</p>
          <p class="ending-text">26日收摊，陈伯给老张先盛了碗淡一点的粥，把借来的锅盖还给刘姐，又给小李留了一份。他擦好灶台，给王主任留了纸条和钥匙，坐3号线往城南走。南桥上车，第五站是梧桐苑。他回了老屋。</p>
          <div class="ending-actions row">
            <button class="ending-btn ghost" @click="goToStage(0)">回看线索</button>
            <button class="ending-btn primary" @click="goToStage(2)">看后续</button>
          </div>
        </template>

        <template v-else-if="!choice">
          <h1 ref="title" tabindex="-1" class="ending-title">把话捎给谁</h1>
          <p class="ending-text">你给论坛回了个帖，告诉大家陈伯自己回家休息了，A1暂时不开。刚发完，就有人问能不能过去看看。你没在帖子里写他住哪儿。</p>
          <div class="post-preview">
            <p class="post-preview-title">今天吃什么 · 私信</p>
            <p class="post-preview-body">你好。你是不是知道陈伯去哪儿了？我就想见他一面，先问问他愿不愿意也行。</p>
          </div>
          <div class="ending-actions row">
            <button class="ending-btn" @click="choose('tell')">私信告诉他梧桐苑</button>
            <button class="ending-btn" @click="choose('ask')">请王主任先问陈伯</button>
          </div>
        </template>

        <template v-else>
          <h1 ref="title" tabindex="-1" class="ending-title">{{ choice === 'tell' ? '你坐，我来' : '有空就来喝粥' }}</h1>

          <template v-if="choice === 'tell'">
            <p class="ending-text">你把梧桐苑告诉他，又请王主任转了他的号码。陈念到小区外面等了一会儿，接到电话。陈伯问他：「你到了？我在门口买菜。你站那儿别动，我出来。」</p>
            <p class="ending-text">11月1日，夜市过五周年。王主任把A1的钥匙送回来，老张拎着一袋卤蛋，刘姐端来绿豆汤。陈伯坐在灶边，看陈念把袖口往上卷，卷过了那根红绳。</p>
            <p class="ending-text">「勺子要贴着锅底。」陈伯扶着膝盖，想站起来。陈念伸手按了按他胳膊：「你坐，我来。」</p>
            <p class="ending-text">粥刚舀出来烫，老张把第一碗往陈伯那边推了推。「等会儿再喝，」他说，「没人跟你抢。」</p>
          </template>

          <template v-else>
            <p class="ending-text">你把私信给王主任看。王主任给陈伯发了条短信，说喝过粥的年轻人想见他，什么时候方便，回个话就行。</p>
            <p class="ending-text">11月1日，夜市过五周年。A1先空着，王主任没给别人排。老张把门口扫了一遍，刘姐过来把挡着门的空箱挪开。小李收摊时照例问了一声：「主任，A1的灯我替您关吗？」</p>
            <p class="ending-text">王主任刚收到一条消息。陈伯说：「你帮我问问，他哪天歇班？不用请假。有空就来喝粥。」</p>
            <p class="ending-text">王主任把这几句话转给陈念，回头跟小李说：「再亮一会儿吧。我收完表去关。」</p>
          </template>

          <hr class="ending-divider">
          <p class="ending-fin">— 完 —</p>
          <div class="ending-actions">
            <button class="ending-btn" @click="choose('')">回到选择</button>
            <button class="ending-btn" @click="$router.push('/home')">回到夜市</button>
            <button class="ending-btn ghost" @click="restart">重新开始</button>
          </div>
        </template>
      </div>

      <div class="stage-dots" aria-hidden="true">
        <span v-for="n in 3" :key="n" class="dot" :class="{ on: stage >= n - 1 }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { isComplete } from '../utils/progress'

// 结局页守卫：线索没有集齐时，直接访问只会看到"灯还没亮"
const unlocked = ref(isComplete())
const stage = ref(0)
const choice = ref('')
const title = ref(null)

const stageLabel = computed(() => ['线索', '故事', '后续'][stage.value])

async function goToStage(page) {
  stage.value = page
  await nextTick()
  title.value?.focus()
}

async function choose(outcome) {
  choice.value = outcome
  await nextTick()
  title.value?.focus()
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
.ending-text {
  font-size: 15px;
  line-height: 2.05;
  color: #4A3322;
  margin-bottom: 14px;
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

/* 选择前收到的私信 */
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
