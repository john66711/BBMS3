// Simple client-side storage for users
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = null;

function showLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
}

function showRegister() {
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
}

// Registration
function register() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  if (!username || !password) {
    alert('Please fill all fields.');
    return;
  }
  if (users.some(u => u.username === username)){
    alert('Username already exists.');
    return;
  }
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  showLogin();
}

// Login
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    loggedInUser = user;
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials.');
  }
}

// Logout
function logout() {
  loggedInUser = null;
  window.location.href = 'index.html';
}

// Dashboard data
let bloodStock = JSON.parse(localStorage.getItem('bloodStock')) || [];
let donors = JSON.parse(localStorage.getItem('donors')) || [];

function populateBloodStock() {
  const tbody = document.querySelector('#bloodStockTable tbody');
  tbody.innerHTML = '';
  bloodStock.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.type}</td>
      <td>${item.units}</td>
      <td><button onclick="removeBlood(${index})">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

function populateDonors() {
  const tbody = document.querySelector('#donorsTable tbody');
  tbody.innerHTML = '';
  donors.forEach((donor, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donor.name}</td>
      <td>${donor.bloodType}</td>
      <td>${donor.contact}</td>
    `;
    tbody.appendChild(row);
  });
}

// Modal controls
function showAddBlood() {
  document.getElementById('bloodModal').classList.remove('hidden');
}

function showAddDonor() {
  document.getElementById('donorModal').classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Add blood
function addBlood() {
  const type = document.getElementById('bloodTypeInput').value.trim();
  const units = parseInt(document.getElementById('bloodUnitsInput').value.trim());
  if (!type || isNaN(units) || units <= 0) {
    alert('Please enter valid details.');
    return;
  }
  // Check if blood type exists
  const existing = bloodStock.find(b => b.type === type);
  if (existing) {
    existing.units += units;
  } else {
    bloodStock.push({ type, units });
  }
  localStorage.setItem('bloodStock', JSON.stringify(bloodStock));
  populateBloodStock();
  closeModal('bloodModal');
  document.getElementById('bloodTypeInput').value = '';
  document.getElementById('bloodUnitsInput').value = '';
}

// Remove blood type
function removeBlood(index) {
  bloodStock.splice(index, 1);
  localStorage.setItem('bloodStock', JSON.stringify(bloodStock));
  populateBloodStock();
}

// Add donor
function addDonor() {
  const name = document.getElementById('donorName').value.trim();
  const bloodType = document.getElementById('donorBloodType').value.trim();
  const contact = document.getElementById('donorContact').value.trim();
  if (!name || !bloodType || !contact) {
    alert('Fill all fields');
    return;
  }
  donors.push({ name, bloodType, contact });
  localStorage.setItem('donors', JSON.stringify(donors));
  populateDonors();
  closeModal('donorModal');
  document.getElementById('donorName').value = '';
  document.getElementById('donorBloodType').value = '';
  document.getElementById('donorContact').value = '';
}

// Initialize dashboard
window.onload = () => {
  if (window.location.pathname.includes('dashboard.html')) {
    populateBloodStock();
    populateDonors();
  }
};
