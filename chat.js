// 檔名：chat.js
document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // 檢查URL參數，自動傳送訊息
  const urlParams = new URLSearchParams(window.location.search);
  const autoMessage = urlParams.get('autoMessage');
  
  if (autoMessage) {
    // 先顯示歡迎訊息，然後再自動發送用戶問題
    setTimeout(() => {
      showWelcomeMessage();
    }, 800);
    
    // 延遲更長時間讓歡迎訊息先顯示，然後再發送用戶問題
    setTimeout(() => {
      sendAutoMessage(autoMessage);
    }, 1500);
  } else {
    // 沒有自動訊息時，只顯示歡迎訊息
    setTimeout(() => {
      showWelcomeMessage();
    }, 800);
  }

  // 表單送出事件
  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (message !== "") {
      appendMessage("你", message);
      chatInput.value = "";

      // 模擬 AI 回覆
      setTimeout(() => {
        appendMessage("AI", generateResponse(message));
      }, 600);
    }
  });

  // 按下 Enter 鍵時送出訊息
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (typeof chatForm.requestSubmit === "function") {
        chatForm.requestSubmit();
      } else {
        chatForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }
    }
  });

  // 顯示歡迎訊息
  function showWelcomeMessage() {
    const welcomeMessage = `您好！我是您的 Family Travel AI 助手！👋<br>
我可以幫您規劃家庭旅遊行程以及提供各種旅遊建議。<br>
請告訴我您需要什麼幫助，我會為您提供最適合的建議！😊`;
    
    // 直接顯示歡迎訊息
    appendMessage("AI", welcomeMessage);
  }

  // 顯示訊息到畫面上，並依 sender 加上不同 class
  function appendMessage(sender, text) {
    const messageElem = document.createElement("div");
    messageElem.classList.add("message", sender === "你" ? "user" : "ai");
    messageElem.innerHTML = `<strong>${sender}：</strong> ${text}`;
    chatMessages.appendChild(messageElem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 自動傳送訊息函數
  function sendAutoMessage(message) {
    // 設定輸入框的值
    chatInput.value = message;
    
    // 觸發表單提交
    chatForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  }

  // 模擬 AI 回應（可串接真正 API）
  function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // 根據不同的訊息類型提供不同的回應
    if (message.includes('行程') || message.includes('規劃') || message.includes('安排')) {
      return `🗺️ 好的！我來幫您規劃家庭旅遊行程。請告訴我：
      
      📍您想要去哪裡旅遊？
      📅預計玩幾天？
      👨‍👩‍👧‍👦有幾位大人和小孩？
      🎯喜歡自然風景、文化古蹟、還是主題樂園？
      💰大概多少預算？
      
      我會根據您的需求為您規劃最適合的家庭行程！😊`;
      
    } else if (message.includes('預算') || message.includes('費用') || message.includes('成本') || message.includes('錢')) {
      return `💰 我來幫您計算旅遊預算！請提供以下資訊：
      
      🏙️要去哪個城市或國家？
      📅旅遊天數？
      👨‍👩‍👧‍👦幾位大人、幾位小孩？
      🏨住宿偏好：飯店、民宿、還是露營？
      ✈️交通方式：飛機、高鐵、自駕？
      🍽️餐飲預算：經濟型、中等、還是豪華？
      
      我會為您估算詳細的旅遊費用！`;
      
    } else if (message.includes('天氣') || message.includes('氣候')) {
      return `我可以幫您查詢天氣資訊！請告訴我：
      
      📍您想查詢哪個城市的天氣？
      📅是現在的天氣，還是未來幾天的預報？
      
      我會為您提供詳細的天氣資訊，讓您做好旅遊準備！☔️`;
      
    } else if (message.includes('哺乳室') || message.includes('餵奶') || message.includes('寶寶')) {
      return `我可以幫您尋找哺乳室！請告訴我：
      
      📍您在哪個城市及區域？
      🏢場所類型：百貨公司、車站、景點、還是餐廳？
      
      我會為您找到最近的哺乳室位置！👶`;
      
    } else if (message.includes('建議') || message.includes('推薦') || message.includes('好玩')) {
      return `我很樂意為您提供旅遊建議！請告訴我：
      
      🎯旅遊類型：親子遊、情侶旅行、還是朋友聚會？
      📍目的地：有特定的城市或國家嗎？
      ⏰旅遊時間：什麼時候出發？
      👶家庭狀況：有帶小孩嗎？幾歲？
      
      我會根據您的需求推薦最適合的景點和活動！🌟`;
      
    } else if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
      return `👋 您好！很高興為您服務！我是您的 Family Travel AI 助手，專門幫助家庭規劃完美的旅遊體驗。
      
      有什麼我可以幫助您的嗎？😊`;
      
    } else {
      return `我理解您的問題！作為您的 Family Travel AI 助手，我可以幫助您：
      
      • 🗺️規劃家庭旅遊行程
      • 💰計算旅遊預算
      • 🌤️查詢天氣資訊  
      • 🍼尋找哺乳室
      • 💡提供旅遊建議
      
      請告訴我您具體需要什麼幫助，我會為您提供詳細的協助！😊`;
    }
  }
});
