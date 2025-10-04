// weather.js - 天氣資訊API連接

class WeatherApp {
    constructor() {
        // OpenWeatherMap API 設定
        // 注意：新生成的 API KEY 需要 2 小時才能完全啟用
        this.apiKey = '04cec0d7865efa81822b939023a85dbe'; // 您的API金鑰
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        
        // 初始化
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.testAPI();
        this.loadWeatherData();
    }

    async testAPI() {
        try {
            const testUrl = `${this.baseUrl}/weather?q=London&appid=${this.apiKey}&units=metric`;
            console.log('測試 API 連線:', testUrl);
            const response = await fetch(testUrl);
            console.log('API 測試回應狀態:', response.status);
            if (response.ok) {
                console.log('API 連線正常');
            } else {
                const errorText = await response.text();
                console.error('API 測試失敗:', response.status, errorText);
            }
        } catch (error) {
            console.error('API 測試錯誤:', error);
        }
    }

    setupEventListeners() {
        // 搜尋按鈕事件
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchWeather());
        }

        // 搜尋輸入框按Enter事件
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather();
                }
            });
        }

        // 定位按鈕事件
        const locationBtn = document.getElementById('location-btn');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }
    }

    async loadWeatherData() {
        // 直接顯示預設城市（台北）的天氣
        // 使用者可以點擊定位按鈕來獲取當前位置的天氣
        try {
            await this.getWeatherByCity('Taipei');
        } catch (error) {
            console.error('載入預設天氣失敗:', error);
            // 如果失敗，嘗試其他城市名稱
            try {
                await this.getWeatherByCity('Taipei,TW');
            } catch (error2) {
                console.error('載入備用天氣失敗:', error2);
                // 如果 API 失敗，顯示模擬資料
                this.showMockWeatherData();
            }
        }
    }

    showMockWeatherData() {
        // 顯示模擬天氣資料（當 API 無法使用時）
        const mockWeatherData = {
            name: '臺北',
            sys: { country: 'TW' },
            main: {
                temp: 25,
                feels_like: 27,
                humidity: 65
            },
            weather: [{
                description: '多雲',
                icon: '03d'
            }],
            wind: { speed: 3.2 }
        };

        const mockForecastData = {
            list: [
                {
                    dt: Date.now() / 1000 + 86400,
                    main: { temp: 26 },
                    weather: [{ description: '晴天', icon: '01d' }]
                },
                {
                    dt: Date.now() / 1000 + 172800,
                    main: { temp: 24 },
                    weather: [{ description: '陰天', icon: '02d' }]
                },
                {
                    dt: Date.now() / 1000 + 259200,
                    main: { temp: 28 },
                    weather: [{ description: '多雲', icon: '03d' }]
                },
                {
                    dt: Date.now() / 1000 + 345600,
                    main: { temp: 25 },
                    weather: [{ description: '小雨', icon: '10d' }]
                },
                {
                    dt: Date.now() / 1000 + 432000,
                    main: { temp: 27 },
                    weather: [{ description: '晴天', icon: '01d' }]
                }
            ]
        };

        this.displayWeather(mockWeatherData, mockForecastData);
        this.showError('目前顯示模擬資料（API 金鑰尚未啟用）');
    }

    async searchWeather() {
        const searchInput = document.getElementById('search-input');
        const city = searchInput.value.trim();
        
        if (city) {
            // 先檢查是否為中文城市名稱，如果是則直接轉換為英文
            const englishCity = this.convertToEnglish(city);
            const isChineseCity = englishCity !== city;
            
            try {
                if (isChineseCity) {
                    // 如果是中文城市名稱，直接使用英文版本
                    console.log(`中文城市 "${city}" 轉換為英文 "${englishCity}"`);
                    await this.getWeatherByCity(englishCity);
                } else {
                    // 如果不是已知的中文城市，嘗試原始輸入
                    await this.getWeatherByCity(city);
                }
            } catch (error) {
                console.error('搜尋城市失敗:', error);
                if (error.message.includes('404')) {
                    // 如果失敗，嘗試添加國家代碼
                    try {
                        if (isChineseCity) {
                            await this.getWeatherByCity(`${englishCity},TW`);
                        } else {
                            await this.getWeatherByCity(`${city},TW`);
                        }
                    } catch (error2) {
                        console.error('搜尋備用格式失敗:', error2);
                        this.showError(`找不到城市 "${city}"，請檢查城市名稱是否正確`);
                    }
                }
            }
        } else {
            this.showError('請輸入城市名稱');
        }
    }

    convertToEnglish(city) {
        // 中文城市名稱轉換為英文
        const cityMap = {
            '台北': 'Taipei',
            '臺北': 'Taipei',
            '台中': 'Taichung',
            '臺中': 'Taichung',
            '高雄': 'Kaohsiung',
            '台南': 'Tainan',
            '臺南': 'Tainan',
            '新竹': 'Hsinchu',
            '桃園': 'Taoyuan',
            '基隆': 'Keelung',
            '嘉義': 'Chiayi',
            '花蓮': 'Hualien',
            '台東': 'Taitung',
            '臺東': 'Taitung',
            '宜蘭': 'Yilan',
            '屏東': 'Pingtung',
            '彰化': 'Changhua',
            '雲林': 'Yunlin',
            '南投': 'Nantou',
            '苗栗': 'Miaoli'
        };
        
        return cityMap[city] || city;
    }

    convertToChinese(city) {
        // 英文城市名稱轉換為中文
        const cityMap = {
            'Taipei': '臺北',
            'Taichung': '臺中',
            'Kaohsiung': '高雄',
            'Tainan': '臺南',
            'Hsinchu': '新竹',
            'Taoyuan': '桃園',
            'Keelung': '基隆',
            'Chiayi': '嘉義',
            'Hualien': '花蓮',
            'Taitung': '臺東',
            'Yilan': '宜蘭',
            'Pingtung': '屏東',
            'Changhua': '彰化',
            'Yunlin': '雲林',
            'Nantou': '南投',
            'Miaoli': '苗栗'
        };
        
        return cityMap[city] || city;
    }

    async getWeatherByCity(city) {
        try {
            this.showLoading(true);
            
            // 獲取當前天氣
            const weatherData = await this.fetchWeatherData(city);
            
            // 獲取5天預報
            const forecastData = await this.fetchForecastData(city);
            
            this.displayWeather(weatherData, forecastData);
            
        } catch (error) {
            console.error('獲取天氣資料失敗:', error);
            if (error.message.includes('401')) {
                this.showError('API 金鑰無效或尚未啟用，請稍後再試（新 API 金鑰需要 2 小時啟用）');
            } else if (error.message.includes('404')) {
                this.showError('找不到該城市，請檢查城市名稱是否正確');
            } else {
                this.showError('無法獲取天氣資料，請稍後再試');
            }
        } finally {
            this.showLoading(false);
        }
    }

    async getCurrentLocation() {
        if (navigator.geolocation) {
            try {
                this.showLoading(true);
                
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                
                // 根據經緯度獲取天氣
                const weatherData = await this.fetchWeatherByCoords(latitude, longitude);
                const forecastData = await this.fetchForecastByCoords(latitude, longitude);
                
                this.displayWeather(weatherData, forecastData);
                
            } catch (error) {
                console.error('獲取位置失敗:', error);
                this.showError('無法獲取您的位置，請手動輸入城市名稱');
            } finally {
                this.showLoading(false);
            }
        } else {
            this.showError('您的瀏覽器不支援地理定位功能');
        }
    }

    async fetchWeatherData(city) {
        const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=zh_tw`;
        console.log('正在請求天氣資料:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 回應錯誤:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('天氣資料獲取成功:', data);
        return data;
    }

    async fetchForecastData(city) {
        const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=zh_tw`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('預報 API 回應錯誤:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    async fetchWeatherByCoords(lat, lon) {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=zh_tw`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    async fetchForecastByCoords(lat, lon) {
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=zh_tw`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    displayWeather(weatherData, forecastData) {
        this.displayCurrentWeather(weatherData);
        this.displayForecast(forecastData);
        
        // 更新搜尋輸入框的值為中文城市名稱
        const searchInput = document.getElementById('search-input');
        if (searchInput && weatherData.name) {
            const chineseName = this.convertToChinese(weatherData.name);
            searchInput.value = chineseName;
        }
    }

    displayCurrentWeather(data) {
        const currentWeatherEl = document.getElementById('current-weather');
        if (!currentWeatherEl) return;

        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const cityName = data.name;
        const country = data.sys.country;

        // 除錯：顯示圖標代碼
        console.log('天氣圖標代碼:', icon);
        console.log('天氣圖標 URL:', `https://openweathermap.org/img/wn/${icon}@2x.png`);

        // 將英文城市名稱轉換為中文
        const chineseCityName = this.convertToChinese(cityName);
        const displayCityName = chineseCityName !== cityName ? chineseCityName : cityName;

        currentWeatherEl.innerHTML = `
            <div class="weather-header">
                <h2>${displayCityName}, ${country}</h2>
                <p class="weather-description">${description}</p>
            </div>
            <div class="weather-main">
                <div class="temperature">
                    <span class="temp-value">${temp}°C</span>
                    <span class="feels-like">體感溫度: ${feelsLike}°C</span>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" onerror="this.src='https://openweathermap.org/img/wn/${icon}.png'">
                </div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">濕度</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">風速</span>
                    <span class="detail-value">${windSpeed} m/s</span>
                </div>
            </div>
        `;
    }

    displayForecast(data) {
        const forecastEl = document.getElementById('forecast');
        if (!forecastEl) return;

        // 將預報資料按日期分組，並限制為5天
        const dailyForecasts = this.groupForecastsByDay(data.list);
        
        let forecastHTML = '<h3>5天預報</h3><div class="forecast-container">';
        
        // 取得排序後的日期鍵，並限制為5天
        const sortedDates = Object.keys(dailyForecasts).sort();
        const limitedDates = sortedDates.slice(0, 5); // 只取前5天
        
        limitedDates.forEach(date => {
            const dayForecasts = dailyForecasts[date];
            const avgTemp = Math.round(dayForecasts.reduce((sum, f) => sum + f.main.temp, 0) / dayForecasts.length);
            const icon = dayForecasts[0].weather[0].icon;
            const description = dayForecasts[0].weather[0].description;
            
            // 除錯：顯示預報圖標代碼
            console.log(`${date} 預報圖標:`, icon);
            
            const dayName = new Date(date).toLocaleDateString('zh-TW', { weekday: 'short' });
            
            forecastHTML += `
                <div class="forecast-day">
                    <div class="forecast-date">${dayName}</div>
                    <div class="forecast-icon">
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                    </div>
                    <div class="forecast-temp">${avgTemp}°C</div>
                    <div class="forecast-desc">${description}</div>
                </div>
            `;
        });
        
        forecastHTML += '</div>';
        forecastEl.innerHTML = forecastHTML;
    }

    groupForecastsByDay(forecastList) {
        const dailyForecasts = {};
        
        forecastList.forEach(forecast => {
            // 使用本地時區來確保日期分組的一致性
            const date = new Date(forecast.dt * 1000);
            const localDateString = date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            
            if (!dailyForecasts[localDateString]) {
                dailyForecasts[localDateString] = [];
            }
            dailyForecasts[localDateString].push(forecast);
        });
        
        return dailyForecasts;
    }

    showLoading(show) {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            
            // 3秒後自動隱藏錯誤訊息
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 3000);
        }
    }
}

// 當頁面載入完成後初始化天氣應用
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
}); 