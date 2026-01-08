<template>
  <section class="page">
    <div class="header">
      <div class="badge">🎞️</div>
      <h2>鋒兄影片庫</h2>
    </div>
    <div class="cards">
      <div class="card" v-for="video in videos" :key="video.name">
        <div class="video-container">
          <video controls :src="video.url" preload="metadata"></video>
        </div>
        <div class="meta">
          <div class="name">{{ video.name }}</div>
          <div class="info">MP4 · 影片連結</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const videos = ref([
  {
    name: '鋒兄進化Show🔥',
    url: 'https://videos.ctfassets.net/navontrqk0l3/5cGDNWIkJ5K4H0HYRtNGKA/5e5e2beb31b6bfc829403d7610e9fc54/%C3%A9__%C3%A5__%C3%A9__%C3%A5__Show%C3%B0___.mp4'
  },
  {
    name: '鋒兄的傳奇人生',
    url: 'https://videos.ctfassets.net/navontrqk0l3/5wQphDy2IBywvSYz1whZju/1049b18184429058dd54a7d4dbab9075/%C3%A9__%C3%A5__%C3%A7__%C3%A5__%C3%A5__%C3%A4%C2%BA%C2%BA%C3%A7__.mp4'
  }
]);
</script>

<style scoped>
.page {
  color: #fff;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.header h2 {
  flex: 1;
  min-width: 120px;
}
.actions {
  display: flex;
  gap: 8px;
}
.badge {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.actions .btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
}
.actions .primary {
  background: #ff5a5f;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.search {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.card {
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
}
.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}
.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.thumb.video {
  height: 140px;
  background: linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
}
.meta {
  padding: 10px 12px;
}
.name {
  font-weight: 600;
}
.info {
  font-size: 12px;
  opacity: 0.9;
}
@media (max-width: 800px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
