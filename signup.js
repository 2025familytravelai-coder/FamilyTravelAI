// signup.js - 註冊頁面互動功能

class SignupManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 表單提交事件
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // 密碼顯示/隱藏切換
        const passwordToggle = document.getElementById('passwordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('password');
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
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
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

        // 條款連結點擊事件
        const termsLinks = document.querySelectorAll('.terms-link');
        termsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const linkText = link.textContent.trim();
                if (linkText.includes('服務條款')) {
                    this.showTermsModal('terms-of-service.html', '服務條款');
                } else if (linkText.includes('隱私政策')) {
                    this.showTermsModal('privacy-policy.html', '隱私政策');
                }
            });
        });
    }

    async handleSignup() {
        const firstName = document.getElementById('firstName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // 基本驗證
        if (!this.validateForm(firstName, email, password, confirmPassword, agreeTerms)) {
            return;
        }

        // 顯示載入狀態
        this.setLoadingState(true);

        try {
            // 模擬註冊API呼叫
            const signupResult = await this.performSignup(firstName, email, password);
            
            if (signupResult.success) {
                this.showMessage('註冊成功！正在跳轉到登入頁面...', 'success');
                
                // 延遲跳轉到登入頁面，並帶上email參數
                setTimeout(() => {
                    window.location.href = `login.html?email=${encodeURIComponent(signupResult.user.email)}`;
                }, 2000);
            } else {
                this.showMessage(signupResult.message || '註冊失敗，請稍後再試', 'error');
            }
        } catch (error) {
            console.error('註冊錯誤:', error);
            this.showMessage('註冊時發生錯誤，請稍後再試', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(firstName, email, password, confirmPassword, agreeTerms) {
        // 姓名驗證
        if (!firstName) {
            this.showMessage('請輸入您的姓名', 'error');
            return false;
        }

        if (firstName.length < 2) {
            this.showMessage('姓名至少需要2個字元', 'error');
            return false;
        }

        // 電子郵件驗證
        if (!this.validateEmail(email)) {
            this.showMessage('請輸入有效的電子郵件地址', 'error');
            return false;
        }

        // 密碼驗證
        if (password.length < 6) {
            this.showMessage('密碼至少需要6個字元', 'error');
            return false;
        }

        if (!/[a-zA-Z]/.test(password)) {
            this.showMessage('密碼必須包含英文字母', 'error');
            return false;
        }

        if (!/\d/.test(password)) {
            this.showMessage('密碼必須包含數字', 'error');
            return false;
        }

        // 密碼確認驗證
        if (password !== confirmPassword) {
            this.showMessage('密碼與確認密碼不一致', 'error');
            return false;
        }

        // 同意條款驗證
        if (!agreeTerms) {
            this.showMessage('請同意服務條款和隱私政策', 'error');
            return false;
        }

        return true;
    }

    async performSignup(firstName, email, password) {
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 檢查是否已存在相同email
        const existingEmails = [
            'user@gmail.com',
            'test@example.com',
            'admin@familytravel.com'
        ];

        if (existingEmails.includes(email)) {
            return {
                success: false,
                message: '此電子郵件地址已被註冊'
            };
        } else {
            // 隨機選擇預設頭像
            const randomAvatar = this.getRandomAvatar();
            
            // 創建新用戶並儲存到localStorage，讓用戶可以立即登入
            const newUser = {
                id: 'user_' + Date.now(),
                name: firstName,
                email: email,
                memberId: this.generateMemberId(),
                password: password, // 在實際應用中，這裡應該是加密後的密碼
                avatar: randomAvatar // 新增頭像欄位
            };

            // 儲存新用戶到localStorage（模擬資料庫）
            this.saveNewUser(newUser);

            return {
                success: true,
                user: newUser
            };
        }
    }

    saveNewUser(user) {
        // 獲取現有的用戶列表
        let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('現有用戶列表:', users); // 調試用
        
        // 添加新用戶
        users.push(user);
        
        // 儲存回localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        console.log('新用戶已註冊:', user); // 調試用
        console.log('更新後的用戶列表:', users); // 調試用
        
        // 驗證儲存是否成功
        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('驗證儲存結果:', savedUsers); // 調試用
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                document.getElementById('confirmPassword').style.borderColor = '#4caf50';
            } else {
                document.getElementById('confirmPassword').style.borderColor = '#f44336';
            }
        } else {
            document.getElementById('confirmPassword').style.borderColor = '#e0e0e0';
        }
    }

    checkPasswordStrength() {
        const password = document.getElementById('password').value;
        const passwordInput = document.getElementById('password');
        
        if (password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password)) {
            passwordInput.style.borderColor = '#4caf50';
        } else if (password.length > 0) {
            passwordInput.style.borderColor = '#f44336';
        } else {
            passwordInput.style.borderColor = '#e0e0e0';
        }
    }

    setLoadingState(loading) {
        const signupBtn = document.getElementById('signupBtn');
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoading = signupBtn.querySelector('.btn-loading');
        
        if (loading) {
            signupBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
        } else {
            signupBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    showTermsModal(filePath, title) {
        // 直接使用內嵌內容，避免fetch問題
        let content = '';
        
        if (title === '服務條款') {
            content = this.getTermsOfServiceContent();
        } else if (title === '隱私政策') {
            content = this.getPrivacyPolicyContent();
        }
        
        // 創建彈出視窗
        const modal = document.createElement('div');
        modal.className = 'terms-modal-overlay';
        modal.innerHTML = `
            <div class="terms-modal">
                <div class="terms-modal-header">
                    <h2>${title}</h2>
                    <button class="terms-modal-close">&times;</button>
                </div>
                <div class="terms-modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        // 添加樣式
        const style = document.createElement('style');
        style.textContent = `
            .terms-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .terms-modal {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease;
            }
            .terms-modal-header {
                background: #2d5a2d;
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .terms-modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            .terms-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            .terms-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .terms-modal-content {
                padding: 0;
                max-height: calc(80vh - 80px);
                overflow-y: auto;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // 關閉按鈕事件
        const closeBtn = modal.querySelector('.terms-modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeTermsModal(modal, style);
        });
        
        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeTermsModal(modal, style);
            }
        });
        
        // ESC鍵關閉
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeTermsModal(modal, style);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
            
    }
    
    getTermsOfServiceContent() {
        return `
            <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
                <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #94ab93; margin: 20px 0;">
                    <strong>最後更新日期：</strong>2025年9月
                </div>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">1. 服務說明</h2>
                <p>Family Travel AI 是一個專為家庭旅遊設計的智能助手平台，提供以下服務：</p>
                <p>1. 個人化旅遊行程規劃<br>
                2. 哺乳室位置查詢<br>
                3. 天氣資訊服務<br>
                4. AI聊天助手諮詢<br>
                5. 家庭友善景點推薦</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">2. 用戶責任</h2>
                <p>使用本服務時，您同意：</p>
                <p>1. 提供真實、準確的個人資訊<br>
                2. 妥善保管您的帳戶密碼<br>
                3. 不得將帳戶轉讓給他人使用<br>
                4. 不得利用本服務進行任何違法活動<br>
                5. 尊重其他用戶的權利和隱私</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">3. 服務使用限制</h2>
                <p>您不得：</p>
                <p>1. 嘗試破解或逆向工程本服務<br>
                2. 發送垃圾郵件或惡意內容<br>
                3. 干擾或破壞服務的正常運作<br>
                4. 未經授權存取其他用戶的帳戶</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">4. 智慧財產權</h2>
                <p>本服務的所有內容，包括但不限於文字、圖片、軟體、商標等，均受智慧財產權法保護。未經授權，您不得複製、修改或分發這些內容。</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">5. 免責聲明</h2>
                <p>本服務提供的資訊僅供參考，我們不保證資訊的準確性、完整性或時效性。用戶應自行驗證旅遊相關資訊，並承擔使用本服務的風險。</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">6. 服務變更與終止</h2>
                <p>我們保留隨時修改、暫停或終止服務的權利。如有重大變更，我們將提前通知用戶。</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">7. 爭議解決</h2>
                <p>因使用本服務產生的爭議，應優先透過友好協商解決。如無法解決，將依中華民國法律處理。</p>

                <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin-top: 30px;">
                    <h2 style="color: #4a6741; margin-top: 0;">8. 聯絡我們</h2>
                    <p>如有任何問題或建議，請透過以下方式聯絡我們：</p>
                    <p><strong>電子郵件：</strong>2025familytravelai@gmail.com</p>
                    <p><strong>電話：</strong>0911323000</p>
                    <p><strong>地址：</strong>雲林縣斗六市大學路三段123號</p>
                    <p><strong>服務時間：</strong>週一至週五 09:00-18:00</p>
                </div>
            </div>
        `;
    }
    
    getPrivacyPolicyContent() {
        return `
            <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
                <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #94ab93; margin: 20px 0;">
                    <strong>最後更新日期：</strong>2025年9月<br>
                    <strong>生效日期：</strong>2025年9月
                </div>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">1. 資訊收集</h2>
                <p>我們收集以下類型的個人資訊：</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background: #f0f8f0; font-weight: 600;">資訊類型</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background: #f0f8f0; font-weight: 600;">收集目的</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background: #f0f8f0; font-weight: 600;">使用方式</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">姓名、電子郵件</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">帳戶管理</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">建立用戶檔案、身份驗證</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">旅遊偏好</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">個人化服務</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">推薦適合的行程和景點</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">位置資訊</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">提供在地服務</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">尋找附近的哺乳室、餐廳</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">使用記錄</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">改善服務品質</td>
                            <td style="border: 1px solid #ddd; padding: 12px;">分析用戶行為、優化功能</td>
                        </tr>
                    </tbody>
                </table>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">2. 資訊使用</h2>
                <p>我們使用您的個人資訊來：</p>
                <p>1. 提供個人化的旅遊建議和服務<br>
                2. 改善我們的產品和服務品質<br>
                3. 與您溝通服務相關資訊<br>
                4. 確保服務的安全性和可靠性<br>
                5. 遵守法律法規要求</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">3. 資訊分享</h2>
                <p>我們承諾不會出售、出租或交易您的個人資訊給第三方，除非：</p>
                <p>1. 獲得您的明確同意<br>
                2. 法律要求或法院命令<br>
                3. 保護我們的權利和財產<br>
                4. 與可信賴的服務提供商合作（在嚴格保密協議下）</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">4. 資料安全</h2>
                <p>我們採取以下措施保護您的個人資訊：</p>
                <p>1. 使用加密技術保護資料傳輸<br>
                2. 定期更新安全系統和軟體<br>
                3. 限制員工存取個人資訊的權限<br>
                4. 定期進行安全審計和測試</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">5. Cookie 和追蹤技術</h2>
                <p>我們使用 Cookie 和類似技術來：</p>
                <p>1. 記住您的登入狀態和偏好設定<br>
                2. 分析網站使用情況<br>
                3. 提供個人化內容<br>
                4. 改善用戶體驗</p>
                <p>您可以透過瀏覽器設定控制 Cookie 的使用。</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">6. 您的權利</h2>
                <p>根據個人資料保護法，您享有以下權利：</p>
                <p>1. <strong>查詢權：</strong>要求我們說明個人資料的處理方式<br>
                2. <strong>閱覽權：</strong>要求提供您的個人資料副本<br>
                3. <strong>更正權：</strong>要求更正錯誤或不完整的資料<br>
                4. <strong>刪除權：</strong>要求刪除您的個人資料<br>
                5. <strong>限制處理權：</strong>要求限制個人資料的處理</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">7. 資料保留</h2>
                <p>我們只在必要期間內保留您的個人資訊：</p>
                <p>1. 帳戶資料：帳戶存續期間<br>
                2. 使用記錄：最多2年<br>
                3. 法律要求：依相關法規規定</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">8. 兒童隱私保護</h2>
                <p>我們重視兒童的隱私保護。對於13歲以下兒童的個人資訊，我們會：</p>
                <p>1. 要求家長或監護人同意<br>
                2. 限制收集的資訊類型<br>
                3. 提供額外的保護措施</p>

                <h2 style="color: #4a6741; margin-top: 25px; margin-bottom: 15px;">9. 政策更新</h2>
                <p>我們可能會不時更新本隱私政策。重大變更將透過以下方式通知您：</p>
                <p>1. 在網站上發布通知<br>
                2. 發送電子郵件通知<br>
                3. 在應用程式中顯示提醒</p>

                <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin-top: 30px;">
                    <h2 style="color: #4a6741; margin-top: 0;">10. 聯絡我們</h2>
                    <p>如有任何隱私相關問題或疑慮，請聯絡我們的隱私保護專員：</p>
                    <p><strong>電子郵件：</strong>2025familytravelai@gmail.com</p>
                    <p><strong>電話：</strong>0911323000</p>
                    <p><strong>地址：</strong>雲林縣斗六市大學路三段123號</p>
                    <p><strong>服務時間：</strong>週一至週五 09:00-18:00</p>
                </div>
            </div>
        `;
    }
    
    closeTermsModal(modal, style) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
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
    new SignupManager();
});
