// config.js - 系統配置檔案

const CONFIG = {
    // Web3Forms API 配置
    WEB3FORMS: {
        ACCESS_KEY: '6a261dfc-a96a-4da0-bfa1-70f09dffe191',
        API_URL: 'https://api.web3forms.com/submit',
        REPLY_TO: '2025familytravelai@gmail.com'
    },
    
    // 系統設定
    SYSTEM: {
        APP_NAME: 'Family Travel AI',
        CONTACT_EMAIL: '2025familytravelai@gmail.com',
        CONTACT_PHONE: '0911323000',
        RESET_TOKEN_EXPIRY: 24 * 60 * 60 * 1000 // 24小時（毫秒）
    },
    
    // 測試帳戶
    TEST_ACCOUNTS: [
        'user@gmail.com',
        'test@example.com',
        'admin@familytravel.com'
    ]
};

// 匯出配置（如果使用模組系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全域變數（用於瀏覽器環境）
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
