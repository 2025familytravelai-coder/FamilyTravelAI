// account.js - 帳號設定頁面互動功能

class AccountManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // 編輯按鈕事件
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 確保永遠拿到按鈕本身，而不是裡面的圖片元素
                this.toggleEditMode(e.currentTarget);
            });
        });

        // 更換頭像按鈕事件
        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                this.changeAvatar();
            });
        }

        // 頭像區域點擊事件
        const avatarPlaceholder = document.getElementById('avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.addEventListener('click', () => {
                this.changeAvatar();
            });
        }

        // 修改密碼按鈕事件
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.showChangePasswordModal();
            });
        }

        // 表單提交事件
        const accountForm = document.getElementById('account-form');
        if (accountForm) {
            accountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAccountData();
            });
        }
    }

    toggleEditMode(editBtn) {
        const fieldName = editBtn.getAttribute('data-field');
        const input = document.getElementById(fieldName);
        const currentMode = editBtn.getAttribute('data-mode');
        
        if (currentMode === 'edit') {
            // 點擊鉛筆：進入編輯模式
            input.readOnly = false;
            
            // 儲存原始值，以便取消時恢復
            input.setAttribute('data-original-value', input.value);
            
            // 如果欄位是空的，清空讓placeholder顯示
            if (input.value === '') {
                input.value = '';
            }
            
            input.focus();
            // 切換成儲存圖示（25x25）
            editBtn.innerHTML = '<img src="img/儲存.png" alt="儲存" style="width:25px;height:25px;vertical-align:middle;">';
            editBtn.setAttribute('data-mode', 'save');
            editBtn.title = '儲存';
            
            // 加入鍵盤事件監聽
            input.addEventListener('keydown', this.handleKeyDown.bind(this));
            input.addEventListener('blur', this.handleBlur.bind(this));
            
        } else if (currentMode === 'save') {
            // 點擊儲存：儲存並退出編輯模式
            this.saveField(fieldName, input.value);
            this.exitEditMode(input, editBtn);
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            // ESC鍵取消編輯
            const input = event.target;
            const fieldName = input.id;
            const editBtn = document.querySelector(`[data-field="${fieldName}"]`);
            this.cancelEdit(input, editBtn);
        } else if (event.key === 'Enter') {
            // Enter鍵儲存
            const input = event.target;
            const fieldName = input.id;
            const editBtn = document.querySelector(`[data-field="${fieldName}"]`);
            this.saveField(fieldName, input.value);
            this.exitEditMode(input, editBtn);
        }
    }

    handleBlur(event) {
        // 失去焦點時自動儲存
        const input = event.target;
        const fieldName = input.id;
        const editBtn = document.querySelector(`[data-field="${fieldName}"]`);
        
        if (editBtn.getAttribute('data-mode') === 'save') {
            this.saveField(fieldName, input.value);
            this.exitEditMode(input, editBtn);
        }
    }

    exitEditMode(input, editBtn) {
        input.readOnly = true;
        // 還原為編輯圖示
        editBtn.innerHTML = '<img src="img/編輯.png" alt="編輯" style="width:25px;height:25px;vertical-align:middle;">';
        editBtn.setAttribute('data-mode', 'edit');
        editBtn.title = '編輯';
        
        // 如果欄位為空，保持placeholder顯示
        if (input.value.trim() === '') {
            input.value = '';
        }
        
        // 移除事件監聽
        input.removeEventListener('keydown', this.handleKeyDown.bind(this));
        input.removeEventListener('blur', this.handleBlur.bind(this));
    }

    cancelEdit(input, editBtn) {
        // 恢復原始值
        const originalValue = input.getAttribute('data-original-value');
        input.value = originalValue;
        this.exitEditMode(input, editBtn);
        this.showMessage('已取消編輯', 'info');
    }

    saveField(fieldName, value) {
        // 這裡可以加入驗證邏輯
        console.log(`儲存欄位 ${fieldName}: ${value}`);
        
        // 如果值為空，保持placeholder顯示
        if (value.trim() === '') {
            console.log(`欄位 ${fieldName} 為空，保持placeholder顯示`);
        }
        
        // 顯示儲存成功提示
        this.showMessage('資料已儲存', 'success');
    }

    changeAvatar() {
        // 顯示頭像選擇對話框
        this.showAvatarSelectionModal();
    }

    showAvatarSelectionModal() {
        // 創建頭像選擇對話框
        const modal = document.createElement('div');
        modal.className = 'avatar-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>選擇頭像</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="avatar-grid">
                        <div class="avatar-option" data-avatar="img/頭像1.png">
                            <img src="img/頭像1.png" alt="頭像1" class="avatar-preview">
                            <span class="avatar-label">頭像1</span>
                        </div>
                        <div class="avatar-option" data-avatar="img/頭像2.png">
                            <img src="img/頭像2.png" alt="頭像2" class="avatar-preview">
                            <span class="avatar-label">頭像2</span>
                        </div>
                        <div class="avatar-option" data-avatar="img/頭像3.png">
                            <img src="img/頭像3.png" alt="頭像3" class="avatar-preview">
                            <span class="avatar-label">頭像3</span>
                        </div>
                        <div class="avatar-option" data-avatar="img/頭像4.png">
                            <img src="img/頭像4.png" alt="頭像4" class="avatar-preview">
                            <span class="avatar-label">頭像4</span>
                        </div>
                        <div class="avatar-option" data-avatar="img/頭像5.png">
                            <img src="img/頭像5.png" alt="頭像5" class="avatar-preview">
                            <span class="avatar-label">頭像5</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">取消</button>
                </div>
            </div>
        `;

        // 加入樣式
        const style = document.createElement('style');
        style.textContent = `
            .avatar-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 500px;
                max-width: 90vw;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .modal-header h3 {
                margin: 0;
                font-size: 20px;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .avatar-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 20px;
            }
            .avatar-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .avatar-option:hover {
                border-color: #94ab93;
                background-color: #f8f9f8;
            }
            .avatar-option.selected {
                border-color: #94ab93;
                background-color: #e8f5e8;
            }
            .avatar-preview {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 8px;
            }
            .avatar-label {
                font-size: 14px;
                font-weight: 500;
                color: #333;
            }
            .modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }
            .cancel-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                background-color: #f0f0f0;
                color: #333;
                transition: all 0.3s;
            }
            .cancel-btn:hover {
                background-color: #e0e0e0;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // 事件處理
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const avatarOptions = modal.querySelectorAll('.avatar-option');

        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        };

        // 頭像選擇事件
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他選項的選中狀態
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                // 選中當前選項
                option.classList.add('selected');
                
                // 獲取選中的頭像路徑
                const selectedAvatar = option.getAttribute('data-avatar');
                
                // 更新頭像
                this.updateAvatar(selectedAvatar);
                
                // 關閉對話框
                closeModal();
            });
        });

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    updateAvatar(avatarPath) {
        const avatarPlaceholder = document.getElementById('avatar-placeholder');
        const avatarIcon = avatarPlaceholder.querySelector('.avatar-icon');
        
        // 隱藏圖標，顯示圖片
        avatarIcon.style.display = 'none';
        
        // 創建圖片元素
        let avatarImg = avatarPlaceholder.querySelector('img');
        if (!avatarImg) {
            avatarImg = document.createElement('img');
            avatarImg.style.width = '100%';
            avatarImg.style.height = '100%';
            avatarImg.style.objectFit = 'cover';
            avatarImg.style.borderRadius = '8px';
            avatarPlaceholder.appendChild(avatarImg);
        }
        
        avatarImg.src = avatarPath;
        
        // 儲存頭像到localStorage，供其他頁面使用
        localStorage.setItem('userAvatar', avatarPath);
        
        // 更新當前頁面的header頭像
        this.updateHeaderAvatar(avatarPath);
        
        // 顯示成功訊息
        this.showMessage('頭像已更新', 'success');
    }
    
    updateHeaderAvatar(imageUrl) {
        const headerAvatar = document.getElementById('avatarImage');
        if (headerAvatar) {
            headerAvatar.src = imageUrl;
        }
    }

    showChangePasswordModal() {
        // 創建密碼修改對話框
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>修改密碼</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="current-password">目前密碼</label>
                        <div class="password-input-container">
                            <input type="password" id="current-password" placeholder="請輸入目前密碼">
                            <button type="button" class="toggle-password" data-target="current-password">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="new-password">新密碼</label>
                        <div class="password-input-container">
                            <input type="password" id="new-password" placeholder="請輸入新密碼">
                            <button type="button" class="toggle-password" data-target="new-password">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="password-requirements">
                            <small>密碼需至少6個字元，包含英文字母與數字</small>
                        </div>
                        <div class="password-strength" id="password-strength">
                            <div class="strength-bar">
                                <div class="strength-fill" id="strength-fill"></div>
                            </div>
                            <span class="strength-text" id="strength-text">請輸入密碼</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">確認新密碼</label>
                        <div class="password-input-container">
                            <input type="password" id="confirm-password" placeholder="請再次輸入新密碼">
                            <button type="button" class="toggle-password" data-target="confirm-password">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="password-match" id="password-match" style="display: none;">
                            <small class="match-text">密碼確認中...</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">取消</button>
                    <button class="save-btn" disabled>儲存</button>
                </div>
            </div>
        `;

        // 加入樣式
        const style = document.createElement('style');
        style.textContent = `
            .password-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                width: 450px;
                max-width: 90vw;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .modal-header h3 {
                margin: 0;
                font-size: 20px;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .modal-body .form-group {
                margin-bottom: 20px;
            }
            .modal-body label {
                display: block;
                margin-bottom: 6px;
                font-weight: 600;
            }
            .password-input-container {
                position: relative;
                display: flex;
                align-items: center;
            }
            .password-input-container input {
                width: 100%;
                padding: 10px 45px 10px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 16px;
            }
            .password-input-container input:focus {
                outline: none;
                border-color: #94ab93;
            }
            .toggle-password {
                position: absolute;
                right: 8px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
            }
            .toggle-password:hover {
                background-color: #f0f0f0;
                color: #333;
            }
            .toggle-password svg {
                transition: all 0.3s;
            }
            .password-requirements {
                margin-top: 6px;
                color: #666;
                font-size: 14px;
            }
            .password-strength {
                margin-top: 8px;
            }
            .strength-bar {
                width: 100%;
                height: 4px;
                background-color: #e0e0e0;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 4px;
            }
            .strength-fill {
                height: 100%;
                width: 0%;
                transition: width 0.3s ease, background-color 0.3s ease;
                border-radius: 2px;
            }
            .strength-text {
                font-size: 12px;
                font-weight: 600;
            }
            .password-match {
                margin-top: 6px;
            }
            .match-text {
                font-size: 14px;
                font-weight: 600;
            }
            .modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }
            .cancel-btn, .save-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            }
            .cancel-btn {
                background-color: #f0f0f0;
                color: #333;
            }
            .cancel-btn:hover {
                background-color: #e0e0e0;
            }
            .save-btn {
                background-color: #94ab93;
                color: white;
            }
            .save-btn:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            .save-btn:not(:disabled):hover {
                background-color: #8ab78a;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // 事件處理
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');
        const toggleButtons = modal.querySelectorAll('.toggle-password');
        const newPasswordInput = modal.querySelector('#new-password');
        const confirmPasswordInput = modal.querySelector('#confirm-password');

        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        };

        // 密碼顯示/隱藏功能
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = modal.querySelector(`#${targetId}`);

                if (input.type === 'password') {
                    // 目前為隱藏 → 切換為顯示，顯示開眼圖示
                    input.type = 'text';
                    btn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    `;
                } else {
                    // 目前為顯示 → 切換為隱藏，顯示閉眼（劃線）圖示
                    input.type = 'password';
                    btn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    `;
                }
            });
        });

        // 密碼強度檢查
        newPasswordInput.addEventListener('input', () => {
            this.checkPasswordStrength(newPasswordInput.value, modal);
            this.checkPasswordMatch(modal);
        });

        // 密碼確認檢查
        confirmPasswordInput.addEventListener('input', () => {
            this.checkPasswordMatch(modal);
        });

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            this.changePassword(modal);
        });

        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    checkPasswordStrength(password, modal) {
        const strengthFill = modal.querySelector('#strength-fill');
        const strengthText = modal.querySelector('#strength-text');
        
        let strength = 0;
        let strengthText_content = '';
        let strengthColor = '';
        
        // 長度檢查
        if (password.length >= 6) strength += 20;
        if (password.length >= 8) strength += 20;
        
        // 包含英文字母
        if (/[a-zA-Z]/.test(password)) strength += 20;
        
        // 包含數字
        if (/\d/.test(password)) strength += 20;
        
        // 包含特殊字元
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
        
        // 設定強度等級
        if (strength === 0) {
            strengthText_content = '請輸入密碼';
            strengthColor = '#e0e0e0';
        } else if (strength <= 40) {
            strengthText_content = '密碼強度：弱';
            strengthColor = '#ff4444';
        } else if (strength <= 60) {
            strengthText_content = '密碼強度：中等';
            strengthColor = '#ffaa00';
        } else if (strength <= 80) {
            strengthText_content = '密碼強度：良好';
            strengthColor = '#00aa00';
        } else {
            strengthText_content = '密碼強度：強';
            strengthColor = '#00aa00';
        }
        
        // 更新UI
        strengthFill.style.width = `${strength}%`;
        strengthFill.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthText_content;
        strengthText.style.color = strengthColor;
    }

    checkPasswordMatch(modal) {
        const newPassword = modal.querySelector('#new-password').value;
        const confirmPassword = modal.querySelector('#confirm-password').value;
        const passwordMatch = modal.querySelector('#password-match');
        const saveBtn = modal.querySelector('.save-btn');
        
        if (confirmPassword.length === 0) {
            passwordMatch.style.display = 'none';
            return;
        }
        
        passwordMatch.style.display = 'block';
        
        if (newPassword === confirmPassword) {
            passwordMatch.querySelector('.match-text').textContent = '✓ 密碼確認成功';
            passwordMatch.querySelector('.match-text').style.color = '#00aa00';
        } else {
            passwordMatch.querySelector('.match-text').textContent = '✗ 密碼不一致';
            passwordMatch.querySelector('.match-text').style.color = '#ff4444';
        }
        
        // 檢查是否可以啟用儲存按鈕
        this.updateSaveButton(modal);
    }

    updateSaveButton(modal) {
        const currentPassword = modal.querySelector('#current-password').value;
        const newPassword = modal.querySelector('#new-password').value;
        const confirmPassword = modal.querySelector('#confirm-password').value;
        const saveBtn = modal.querySelector('.save-btn');
        
        // 檢查所有條件
        const hasCurrentPassword = currentPassword.length > 0;
        const hasNewPassword = newPassword.length >= 6 && /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword);
        const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
        
        if (hasCurrentPassword && hasNewPassword && passwordsMatch) {
            saveBtn.disabled = false;
        } else {
            saveBtn.disabled = true;
        }
    }

    changePassword(modal) {
        const currentPassword = modal.querySelector('#current-password').value;
        const newPassword = modal.querySelector('#new-password').value;
        const confirmPassword = modal.querySelector('#confirm-password').value;

        // 驗證
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showMessage('請填寫所有欄位', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showMessage('新密碼與確認密碼不一致', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('密碼長度至少 6 個字元', 'error');
            return;
        }

        if (!/[a-zA-Z]/.test(newPassword)) {
            this.showMessage('密碼必須包含英文字母', 'error');
            return;
        }

        if (!/\d/.test(newPassword)) {
            this.showMessage('密碼必須包含數字', 'error');
            return;
        }

        // 這裡可以加入實際的密碼修改邏輯
        console.log('修改密碼:', { currentPassword, newPassword });
        this.showMessage('密碼已成功修改', 'success');
        
        // 關閉對話框
        document.body.removeChild(modal);
        const style = document.querySelector('style:last-of-type');
        if (style) document.head.removeChild(style);
    }

    saveAccountData() {
        const formData = new FormData(document.getElementById('account-form'));
        const data = Object.fromEntries(formData);
        
        console.log('儲存帳號資料:', data);
        this.showMessage('帳號資料已儲存', 'success');
    }

    async loadUserData() {
        // 顯示載入動畫
        this.showMemberIdLoading(true);
        
        try {
            // 模擬從資料庫獲取使用者資料
            const userData = await this.fetchUserDataFromDatabase();
            
            // 更新表單欄位
            document.getElementById('member-id').value = userData.memberId;
            
            // 只有當有實際資料時才填入，否則保持placeholder
            if (userData.lastName && userData.lastName !== 'XXX') {
                document.getElementById('last-name').value = userData.lastName;
            }
            if (userData.firstName && userData.firstName !== 'XXX') {
                document.getElementById('first-name').value = userData.firstName;
            }
            if (userData.email && userData.email !== 'example@gmail.com') {
                document.getElementById('email').value = userData.email;
            }
            
            // 載入用戶頭像
            if (userData.avatar) {
                this.updateAvatar(userData.avatar);
            } else {
                // 如果沒有頭像，使用預設頭像
                const defaultAvatar = this.getRandomAvatar();
                this.updateAvatar(defaultAvatar);
            }
            
        } catch (error) {
            console.error('載入使用者資料失敗:', error);
            document.getElementById('member-id').value = '載入失敗';
            this.showMessage('無法載入使用者資料', 'error');
        } finally {
            this.showMemberIdLoading(false);
        }
    }

    async fetchUserDataFromDatabase() {
        // 模擬API呼叫延遲
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模擬從資料庫獲取流水編號
        const memberId = await this.generateMemberId();
        
        // 模擬使用者資料
        const userData = {
            memberId: memberId,
            lastName: 'XXX',
            firstName: 'XXX',
            email: 'example@gmail.com'
        };
        
        return userData;
    }

    async generateMemberId() {
        // 模擬資料庫流水編號生成
        // 實際應用中，這會是從資料庫獲取的下一個流水號
        
        // 方法1：基於時間戳的流水號（推薦用於實際應用）
        const timestamp = Date.now();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const timeSuffix = timestamp.toString().slice(-6);
        
        // 格式選項：
        // 1. M + 年月日 + 時間戳後6位：M241201123456
        // 2. M + 年月 + 流水號：M2412001
        // 3. 純數字流水號：1000001
        
        const memberId = `M${year}${month}${day}${timeSuffix}`;
        
        console.log('生成會員編號:', memberId);
        console.log('編號格式說明: M + 年月日 + 時間戳後6位');
        
        return memberId;
    }

    // 實際資料庫連接的範例函數（供參考）
    async connectToDatabase() {
        // 實際應用中的資料庫連接範例
        /*
        try {
            const response = await fetch('/api/user/next-member-id', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('無法獲取會員編號');
            }
            
            const data = await response.json();
            return data.memberId;
        } catch (error) {
            console.error('資料庫連接失敗:', error);
            throw error;
        }
        */
    }

    showMemberIdLoading(show) {
        const loadingIndicator = document.getElementById('member-id-loading');
        const memberIdInput = document.getElementById('member-id');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            memberIdInput.value = '載入中...';
        } else {
            loadingIndicator.style.display = 'none';
        }
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

    showMessage(message, type = 'info') {
        // 創建訊息提示
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast ${type}`;
        messageEl.textContent = message;
        
        // 樣式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            messageEl.style.backgroundColor = '#4caf50';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = '#f44336';
        } else {
            messageEl.style.backgroundColor = '#2196f3';
        }

        // 加入動畫樣式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageEl);

        // 3秒後自動移除
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 3000);
    }
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    new AccountManager();
});
