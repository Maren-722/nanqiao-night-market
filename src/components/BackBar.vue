<template>
  <button class="back-link" @click="goBack">
    <span class="back-arrow">←</span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  label: { type: String, default: '返回' },
  fallback: { type: String, default: '/home' }
})

const router = useRouter()

// 优先回退到浏览历史的上一步；没有历史时跳到指定上级页面
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.fallback)
  }
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-body);
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  cursor: pointer;
  margin-bottom: var(--space-sm);
  transition: color 0.2s;
}
.back-link:hover {
  color: var(--color-accent);
}
.back-arrow {
  font-size: 16px;
}
</style>
