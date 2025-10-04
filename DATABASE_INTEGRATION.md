# 資料庫整合說明

## 會員編號流水號生成

### 目前的模擬實現
- 格式：`M + 年月日 + 時間戳後6位`
- 範例：`M241201123456`
- 說明：M + 24年12月01日 + 時間戳後6位

### 實際資料庫整合方案

#### 1. 後端API端點設計
```javascript
// GET /api/user/next-member-id
// 回傳格式：
{
  "success": true,
  "memberId": "M241201000001",
  "timestamp": "2024-12-01T12:34:56Z"
}
```

#### 2. 資料庫表格設計
```sql
-- 會員編號序列表
CREATE TABLE member_id_sequence (
  id INT PRIMARY KEY AUTO_INCREMENT,
  year_month VARCHAR(6) NOT NULL,  -- 格式：241201
  sequence_number INT NOT NULL,    -- 當月流水號
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 會員資料表
CREATE TABLE members (
  member_id VARCHAR(20) PRIMARY KEY,
  last_name VARCHAR(50),
  first_name VARCHAR(50),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. 流水號生成邏輯（後端）
```javascript
// Node.js + Express 範例
app.get('/api/user/next-member-id', async (req, res) => {
  try {
    const now = new Date();
    const yearMonth = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    
    // 獲取或創建當月序號
    let sequence = await getOrCreateSequence(yearMonth);
    
    // 生成會員編號
    const memberId = `M${yearMonth}${sequence.toString().padStart(6, '0')}`;
    
    res.json({
      success: true,
      memberId: memberId,
      timestamp: now.toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '無法生成會員編號'
    });
  }
});

async function getOrCreateSequence(yearMonth) {
  // 檢查是否已存在當月序號
  let record = await db.query(
    'SELECT sequence_number FROM member_id_sequence WHERE year_month = ?',
    [yearMonth]
  );
  
  if (record.length === 0) {
    // 創建新的月份序號
    await db.query(
      'INSERT INTO member_id_sequence (year_month, sequence_number) VALUES (?, 1)',
      [yearMonth]
    );
    return 1;
  } else {
    // 增加序號
    const newSequence = record[0].sequence_number + 1;
    await db.query(
      'UPDATE member_id_sequence SET sequence_number = ? WHERE year_month = ?',
      [newSequence, yearMonth]
    );
    return newSequence;
  }
}
```

#### 4. 前端整合
```javascript
// 在 account.js 中替換 generateMemberId() 函數
async generateMemberId() {
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
    // 降級到本地生成
    return this.generateLocalMemberId();
  }
}
```

### 編號格式選項

#### 選項1：年月日 + 流水號（推薦）
- 格式：`M + YYMMDD + 6位流水號`
- 範例：`M241201000001`
- 優點：包含日期資訊，易於管理

#### 選項2：年月 + 流水號
- 格式：`M + YYMM + 8位流水號`
- 範例：`M241200000001`
- 優點：每月重新開始，編號較短

#### 選項3：純數字流水號
- 格式：`7位數字`
- 範例：`1000001`
- 優點：最簡潔，但缺乏時間資訊

### 安全考量

1. **並發控制**：使用資料庫事務確保流水號唯一性
2. **權限驗證**：API需要驗證使用者身份
3. **錯誤處理**：網路失敗時的降級方案
4. **日誌記錄**：記錄所有編號生成操作

### 測試建議

1. 測試並發請求下的編號唯一性
2. 測試網路中斷時的降級機制
3. 測試大量請求下的效能表現
4. 測試跨月時的編號重置


