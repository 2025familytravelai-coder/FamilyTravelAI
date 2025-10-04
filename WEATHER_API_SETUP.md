# 天氣API設定說明

## 概述
這個天氣功能使用 OpenWeatherMap API 來獲取即時天氣資料和5天預報。

## 步驟1：註冊 OpenWeatherMap 帳號
1. 前往 [OpenWeatherMap](https://openweathermap.org/)
2. 點擊右上角的 "Sign Up" 註冊新帳號
3. 填寫基本資料並驗證電子郵件

## 步驟2：獲取API金鑰
1. 登入後，前往 [API Keys](https://home.openweathermap.org/api_keys) 頁面
2. 點擊 "Generate" 按鈕生成新的API金鑰
3. 複製生成的API金鑰（通常是一串32位字符）

## 步驟3：設定API金鑰
1. 開啟 `weather.js` 檔案
2. 找到第5行的 `this.apiKey = 'YOUR_API_KEY_HERE';`
3. 將 `YOUR_API_KEY_HERE` 替換為您剛才複製的API金鑰
4. 儲存檔案

```javascript
// 範例
this.apiKey = '1234567890abcdef1234567890abcdef';
```

## 步驟4：等待API金鑰啟用
- 新生成的API金鑰可能需要2小時才能完全啟用
- 如果立即使用可能會收到錯誤訊息

## 功能特色
- **即時天氣**：顯示當前溫度、體感溫度、濕度、風速
- **5天預報**：顯示未來5天的天氣預報
- **城市搜尋**：支援全球城市名稱搜尋
- **地理定位**：使用瀏覽器定位功能獲取當地天氣
- **多語言支援**：支援繁體中文顯示
- **響應式設計**：適配各種螢幕尺寸

## API限制
- 免費帳號：每分鐘60次請求
- 付費帳號：更高的請求限制

## 故障排除
1. **API金鑰錯誤**：確認金鑰是否正確複製
2. **城市找不到**：嘗試使用英文城市名稱
3. **定位失敗**：確認瀏覽器已授權位置權限
4. **載入失敗**：檢查網路連線是否正常

## 替代方案
如果不想使用 OpenWeatherMap，也可以考慮：
- **AccuWeather API**
- **WeatherAPI.com**
- **Tomorrow.io**

只需要修改 `weather.js` 中的 API 端點和資料處理邏輯即可。 