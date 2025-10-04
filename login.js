// login.js - 登入頁面互動功能

class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // 先檢查記住我功能，再檢查現有登入狀態
        this.loadRememberedEmail();
        this.checkExistingLogin();
    }

    setupEventListeners() {
        // 表單提交事件
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 密碼顯示/隱藏切換
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }


        // 註冊按鈕
        const signupBtn = document.querySelector('.signup-btn');
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // 忘記密碼連結
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
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

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // 基本驗證
        if (!this.validateEmail(email)) {
            this.showMessage('請輸入有效的電子郵件地址', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('密碼至少需要6個字元', 'error');
            return;
        }

        // 顯示載入狀態
        this.setLoadingState(true);

        try {
            // 模擬登入API呼叫
            const loginResult = await this.performLogin(email, password);
            
            if (loginResult.success) {
                // 儲存登入狀態
                this.saveLoginState(loginResult.user, rememberMe);
                
                this.showMessage('登入成功！正在跳轉...', 'success');
                
                // 延遲跳轉以顯示成功訊息
                setTimeout(() => {
                    this.redirectToMainPage();
                }, 1500);
            } else {
                this.showMessage(loginResult.message || '登入失敗，請檢查您的帳戶資訊', 'error');
            }
        } catch (error) {
            console.error('登入錯誤:', error);
            this.showMessage('登入時發生錯誤，請稍後再試', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async performLogin(email, password) {
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模擬登入驗證
        // 在實際應用中，這裡會是真正的API呼叫
        const validCredentials = this.validateCredentials(email, password);
        
        if (validCredentials) {
            // 獲取用戶資料
            const userData = this.getUserData(email);
            
            return {
                success: true,
                user: userData
            };
        } else {
            return {
                success: false,
                message: '電子郵件或密碼錯誤'
            };
        }
    }

    validateCredentials(email, password) {
        console.log('驗證登入憑證:', { email, password }); // 調試用
        
        // 先檢查預設的測試帳戶
        const testAccounts = [
            { email: 'user@gmail.com', password: 'user123' }
        ];

        if (testAccounts.some(account => 
            account.email === email && account.password === password
        )) {
            console.log('使用預設測試帳戶登入'); // 調試用
            return true;
        }

        // 檢查新註冊的用戶
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('已註冊用戶列表:', registeredUsers); // 調試用
        
        const isValid = registeredUsers.some(user => {
            console.log('檢查用戶:', { userEmail: user.email, userPassword: user.password, inputEmail: email, inputPassword: password }); // 調試用
            return user.email === email && user.password === password;
        });
        
        console.log('註冊用戶驗證結果:', isValid); // 調試用
        return isValid;
    }

    getUserData(email) {
        // 先檢查新註冊的用戶
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const registeredUser = registeredUsers.find(user => user.email === email);
        
        if (registeredUser) {
            return {
                id: registeredUser.id,
                email: registeredUser.email,
                name: registeredUser.name,
                avatar: registeredUser.avatar || this.getRandomAvatar(),
                memberId: registeredUser.memberId
            };
        }
        
        // 如果是預設測試帳戶，使用預設資料
        return {
            id: 'user_' + Date.now(),
            email: email,
            name: this.extractNameFromEmail(email),
            avatar: this.getRandomAvatar(),
            memberId: this.generateMemberId()
        };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    extractNameFromEmail(email) {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    generateMemberId() {
        const timestamp = Date.now();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const timeSuffix = timestamp.toString().slice(-6);
        
        return `M${year}${month}${day}${timeSuffix}`;
    }

    getRandomAvatar() {
        // 預設頭像列表
        const avatars = [
            'img/頭像1.png',
            'img/頭像2.png',
            'img/頭像3.png',
            'img/頭像4.png',
            'img/頭像5.png'
        ];
        
        // 隨機選擇一個頭像
        const randomIndex = Math.floor(Math.random() * avatars.length);
        return avatars[randomIndex];
    }

    saveLoginState(user, rememberMe) {
        // 儲存使用者資料到 localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // 儲存頭像到 localStorage，供其他頁面使用
        if (user.avatar) {
            localStorage.setItem('userAvatar', user.avatar);
        }
        
        console.log('儲存登入狀態:', { rememberMe, email: user.email, avatar: user.avatar }); // 調試用
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedEmail', user.email); // 儲存email供下次登入使用
            console.log('已儲存記住的email:', user.email); // 調試用
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
            console.log('已清除記住我設定'); // 調試用
        }

        // 儲存到 sessionStorage 作為備份
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('isLoggedIn', 'true');
    }

    checkExistingLogin() {
        // 檢查是否已經登入
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        console.log('檢查現有登入狀態:', { isLoggedIn, rememberMe }); // 調試用
        
        if (isLoggedIn && rememberMe) {
            // 如果選擇記住我，自動跳轉到主頁面
            console.log('自動跳轉到主頁面'); // 調試用
            this.redirectToMainPage();
        } else if (isLoggedIn) {
            // 如果沒有選擇記住我，檢查登入時間
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const loginDate = new Date(loginTime);
                const now = new Date();
                const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    // 24小時內自動跳轉
                    console.log('24小時內自動跳轉'); // 調試用
                    this.redirectToMainPage();
                } else {
                    // 超過24小時，清除登入狀態
                    console.log('超過24小時，清除登入狀態'); // 調試用
                    this.clearLoginState();
                }
            }
        }
        // 移除這裡的 loadRememberedEmail() 調用，因為已經在 init() 中調用了
    }

    loadRememberedEmail() {
        // 檢查URL參數中的email（來自註冊頁面）
        const urlParams = new URLSearchParams(window.location.search);
        const urlEmail = urlParams.get('email');
        
        // 檢查是否有記住的email
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const savedEmail = localStorage.getItem('savedEmail');
        
        console.log('檢查記住的email:', { rememberMe, savedEmail, urlEmail }); // 調試用
        
        // 優先使用URL參數中的email（來自註冊）
        const emailToFill = urlEmail || savedEmail;
        
        if (emailToFill) {
            // 自動填入email
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = emailToFill;
                console.log('已填入email:', emailToFill); // 調試用
            }
            
            // 如果是來自註冊頁面，不自動勾選記住我
            if (!urlEmail) {
                // 自動勾選記住我選項
                const rememberMeCheckbox = document.getElementById('rememberMe');
                if (rememberMeCheckbox) {
                    rememberMeCheckbox.checked = true;
                    console.log('已勾選記住我'); // 調試用
                }
                
                // 同時修正localStorage狀態
                localStorage.setItem('rememberMe', 'true');
                console.log('已修正rememberMe狀態為true');
            }
        }
    }

    clearLoginState() {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
    }

    redirectToMainPage() {
        // 跳轉到主頁面
        window.location.href = 'index.html';
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('passwordToggle');
        
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


    handleSignup() {
        // 跳轉到註冊頁面
        window.location.href = 'signup.html';
    }

    handleForgotPassword() {
        // 跳轉到忘記密碼頁面
        window.location.href = 'forgot-password.html';
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        if (loading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
        } else {
            loginBtn.disabled = false;
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
    new LoginManager();
});

// 登出函數已移至 sidebar.js 中定義
