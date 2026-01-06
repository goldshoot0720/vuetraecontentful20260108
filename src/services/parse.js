import Parse from 'parse';

console.log('Parse SDK imported:', Parse);

// 初始化 Parse
const appId = localStorage.getItem('custom_app_id') || import.meta.env.VITE_APP_ID || 'D9ePfYNRGVu2JZaYbPeGW8ECfLKxIjt7ONXHjH5L';
const jsKey = localStorage.getItem('custom_js_key') || import.meta.env.VITE_JS_KEYS || 'yT9NcJJY2YLIAR3mZ3Tx8R57Chf9kPZz1HX4uAlS';

if (appId && jsKey) {
  Parse.initialize(appId, jsKey);
  Parse.serverURL = 'https://parseapi.back4app.com/';
} else {
  console.warn('Parse credentials not found in environment variables or localStorage.');
}

export default Parse;
