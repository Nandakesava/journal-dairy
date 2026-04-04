const API = 'https://journal-dairy-1.onrender.com';

let token = localStorage.getItem('journal_token') || '';
let currentUser = JSON.parse(localStorage.getItem('journal_user') || 'null');

window.addEventListener('DOMContentLoaded', () => {
  if (token && currentUser) showApp();
});

// -------- AUTH UI --------
function showAuthTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
}

// -------- LOGIN --------
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';

  if (!email || !password) {
    errEl.textContent = 'Please fill all fields';
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.message;
      return;
    }

    token = data.token;
    currentUser = data.user;

    localStorage.setItem('journal_token', token);
    localStorage.setItem('journal_user', JSON.stringify(currentUser));

    showApp();

  } catch (err) {
    errEl.textContent = 'Cannot connect to server';
  }
}

// -------- REGISTER --------
async function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl = document.getElementById('register-error');
  errEl.textContent = '';

  if (!username || !email || !password) {
    errEl.textContent = 'Fill all fields';
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.message;
      return;
    }

    token = data.token;
    currentUser = data.user;

    localStorage.setItem('journal_token', token);
    localStorage.setItem('journal_user', JSON.stringify(currentUser));

    showApp();

  } catch (err) {
    errEl.textContent = 'Cannot connect to server';
  }
}

// -------- LOGOUT --------
function handleLogout() {
  localStorage.clear();
  location.reload();
}

// -------- SHOW APP --------
function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
}

// -------- SAVE ENTRY --------
async function saveEntry() {
  const title = document.getElementById('entry-title').value;
  const content = document.getElementById('entry-content').value;

  try {
    const res = await fetch(`${API}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert('Saved successfully');
    loadEntries();

  } catch (err) {
    alert('Error saving entry');
  }
}

// -------- LOAD ENTRIES --------
async function loadEntries() {
  try {
    const res = await fetch(`${API}/api/entries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    console.log(data);

  } catch (err) {
    console.error('Error loading entries');
  }
}

// -------- DELETE ENTRY --------
async function deleteEntry(id) {
  await fetch(`${API}/api/entries/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  loadEntries();
}
