// ===== ADMIN LOGIN =====
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Logout buttons (present on dashboard/add/manage pages)
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => btn.addEventListener('click', logout));

  // Protect admin pages (skip this check on the login page itself)
  const isLoginPage = document.getElementById('admin-login-form');
  if (!isLoginPage) {
    requireAuth();
  }
});

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorBox = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorBox.textContent = data.message || 'Login failed';
      errorBox.style.display = 'block';
      return;
    }

    // Save token and redirect to dashboard
    localStorage.setItem('cgsp_admin_token', data.token);
    localStorage.setItem('cgsp_admin_username', data.username);
    window.location.href = 'admin-dashboard.html';

  } catch (error) {
    errorBox.textContent = 'Could not connect to server. Please try again.';
    errorBox.style.display = 'block';
    console.error(error);
  }
}

function requireAuth() {
  const token = localStorage.getItem('cgsp_admin_token');
  if (!token) {
    window.location.href = 'admin-login.html';
  }
}

function logout() {
  localStorage.removeItem('cgsp_admin_token');
  localStorage.removeItem('cgsp_admin_username');
  window.location.href = 'admin-login.html';
}

function getAuthHeaders() {
  const token = localStorage.getItem('cgsp_admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}