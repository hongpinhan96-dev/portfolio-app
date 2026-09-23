// 當網頁全部載入完成後才執行
document.addEventListener('DOMContentLoaded', () => {
  console.log("【測試】JavaScript 已經成功載入！");

  // 1. 抓取登入彈窗與按鈕元素
  const loginModal = document.getElementById('loginModal');
  const openBtn = document.getElementById('openLoginModal');
  const closeBtn = document.getElementById('closeLoginModal');
  const submitBtn = document.getElementById('submitLogin');

  // 抓取編輯彈窗與個人資料相關元素
  const editBtn = document.getElementById('editBtn');
  const editModal = document.getElementById('editModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const saveProfile = document.getElementById('saveProfile');

  const heroTitle = document.getElementById('heroTitle');
  const heroBio = document.getElementById('heroBio');
  const aboutContent = document.getElementById('aboutContent');

  // 2. 點擊「管理者登入」按鈕 ➔ 打開彈窗
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      console.log("【測試】點擊了管理者登入按鈕");
      if (loginModal) {
        loginModal.classList.remove('hidden');
      } else {
        alert("找不到 id='loginModal' 的彈出視窗區塊！");
      }
    });
  } else {
    console.log("【錯誤】找不到 id='openLoginModal' 的按鈕！");
  }

  // 3. 點擊「取消」按鈕 ➔ 關閉登入彈窗
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      loginModal.classList.add('hidden');
    });
  }

  // 4. 點擊「登入」按鈕 ➔ 送出帳密驗證
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (data.success) {
          alert('登入成功！');
          loginModal.classList.add('hidden');
          
          // 登入成功後，顯示「編輯個人資料」按鈕，讓管理者可以編輯後台資料
          if (editBtn) {
            editBtn.classList.remove('hidden');
          }
        } else {
          alert('帳號或密碼錯誤！');
        }
      } catch (err) {
        alert('API 連線失敗，請檢查後端服務是否啟動！');
      }
    });
  }

  // 5. 點擊「編輯個人資料」按鈕 ➔ 打開編輯 Modal 並帶入目前資料
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      document.getElementById('editTitle').value = heroTitle ? heroTitle.textContent : '';
      document.getElementById('editBio').value = heroBio ? heroBio.textContent : '';
      document.getElementById('editAbout').value = aboutContent ? aboutContent.textContent.trim() : '';
      if (editModal) editModal.classList.remove('hidden');
    });
  }

  // 6. 關閉編輯彈窗
  if (closeEditModal) {
    closeEditModal.addEventListener('click', () => {
      if (editModal) editModal.classList.add('hidden');
    });
  }

  // 7. 儲存編輯資料
  if (saveProfile) {
    saveProfile.addEventListener('click', () => {
      if (heroTitle) heroTitle.textContent = document.getElementById('editTitle').value;
      if (heroBio) heroBio.textContent = document.getElementById('editBio').value;
      if (aboutContent) aboutContent.textContent = document.getElementById('editAbout').value;
      alert('個人資料已更新！');
      if (editModal) editModal.classList.add('hidden');
    });
  }
});

