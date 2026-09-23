let token = localStorage.getItem('jwt_token');

document.addEventListener('DOMContentLoaded', () => {
  fetchProfile();
  if (token) {
    document.getElementById('editBtn').classList.remove('hidden');
    document.getElementById('loginBtn').innerText = '登出';
    document.getElementById('loginBtn').onclick = logout;
  }
});

async function fetchProfile() {
  try {
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (data) {
      document.getElementById('profName').innerText = data.name || 'Pinhann';
      document.getElementById('profTitle').innerText = data.title || '';
      document.getElementById('profBio').innerText = data.bio || '';
      
      const skillsContainer = document.getElementById('profSkills');
      skillsContainer.innerHTML = '';
      if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach(skill => {
          const badge = document.createElement('span');
          badge.className = 'skill-badge';
          badge.innerText = skill;
          skillsContainer.appendChild(badge);
        });
      }
    }
  } catch (err) {
    console.error('無法取得個人資料:', err);
  }
}

function openLoginModal() {
  document.getElementById('loginModal').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
}

async function login() {
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
      token = data.token;
      localStorage.setItem('jwt_token', token);
      alert('登入成功！');
      closeLoginModal();
      document.getElementById('editBtn').classList.remove('hidden');
      document.getElementById('loginBtn').innerText = '登出';
      document.getElementById('loginBtn').onclick = logout;
    } else {
      alert('登入失敗：' + (data.message || '帳密錯誤'));
    }
  } catch (err) {
    alert('登入時發生錯誤');
  }
}

function logout() {
  localStorage.removeItem('jwt_token');
  token = null;
  document.getElementById('editBtn').classList.add('hidden');
  document.getElementById('loginBtn').innerText = '管理者登入';
  document.getElementById('loginBtn').onclick = openLoginModal;
  alert('已登出');
}

async function openEditModal() {
  try {
    const res = await fetch('/api/profile');
    const data = await res.json();
    document.getElementById('editName').value = data.name || '';
    document.getElementById('editTitle').value = data.title || '';
    document.getElementById('editBio').value = data.bio || '';
    document.getElementById('editSkills').value = data.skills ? data.skills.join(', ') : '';
    document.getElementById('editModal').classList.remove('hidden');
  } catch (err) {
    alert('無法讀取現有資料');
  }
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function saveProfile() {
  const name = document.getElementById('editName').value;
  const title = document.getElementById('editTitle').value;
  const bio = document.getElementById('editBio').value;
  const skillsStr = document.getElementById('editSkills').value;
  const skills = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, title, bio, skills })
    });
    const data = await res.json();
    if (data.success) {
      alert('資料更新成功！');
      closeEditModal();
      fetchProfile();
    } else {
      alert('更新失敗，請重新登入');
    }
  } catch (err) {
    alert('更新時發生錯誤');
  }
}
