<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <div class="mobile-overlay" v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"></div>
    <Sidebar :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    <div class="content">
      <header class="topbar">
        <button class="menu-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          ☰
        </button>
        歡迎使用鋒兄AI資訊系統
      </header>
      <main class="main">
        <RouterView />
      </main>
    </div>
  </div>
  <div class="bg"></div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}
.content {
  margin-left: 240px;
  width: calc(100% - 240px);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s, width 0.3s;
}
.topbar {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: #fff;
  gap: 12px;
}
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}
.main {
  padding: 24px;
}
.bg {
  position: fixed;
  inset: 0;
  background: radial-gradient(1200px 600px at 60% 10%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #5a64e0 0%, #7b66e8 40%, #865fe6 100%);
  z-index: -1;
}
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 900;
}
@media (max-width: 900px) {
  .content {
    margin-left: 0;
    width: 100%;
  }
  .menu-toggle {
    display: block;
  }
  .main {
    padding: 16px;
  }
}
</style>
