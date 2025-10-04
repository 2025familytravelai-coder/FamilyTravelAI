// plan.js

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const monthYear = document.getElementById('month-year');
  const calendarBody = document.getElementById('calendar-body');
  const itineraryList = document.getElementById('itinerary-list');
  const addBtn = document.querySelector('.add-today');
  const editBtn = document.querySelector('.quick-edit');
  const quickPlanBtn = document.getElementById('quick-plan-btn');
  const costCalcBtn = document.getElementById('cost-calc-btn');

  let today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let isEditing = false;

  function getDateKey(date) {
    // 修正日期轉換，確保使用本地時間
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    console.log('日期轉換:', date, '->', dateKey);
    return dateKey;
  }

  function saveItinerary(date, htmlContent) {
    const dateKey = getDateKey(date);
    console.log('保存日期:', dateKey);
    localStorage.setItem(dateKey, htmlContent);
  }

  function loadItinerary(date) {
    const dateKey = getDateKey(date);
    console.log('載入日期:', dateKey);
    const saved = localStorage.getItem(dateKey);
    if (saved && saved.trim() !== '') {
      itineraryList.innerHTML = saved;
      console.log('載入行程成功');
    } else {
      emptyPlaceholder();
      console.log('該日期無行程');
    }
  }

  function getAllPlannedDates() {
    const keys = Object.keys(localStorage);
    console.log('localStorage 所有鍵:', keys);
    // 只返回日期格式的鍵（YYYY-MM-DD格式）
    const plannedDates = keys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
    
    // 過濾掉空行程的日期
    const validPlannedDates = plannedDates.filter(dateKey => {
      const content = localStorage.getItem(dateKey);
      return content && content.trim() !== '' && !content.includes('今日尚無行程');
    });
    
    console.log('有行程的日期:', validPlannedDates);
    return validPlannedDates;
  }

  // 可重用日曆渲染器
  function renderCalendar(target) {
    const dom = target || { monthYear, calendarBody };
    dom.monthYear.textContent = `${currentYear} 年 ${currentMonth + 1} 月`;
    dom.calendarBody.innerHTML = '';
    const firstDayIdx = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = firstDayIdx + daysInMonth;
    const numRows = Math.ceil(totalCells / 7);
    const plannedDates = getAllPlannedDates();

    let date = 1;
    for (let row = 0; row < numRows; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < 7; col++) {
        const td = document.createElement('td');
        if (!(row === 0 && col < firstDayIdx) && date <= daysInMonth) {
          td.textContent = date;
          const cellDate = new Date(currentYear, currentMonth, date);
          const cellKey = getDateKey(cellDate);

          // 處理今天的日期樣式
          if (cellDate.toDateString() === today.toDateString()) {
            // 先清除所有可能的樣式類別
            td.classList.remove('today-green', 'planned-orange', 'today-faded');
            
            // 如果選中的是今天，顯示綠色
            if (date === selectedDate.getDate() && 
                currentMonth === selectedDate.getMonth() && 
                currentYear === selectedDate.getFullYear()) {
              td.classList.add('today-green');
            } else {
              // 如果選中的不是今天，檢查今天是否有行程
              const todayKey = getDateKey(today);
              const todayHasPlans = plannedDates.includes(todayKey);
              
              if (todayHasPlans) {
                // 如果今天有行程，顯示橙色
                td.classList.add('planned-orange');
              } else {
                // 如果今天沒有行程，顯示淺灰色
                td.classList.add('today-faded');
              }
            }
          }
          
          // 處理有行程的其他日期樣式
          if (plannedDates.includes(cellKey) && cellDate.toDateString() !== today.toDateString()) {
            td.classList.add('planned-orange');
          }
          
          // 處理選中狀態
          if (
            date === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
          ) {
            td.classList.add('selected');
          }

          // 使用立即執行函數來捕獲正確的日期值
          (function(currentDate) {
            td.addEventListener('click', (e) => {
              selectDate(td, currentDate, dom);
            });
          })(date);
          
          date++;
        }
        tr.appendChild(td);
      }
      dom.calendarBody.appendChild(tr);
    }
  }

  function emptyPlaceholder() {
    console.log('設置空行程佔位符');
    itineraryList.innerHTML = `<li class="empty">今日尚無行程</li>`;
  }
  
  // 清理空行程的 localStorage 項目
  function cleanupEmptyItineraries() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const content = localStorage.getItem(key);
        if (!content || content.trim() === '' || content.includes('今日尚無行程')) {
          localStorage.removeItem(key);
          console.log('清理空行程:', key);
        }
      }
    });
  }

  function selectDate(cell, date, dom) {
    const selectedCellDate = new Date(currentYear, currentMonth, date);
    const isToday = selectedCellDate.toDateString() === today.toDateString();
    const isInCostModal = dom && dom.calendarBody === costCalendarBody;

    // 在成本彈窗中點選日期時，若該日沒有行程則阻止選取
    if (isInCostModal) {
      const key = getDateKey(selectedCellDate);
      const content = localStorage.getItem(key);
      const hasItems = content && content.trim() !== '' && !content.includes('今日尚無行程');
      if (!hasItems) {
        alert('此日期尚無行程，請先新增行程後再計算成本。');
        return;
      }
    }
    
    // 先保存當前行程
    saveItinerary(selectedDate, itineraryList.innerHTML);
    
    // 更新選中日期
    selectedDate = selectedCellDate;
    
    // 重新渲染日曆以更新所有日期樣式
    renderCalendar(dom);
    
    // 載入新選中日期的行程
    loadItinerary(selectedDate);

    // 彈窗中選到有效日期時，同步載入該日的成本資料
    if (isInCostModal) {
      loadCostsFor(selectedDate);
    }
  }

  prevBtn.addEventListener('click', () => {
    saveItinerary(selectedDate, itineraryList.innerHTML);
    currentMonth = currentMonth > 0 ? currentMonth - 1 : 11;
    if (currentMonth === 11) currentYear--;
    renderCalendar();
    if (costModalOpen) syncModalCalendar();
    // 重新載入當前選中日期的行程
    loadItinerary(selectedDate);
  });
  nextBtn.addEventListener('click', () => {
    saveItinerary(selectedDate, itineraryList.innerHTML);
    currentMonth = currentMonth < 11 ? currentMonth + 1 : 0;
    if (currentMonth === 0) currentYear++;
    renderCalendar();
    if (costModalOpen) syncModalCalendar();
    // 重新載入當前選中日期的行程
    loadItinerary(selectedDate);
  });

  function sortItineraries() {
    const emptyLi = itineraryList.querySelector('.empty');
    const items = Array.from(itineraryList.children)
      .filter(li => !li.classList.contains('empty'));
    items.sort((a, b) => {
      const [ah, am] = a.querySelector('.time-text').textContent.split(':').map(Number);
      const [bh, bm] = b.querySelector('.time-text').textContent.split(':').map(Number);
      return ah * 60 + am - (bh * 60 + bm);
    });
    itineraryList.innerHTML = '';
    if (emptyLi) itineraryList.appendChild(emptyLi);
    items.forEach(li => itineraryList.appendChild(li));
    // 排序後保存行程
    if (items.length > 0 || emptyLi) {
      saveItinerary(selectedDate, itineraryList.innerHTML);
    }
  }

  addBtn.addEventListener('click', () => {
    if (itineraryList.querySelector('.new-item')) return;
    const emptyLi = itineraryList.querySelector('.empty');
    if (emptyLi) emptyLi.remove();

    const li = document.createElement('li');
    li.classList.add('new-item');
    let hSel = '<select class="hour-select">';
    for (let h = 0; h < 24; h++) {
      const v = String(h).padStart(2, '0');
      hSel += `<option value="${v}">${v}</option>`;
    }
    hSel += '</select>';
    let mSel = '<select class="minute-select">';
    for (let m = 0; m < 60; m += 5) {
      const v = String(m).padStart(2, '0');
      mSel += `<option value="${v}">${v}</option>`;
    }
    mSel += '</select>';

    li.innerHTML = `
      <div class="time-group">${hSel}<span>:</span>${mSel}</div>
      <input type="text" class="desc-input" placeholder="輸入行程內容" />
      <div class="action-buttons">
        <button class="save-btn">儲存</button>
        <button class="cancel-btn">取消</button>
      </div>`;
    itineraryList.prepend(li);

    li.querySelector('.save-btn').addEventListener('click', () => {
      const hh = li.querySelector('.hour-select').value;
      const mm = li.querySelector('.minute-select').value;
      const desc = li.querySelector('.desc-input').value.trim();
      if (!desc) return alert('請輸入行程內容');
      const newLi = document.createElement('li');
      newLi.innerHTML = `
        <span class="time-text">${hh}:${mm}</span>
        <span class="desc-text">${desc}</span>`;
      itineraryList.replaceChild(newLi, li);
      sortItineraries();
      // 保存行程到 localStorage
      saveItinerary(selectedDate, itineraryList.innerHTML);
      // 重新渲染日曆以更新顏色標記
      renderCalendar();
    });

    li.querySelector('.cancel-btn').addEventListener('click', () => {
      li.remove();
      if (!itineraryList.children.length) emptyPlaceholder();
    });
  });

  editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    editBtn.textContent = isEditing ? '完成編輯' : '快速編輯';

    if (!isEditing) {
      itineraryList.querySelectorAll('li.new-item').forEach(li => li.remove());
    }

    Array.from(itineraryList.children).forEach(li => {
      if (li.classList.contains('empty')) return;

      if (isEditing) {
        const tSpan = li.querySelector('.time-text');
        const dSpan = li.querySelector('.desc-text');
        if (!tSpan || !dSpan) return;
        const [hh, mm] = tSpan.textContent.split(':');

        let hSel2 = '<select class="hour-select">';
        for (let h = 0; h < 24; h++) {
          const v = String(h).padStart(2, '0');
          hSel2 += `<option value="${v}"${v === hh ? ' selected' : ''}>${v}</option>`;
        }
        hSel2 += '</select>';
        let mSel2 = '<select class="minute-select">';
        for (let m = 0; m < 60; m += 5) {
          const v = String(m).padStart(2, '0');
          mSel2 += `<option value="${v}"${v === mm ? ' selected' : ''}>${v}</option>`;
        }
        mSel2 += '</select>';

        li.innerHTML = `
          <div class="time-group">${hSel2}<span>:</span>${mSel2}</div>
          <input type="text" class="desc-input" value="${dSpan.textContent}" />
          <button class="delete-btn">刪除</button>`;
        
        // 添加刪除按鈕的事件監聽器
        li.querySelector('.delete-btn').addEventListener('click', () => {
          li.remove();
          if (!itineraryList.children.length) emptyPlaceholder();
          // 刪除後保存行程
          saveItinerary(selectedDate, itineraryList.innerHTML);
          // 重新渲染日曆以更新顏色標記
          renderCalendar();
        });
      } else {
        const hSel = li.querySelector('.hour-select');
        const mSel = li.querySelector('.minute-select');
        const dIn = li.querySelector('.desc-input');
        if (hSel && mSel && dIn) {
          const hh = hSel.value;
          const mm = mSel.value;
          const desc = dIn.value;
          li.innerHTML = `
            <span class="time-text">${hh}:${mm}</span>
            <span class="desc-text">${desc}</span>`;
        }
      }
    });

    if (!isEditing) {
      sortItineraries();
      if (!itineraryList.children.length) emptyPlaceholder();
      // 保存行程到 localStorage
      saveItinerary(selectedDate, itineraryList.innerHTML);
      // 重新渲染日曆以更新顏色標記
      renderCalendar();
    }
  });

  window.addEventListener('beforeunload', () => {
    saveItinerary(selectedDate, itineraryList.innerHTML);
  });

  // 清理空行程
  cleanupEmptyItineraries();
  
  loadItinerary(selectedDate);
  renderCalendar();
  
  // 初始化時，如果選中的不是今天，今天的日期應該變成淺灰色
  const todayCell = calendarBody.querySelector('.today-green');
  if (todayCell && selectedDate.toDateString() !== today.toDateString()) {
    todayCell.classList.add('today-faded');
  }

  // 快速安排行程按鈕事件
  quickPlanBtn.addEventListener('click', () => {
    // 儲存當前選中的日期到localStorage，供聊天頁面使用
    const selectedDateKey = getDateKey(selectedDate);
    localStorage.setItem('selectedTravelDate', selectedDateKey);
    
    // 跳轉到聊天頁面並自動傳送訊息
    window.location.href = 'chat.html?autoMessage=請幫我安排行程';
  });

  // 計算旅遊成本按鈕事件（直接開啟彈窗；檢查移至彈窗內日期點選時）
  costCalcBtn.addEventListener('click', () => {
    openCostModal();
  });

  // —— 旅遊成本彈窗邏輯 ——
  const costModal = document.getElementById('costModal');
  const closeCostModalBtn = document.getElementById('closeCostModal');
  const costMonthYear = document.getElementById('cost-month-year');
  const costCalendarBody = document.getElementById('cost-calendar-body');
  const costPrevBtn = document.getElementById('cost-prev-month');
  const costNextBtn = document.getElementById('cost-next-month');
  const costDateText = document.getElementById('cost-date-text');
  const saveCostBtn = document.getElementById('save-cost');
  const schemeANameInput = document.getElementById('schemeAName');
  const schemeBNameInput = document.getElementById('schemeBName');
  const schemeArows = document.getElementById('schemeA-rows');
  const schemeBrows = document.getElementById('schemeB-rows');
  const schemeATotal = document.getElementById('schemeA-total');
  const schemeBTotal = document.getElementById('schemeB-total');
  const addRowButtons = document.querySelectorAll('.add-row');

  let costModalOpen = false;

  function openCostModal() {
    costModal.classList.add('show');
    costModal.setAttribute('aria-hidden','false');
    costModalOpen = true;
    
    // 保存主日曆的選中日期
    const mainSelectedDate = selectedDate;
    
    // 初始狀態：禁用方案名稱編輯和新增按鈕
    schemeANameInput.disabled = true;
    schemeBNameInput.disabled = true;
    addRowButtons.forEach(btn => btn.disabled = true);
    if (saveCostBtn) saveCostBtn.disabled = true;
    
    // 清空日期顯示
    costDateText.textContent = '—';
    
    // 清空方案內容
    schemeArows.innerHTML = '';
    schemeBrows.innerHTML = '';
    schemeANameInput.value = '方案A';
    schemeBNameInput.value = '方案B';
    updateSchemeTotals();
    
    syncModalCalendar();
    
    // 恢復主日曆的選中日期
    selectedDate = mainSelectedDate;
  }
  function closeCostModal() {
    costModal.classList.remove('show');
    costModal.setAttribute('aria-hidden','true');
    costModalOpen = false;
  }
  if (closeCostModalBtn) closeCostModalBtn.addEventListener('click', closeCostModal);
  if (costModal) costModal.addEventListener('click', (e)=>{ if (e.target === costModal) closeCostModal(); });

  function syncModalCalendar() {
    // 讓彈窗日曆與主日曆顯示相同的月份、狀態
    renderCalendar({ monthYear: costMonthYear, calendarBody: costCalendarBody });
    // 也要綁定 modal 專用的前後月按鈕
  }
  if (costPrevBtn) costPrevBtn.addEventListener('click', ()=>{ currentMonth = currentMonth > 0 ? currentMonth - 1 : 11; if (currentMonth===11) currentYear--; renderCalendar(); syncModalCalendar(); });
  if (costNextBtn) costNextBtn.addEventListener('click', ()=>{ currentMonth = currentMonth < 11 ? currentMonth + 1 : 0; if (currentMonth===0) currentYear++; renderCalendar(); syncModalCalendar(); });

  function setCostDateText(date){
    costDateText.textContent = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  function costStorageKey(date){ return `COSTS2:${getDateKey(date)}`; }

  function loadCostsFor(date){
    setCostDateText(date);
    schemeArows.innerHTML = '';
    schemeBrows.innerHTML = '';
    const raw = localStorage.getItem(costStorageKey(date));
    let data = { schemeA: { name: '方案A', rows: [] }, schemeB: { name: '方案B', rows: [] } };
    try { data = raw ? JSON.parse(raw) : data; } catch(e) {}
    schemeANameInput.value = data.schemeA?.name || '方案A';
    schemeBNameInput.value = data.schemeB?.name || '方案B';
    (data.schemeA?.rows || []).forEach(r=> addSchemeRowFromData('A', r));
    (data.schemeB?.rows || []).forEach(r=> addSchemeRowFromData('B', r));
    updateSchemeTotals();
    
    // 只有在有選中日期時才啟用編輯功能
    if (selectedDate) {
      schemeANameInput.disabled = false;
      schemeBNameInput.disabled = false;
      addRowButtons.forEach(btn => btn.disabled = false);
      if (saveCostBtn) saveCostBtn.disabled = false;
    }
  }

  function saveCostsFor(date){
    const collect = (tbody)=> Array.from(tbody.querySelectorAll('tr')).map(tr=>({
      category: tr.querySelector('.c-cat').value,
      note: tr.querySelector('.c-note').value.trim(),
      amount: parseCurrency(tr.querySelector('.c-amount').value)
    }));
    const payload = {
      schemeA: { name: schemeANameInput.value.trim() || '方案A', rows: collect(schemeArows) },
      schemeB: { name: schemeBNameInput.value.trim() || '方案B', rows: collect(schemeBrows) }
    };
    localStorage.setItem(costStorageKey(date), JSON.stringify(payload));
  }

  function formatCurrency(n){
    const value = Number(n||0);
    return value.toLocaleString('zh-TW');
  }
  function parseCurrency(s){
    if (typeof s === 'number') return s;
    if (!s) return 0;
    return Number(String(s).replace(/[,\s元]/g, '')) || 0;
  }

  function categoryOptionsHtml(selected){
    const opts = ['食','衣','住','行','娛樂','其他','無'];
    return opts.map(o=>`<option value="${o}"${selected===o?' selected':''}>${o}</option>`).join('');
  }

  function addSchemeRowFromData(scheme, data){
    const tbody = scheme==='A' ? schemeArows : schemeBrows;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <select class="c-cat">${categoryOptionsHtml(data?.category)}</select>
      </td>
      <td><input type="text" class="c-note" placeholder="備註" value="${data?.note||''}"></td>
      <td><input type="text" inputmode="numeric" class="c-amount amount-input" value="${formatCurrency(data?.amount??0)}" style="max-width: 180px;"></td>
      <td><button class="btn btn-secondary c-del">刪除</button></td>`;
    tbody.appendChild(tr);

    const applyDisable = ()=>{
      const isNone = tr.querySelector('.c-cat').value === '無';
      ['.c-note','.c-amount'].forEach(sel=>{
        const el = tr.querySelector(sel);
        el.disabled = isNone;
        if (isNone) { if (sel!=='.c-note') el.value = formatCurrency(0); tr.querySelector('.c-note').value = ''; }
      });
      recalc();
    };

    const recalc = ()=>{
      const amount = parseCurrency(tr.querySelector('.c-amount').value);
      updateSchemeTotals();
    };

    const amountInput = tr.querySelector('.c-amount');
    const onAmountInput = ()=>{
      const caret = amountInput.selectionStart;
      const raw = amountInput.value;
      const num = parseCurrency(raw);
      amountInput.value = formatCurrency(num);
      // caret 位置簡化處理，不做精細還原
      recalc();
    };

    tr.querySelector('.c-cat').addEventListener('change', applyDisable);
    amountInput.addEventListener('input', onAmountInput);
    amountInput.addEventListener('blur', onAmountInput);
    tr.querySelector('.c-del').addEventListener('click', ()=>{ tr.remove(); updateSchemeTotals(); });
    applyDisable();
  }

  addRowButtons.forEach(btn=> btn.addEventListener('click', ()=> {
    // 檢查是否已選擇日期
    if (!selectedDate) {
      alert('請先選擇一個日期');
      return;
    }
    addSchemeRowFromData(btn.dataset.scheme, { category:'食', amount:0 });
  }));
  if (saveCostBtn) saveCostBtn.addEventListener('click', ()=>{ 
    // 檢查是否已選擇日期
    if (!selectedDate) {
      alert('請先選擇一個日期');
      return;
    }
    saveCostsFor(selectedDate); 
    closeCostModal(); 
  });

  function schemeSum(tbody){
    return Array.from(tbody.querySelectorAll('.c-amount')).reduce((acc,input)=> acc + parseCurrency(input.value), 0);
  }
  function updateSchemeTotals(){
    schemeATotal.textContent = `${formatCurrency(schemeSum(schemeArows))}`;
    schemeBTotal.textContent = `${formatCurrency(schemeSum(schemeBrows))}`;
  }
});