// --- Авторизація ---
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout');
const userEmailSpan = document.getElementById('user-email');

let currentUser = localStorage.getItem('currentUser') || null;
let balance = parseFloat(localStorage.getItem('balance')) || 0;

// Показуємо email і баланс
function updateUI() {
  userEmailSpan.innerText = currentUser || "Гість";
  document.getElementById('balance').innerText = balance;
  document.getElementById('add-logo-section').style.display = currentUser ? 'block' : 'none';
  logoutBtn.style.display = currentUser ? 'inline-block' : 'none';
}

updateUI();

// Логін / реєстрація
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  if(!email) return showToast('Введіть email', 'error');
  currentUser = email;
  localStorage.setItem('currentUser', currentUser);
  updateUI();
  showToast('Вхід успішний', 'success');
  loadLogos();
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUI();
  showToast('Вийшли з системи', 'warning');
});

// --- Toast ---
function showToast(message, type='success'){
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(()=> container.removeChild(toast),3000);
}

// --- Логотипи ---
function getLogos(){
  return JSON.parse(localStorage.getItem('logos')) || [];
}

function saveLogos(logos){
  localStorage.setItem('logos', JSON.stringify(logos));
}

function loadLogos(){
  const logosContainer = document.getElementById('logos');
  logosContainer.innerHTML = '';
  const logos = getLogos();
  logos.forEach((logo, index)=>{
    const card = document.createElement('div');
    card.className = 'logo-card';
    card.innerHTML = `
      <img src="${logo.image}" alt="${logo.name}" style="width:100%;border-radius:10px;margin-bottom:10px;">
      <span class="logo-name">${logo.name}</span>
      <span class="logo-price">$${logo.price}</span>
      <button class="buy-button" data-index="${index}">Купити</button>
    `;
    logosContainer.appendChild(card);
  });

  // Кнопки Купити
  document.querySelectorAll('.buy-button').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const idx = e.target.dataset.index;
      const logos = getLogos();
      const logo = logos[idx];
      if(!currentUser) return showToast('Увійдіть для покупки', 'error');
      balance += parseFloat(logo.price);
      localStorage.setItem('balance', balance);
      addPurchase(logo);
      updateUI();
      showToast(`Купили ${logo.name} за $${logo.price}`, 'success');
    });
  });
}

// --- Додавання логотипів ---
document.getElementById('add-logo-btn').addEventListener('click', ()=>{
  const name = document.getElementById('logo-name').value.trim();
  const price = parseFloat(document.getElementById('logo-price').value);
  const image = document.getElementById('logo-image').value.trim();
  if(!name || !price || !image) return showToast('Заповніть всі поля', 'error');

  const logos = getLogos();
  logos.push({name, price
