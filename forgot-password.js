// forgot-password.js - 忘記密碼頁面互動功能

class ForgotPasswordManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 表單提交事件
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // 輸入框焦點效果
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    async handleForgotPassword() {
        const email = document.getElementById('email').value.trim();

        // 基本驗證
        if (!this.validateEmail(email)) {
            this.showMessage('請輸入有效的電子郵件地址', 'error');
            return;
        }

        // 顯示載入狀態
        this.setLoadingState(true);

        try {
            // 模擬發送重設連結
            const result = await this.sendResetLink(email);
            
            if (result.success) {
                this.showMessage('密碼重設連結已發送到您的電子郵件！', 'success');
                
                // 延遲跳轉到登入頁面
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                this.showMessage(result.message || '發送失敗，請稍後再試', 'error');
            }
        } catch (error) {
            console.error('發送重設連結錯誤:', error);
            this.showMessage('發送時發生錯誤，請稍後再試', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendResetLink(email) {
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 檢查硬編碼的測試帳戶
        const testEmails = CONFIG.TEST_ACCOUNTS;

        // 檢查已註冊的用戶
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const isRegisteredUser = registeredUsers.some(user => user.email === email);
        const isTestUser = testEmails.includes(email);

        // 調試資訊
        console.log('忘記密碼檢查:', {
            email: email,
            registeredUsers: registeredUsers,
            isRegisteredUser: isRegisteredUser,
            isTestUser: isTestUser
        });

        if (isRegisteredUser || isTestUser) {
            // 生成重設連結
            const resetToken = this.generateResetToken();
            
            // 使用一個簡單的重定向服務，讓郵件中的連結可以點擊
            // 這裡使用 GitHub Pages 或 Netlify 等免費託管服務
            const currentPath = window.location.href.replace(/\/[^\/]*$/, '');
            const localPath = `${currentPath}/index.html?token=${resetToken}&email=${encodeURIComponent(email)}&timestamp=${Date.now()}`;
            
            // 創建一個簡單的重定向連結（請替換為您的實際網址）
            const resetLink = `https://your-actual-netlify-url.netlify.app/?redirect=${encodeURIComponent(localPath)}`;
            
            // 儲存重設令牌到 localStorage（模擬資料庫）
            this.saveResetToken(email, resetToken);
            
            // 嘗試發送郵件，但不管成功與否都顯示重設連結
            try {
                const emailResult = await this.sendPasswordResetEmail(email, resetLink);
                console.log('郵件發送結果:', emailResult);
            } catch (error) {
                console.log('郵件發送失敗，但繼續顯示重設連結:', error);
            }
            
            // 顯示重設連結並說明郵件發送
            return {
                success: true,
                message: `密碼重設連結已準備好！\n\n🔗 重設連結：\n<a href="${resetLink}" target="_blank" style="color: #007bff; text-decoration: underline;">點擊這裡重設密碼</a>\n\n📋 使用說明：\n1. 點擊上方連結直接重設密碼\n2. 或複製下方網址到瀏覽器開啟\n3. 網址：${resetLink}\n\n📧 我們也會發送郵件到 ${email}，請檢查您的信箱（包括垃圾郵件夾）。\n\n⚠️ 注意：此連結將在 24 小時後過期。`
            };
        } else {
            console.log('電子郵件地址未註冊:', email);
            return {
                success: false,
                message: '此電子郵件地址未註冊'
            };
        }
    }

    generateResetToken() {
        // 生成一個簡單的重設令牌
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `reset_${timestamp}_${random}`;
    }

    saveResetToken(email, token) {
        // 儲存重設令牌到 localStorage（模擬資料庫）
        const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
        resetTokens[email] = {
            token: token,
            timestamp: Date.now(),
            used: false
        };
        localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
        console.log('重設令牌已儲存:', { email, token });
    }

    async sendPasswordResetEmail(email, resetLink) {
        try {
            // 檢查 EmailJS 是否已載入
            if (typeof emailjs === 'undefined') {
                console.log('EmailJS 未載入，跳過郵件發送');
                return { success: false, error: 'EmailJS 未載入' };
            }

            // 初始化 EmailJS（使用您的 Public Key）
            emailjs.init('DS7989ii_jEambnB4');

            const templateParams = {
                email: email, // 對應模板中的 {{email}}
                subject: `[${CONFIG.SYSTEM.APP_NAME}] 密碼重設連結`,
                link: resetLink, // 對應模板中的 {{link}}
                message: '點擊這裡重設密碼', // 對應模板中的 {{message}}
                from_name: CONFIG.SYSTEM.APP_NAME,
                reply_to: email
            };
            
            console.log('發送密碼重設郵件到:', email);
            console.log('EmailJS 請求資料:', templateParams);
            console.log('重設連結:', resetLink);
            
            // 使用 EmailJS 發送郵件
            const result = await emailjs.send(
                'service_6lg4lqc', // 您的 EmailJS Service ID
                'template_3qhgn0o', // 您的 EmailJS Template ID
                templateParams
            );
            
            console.log('EmailJS 回應:', result);
            
            if (result.status === 200) {
                console.log('密碼重設郵件發送成功!', result);
                return { success: true, data: result };
            } else {
                console.error('密碼重設郵件發送失敗:', result);
                return { success: false, error: result };
            }
        } catch (error) {
            console.error('發送密碼重設郵件時發生錯誤:', error);
            return { success: false, error: error };
        }
    }

    generatePasswordResetEmailTemplate(resetLink, userEmail) {
        return `
親愛的 ${CONFIG.SYSTEM.APP_NAME} 用戶，

您收到了這封郵件是因為您請求重設密碼。

請複製以下網址到瀏覽器來重設您的密碼：
${resetLink}

⚠️ 重要提醒：
• 此連結將在 24 小時後過期
• 此連結只能使用一次
• 如果您沒有請求重設密碼，請忽略此郵件

如有任何問題，請聯絡我們：
📧 ${CONFIG.SYSTEM.CONTACT_EMAIL}
📞 ${CONFIG.SYSTEM.CONTACT_PHONE}

感謝您使用 ${CONFIG.SYSTEM.APP_NAME}！

---
${CONFIG.SYSTEM.APP_NAME} 團隊
讓AI成為您家庭旅行的最佳夥伴
        `.trim();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(loading) {
        const sendResetBtn = document.getElementById('sendResetBtn');
        const btnText = sendResetBtn.querySelector('.btn-text');
        const btnLoading = sendResetBtn.querySelector('.btn-loading');
        
        if (loading) {
            sendResetBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
        } else {
            sendResetBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        const messageToast = document.getElementById('messageToast');
        const messageText = messageToast.querySelector('.message-text');
        
        // 支援多行訊息和連結
        let htmlMessage = message.replace(/\n/g, '<br>');
        
        // 處理 HTML 標籤（如果訊息包含 HTML）
        if (message.includes('<a href=')) {
            // 如果訊息已經包含 HTML 標籤，直接使用
            htmlMessage = message.replace(/\n/g, '<br>');
        } else if (message.includes('重設連結：')) {
            // 如果是重設連結訊息，讓連結可以點擊
            const linkMatch = message.match(/https?:\/\/[^\s]+/);
            if (linkMatch) {
                const link = linkMatch[0];
                htmlMessage = htmlMessage.replace(link, `<a href="${link}" target="_blank" style="color: #007bff; text-decoration: underline;">${link}</a>`);
            }
        }
        
        messageText.innerHTML = htmlMessage;
        messageToast.className = `message-toast ${type}`;
        messageToast.style.display = 'block';
        
        // 觸發顯示動畫
        setTimeout(() => {
            messageToast.classList.add('show');
        }, 100);
        
        // 延長顯示時間，因為訊息較長
        const displayTime = message.includes('重設連結') ? 15000 : 3000;
        setTimeout(() => {
            messageToast.classList.remove('show');
            setTimeout(() => {
                messageToast.style.display = 'none';
            }, 300);
        }, displayTime);
    }
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPasswordManager();
});
