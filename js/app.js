// ==========================================
// APP.JS - FINAL CLEANUP
// ==========================================

function toggleSidebar(event) {
  if (event) event.stopPropagation();
  document.getElementById('sidebar').classList.toggle('active');
}

function toggleNotifications(event) {
  if (event) event.stopPropagation();
  const panel = document.getElementById('notification-panel');
  const userPanel = document.getElementById('user-menu-panel');

  userPanel.classList.add('hidden');
  panel.classList.toggle('hidden');
}

function toggleUserMenu(event) {
  if (event) event.stopPropagation();
  const panel = document.getElementById('user-menu-panel');
  const notifPanel = document.getElementById('notification-panel');

  notifPanel.classList.add('hidden');
  panel.classList.toggle('hidden');
}

function clearNotifications() {
  const list = document.getElementById('notification-list');
  list.innerHTML = `<p class="empty-state-text">No notifications yet.</p>`;
  const badge = document.getElementById('notification-count');
  badge.style.display = 'none';
  badge.textContent = '0';
  showToast('Notifications cleared', 'success');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function showSection(sectionName, event = null) {
  if (event) event.preventDefault();

  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const target = document.getElementById(`section-${sectionName}`);
  if (target) target.classList.add('active');

  const nav = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
  if (nav) nav.classList.add('active');

  document.getElementById('notification-panel').classList.add('hidden');
  document.getElementById('user-menu-panel').classList.add('hidden');
  removeSearchResults();

  if (window.innerWidth < 1024) {
    document.getElementById('sidebar').classList.remove('active');
  }
}

function showPharmacyTab(tabName, event) {
  if (event) event.preventDefault();
  activatePharmacyTab(tabName);
}

function activatePharmacyTab(tabName) {
  document.querySelectorAll('.pharmacy-tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById(`pharmacy-${tabName}`);
  if (tab) tab.classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (
      (tabName === 'dosing' && text.includes('dosing')) ||
      (tabName === 'iv' && text.includes('iv')) ||
      (tabName === 'pk' && text.includes('pk'))
    ) {
      btn.classList.add('active');
    }
  });
}

function mapCategoryToSection(category) {
  const c = (category || '').toLowerCase();

  if (['general'].includes(c)) return 'general';
  if (['cardio', 'cardiology'].includes(c)) return 'cardio';
  if (['nephro', 'renal', 'nephrology'].includes(c)) return 'nephro';
  if (['er', 'emergency'].includes(c)) return 'er';
  if (['icu'].includes(c)) return 'icu';
  if (['peds', 'pediatrics'].includes(c)) return 'peds';
  if (['obgyn', 'ob', 'gyn'].includes(c)) return 'obgyn';
  if (['pharmacy', 'iv', 'pk'].includes(c)) return 'pharmacy';

  return 'general';
}

function globalSearch(query) {
  const searchTerm = query.trim().toLowerCase();
  removeSearchResults();

  if (searchTerm.length < 2) return;

  const results = Object.entries(CALCULATORS)
    .filter(([id, calc]) => {
      return (
        (calc.name && calc.name.toLowerCase().includes(searchTerm)) ||
        (calc.description && calc.description.toLowerCase().includes(searchTerm)) ||
        (calc.category && calc.category.toLowerCase().includes(searchTerm)) ||
        id.toLowerCase().includes(searchTerm)
      );
    })
    .slice(0, 10);

  if (!results.length) return;

  const searchBar = document.querySelector('.search-bar');
  const box = document.createElement('div');
  box.id = 'search-results-box';
  box.className = 'search-results-box';

  box.innerHTML = results.map(([id, calc]) => `
    <div class="search-result-item" onclick="openCalculatorFromSearch('${id}')">
      <div class="search-result-title">${calc.name}</div>
      <div class="search-result-meta">${calc.description || calc.category || ''}</div>
    </div>
  `).join('');

  searchBar.appendChild(box);
}

function openCalculatorFromSearch(calcId) {
  removeSearchResults();
  document.getElementById('global-search').value = '';

  const calc = CALCULATORS[calcId];
  if (!calc) return;

  const section = mapCategoryToSection(calc.category);
  showSection(section);

  if ((calc.category || '').toLowerCase() === 'pharmacy') {
    const sub = (calc.subType || '').toLowerCase();
    if (sub === 'iv') activatePharmacyTab('iv');
    else if (sub === 'pk') activatePharmacyTab('pk');
    else activatePharmacyTab('dosing');
  }

  setTimeout(() => openCalculator(calcId), 120);
}

function removeSearchResults() {
  const existing = document.getElementById('search-results-box');
  if (existing) existing.remove();
}

function toggleFavorite(calcId) {
  calcStorage.toggleFavorite(calcId);
  loadFavorites();
  renderAllCalculatorGrids();
  renderQuickPicks();
  showToast('Favorites updated', 'success');
}

function loadFavorites() {
  const favorites = calcStorage.getFavorites();
  const containers = [
    document.getElementById('favorites-grid'),
    document.getElementById('all-favorites')
  ];

  containers.forEach(container => {
    if (!container) return;

    if (favorites.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-star"></i>
          <p>No favorites yet.</p>
        </div>
      `;
      return;
    }

    let html = '';
    favorites.forEach(calcId => {
      const calc = CALCULATORS[calcId];
      if (!calc) return;

      html += buildCalculatorCard(calcId, calc, true);
    });

    container.innerHTML = html;
  });
}

function loadHistory() {
  const history = calcStorage.getHistory(50);
  const recent = document.getElementById('recent-calculations');
  const full = document.getElementById('full-history');

  const renderHistory = (container, items) => {
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-history"></i>
          <p>No calculation history yet.</p>
        </div>
      `;
      return;
    }

    let html = '';
    items.forEach(entry => {
      const calc = CALCULATORS[entry.calculatorId];
      html += `
        <div class="recent-item">
          <i class="fas ${calc?.icon || 'fa-calculator'}"></i>
          <div class="recent-info">
            <strong>${entry.calculatorName}</strong>
            <p>${entry.result?.interpretation || entry.result?.summary || 'Saved calculation'}</p>
          </div>
          <small>${getTimeAgo(new Date(entry.timestamp))}</small>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  renderHistory(recent, history.slice(0, 5));
  renderHistory(full, history);
}

function clearHistory() {
  if (!confirm('Clear all calculation history?')) return;
  calcStorage.clearHistory();
  loadHistory();
  showToast('History cleared', 'success');
}

function showActivity() {
  showSection('history');
  document.getElementById('user-menu-panel').classList.add('hidden');
}

function openUploadModal() {
  document.getElementById('upload-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function handlePDFUpload(event) {
  event.preventDefault();

  const title = document.getElementById('pdf-title').value.trim();
  const category = document.getElementById('pdf-category').value.trim();
  const description = document.getElementById('pdf-description').value.trim();
  const file = document.getElementById('pdf-file').files[0];

  if (!file) {
    showToast('Please choose a file', 'error');
    return;
  }

  pdfStorage.savePDF({
    title,
    category,
    description,
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
  });

  renderPDFs();
  closeUploadModal();
  showToast('Document metadata saved', 'success');
}

function renderPDFs() {
  const grid = document.getElementById('pdf-grid');
  if (!grid) return;

  const pdfs = pdfStorage.getPDFs();

  if (!pdfs.length) {
    grid.innerHTML = `
      <div class="empty-state-card">
        <i class="fas fa-file-pdf"></i>
        <p>No documents uploaded yet.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = pdfs.map(pdf => `
    <div class="pdf-card">
      <div class="pdf-icon"><i class="fas fa-file-pdf"></i></div>
      <h3>${pdf.title}</h3>
      <p>${pdf.description || 'No description'}</p>
      <small>${pdf.category || 'General'} • ${pdf.fileSize || ''}</small>
      <div class="pdf-actions">
        <button onclick="showToast('Preview not implemented yet','info')"><i class="fas fa-eye"></i> View</button>
        <button onclick="showToast('Stored locally as metadata only','info')"><i class="fas fa-download"></i> Info</button>
      </div>
    </div>
  `).join('');
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day(s) ago`;
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function buildCalculatorCard(id, calc, favorite = false) {
  return `
    <div class="calc-card" onclick="openCalculator('${id}')">
      <div class="calc-icon"><i class="fas ${calc.icon || 'fa-calculator'}"></i></div>
      <h3>${calc.name}</h3>
      <p>${calc.description || calc.category}</p>
      <div class="calc-card-footer">
        <span class="calc-category-badge">${(calc.category || '').toUpperCase()}</span>
        <button class="calc-favorite ${favorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${id}')">
          <i class="${favorite ? 'fas' : 'far'} fa-star"></i>
        </button>
      </div>
    </div>
  `;
}

function renderAllCalculatorGrids() {
  const grids = {
    general: document.getElementById('general-grid'),
    cardio: document.getElementById('cardio-grid'),
    nephro: document.getElementById('nephro-grid'),
    er: document.getElementById('er-grid'),
    icu: document.getElementById('icu-grid'),
    peds: document.getElementById('peds-grid'),
    obgyn: document.getElementById('obgyn-grid'),
    pharmacyDosing: document.getElementById('pharmacy-dosing-grid'),
    pharmacyIv: document.getElementById('pharmacy-iv-grid'),
    pharmacyPk: document.getElementById('pharmacy-pk-grid')
  };

  Object.values(grids).forEach(grid => {
    if (grid) grid.innerHTML = '';
  });

  const favorites = calcStorage.getFavorites();

  Object.entries(CALCULATORS).forEach(([id, calc]) => {
    const favorite = favorites.includes(id);
    const card = buildCalculatorCard(id, calc, favorite);

    const category = (calc.category || '').toLowerCase();
    const subType = (calc.subType || '').toLowerCase();

    if (category === 'general' && grids.general) grids.general.innerHTML += card;
    else if (category === 'cardio' && grids.cardio) grids.cardio.innerHTML += card;
    else if ((category === 'nephro' || category === 'renal') && grids.nephro) grids.nephro.innerHTML += card;
    else if (category === 'er' && grids.er) grids.er.innerHTML += card;
    else if (category === 'icu' && grids.icu) grids.icu.innerHTML += card;
    else if (category === 'peds' && grids.peds) grids.peds.innerHTML += card;
    else if (category === 'obgyn' && grids.obgyn) grids.obgyn.innerHTML += card;
    else if (category === 'pharmacy') {
      if (subType === 'iv' && grids.pharmacyIv) grids.pharmacyIv.innerHTML += card;
      else if (subType === 'pk' && grids.pharmacyPk) grids.pharmacyPk.innerHTML += card;
      else if (grids.pharmacyDosing) grids.pharmacyDosing.innerHTML += card;
    }
  });
}

function renderQuickPicks() {
  const container = document.querySelector('.quick-access');
  if (!container) return;

  container.innerHTML = `
    <div class="quick-card er" onclick="openCalculator('shockIndex')">
      <i class="fas fa-ambulance"></i>
      <h3>Shock Index</h3>
      <p>ER quick risk tool</p>
    </div>
    <div class="quick-card icu" onclick="openCalculator('pfRatio')">
      <i class="fas fa-procedures"></i>
      <h3>P/F Ratio</h3>
      <p>ICU oxygenation tool</p>
    </div>
    <div class="quick-card peds" onclick="openCalculator('pedsDose')">
      <i class="fas fa-baby"></i>
      <h3>Peds Dose</h3>
      <p>Weight-based dose</p>
    </div>
    <div class="quick-card pharmacy" onclick="openCalculator('dripRate')">
      <i class="fas fa-pills"></i>
      <h3>IV Drip Rate</h3>
      <p>Common pharmacy calculation</p>
    </div>
  `;
}

document.addEventListener('click', (e) => {
  const notificationPanel = document.getElementById('notification-panel');
  const userMenuPanel = document.getElementById('user-menu-panel');
  const sidebar = document.getElementById('sidebar');
  const calculatorModal = document.getElementById('calculator-modal');
  const uploadModal = document.getElementById('upload-modal');

  if (!notificationPanel.contains(e.target) && !e.target.closest('.header-icon')) {
    notificationPanel.classList.add('hidden');
  }

  if (!userMenuPanel.contains(e.target) && !e.target.closest('.user-menu')) {
    userMenuPanel.classList.add('hidden');
  }

  if (!e.target.closest('.search-bar')) {
    removeSearchResults();
  }

  if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !e.target.closest('.menu-toggle')) {
    sidebar.classList.remove('active');
  }

  if (e.target === calculatorModal) closeCalculator();
  if (e.target === uploadModal) closeUploadModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('notification-panel').classList.add('hidden');
    document.getElementById('user-menu-panel').classList.add('hidden');
    removeSearchResults();
    closeCalculator();
    closeUploadModal();
    if (window.innerWidth < 1024) {
      document.getElementById('sidebar').classList.remove('active');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  setTimeout(() => {
    renderQuickPicks();
    renderAllCalculatorGrids();
    loadFavorites();
    loadHistory();
    renderPDFs();
  }, 100);
});

window.toggleSidebar = toggleSidebar;
window.toggleNotifications = toggleNotifications;
window.toggleUserMenu = toggleUserMenu;
window.clearNotifications = clearNotifications;
window.toggleTheme = toggleTheme;
window.showSection = showSection;
window.showPharmacyTab = showPharmacyTab;
window.activatePharmacyTab = activatePharmacyTab;
window.globalSearch = globalSearch;
window.openCalculatorFromSearch = openCalculatorFromSearch;
window.toggleFavorite = toggleFavorite;
window.loadFavorites = loadFavorites;
window.loadHistory = loadHistory;
window.clearHistory = clearHistory;
window.showActivity = showActivity;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.handlePDFUpload = handlePDFUpload;
window.showToast = showToast;
window.renderAllCalculatorGrids = renderAllCalculatorGrids;
window.renderQuickPicks = renderQuickPicks;