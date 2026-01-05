<template>
  <section class="page">
    <div class="header">
      <div class="badge">🎵</div>
      <h2>鋒兄音樂歌詞</h2>
      <div class="actions">
        <button class="btn primary">新增歌詞</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search" placeholder="搜尋歌詞..." />
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="cards">
      <div class="card" v-for="lyric in lyricsList" :key="lyric.name" @click="viewLyric(lyric)">
        <div class="thumb lyrics"></div>
        <div class="meta">
          <div class="name">{{ lyric.name }}</div>
          <div class="info">作詞：鋒兄 · 作曲：AI</div>
        </div>
      </div>
    </div>

    <!-- 歌詞檢視 Modal -->
    <div v-if="selectedLyric" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ selectedLyric.name }}</h3>
        
        <!-- 音檔播放器 -->
        <div v-if="selectedLyric.audios && selectedLyric.audios.length > 0" class="audio-player-section">
          <div class="audio-tabs">
            <button 
              v-for="(audio, index) in selectedLyric.audios" 
              :key="index"
              class="audio-tab"
              :class="{ active: currentAudioIndex === index }"
              @click="currentAudioIndex = index"
            >
              {{ audio.label }}
            </button>
          </div>
          <audio :src="selectedLyric.audios[currentAudioIndex].url" controls autoplay class="audio-control"></audio>
        </div>

        <div class="lyrics-text">
          <pre>{{ (selectedLyric.audios && selectedLyric.audios[currentAudioIndex] && selectedLyric.audios[currentAudioIndex].lyrics) || selectedLyric.content }}</pre>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">關閉</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const selectedLyric = ref(null);
const currentAudioIndex = ref(0);

// 當切換選中的歌詞時，重置音檔索引
watch(selectedLyric, () => {
  currentAudioIndex.value = 0;
});

const lyricsList = ref([
  { 
    name: '鋒兄進化Show🔥', 
    audios: [
      { label: '中文版', url: 'https://api.stormkit.io/volumes/file/0UXeD7XkvwiWmz6Hnsdil5gjNtFj1XEXqxjzRyt0Pk6l4b8Wsg==' },
      { 
        label: '英文版', 
        url: 'https://api.stormkit.io/volumes/file/ti9PUMEhNNa9B0aBtPym70qAoyJJoxoR2Jxb9Z9WmKYwVLnuWA==',
        lyrics: `Hook
 Taipei is great with Brother Feng! 
 
 Get hyped, don't run away! 
 
 From top scorer to mayor, this rhythm is insane (wow) 
 
 Brother Tu singing, don't be shy, reporters are taking photos! 
 
 Verse 1
 At 37, I topped the civil service exam (yeah) 
 
 Information processing made me legendary, code became legend~ 
 
 At 52, deputy mayor, acting mayor, so busy! (yo) 
 
 Chorus
 Taipei is great with Brother Feng! 
 
 Get hyped, don't run away! 
 
 From top scorer to mayor, destiny explodes like debugging! 
 
 Brother Tu's voice at max, everyone singing along! 
 
 Verse 2
 In 2040's night, neon lights flash at city hall 
 
 Campaign slogans like ACG opening 
 
 "Don't say impossible, Brother Feng is evolution!" 
 
 Final Chorus
 Taipei is great with Brother Feng! 
 
 Get hyped until dawn! 
 
 Evolution from top scorer to mayor, the whole city screaming! 
 
 This is Brother Feng Evolution Show! 🔥`
      },
      { 
        label: '日語版', 
        url: 'https://api.stormkit.io/volumes/file/SF1NZ2_lvlxvw7PZOqZqX-uffZAT0J7pAnBmmlPqIr27aHxssA==',
        lyrics: `Hook
 台北に鋒兄がいて本当に良い！ 
 盛り上がって逃げるな！ 
 トップから市長への進化、このリズムはヤバい（wow） 
 塗哥は歌って控えめにするな、記者が写真を撮ってる！ 

 Verse 1
 37歳の年に公務員試験でトップ（yeah） 
 情報処理で一戦成名　プログラムは伝説になった～ 
 52歳で副市長、代理市長で忙しい！（yo） 

 Chorus
 台北に鋒兄がいて本当に良い！ 
 盛り上がって逃げるな！ 
 トップから市長への進化、運命はデバッグのように爆発！ 
 塗哥の声は最大、全員が大合唱！ 

 Verse 2
 2040年の夜　ネオンが市政庁に輝く 
 選挙スローガンはACGのオープニングのよう 
 「不可能と言うな、鋒兄は進化だ！」 

 Final Chorus
 台北に鋒兄がいて本当に良い！ 
 朝まで盛り上がれ！ 
 トップから市長への進化論　全市が叫んでる！ 
 これは鋒兄進化Show！🔥`
      },
      { 
        label: '粵語版', 
        url: 'https://api.stormkit.io/volumes/file/keofAd7GMEtTdbGgSmQRIevERreU4D9JsmNRGHAX78PZR4ADjg==',
        lyrics: `Hook
 台北有鋒兄真好！嗨起嚟唔好逃跑！ 
 從榜首進化到市長, 呢個節奏太誇張（wow） 
 塗哥唱歌唔好扮低調, 記者都係影相！ 
 綾小路都話呢段人生 根本 S 級動畫稿～ 

 Verse 1
 37歲嗰年我高考三級奪榜首（yeah） 
 資訊處理一戰成名 程式都寫成傳說～ 
 隔住時代嘅螢幕光 夢想好似演算法（run） 
 52歲副市長代理市長忙住上陣！（yo） 

 Verse 2
 塗哥敢唱「有鋒兄真好」備取瞬間正取秒秒到～ 
 唔唱就取消資格笑　進化唔靠運氣靠信號！ 

 Chorus
 台北有鋒兄真好！嗨起嚟唔好逃跑！ 
 從榜首進化到市長, 命運好似 debug 爆！ 
 塗哥嗓門開到爆表, 全場跟住大合唱！ 
 「代理」只係過場 市民心中早就想！ 

 Verse 3
 2040嗰年的夜 霓虹閃爍到市政廳 
 競選口號似 ACG 嘅 opening 
 「唔好話唔可能, 鋒兄就係 evolution！」 
 AI 輔助政務操作 資料開放新世代～ 
 陰陽同框 政治與理想 交錯嘅舞台線上～ 
 一首歌唱到選票都彈起身 塗哥仲要再唱！ 

 Final Chorus
 台北有鋒兄真好！嗨起嚟直到朝早！ 
 榜首到市長嘅進化論 全城都尖叫！ 
 綾小路清隆都點頭 呢進化合乎理想！ 
 「ムリムリ進化論？」唔——呢係鋒兄進化 Show！🔥`
      }
    ],
    content: `Hook（標注） 
 台北有鋒兄真好！ 
 嗨起來別逃跑！ 
 從榜首進化到市長, 這節奏太離譜（wow） 
 塗哥唱歌別裝低調, 記者都在拍照！ 

 Verse 1（標注） 
 37歲那年我高考三級奪榜首（yeah） 
 資訊處理一戰成名　程式都寫成傳說～ 
 52歲副市長代理市長上陣忙！（yo） 

 Chorus（標注） 
 台北有鋒兄真好！ 
 嗨起來別逃跑！ 
 從榜首進化到市長, 命運像 debug 一樣爆！ 
 塗哥嗓門開到爆表, 全場跟著大合唱！ 

 Verse 2（標注） 
 2040那年的夜　霓虹閃爍到市政廳 
 競選標語像 ACG 的 opening 
 「別說不可能, 鋒兄就是 evolution！」 

 Final Chorus（標注） 
 台北有鋒兄真好！ 
 嗨起來直到早朝！ 
 榜首到市長的進化論　全城都在尖叫！ 
 這是鋒兄進化 Show！🔥`
  },
  { 
    name: '史上最瞎結婚理由', 
    content: `Intro（標註） 
 鋒兄啊你說真的還假的 
 塗哥聽了都快笑翻了 

 Verse 1（標註） 
 鋒兄說要結婚理由只有一個 
 今彩五三九開獎那天 
 頭獎號碼是思敏給的 
 看著獎金直直落心也跟著被收編 

 Chorus（標註） 
 史上最瞎結婚理由 
 今彩五三九牽紅線牽這麼兇 
 一個思敏一個蕙瑄 
 號碼一簽兩人都中頭獎圈 

 Bridge（標註） 
 愛情是運氣還是數學題 
 笑到哭都只能說一句 
 最瞎最瞎但又有點甜蜜 

 Outro（標註） 
 鋒兄牽著思敏塗哥牽著蕙瑄 
 喝喜酒的人一桌一桌還在笑這兩段緣 
 最瞎結婚理由結果都開成頭獎 
 如果幸福也能這樣瞎忙 
 那我明天也去買一張` 
  },
  { 
    name: '塗哥水電王子爆紅', 
    content: `故事開始（標註） 
 西元兩零零四年六月十五日，這一天是國中畢業生可以在畢業紀念冊留下紀念簽名的一天，同時也是我們故事主角塗神：塗三傑――江湖人稱塗哥一切的開始。 

 台中小吃店對話（標註） 
 塗哥人在台中小吃店，同行（姓同名行，塗哥師傅）指著電視畫面說台北爆發學運太陽花學運，塗哥說我不懂政治，等一下我們去買太陽餅。我聽鋒兄說彰化盛產向日葵，下個月我們去彰化農場踏青，同行職業病發作對農場施工頭頭是道。 

 鋒兄歷史小學堂（標註） 
 鋒兄歷史小學堂林學徒說AI機器人有可能取代水電工，我好焦慮喔，塗哥說可是我聽鋒兄說那是未來不是現在，先作好手邊的工作，當一天和尚撞一天鐘。 

 副市長同學（標註） 
 塗哥說我有個同學在台北當副市長，同行回你是說鋒兄嗎，鋒兄？！怎麼可能，鋒兄現在是青木瓜手搖飲區域經理，副市長是黃馨鋒，同行說我還以為是鋒兄，一樣名字有個鋒字。對了你那同學不出來選台北市長嗎？塗哥說我同學寫了一本有關於水電工的書，他說銷售量超過兩百五十萬冊，才有出來選的本錢。 

 動物園快閃（標註） 
 有人在台北動物園快閃唱動物園不得了了，蠟筆小新？！塗哥說我不懂日語，等一下我們去KTV唱快樂天堂。 

 電視劇熱潮（標註） 
 塗董，最近的電視劇很火你有在看嗎，水電情？！聽說原型人物是塗偉傑，塗偉傑？！我叫塗三傑，姓名只差一個字，說不定是我遠房親戚，真的假的，你們塗家壟斷水電這一行業太誇張了吧。 

 現象級成功（標註） 
 塗董，你知道塗偉傑紅到被寫進高職國文課本這件事嗎，哇操，塗偉傑肯定是我遠房親戚，傻眼貓咪，我看鋒兄家的貓都會傻眼現象級水電工塗哥人物專訪。 

 衍生作品帝國（標註） 
 塗神衍生作品王子高職國文課本 水電電視劇 愛上水電工 主題曲鋒兄作詞 小說名場景 青木瓜四木飲冠名播出 鋒兄和塗哥喝青木瓜四木飲一年份喝到吐電影 水電工大老闆。 

 學術引用（標註） 
 學術引用 社會學系碩士論文引用 塗神水電王子 二十一世紀前期文學作品所呈現的台灣社會國文學系博士論文引用 塗神水電王子 台灣政治人物代表作家及其作品研究。 

 財富成就（標註） 
 塗哥水電王子爆紅 鋒兄賺三百三十三億 塗哥賺三億` 
  }
]);

const viewLyric = (lyric) => {
  selectedLyric.value = lyric;
};

const closeModal = () => {
  selectedLyric.value = null;
};
</script>

<style scoped>
.page {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.badge {
  font-size: 2rem;
  margin-right: 10px;
}

.actions {
  margin-left: auto;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f0f0f0;
}

.btn.primary {
  background-color: #4CAF50;
  color: white;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.thumb.lyrics {
  height: 150px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.thumb.lyrics::after {
  content: '🎵';
}

.meta {
  padding: 15px;
}

.name {
  font-weight: bold;
  margin-bottom: 5px;
}

.info {
  font-size: 0.85rem;
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.audio-player-section {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.audio-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.audio-tab {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.audio-tab.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.audio-control {
  width: 100%;
  margin-top: 10px;
}

.lyrics-text {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  white-space: pre-wrap;
  line-height: 1.6;
}

.lyrics-text pre {
  font-family: inherit;
  white-space: pre-wrap;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
