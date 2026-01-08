<template>
  <section class="page">
    <div class="header">
      <div class="badge">⚙️</div>
      <h2>系統設定</h2>
    </div>

    <div class="content">
      <div class="card">
        <h3>Contentful 設定</h3>
        <p class="desc">請設定您的 Contentful Space ID 與 Delivery Access Token。</p>
        
        <div class="form-group">
          <label>Space ID</label>
          <div class="input-wrapper">
            <input type="text" v-model="spaceId" placeholder="Space ID" />
            <button class="copy-btn" @click="copyToClipboard(spaceId)">複製</button>
          </div>
        </div>

        <div class="form-group">
          <label>Access Token (Delivery API)</label>
          <div class="input-wrapper">
            <input type="text" v-model="accessToken" placeholder="Access Token" />
            <button class="copy-btn" @click="copyToClipboard(accessToken)">複製</button>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" @click="saveSettings">儲存設定</button>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>資料匯出</h3>
        <p class="desc">將資料從 Contentful 匯出為 CSV 檔案。</p>
        
        <div class="actions start">
          <button class="btn" @click="exportFoodCSV">匯出 Food CSV</button>
          <button class="btn" @click="exportSubscriptionCSV">匯出 Subscription CSV</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../services/contentful';

const spaceId = ref('');
const accessToken = ref('');

onMounted(() => {
  spaceId.value = localStorage.getItem('contentful_space_id') || import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'navontrqk0l3';
  accessToken.value = localStorage.getItem('contentful_access_token') || import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '83Q5hThGBPCIgXAYX7Fc-gSUN-psxg_j-F-gXSskQBc';
});

const saveSettings = () => {
  localStorage.setItem('contentful_space_id', spaceId.value);
  localStorage.setItem('contentful_access_token', accessToken.value);
  alert('設定已儲存，頁面將重新載入以生效。');
  window.location.reload();
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text || '').then(() => {
    alert('已複製到剪貼簿')
  }).catch(() => {})
}

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  
  if (array.length === 0) return '';

  // Get headers
  const headers = Object.keys(array[0]).join(',');
  str += headers + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (line !== '') line += ',';
      
      let item = array[i][index];
      
      // Handle null/undefined
      if (item === null || item === undefined) {
        item = '';
      }
      
      // Handle strings containing commas or newlines
      if (typeof item === 'string') {
        if (item.includes(',') || item.includes('\n') || item.includes('"')) {
          item = '"' + item.replace(/"/g, '""') + '"';
        }
      } else if (item instanceof Date) {
        item = item.toISOString();
      }
      
      line += item;
    }
    str += line + '\r\n';
  }
  return str;
};

const downloadCSV = (csvStr, fileName) => {
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const exportFoodCSV = async () => {
  try {
    const response = await client.getEntries({ content_type: 'food', limit: 1000 });
    const results = response.items;
    
    const data = results.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      amount: item.fields.amount,
      price: item.fields.price,
      shop: item.fields.shop,
      todate: item.fields.todate,
      photo: item.fields.photo?.fields?.file?.url || '',
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'contentful_food.csv');
  } catch (error) {
    console.error('Error exporting food CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};

const exportSubscriptionCSV = async () => {
  try {
    const response = await client.getEntries({ content_type: 'subscription', limit: 1000 });
    const results = response.items;
    
    const data = results.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      nextdate: item.fields.nextdate,
      site: item.fields.site,
      note: item.fields.note ? 'Rich Text' : '', // Simplified for CSV
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'contentful_subscription.csv');
  } catch (error) {
    console.error('Error exporting subscription CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};
</script>

<style scoped>
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
}
.actions.start {
  justify-content: flex-start;
}
.btn {
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.2s;
}
.btn:hover {
  opacity: 0.9;
}
.primary {
  background: #ff5a5f;
  color: #fff;
}
.page {
  color: #fff;
  max-width: 800px;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.badge {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.1);
}
h3 {
  margin-bottom: 8px;
  font-size: 1.2rem;
}
.desc {
  opacity: 0.7;
  margin-bottom: 24px;
  font-size: 0.9rem;
}
.form-group {
  margin-bottom: 20px;
}
.form-group:last-child {
  margin-bottom: 0;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  opacity: 0.9;
}
.input-wrapper {
  display: flex;
  gap: 10px;
}
input {
  flex: 1;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px 14px;
  color: #fff;
  font-family: monospace;
  font-size: 0.95rem;
}
input:focus {
  outline: none;
  border-color: rgba(255,255,255,0.3);
}
.copy-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.copy-btn:hover {
  background: rgba(255,255,255,0.25);
}

@media (max-width: 600px) {
  .actions {
    justify-content: flex-start;
  }
  .actions .btn {
    width: 100%;
  }
}
</style>
