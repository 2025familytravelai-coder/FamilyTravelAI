document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  // 移除所有 active 樣式
  sidebarLinks.forEach(link => link.classList.remove('active'));

  // 取得目前的網址路徑
  const currentPage = window.location.pathname;

  // 檢查每個連結的 href 是否在網址中
  sidebarLinks.forEach(link => {
    const linkHref = link.querySelector("a").getAttribute("href");
    if (linkHref && currentPage.includes(linkHref)) {
      link.classList.add("active");
    }
  });

  // 漢堡選單功能
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  // 創建遮罩層
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function toggleSidebar() {
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
      // 關閉側邊欄
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      hamburgerMenu.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      // 開啟側邊欄
      sidebar.classList.add('open');
      overlay.classList.add('show');
      hamburgerMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburgerMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 綁定事件
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
  }

  // 點擊遮罩層關閉側邊欄
  overlay.addEventListener('click', closeSidebar);

  // 點擊側邊欄連結後關閉側邊欄
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // 視窗大小改變時檢查是否需要關閉側邊欄
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // 用戶下拉選單功能
  const userAvatar = document.getElementById('userAvatar');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (userAvatar && dropdownMenu) {
    // 載入儲存的頭像
    const savedAvatar = localStorage.getItem('userAvatar');
    const avatarImage = document.getElementById('avatarImage');
    if (savedAvatar && avatarImage) {
      avatarImage.src = savedAvatar;
    }

    // 點擊頭像切換下拉選單
    userAvatar.addEventListener('click', function(e) {
      e.stopPropagation();
      userAvatar.classList.toggle('active');
      dropdownMenu.classList.toggle('show');
    });

    // 點擊其他地方關閉下拉選單
    document.addEventListener('click', function(e) {
      if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
        userAvatar.classList.remove('active');
        dropdownMenu.classList.remove('show');
      }
    });

    // 防止下拉選單內部點擊事件冒泡，但允許登出按鈕正常工作
    dropdownMenu.addEventListener('click', function(e) {
      // 如果是登出按鈕，不阻止事件冒泡
      if (e.target.closest('.dropdown-item[onclick*="logout"]')) {
        return; // 讓登出按鈕正常工作
      }
      e.stopPropagation();
    });
  }

  // —— 問題回報：在所有頁面生效 ——
  async function ensureFeedbackModal() {
    const existingModal = document.getElementById('feedbackModal');
    if (existingModal) return; // 已存在

    try {
      const res = await fetch('feedback-modal.html', { cache: 'no-store' });
      const html = await res.text();
      document.body.insertAdjacentHTML('beforeend', html);
    } catch (e) {
      console.error('載入 feedback-modal.html 失敗，仍使用內建模板', e);
      const fallback = `
      <div class="modal-overlay" id="feedbackModal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-card" role="document">
          <div class="modal-header">
            <div class="modal-title">問題回報</div>
            <button class="modal-close-btn" id="closeFeedbackModal" aria-label="關閉">×</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label for="feedbackType">問題類型</label>
              <select id="feedbackType">
                <option value="">請選擇</option>
                <option>功能異常</option>
                <option>介面調整建議</option>
                <option>資料錯誤</option>
                <option>其他</option>
              </select>
            </div>
            <div class="form-row">
              <label for="feedbackDesc">詳細描述</label>
              <textarea id="feedbackDesc" placeholder="請敘述遇到的情況或期望的結果..."></textarea>
            </div>
            <div class="form-row">
              <label for="feedbackEmail">聯絡信箱（選填）</label>
              <input type="email" id="feedbackEmail" placeholder="example@gmail.com">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelFeedback">取消</button>
            <button class="btn btn-primary" id="submitFeedback">送出</button>
          </div>
        </div>
      </div>
      <div class="modal-overlay" id="feedbackSuccess" aria-hidden="true">
        <div class="modal-card">
          <div class="modal-success">
            <h4>已收到您的回報！</h4>
            <p>感謝協助我們讓 Family Travel AI 更好。</p>
            <div style="margin-top:14px;text-align:center">
              <button class="btn btn-primary" id="closeSuccess">關閉</button>
            </div>
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', fallback);
    }

    // 綁定控制
    const openBtn = document.getElementById('openFeedbackModal') || document.querySelector('.dropdown-item[href="#"] img[alt="問題回報"]')?.parentElement;
    const modal = document.getElementById('feedbackModal');
    const success = document.getElementById('feedbackSuccess');
    const closeBtn = document.getElementById('closeFeedbackModal');
    const cancelBtn = document.getElementById('cancelFeedback');
    const submitBtn = document.getElementById('submitFeedback');
    const closeSuccessBtn = document.getElementById('closeSuccess');

    function openModal() { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
    function closeModal() { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
    function openSuccess() { success.classList.add('show'); success.setAttribute('aria-hidden','false'); }
    function closeSuccess() { success.classList.remove('show'); success.setAttribute('aria-hidden','true'); }

    if (openBtn) openBtn.addEventListener('click', function(e){ e.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (submitBtn) submitBtn.addEventListener('click', function(){ 
      handleFeedbackSubmission(); 
    });
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccess);

    [modal, success].forEach(function(layer){
      if (!layer) return;
      layer.addEventListener('click', function(e){ if (e.target === layer) layer.classList.remove('show'); });
    });

    // 處理問題回報提交
    function handleFeedbackSubmission() {
      const feedbackType = document.getElementById('feedbackType').value;
      const feedbackDesc = document.getElementById('feedbackDesc').value;
      const feedbackEmail = document.getElementById('feedbackEmail').value;
      
      // 基本驗證
      if (!feedbackType) {
        alert('請選擇問題類型');
        return;
      }
      
      if (!feedbackDesc.trim()) {
        alert('請填寫詳細描述');
        return;
      }
      
      // 收集用戶資訊
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const currentTime = new Date().toLocaleString('zh-TW');
      
      // 準備EmailJS模板參數
      const templateParams = {
        to_email: '2025familytravelai@gmail.com',
        from_name: user.name || '未登入用戶',
        from_email: feedbackEmail || '未提供',
        subject: `[Family Travel AI] 問題回報 - ${feedbackType}`,
        message: `
問題回報詳情：
================
問題類型：${feedbackType}
詳細描述：${feedbackDesc}
用戶信箱：${feedbackEmail || '未提供'}
用戶姓名：${user.name || '未登入'}
用戶ID：${user.id || '未登入'}
回報時間：${currentTime}
================

此問題回報來自 Family Travel AI 網站。
        `,
        reply_to: feedbackEmail || '2025familytravelai@gmail.com'
      };
      
      // 顯示載入狀態
      const submitBtn = document.getElementById('submitFeedback');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '發送中...';
      submitBtn.disabled = true;
      
      // 使用 Web3Forms API 發送郵件（免費服務）
      const formData = {
        access_key: '6a261dfc-a96a-4da0-bfa1-70f09dffe191', // 需要替換為您的 Web3Forms Access Key
        name: user.name || '未登入用戶',
        email: feedbackEmail || '2025familytravelai@gmail.com',
        subject: `[Family Travel AI] 問題回報 - ${feedbackType}`,
        message: templateParams.message,
        reply_to: feedbackEmail || '2025familytravelai@gmail.com'
      };
      
      // 發送郵件到您的信箱
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('郵件發送成功!', data);
          
          // 顯示成功訊息
          alert('問題回報已成功發送！\n我們會盡快處理您的問題。');
          
          // 關閉模態視窗並顯示成功訊息
          closeModal();
          openSuccess();
          
          // 清空表單
          document.getElementById('feedbackType').value = '';
          document.getElementById('feedbackDesc').value = '';
          document.getElementById('feedbackEmail').value = '';
        } else {
          throw new Error('發送失敗');
        }
      })
      .catch(function(error) {
        console.error('郵件發送失敗:', error);
        
        // 如果發送失敗，提供備用方案
        alert('自動發送失敗，請手動聯絡我們：\n📧 2025familytravelai@gmail.com\n📞 0911323000');
        
        // 關閉模態視窗
        closeModal();
        openSuccess();
        
        // 清空表單
        document.getElementById('feedbackType').value = '';
        document.getElementById('feedbackDesc').value = '';
        document.getElementById('feedbackEmail').value = '';
      })
      .finally(function() {
        // 恢復按鈕狀態
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    }
  }

  // 確保每頁都有彈窗
  ensureFeedbackModal();
});

// 全域登出函數
function logout() {
  console.log('登出函數被調用'); // 調試用
  
  // 在清除任何資料之前，先保存記住我狀態
  const rememberMe = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('savedEmail');
  
  console.log('登出前狀態:', { rememberMe, savedEmail }); // 調試用
  
  // 只清除登入相關的資料，不碰記住我相關的資料
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('userAvatar');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('isLoggedIn');
  
  // 如果原本有記住我設定，重新設定它
  if (rememberMe === 'true' && savedEmail) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('savedEmail', savedEmail);
    console.log('登出時保留記住我狀態:', { rememberMe: 'true', savedEmail });
  }
  
  console.log('登出完成，最終狀態:', {
    rememberMe: localStorage.getItem('rememberMe'),
    savedEmail: localStorage.getItem('savedEmail')
  });
  
  // 顯示登出訊息
  alert('已成功登出！');
  
  // 跳轉到登入頁面
  window.location.href = 'login.html';
}

// 確保登出函數在頁面載入後立即可用
window.logout = logout;