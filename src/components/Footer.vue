<template>
  <footer v-if="!hideNav" class="footer">
    <div class="footer-lights" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <p class="footer-main">南桥夜市 · 临岗市江边 · 营业时间 每天 17:00 — 23:00</p>
    <p class="footer-small">夜市管理处维护 · 有问题请联系管理处王主任</p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideNav = computed(() => route.meta.hideNav === true)
</script>

<style scoped>
.footer {
  position: relative;
  background:
    linear-gradient(180deg, #452618 0%, #361D11 100%),
    repeating-linear-gradient(90deg, rgba(255, 214, 160, 0.035) 0 2px, transparent 2px 9px);
  border-top: 1px solid rgba(235, 184, 106, 0.28);
  padding: 30px 24px 26px;
  text-align: center;
  color: #C9B192;
  font-size: var(--font-tiny);
  letter-spacing: 1px;
}
.footer::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 180px;
  height: 2px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(255, 214, 150, 0.9), transparent);
}
.footer-lights {
  display: flex;
  justify-content: center;
  gap: 26px;
  margin-bottom: 16px;
}
.footer-lights span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #FFDCA6;
  box-shadow: 0 0 10px 4px rgba(255, 186, 92, 0.4);
  opacity: 0.85;
}
.footer-lights span:nth-child(2n) {
  opacity: 0.55;
}
.footer-main {
  color: #E4D0B2;
  letter-spacing: 1.6px;
}
.footer-small {
  margin-top: 7px;
  font-size: 11px;
  color: rgba(201, 177, 146, 0.66);
}
</style>
