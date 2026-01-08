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

        <div class="form-group">
          <label>Management Token (CMA - 用於寫入) <a href="https://app.contentful.com/account/profile/tokens" target="_blank" style="color: #4facfe; font-size: 0.8em; margin-left: 10px; text-decoration: none;">(取得 Token ↗)</a></label>
          <div class="input-wrapper">
            <input type="password" v-model="managementToken" placeholder="Management Token (CFPAT-...)" />
            <button class="copy-btn" @click="copyToClipboard(managementToken)">複製</button>
          </div>
          <p style="font-size: 0.8em; opacity: 0.7; margin-top: 5px;">注意：請勿使用 Delivery Token (Access Token)。請至 Contentful 個人設定產生 Personal Access Token (CMA)。</p>
        </div>

        <div class="actions">
          <button class="btn primary" @click="saveSettings">儲存設定</button>
          <button class="btn" @click="testManagementToken">測試 Token 權限</button>
        </div>
        <div v-if="managementTestStatus" class="status-log">{{ managementTestStatus }}</div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>系統初始化 (Schema Setup)</h3>
        <p class="desc">自動建立 Food 與 Subscription 的 Content Types (需 Management Token)。</p>
        
        <div class="actions start">
          <button class="btn primary" @click="initializeContentTypes">🚀 初始化 Content Types</button>
        </div>
        <div v-if="initStatus" class="status-log">
          {{ initStatus }}
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

      <div class="card" style="margin-top: 20px;">
        <h3>Strapi 轉 Contentful CSV</h3>
        <p class="desc">將 Strapi 匯出的 CSV 轉換為 Contentful 匯入格式 (自動偵測 Food/Subscription)。</p>
        
        <div class="actions start">
          <input type="file" ref="fileInput" accept=".csv" @change="handleFileUpload" style="display: none" />
          <button class="btn" @click="$refs.fileInput.click()">📂 選擇 Strapi CSV 並轉換</button>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>資料匯入 (Write to Contentful)</h3>
        <p class="desc">將 CSV 資料寫入至 Contentful (需設定 Management Token)。</p>
        
        <div class="actions start">
          <input type="file" ref="importInput" accept=".csv" @change="handleImportUpload" style="display: none" />
          <button class="btn primary" @click="triggerImport">🚀 匯入至 Contentful</button>
        </div>
        <div v-if="importStatus" class="status-log">
          {{ importStatus }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { client } from '../services/contentful';
import { createClient } from 'contentful-management';

const spaceId = ref('');
const accessToken = ref('');
const managementToken = ref('');
const managementTestStatus = ref('');
const initStatus = ref('');
const importStatus = ref('');
const importInput = ref(null);

onMounted(() => {
  spaceId.value = localStorage.getItem('contentful_space_id') || import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'navontrqk0l3';
  accessToken.value = localStorage.getItem('contentful_access_token') || import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '83Q5hThGBPCIgXAYX7Fc-gSUN-psxg_j-F-gXSskQBc';
  managementToken.value = localStorage.getItem('contentful_management_token') || '';
});

const saveSettings = () => {
  if (managementToken.value && !managementToken.value.startsWith('CFPAT-')) {
    if (!confirm('提醒：Management Token 通常以 CFPAT- 開頭（Personal Access Token）。\n如果填入的是 Delivery Token，寫入/刪除會失敗。\n\n確定要儲存嗎？')) {
      return;
    }
  }

  if (managementToken.value && (managementToken.value === accessToken.value || managementToken.value.endsWith('skQBc'))) {
    if (!confirm('警告：您的 Management Token 看起來像是 Delivery Token (Read-Only)。\n寫入功能需要 Management Token (CMA)。\n\n確定要儲存嗎？')) {
      return;
    }
  }

  localStorage.setItem('contentful_space_id', (spaceId.value || '').trim());
  localStorage.setItem('contentful_access_token', (accessToken.value || '').trim());
  localStorage.setItem('contentful_management_token', (managementToken.value || '').trim());
  alert('設定已儲存，頁面將重新載入以生效。');
  window.location.reload();
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text || '').then(() => {
    alert('已複製到剪貼簿')
  }).catch(() => {})
}

const testManagementToken = async () => {
  managementTestStatus.value = '';
  const token = (managementToken.value || '').trim();
  if (!token) {
    managementTestStatus.value = '請先填入 Management Token (CFPAT-...)';
    return;
  }

  try {
    const cma = createClient({ accessToken: token });
    const me = await cma.getCurrentUser();
    const spacesResponse = await cma.getSpaces({ limit: 1000 });
    const spaces = spacesResponse?.items || [];
    const currentSpaceId = (spaceId.value || '').trim();
    const matched = spaces.find(s => s?.sys?.id === currentSpaceId);

    if (matched) {
      managementTestStatus.value = `Token 有權限：${me?.firstName || ''} ${me?.lastName || ''}\n可存取目前 Space：${matched?.name || ''} (${matched?.sys?.id || ''})`;
      return;
    }

    const list = spaces.slice(0, 10).map(s => `${s?.name || ''} (${s?.sys?.id || ''})`).join('\n');
    managementTestStatus.value = `Token 有效，但無法存取目前 Space ID：${currentSpaceId}\n\n此 Token 可存取的 Space (前 10 筆)：\n${list || '(無)'}\n\n請確認 Space ID，或將此 Token 的帳號加入該 Space/Organization。`;
  } catch (error) {
    if (error?.status === 401) {
      managementTestStatus.value = 'Token 無法存取 Contentful Management API（401）。請確認 token 是否正確、是否已撤銷、以及帳號是否有任何 Space 權限。';
      return;
    }
    managementTestStatus.value = `測試失敗：${error?.message || 'Unknown error'}`;
  }
};

const initializeContentTypes = async () => {
  if (!managementToken.value.trim()) {
    initStatus.value = '請先輸入 Management Token。';
    return;
  }

  initStatus.value = '正在連線 Contentful Management API...';
  const cma = createClient({ accessToken: managementToken.value.trim() });
  
  try {
    const space = await cma.getSpace(spaceId.value.trim());
    const environment = await space.getEnvironment('master');

    // Define Food Content Type
    initStatus.value = '正在檢查/建立 Food Content Type...';
    let foodType;
    try {
      foodType = await environment.getContentType('food');
      initStatus.value += '\nFood Content Type 已存在，跳過建立。';
    } catch (e) {
      foodType = await environment.createContentTypeWithId('food', {
        name: 'Food',
        fields: [
          { id: 'name', name: 'Name', type: 'Symbol', required: true },
          { id: 'amount', name: 'Amount', type: 'Integer' },
          { id: 'todate', name: 'To Date', type: 'Date' },
          { id: 'photo', name: 'Photo', type: 'Link', linkType: 'Asset' },
          { id: 'price', name: 'Price', type: 'Integer' },
          { id: 'shop', name: 'Shop', type: 'Symbol' },
          { id: 'photoHash', name: 'Photo Hash', type: 'Symbol' }
        ]
      });
      await foodType.publish();
      initStatus.value += '\nFood Content Type 建立並發布成功！';
    }

    // Define Subscription Content Type
    initStatus.value += '\n正在檢查/建立 Subscription Content Type...';
    let subType;
    try {
      subType = await environment.getContentType('subscription');
      initStatus.value += '\nSubscription Content Type 已存在，跳過建立。';
    } catch (e) {
      subType = await environment.createContentTypeWithId('subscription', {
        name: 'Subscription',
        fields: [
          { id: 'name', name: 'Name', type: 'Symbol', required: true },
          { id: 'price', name: 'Price', type: 'Integer' },
          { id: 'nextdate', name: 'Next Date', type: 'Date' },
          { id: 'site', name: 'Site', type: 'Symbol' },
          { id: 'note', name: 'Note', type: 'RichText' },
          { id: 'account', name: 'Account', type: 'Symbol' }
        ]
      });
      await subType.publish();
      initStatus.value += '\nSubscription Content Type 建立並發布成功！';
    }

    initStatus.value += '\n\n全部初始化完成！';

  } catch (error) {
    console.error('Initialization error:', error);
    initStatus.value = `初始化失敗：${error.message}`;
  }
};

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

const fileInput = ref(null);

const generateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 22; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const cleanString = (str) => {
  if (!str) return '';
  return str.replace(/`/g, '').trim();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  // Handle YYYY/MM/DD
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    return d.toISOString(); // Return ISO string
  }
  return '';
};

const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '')); // Remove surrounding quotes
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    processStrapiCSV(content);
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input
};

const processStrapiCSV = (csvContent) => {
  const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return;

  const headerLine = lines[0];
  
  if (headerLine.includes('名稱') && headerLine.includes('數量')) {
    convertStrapiFood(lines);
  } else if (headerLine.includes('名稱') && (headerLine.includes('網站') || headerLine.includes('價格'))) {
    // Subscription usually has website or price
    convertStrapiSubscription(lines);
  } else {
    alert('無法識別的 CSV 格式。請確認欄位包含「名稱、數量」(Food) 或 「名稱、網站」(Subscription)。');
  }
};

const convertStrapiFood = (lines) => {
  // Strapi Headers: ID,名稱,數量,價格,商店,到期日,圖片連結
  // Contentful Target: id,name,amount,price,shop,todate,photo,photoHash,createdAt,updatedAt
  
  const data = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 2) continue;
    
    // Mapping based on index (assuming fixed order from example)
    // 0: ID, 1: Name, 2: Amount, 3: Price, 4: Shop, 5: Date, 6: Photo
    
    data.push({
      id: generateId(),
      name: cols[1],
      amount: parseInt(cols[2]) || 0,
      price: parseInt(cols[3]) || 0,
      shop: cols[4],
      todate: formatDate(cols[5]),
      photo: cleanString(cols[6]),
      photoHash: '', // New field, empty for migration
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  const csv = convertToCSV(data);
  downloadCSV(csv, 'converted_contentful_food.csv');
};

const convertStrapiSubscription = (lines) => {
  // Strapi Headers: ID,名稱,價格,網站,帳號,下期扣款日,備註
  // Contentful Target: id,name,price,nextdate,site,account,note,createdAt,updatedAt
  
  const data = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 2) continue;
    
    // Mapping based on index
    // 0: ID, 1: Name, 2: Price, 3: Site, 4: Account, 5: Date, 6: Note
    
    data.push({
      id: generateId(),
      name: cols[1],
      price: parseInt(cols[2]) || 0,
      nextdate: formatDate(cols[5]),
      site: cleanString(cols[3]),
      account: cols[4] || '', // Added account field
      note: cleanString(cols[6]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  const csv = convertToCSV(data);
  downloadCSV(csv, 'converted_contentful_subscription.csv');
};

const triggerImport = () => {
  if (!managementToken.value.trim()) {
    importStatus.value = '請先至系統設定輸入 Management Token 以啟用寫入功能。';
    return;
  }
  importInput.value.click();
};

const handleImportUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  importStatus.value = '正在讀取 CSV 檔案...';
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    processImportCSV(content);
  };
  reader.readAsText(file);
  event.target.value = '';
};

const createRichText = (text) => {
  if (!text) return null;
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {}
          }
        ]
      }
    ]
  };
};

const createAndPublishAsset = async (environment, url, title) => {
  try {
    const cleanUrl = cleanString(url);
    if (!cleanUrl) return null;

    // Fix protocol-relative URLs
    const finalUrl = cleanUrl.startsWith('//') ? 'https:' + cleanUrl : cleanUrl;
    
    const fileName = finalUrl.split('/').pop() || 'image.jpg';
    const contentType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    let asset = await environment.createAsset({
      fields: {
        title: { 'en-US': title },
        file: {
          'en-US': {
            contentType: contentType,
            fileName: fileName,
            upload: finalUrl
          }
        }
      }
    });

    asset = await asset.processForAllLocales();
    
    // Wait for processing to likely complete
    await new Promise(r => setTimeout(r, 1000));
    
    // Publish
    asset = await asset.publish();
    
    return {
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: asset.sys.id
      }
    };
  } catch (e) {
    console.error('Asset upload failed:', e);
    throw new Error(`圖片上傳失敗 (${e.message})`);
  }
};

const processImportCSV = async (csvContent) => {
  importStatus.value = '正在初始化 Contentful Management Client...';
  const token = managementToken.value.trim();
  const cma = createClient({ accessToken: token });
  const currentSpaceId = spaceId.value.trim();

  try {
    const space = await cma.getSpace(currentSpaceId);
    const environment = await space.getEnvironment('master');
    
    const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      importStatus.value = 'CSV 內容為空或格式不正確 (至少需要標題列與一筆資料)。';
      return;
    }

    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    
    let contentType = '';
    if (headers.includes('amount') && headers.includes('shop')) {
      contentType = 'food';
    } else if (headers.includes('nextdate') && headers.includes('site')) {
      contentType = 'subscription';
    } else {
      importStatus.value = '無法識別 CSV 類型。請確認標題列包含 amount/shop (Food) 或 nextdate/site (Subscription)。';
      return;
    }

    importStatus.value = `偵測到類型：${contentType}，開始匯入 ${lines.length - 1} 筆資料...`;

    let successCount = 0;
    let failCount = 0;
    let errors = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < headers.length) continue;

      const rowData = {};
      headers.forEach((h, index) => {
        rowData[h] = cols[index];
      });

      try {
        const fields = {};
        
        // Map CSV columns to Contentful fields (en-US)
        // Using for...of loop to support await inside
        for (const key of Object.keys(rowData)) {
          if (key === 'id' || key === 'createdAt' || key === 'updatedAt') continue; // Skip system fields
          
          let value = rowData[key];
          
          // Type conversions
          if (contentType === 'food') {
             if (key === 'amount' || key === 'price') value = parseInt(value) || 0;
             if (key === 'todate' && value) value = new Date(value).toISOString();
             if (key === 'photo' && value) {
                importStatus.value = `正在上傳圖片 (Row ${i})...`;
                const assetLink = await createAndPublishAsset(environment, value, rowData.name || 'Food Image');
                if (assetLink) {
                  fields[key] = { 'en-US': assetLink };
                }
                continue; // Skip standard assignment for photo
             }
             if (key === 'photoHash') value = cleanString(value); // Clean string just in case
          } else if (contentType === 'subscription') {
             if (key === 'price') value = parseInt(value) || 0;
             if (key === 'nextdate' && value) value = new Date(value).toISOString();
             if (key === 'note' && value) value = createRichText(cleanString(value));
          }

          if (value !== undefined && value !== '') {
             // Standard assignment
             if (typeof value === 'string') value = cleanString(value);
             fields[key] = { 'en-US': value };
          }
        }

        importStatus.value = `正在建立 Entry (Row ${i})...`;
        // Create and Publish
        const entry = await environment.createEntry(contentType, { fields });
        await entry.publish();
        
        successCount++;
        importStatus.value = `進度：${successCount}/${lines.length - 1} (成功)`;
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {
        console.error(`Row ${i} failed:`, err);
        failCount++;
        const errMsg = err?.message || JSON.stringify(err);
        errors.push(`Row ${i}: ${errMsg}`);
        importStatus.value = `進度：${successCount} 成功, ${failCount} 失敗`;
      }
    }

    let finalMsg = `匯入完成！成功：${successCount}，失敗：${failCount}`;
    if (errors.length > 0) {
      finalMsg += '\n\n失敗詳情 (前 5 筆)：\n' + errors.slice(0, 5).join('\n');
    }
    importStatus.value = finalMsg;

  } catch (error) {
    console.error('Import error:', error);
    importStatus.value = `匯入發生錯誤：${error.message}`;
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

.status-log {
  margin-top: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9em;
  color: #4facfe;
  white-space: pre-wrap;
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
