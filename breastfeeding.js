document.addEventListener("DOMContentLoaded", function () {
  console.log("哺乳室查詢頁載入完成");

  const countySelect = document.getElementById('county');
  const districtSelect = document.getElementById('district');
  const countySearch = document.getElementById('countySearch');
  const districtSearch = document.getElementById('districtSearch');
  const useLocationBtn = document.getElementById('useLocation');
  const searchByAreaBtn = document.getElementById('searchByArea');
  const resultList = document.getElementById('resultList');

  // 完整的台灣縣市/地區資料（按地理位置從北到南排序）
  const COUNTY_TO_DISTRICTS = {
    '基隆市': ['仁愛區','信義區','中正區','中山區','安樂區','暖暖區','七堵區'],
    '新北市': ['板橋區','新莊區','中和區','永和區','土城區','三重區','蘆洲區','樹林區','鶯歌區','三峽區','淡水區','汐止區','林口區','五股區','泰山區','八里區','新店區','深坑區','石碇區','坪林區','烏來區','瑞芳區','貢寮區','雙溪區','金山區','萬里區'],
    '臺北市': ['中正區','大同區','中山區','松山區','大安區','萬華區','信義區','士林區','北投區','內湖區','南港區','文山區'],
    '桃園市': ['桃園區','中壢區','平鎮區','八德區','楊梅區','蘆竹區','大溪區','大園區','龜山區','龍潭區','新屋區','觀音區','復興區'],
    '宜蘭縣': ['宜蘭市','頭城鎮','礁溪鄉','壯圍鄉','員山鄉','羅東鎮','三星鄉','大同鄉','五結鄉','冬山鄉','蘇澳鎮','南澳鄉'],
    '新竹市': ['東區','北區','香山區'],
    '新竹縣': ['竹北市','湖口鄉','新豐鄉','新埔鎮','關西鎮','芎林鄉','寶山鄉','竹東鎮','五峰鄉','橫山鄉','尖石鄉','北埔鄉','峨眉鄉'],
    '苗栗縣': ['竹南鎮','頭份市','三灣鄉','南庄鄉','獅潭鄉','後龍鎮','通霄鎮','苑裡鎮','苗栗市','造橋鄉','頭屋鄉','公館鄉','大湖鄉','泰安鄉','銅鑼鄉','三義鄉','西湖鄉','卓蘭鎮'],
    '臺中市': ['中區','東區','南區','西區','北區','西屯區','南屯區','北屯區','豐原區','東勢區','大甲區','清水區','沙鹿區','梧棲區','后里區','神岡區','潭子區','大雅區','新社區','石岡區','外埔區','大安區','烏日區','大肚區','龍井區','霧峰區','太平區','大里區','和平區'],
    '彰化縣': ['彰化市','芬園鄉','花壇鄉','秀水鄉','鹿港鎮','福興鄉','線西鄉','和美鎮','伸港鄉','員林市','社頭鄉','永靖鄉','埔心鄉','溪湖鎮','大村鄉','埔鹽鄉','田中鎮','北斗鎮','田尾鄉','埤頭鄉','溪州鄉','竹塘鄉','二林鎮','大城鄉','芳苑鄉','二水鄉'],
    '南投縣': ['南投市','中寮鄉','草屯鎮','國姓鄉','埔里鎮','仁愛鄉','名間鄉','集集鎮','水里鄉','魚池鄉','信義鄉','竹山鎮','鹿谷鄉'],
    '雲林縣': ['斗南鎮','大埤鄉','虎尾鎮','土庫鎮','褒忠鄉','東勢鄉','臺西鄉','崙背鄉','麥寮鄉','斗六市','林內鄉','古坑鄉','莿桐鄉','西螺鎮','二崙鄉','北港鎮','水林鄉','口湖鄉','四湖鄉','元長鄉'],
    '嘉義市': ['東區','西區'],
    '嘉義縣': ['番路鄉','梅山鄉','竹崎鄉','阿里山鄉','中埔鄉','大埔鄉','水上鄉','鹿草鄉','太保市','朴子市','東石鄉','六腳鄉','新港鄉','民雄鄉','大林鎮','溪口鄉','義竹鄉','布袋鎮'],
    '臺南市': ['中西區','東區','南區','北區','安平區','安南區','永康區','歸仁區','新化區','左鎮區','玉井區','楠西區','南化區','仁德區','關廟區','龍崎區','官田區','麻豆區','佳里區','西港區','七股區','將軍區','學甲區','北門區','新營區','後壁區','白河區','東山區','六甲區','下營區','柳營區','鹽水區','善化區','大內區','山上區','新市區','安定區'],
    '高雄市': ['新興區','前金區','苓雅區','鹽埕區','鼓山區','旗津區','前鎮區','三民區','楠梓區','小港區','左營區','仁武區','大社區','岡山區','路竹區','阿蓮區','田寮區','燕巢區','橋頭區','梓官區','彌陀區','永安區','湖內區','鳳山區','大寮區','林園區','鳥松區','大樹區','旗山區','美濃區','六龜區','內門區','杉林區','甲仙區','桃源區','那瑪夏區','茂林區'],
    '屏東縣': ['屏東市','三地門鄉','霧臺鄉','瑪家鄉','九如鄉','里港鄉','高樹鄉','鹽埔鄉','長治鄉','麟洛鄉','竹田鄉','內埔鄉','萬丹鄉','潮州鎮','泰武鄉','來義鄉','萬巒鄉','崁頂鄉','新埤鄉','南州鄉','林邊鄉','東港鎮','琉球鄉','佳冬鄉','新園鄉','枋寮鄉','枋山鄉','春日鄉','獅子鄉','車城鄉','牡丹鄉','恆春鎮','滿州鄉'],
    '臺東縣': ['臺東市','綠島鄉','蘭嶼鄉','延平鄉','卑南鄉','鹿野鄉','關山鎮','海端鄉','池上鄉','東河鄉','成功鎮','長濱鄉','太麻里鄉','金峰鄉','大武鄉','達仁鄉'],
    '花蓮縣': ['花蓮市','新城鄉','秀林鄉','吉安鄉','壽豐鄉','鳳林鎮','光復鄉','豐濱鄉','瑞穗鄉','玉里鎮','卓溪鄉','富里鄉'],
    '澎湖縣': ['馬公市','西嶼鄉','望安鄉','七美鄉','白沙鄉','湖西鄉'],
    '金門縣': ['金城鎮','金湖鎮','金沙鎮','金寧鄉','烈嶼鄉','烏坵鄉'],
    '連江縣': ['南竿鄉','北竿鄉','莒光鄉','東引鄉']
  };

  // 初始化縣市選項
  function initCountyOptions() {
    Object.keys(COUNTY_TO_DISTRICTS).forEach(function(name) {
      var opt = document.createElement('option');
      opt.value = name; 
      opt.textContent = name;
      countySelect.appendChild(opt);
    });
  }

  // 初始化地區選項
  function initDistrictOptions(county) {
    districtSelect.innerHTML = '';
    if (!county) {
      districtSelect.disabled = true;
      districtSearch.disabled = true;
      districtSearch.value = '';
      var placeholder = document.createElement('option');
      placeholder.value = ''; 
      placeholder.textContent = '請先選擇縣市';
      districtSelect.appendChild(placeholder);
      return;
    }
    
    const districts = COUNTY_TO_DISTRICTS[county] || [];
    districts.forEach(function(d) {
      var opt = document.createElement('option');
      opt.value = d; 
      opt.textContent = d;
      districtSelect.appendChild(opt);
    });
    districtSelect.disabled = false;
    districtSearch.disabled = false;
  }

  // 縣市搜尋功能
  function setupCountySearch() {
    countySearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const options = countySelect.querySelectorAll('option');
      
      // 重置所有選項顯示
      options.forEach(function(option) {
        option.style.display = 'block';
      });
      
      if (searchTerm) {
        options.forEach(function(option) {
          if (option.value === '') return; // 跳過預設選項
          
          const text = option.textContent.toLowerCase();
          const normalizedText = text.replace(/臺/g, '台'); // 將臺轉換為台進行比較
          const normalizedSearch = searchTerm.replace(/臺/g, '台');
          
          if (text.includes(searchTerm) || normalizedText.includes(normalizedSearch)) {
            option.style.display = 'block';
          } else {
            option.style.display = 'none';
          }
        });
      }
      
      // 顯示下拉選單
      countySelect.style.display = 'block';
    });

    countySearch.addEventListener('focus', function() {
      countySelect.style.display = 'block';
    });

    countySearch.addEventListener('blur', function() {
      setTimeout(function() {
        countySelect.style.display = 'none';
      }, 200);
    });

    // 點選選項事件
    countySelect.addEventListener('click', function(e) {
      if (e.target.tagName === 'OPTION' && e.target.value) {
        countySearch.value = e.target.textContent;
        initDistrictOptions(e.target.value);
        this.style.display = 'none';
      }
    });

    // 鍵盤事件支援
    countySearch.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        countySelect.style.display = 'block';
        
        if (e.key === 'Enter') {
          const visibleOptions = Array.from(countySelect.options).filter(opt => 
            opt.style.display !== 'none' && opt.value !== ''
          );
          if (visibleOptions.length === 1) {
            countySearch.value = visibleOptions[0].textContent;
            initDistrictOptions(visibleOptions[0].value);
            countySelect.style.display = 'none';
          }
        }
      }
    });
  }

  // 地區搜尋功能
  function setupDistrictSearch() {
    districtSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const options = districtSelect.querySelectorAll('option');
      
      // 重置所有選項顯示
      options.forEach(function(option) {
        option.style.display = 'block';
      });
      
      if (searchTerm) {
        options.forEach(function(option) {
          if (option.value === '') return; // 跳過預設選項
          
          const text = option.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            option.style.display = 'block';
          } else {
            option.style.display = 'none';
          }
        });
      }
      
      // 顯示下拉選單
      districtSelect.style.display = 'block';
    });

    districtSearch.addEventListener('focus', function() {
      if (!districtSelect.disabled) {
        districtSelect.style.display = 'block';
      }
    });

    districtSearch.addEventListener('blur', function() {
      setTimeout(function() {
        districtSelect.style.display = 'none';
      }, 200);
    });

    // 點選選項事件
    districtSelect.addEventListener('click', function(e) {
      if (e.target.tagName === 'OPTION' && e.target.value) {
        districtSearch.value = e.target.textContent;
        this.style.display = 'none';
      }
    });

    // 鍵盤事件支援
    districtSearch.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        if (!districtSelect.disabled) {
          districtSelect.style.display = 'block';
          
          if (e.key === 'Enter') {
            const visibleOptions = Array.from(districtSelect.options).filter(opt => 
              opt.style.display !== 'none' && opt.value !== ''
            );
            if (visibleOptions.length === 1) {
              districtSearch.value = visibleOptions[0].textContent;
              districtSelect.style.display = 'none';
            }
          }
        }
      }
    });
  }

  // 初始化所有功能
  initCountyOptions();
  setupCountySearch();
  setupDistrictSearch();

  // 以縣市/地區查詢（示例：以假資料回傳）
  searchByAreaBtn.addEventListener('click', function(){
    const county = countySearch.value || countySelect.value;
    const district = districtSearch.value || districtSelect.value;
    
    if (!county) {
      renderNotice('請先選擇縣市');
      return;
    }
    
    // 驗證縣市是否有效
    if (!COUNTY_TO_DISTRICTS[county]) {
      renderNotice('請選擇有效的縣市');
      return;
    }
    
    // 驗證地區是否有效（如果選擇了地區）
    if (district && !COUNTY_TO_DISTRICTS[county].includes(district)) {
      renderNotice('請選擇有效的地區');
      return;
    }
    
    // 模擬查詢結果
    const mock = mockQueryByArea(county, district);
    renderResults(mock);
  });

  // 使用定位查詢（示例：取得座標後以假資料回傳）
  useLocationBtn.addEventListener('click', function(){
    if (!navigator.geolocation){
      renderNotice('此瀏覽器不支援定位');
      return;
    }
    renderNotice('定位中，請稍候...');
    navigator.geolocation.getCurrentPosition(function(pos){
      const { latitude, longitude } = pos.coords;
      const mock = mockQueryByLocation(latitude, longitude);
      renderResults(mock);
    }, function(err){
      renderNotice('定位失敗：' + (err && err.message ? err.message : '未知錯誤'));
    }, { enableHighAccuracy: true, timeout: 8000 });
  });

  function renderNotice(text){
    resultList.innerHTML = '<p style="color:#666;">' + escapeHtml(text) + '</p>';
  }

  function renderResults(items){
    if (!items || items.length === 0){
      renderNotice('查無資料');
      return;
    }
    var html = items.map(function(x){
      var distance = x.distanceKm != null ? ' · 約' + x.distanceKm.toFixed(1) + '公里' : '';
      return (
        '<div class="bf-item" style="padding:10px;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:10px;">' +
          '<div style="font-weight:600;">' + escapeHtml(x.name) + '</div>' +
          '<div style="color:#444;">' + escapeHtml(x.address) + distance + '</div>' +
          (x.opening ? '<div style="color:#2f855a;">營業時間：' + escapeHtml(x.opening) + '</div>' : '') +
          (x.note ? '<div style="color:#666;">備註：' + escapeHtml(x.note) + '</div>' : '') +
        '</div>'
      );
    }).join('');
    resultList.innerHTML = html;
  }

  // 假資料：依縣市/地區
  function mockQueryByArea(county, district){
    var base = [
      { name: '市民大道親子中心哺乳室', address: county + (district? district: '') + '市民大道100號', opening: '10:00-20:00', note: '設有尿布台與熱水' },
      { name: '幸福百貨哺乳室', address: county + (district? district: '') + '幸福路200號7樓', opening: '11:00-21:30' }
    ];
    return base;
  }

  // 假資料：依定位座標
  function mockQueryByLocation(lat, lng){
    return [
      { name: '鄰近公園親子館哺乳室', address: '距離(' + lat.toFixed(4) + ',' + lng.toFixed(4) + ')東北方300m', distanceKm: 0.3, opening: '09:00-18:00' },
      { name: 'XX 醫院哺乳室', address: '主要門診大樓2樓', distanceKm: 0.9, note: '需向櫃檯登記' }
    ];
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(s){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]);
    });
  }
});