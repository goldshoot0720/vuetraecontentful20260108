<template>
  <section class="home">
    <div class="hero">
      <div class="logo">鋒</div>
      <h1 class="title">鋒兄AI資訊系統</h1>
      <p class="subtitle">智能管理您的影片和圖片收藏 · 支援智能分類和快速搜尋</p>
      <div class="copyright">鋒兄塗哥公關資訊© 版權所有 2025 ~ 2125</div>
      <div class="tech">
        <div class="card">
          <div class="card-title">⚡ 前端技術</div>
          <ul class="list">
            <li>Vue 3 (Vite)</li>
            <li>網頁存放於 Local</li>
            <li>響應式設計 + CSS</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">🚀 後端技術</div>
          <ul class="list">
            <li>Contentful (Headless CMS)</li>
            <li>資料存放於 Contentful Space</li>
            <li>Contentful Delivery API</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="dashboard">
      <div class="panel">
        <div class="panel-title">🧾 訂閱管理</div>
        <div class="stats">
          <div class="stat">
            <div class="label">項目數</div>
            <div class="value">{{ subscriptionTotal }}</div>
          </div>
          <div class="stat">
            <div class="label">7天提醒</div>
            <div class="value">{{ subscription7 }}</div>
            <div class="hint">最近：{{ subscription7Date }}</div>
          </div>
          <div class="stat">
            <div class="label">30天提醒</div>
            <div class="value">{{ subscription30 }}</div>
            <div class="hint">最近：{{ subscription30Date }}</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">🍎 食品管理</div>
        <div class="stats">
          <div class="stat">
            <div class="label">項目數</div>
            <div class="value">{{ foodTotal }}</div>
          </div>
          <div class="stat">
            <div class="label">3天提醒</div>
            <div class="value">{{ food3 }}</div>
            <div class="hint">最近：{{ food3Date }}</div>
          </div>
          <div class="stat">
            <div class="label">7天提醒</div>
            <div class="value">{{ food7 }}</div>
            <div class="hint">最近：{{ food7Date }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-title">☀️ 系統功能選單</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../services/contentful';

const subscriptionTotal = ref(0);
const subscription7 = ref(0);
const subscription30 = ref(0);
const subscription7Date = ref('-');
const subscription30Date = ref('-');
const foodTotal = ref(0);
const food3 = ref(0);
const food7 = ref(0);
const food3Date = ref('-');
const food7Date = ref('-');

const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDate = (d) => {
  if (!d) return '-';
  const x = new Date(d);
  return x.toLocaleDateString();
};

const fetchDashboard = async () => {
  const now = new Date();
  const nowISO = now.toISOString();

  try {
    // Subscription Total
    const subTotalRes = await client.getEntries({ content_type: 'subscription', limit: 1 });
    subscriptionTotal.value = subTotalRes.total;

    // Subscription 7 days
    const sub7Res = await client.getEntries({
      content_type: 'subscription',
      'fields.nextdate[gte]': nowISO,
      'fields.nextdate[lte]': addDays(now, 7).toISOString(),
      order: 'fields.nextdate',
      limit: 100
    });
    subscription7.value = sub7Res.total;
    if (sub7Res.items.length > 0) {
      subscription7Date.value = formatDate(sub7Res.items[0].fields.nextdate);
    } else {
      subscription7Date.value = '-';
    }

    // Subscription 30 days
    const sub30Res = await client.getEntries({
      content_type: 'subscription',
      'fields.nextdate[gte]': nowISO,
      'fields.nextdate[lte]': addDays(now, 30).toISOString(),
      order: 'fields.nextdate',
      limit: 100
    });
    subscription30.value = sub30Res.total;
    if (sub30Res.items.length > 0) {
      subscription30Date.value = formatDate(sub30Res.items[0].fields.nextdate);
    } else {
      subscription30Date.value = '-';
    }

    // Food Total
    const foodTotalRes = await client.getEntries({ content_type: 'food', limit: 1 });
    foodTotal.value = foodTotalRes.total;

    // Food 3 days
    const food3Res = await client.getEntries({
      content_type: 'food',
      'fields.todate[gte]': nowISO,
      'fields.todate[lte]': addDays(now, 3).toISOString(),
      order: 'fields.todate',
      limit: 100
    });
    food3.value = food3Res.total;
    if (food3Res.items.length > 0) {
      food3Date.value = formatDate(food3Res.items[0].fields.todate);
    } else {
      food3Date.value = '-';
    }

    // Food 7 days
    const food7Res = await client.getEntries({
      content_type: 'food',
      'fields.todate[gte]': nowISO,
      'fields.todate[lte]': addDays(now, 7).toISOString(),
      order: 'fields.todate',
      limit: 100
    });
    food7.value = food7Res.total;
    if (food7Res.items.length > 0) {
      food7Date.value = formatDate(food7Res.items[0].fields.todate);
    } else {
      food7Date.value = '-';
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
.home {
  color: #fff;
}
.hero {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  max-width: 980px;
  margin: 0 auto;
}
.logo {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #ff5a5f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 12px;
}
.title {
  font-size: 32px;
  margin-bottom: 8px;
}
.subtitle {
  opacity: 0.95;
  margin-bottom: 8px;
}
.copyright {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 20px;
}
.tech {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}
.card-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.list {
  padding-left: 18px;
}
.section-title {
  text-align: center;
  margin-top: 24px;
  font-weight: 600;
}
@media (max-width: 680px) {
  .tech {
    grid-template-columns: 1fr;
  }
}
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 980px;
  margin: 18px auto 0;
}
.panel {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}
.panel-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.stat {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}
.stat .label {
  font-size: 13px;
  opacity: 0.9;
}
.stat .value {
  font-size: 22px;
  font-weight: 700;
}
.stat .hint {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}
@media (max-width: 680px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
