// 側邊欄的點擊事件處理
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
  link.addEventListener('click', function () {
    // 移除所有側邊欄項目的 active 狀態
    sidebarLinks.forEach(link => link.classList.remove('active'));
    // 將當前點擊的項目標記為 active
    this.classList.add('active');
  });
});

// 確保頁面載入後正確處理 active 狀態
document.addEventListener("DOMContentLoaded", function() {
  // 清除所有側邊欄鏈接的 active 類
  sidebarLinks.forEach(link => link.classList.remove('active'));

  // 確保當前頁面的側邊欄項目保持 active 狀態
  const currentPage = window.location.pathname; // 獲取當前頁面的 URL
  sidebarLinks.forEach(link => {
    const linkHref = link.querySelector('a').getAttribute('href');
    if (currentPage.includes(linkHref)) {
      link.classList.add('active');
    }
  });
});

// 登出函數已移至 sidebar.js 中定義