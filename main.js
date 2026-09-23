document.addEventListener('DOMContentLoaded', () => {
  console.log("【測試】JavaScript 已經成功載入！");

  const loginModal = document.getElementById('loginModal');
  const openBtn = document.getElementById('openLoginModal');
  const closeBtn = document.getElementById('closeLoginModal');
  const submitBtn = document.getElementById('submitLogin');

  const editBtn = document.getElementById('editBtn');
  const editModal = document.getElementById('editModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const saveProfile = document.getElementById('saveProfile');

  const heroTitle = document.getElementById('heroTitle');
  const heroBio = document.getElementById('heroBio');
  const aboutContent = document.getElementById('aboutContent');

  // 初始化：向後端請求 MongoDB 內的個人資料
  loadProfile();

  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.name && heroTitle) heroTitle.textContent = data.name;
          if (data.title && heroBio) heroBio.textContent = data.title;
          if (data.bio && aboutContent) aboutContent.textContent = data.bio;
        }
      }
    } catch (err) {
      console.log('載入資料失敗，使用預設靜態文字');
    }
  }

  // 1. 開啟登入彈窗
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (loginModal) loginModal.classList.remove('hidden');
    });
  }

  // 2. 關閉登入彈窗
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      loginModal.classList.add('hidden');
    });
  }

  // 3. 登入驗證與儲存 Token
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
          // 將 Token 儲存至瀏覽器
          localStorage.setItem('token', data.token);
          loginModal.classList.add('hidden');
          
          // 顯示編輯按鈕
          if (editBtn) editBtn.classList.remove('hidden');
        } else {
          alert(data.message || '帳號或密碼錯誤！');
        }
      } catch (err) {
        alert('API 連線失敗，請檢查後端服務是否啟動！');
      }
    });
  }

  // 4. 開啟編輯彈窗
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      document.getElementById('editTitle').value = heroTitle ? heroTitle.textContent : '';
      document.getElementById('editBio').value = heroBio ? heroBio.textContent : '';
      document.getElementById('editAbout').value = aboutContent ? aboutContent.textContent.trim() : '';
      if (editModal) editModal.classList.remove('hidden');
    });
  }

  // 5. 關閉編輯彈窗
  if (closeEditModal) {
    closeEditModal.addEventListener('click', () => {
      if (editModal) editModal.classList.add('hidden');
    });
  }

  // 6. 送出編輯資料給後端存入 MongoDB
  if (saveProfile) {
    saveProfile.addEventListener('click', async () => {
      const name = document.getElementById('editTitle').value;
      const title = document.getElementById('editBio').value;
      const bio = document.getElementById('editAbout').value;
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, title, bio })
        });

        const data = await res.json();
        if (data.success) {
          alert('資料已成功更新並存入資料庫！');
          heroTitle.textContent = name;
          heroBio.textContent = title;
          aboutContent.textContent = bio;
          if (editModal) editModal.classList.add('hidden');
        } else {
          alert('更新失敗，登入權限可能已過期，請重新登入！');
        }
      } catch (err) {
        alert('連線失敗，無法更新資料！');
      }
    });
  }
});
