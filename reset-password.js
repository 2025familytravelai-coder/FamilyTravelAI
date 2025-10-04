// reset-password.js - 重設密碼頁面互動功能

class ResetPasswordManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadResetData();
    }

    setupEventListeners() {
        // 表單提交事件
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleResetPassword();
            });
        }

        // 密碼顯示/隱藏切換
        const newPasswordToggle = document.getElementById('newPasswordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        
        if (newPasswordToggle) {
            newPasswordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('newPassword');
            });
        }
        
        if (confirmPasswordToggle) {
            confirmPasswordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('confirmPassword');
            });
        }

        // 密碼確認檢查
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }

        // 密碼強度檢查
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', () => {
                this.checkPasswordStrength();
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

    loadResetData() {
        // 從 URL 參數獲取電子郵件、令牌和時間戳
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const token = urlParams.get('token');
        const timestamp = urlParams.get('timestamp');

        if (!email || !token || !timestamp) {
            this.showMessage('無效的重設連結', 'error');
            setTimeout(() => {
                window.location.href = 'forgot-password.html';
            }, 3000);
            return;
        }

        // 驗證令牌
        if (!this.validateResetToken(email, token, timestamp)) {
            this.showMessage('重設連結已過期或無效', 'error');
            setTimeout(() => {
                window.location.href = 'forgot-password.html';
            }, 3000);
            return;
        }

        // 填入電子郵件
        document.getElementById('email').value = email;
        
        // 調試：顯示 localStorage 中的資料
        this.debugLocalStorage();
    }

    validateResetToken(email, token, timestamp) {
        // 檢查令牌格式是否正確
        if (!token.startsWith('reset_') || !token.includes('_')) {
            console.log('令牌格式不正確:', token);
            return false;
        }

        // 檢查時間戳是否有效
        const tokenTimestamp = parseInt(timestamp);
        if (isNaN(tokenTimestamp)) {
            console.log('時間戳無效:', timestamp);
            return false;
        }

        // 檢查令牌是否過期（24小時）
        const now = Date.now();
        const tokenAge = now - tokenTimestamp;
        const maxAge = CONFIG.SYSTEM.RESET_TOKEN_EXPIRY;

        if (tokenAge > maxAge) {
            console.log('令牌已過期:', { tokenAge, maxAge, hours: Math.round(tokenAge / (1000 * 60 * 60)) });
            return false;
        }

        // 檢查電子郵件格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('電子郵件格式不正確:', email);
            return false;
        }

        console.log('令牌驗證成功:', { email, tokenAge: Math.round(tokenAge / (1000 * 60 * 60)) + '小時' });
        return true;
    }

    debugLocalStorage() {
        console.log('=== localStorage 調試資訊 ===');
        console.log('localStorage 項目數量:', localStorage.length);
        
        let foundUsers = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`鍵: ${key}`);
            console.log(`值: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
            
            if (key === 'registeredUsers') {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`registeredUsers 解析結果:`, parsed);
                    if (Array.isArray(parsed)) {
                        console.log(`用戶數量: ${parsed.length}`);
                        foundUsers = parsed;
                        parsed.forEach((user, index) => {
                            console.log(`用戶 ${index + 1}:`, user.email);
                        });
                    }
                } catch (e) {
                    console.log('解析 registeredUsers 失敗:', e);
                }
            }
            console.log('---');
        }
        
        // 在頁面上顯示用戶列表（調試用）
        if (foundUsers.length > 0) {
            const userList = foundUsers.map(user => user.email).join(', ');
            console.log('找到的用戶:', userList);
            
            // 在頁面上顯示調試資訊
            const debugDiv = document.createElement('div');
            debugDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f0f0f0;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 12px;
                max-width: 300px;
                z-index: 9999;
            `;
            debugDiv.innerHTML = `
                <strong>調試資訊：</strong><br>
                找到 ${foundUsers.length} 個用戶<br>
                用戶列表：${userList}
            `;
            document.body.appendChild(debugDiv);
            
            // 5秒後自動移除
            setTimeout(() => {
                if (debugDiv.parentNode) {
                    debugDiv.parentNode.removeChild(debugDiv);
                }
            }, 5000);
        }
        
        console.log('=== 調試資訊結束 ===');
    }

    async handleResetPassword() {
        const email = document.getElementById('email').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 基本驗證
        if (!this.validateForm(email, newPassword, confirmPassword)) {
            return;
        }

        // 顯示載入狀態
        this.setLoadingState(true);

        try {
            // 模擬重設密碼
            const result = await this.resetPassword(email, newPassword);
            
            if (result.success) {
                this.showMessage('密碼重設成功！正在跳轉到登入頁面...', 'success');
                
                // 延遲跳轉到登入頁面
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                this.showMessage(result.message || '重設失敗，請稍後再試', 'error');
            }
        } catch (error) {
            console.error('重設密碼錯誤:', error);
            this.showMessage('重設時發生錯誤，請稍後再試', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(email, newPassword, confirmPassword) {
        // 密碼驗證
        if (newPassword.length < 6) {
            this.showMessage('密碼至少需要6個字元', 'error');
            return false;
        }

        if (!/[a-zA-Z]/.test(newPassword)) {
            this.showMessage('密碼必須包含英文字母', 'error');
            return false;
        }

        if (!/\d/.test(newPassword)) {
            this.showMessage('密碼必須包含數字', 'error');
            return false;
        }

        // 密碼確認驗證
        if (newPassword !== confirmPassword) {
            this.showMessage('密碼與確認密碼不一致', 'error');
            return false;
        }

        return true;
    }

    async resetPassword(email, newPassword) {
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // 嘗試從 localStorage 讀取
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            console.log('重設密碼 - 讀取到的用戶列表:', registeredUsers);
            console.log('重設密碼 - 尋找的電子郵件:', email);
            
            const userIndex = registeredUsers.findIndex(user => user.email === email);
            console.log('重設密碼 - 用戶索引:', userIndex);
            
            if (userIndex !== -1) {
                // 更新密碼
                registeredUsers[userIndex].password = newPassword;
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                console.log('密碼重設成功:', email);
                return {
                    success: true,
                    message: '密碼重設成功！您現在可以使用新密碼登入。'
                };
            } else {
                console.log('找不到用戶資料，可用用戶列表:', registeredUsers.map(u => u.email));
                return {
                    success: false,
                    message: `找不到用戶資料。可用用戶：${registeredUsers.map(u => u.email).join(', ')}`
                };
            }
        } catch (error) {
            console.error('重設密碼時發生錯誤:', error);
            return {
                success: false,
                message: '重設密碼時發生錯誤'
            };
        }
    }

    togglePasswordVisibility(fieldId) {
        const passwordInput = document.getElementById(fieldId);
        const toggleBtn = document.getElementById(fieldId + 'Toggle');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        }
    }

    checkPasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword.length > 0) {
            if (newPassword === confirmPassword) {
                document.getElementById('confirmPassword').style.borderColor = '#4caf50';
            } else {
                document.getElementById('confirmPassword').style.borderColor = '#f44336';
            }
        } else {
            document.getElementById('confirmPassword').style.borderColor = '#e0e0e0';
        }
    }

    checkPasswordStrength() {
        const password = document.getElementById('newPassword').value;
        const passwordInput = document.getElementById('newPassword');
        
        if (password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password)) {
            passwordInput.style.borderColor = '#4caf50';
        } else if (password.length > 0) {
            passwordInput.style.borderColor = '#f44336';
        } else {
            passwordInput.style.borderColor = '#e0e0e0';
        }
    }

    setLoadingState(loading) {
        const resetPasswordBtn = document.getElementById('resetPasswordBtn');
        const btnText = resetPasswordBtn.querySelector('.btn-text');
        const btnLoading = resetPasswordBtn.querySelector('.btn-loading');
        
        if (loading) {
            resetPasswordBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
        } else {
            resetPasswordBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        const messageToast = document.getElementById('messageToast');
        const messageText = messageToast.querySelector('.message-text');
        
        messageText.textContent = message;
        messageToast.className = `message-toast ${type}`;
        messageToast.style.display = 'block';
        
        // 觸發顯示動畫
        setTimeout(() => {
            messageToast.classList.add('show');
        }, 100);
        
        // 3秒後自動隱藏
        setTimeout(() => {
            messageToast.classList.remove('show');
            setTimeout(() => {
                messageToast.style.display = 'none';
            }, 300);
        }, 3000);
    }
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    new ResetPasswordManager();
});
