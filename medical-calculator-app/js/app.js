// ==========================================
// APP.JS - Main Application Logic
// ==========================================

// Toggle sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

// Toggle notifications panel
function toggleNotifications() {
  const panel = document.getElementById('notification-panel');
  const userPanel = document.getElementById('user-menu-panel');
  
  userPanel.classList.add('hidden');
  panel.classList.toggle('hidden');
  
  // Mark notifications as read
  if (!panel.classList.contains('hidden')) {
    notificationStorage.getNotifications().forEach(n => {
      if (!n.read) {
        notificationStorage.markAsRead(n.id);
      }
    });
  }
}

// Toggle user menu
function toggleUserMenu() {
  const panel = document.getElementById('user-menu-panel');
  const notifPanel = document.getElementById('notification-panel');
  
  notifPanel.classList.add('hidden');
  panel.classList.toggle('hidden');
}

// Clear notifications
function clearNotifications() {
  if (confirm('Clear all notifications?')) {
    notificationStorage.clearAll();
    document.getElementById('notification-list').innerHTML = '<p style="text-align:center; color: var(--gray-400); padding: 2rem;">No notifications</p>';
    showToast('Notifications cleared', 'success');
  }
}

// Toggle theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const icon = document.getElementById('theme-icon');
  icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'success');
}

// Show section
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const section = document.getElementById(`section-${sectionName}`);
  if (section) {
    section.classList.add('active');
  }
  
  // Activate corresponding nav item
  event?.target.classList.add('active');
  
  // Close sidebar on mobile
  if (window.innerWidth < 1024) {
    document.getElementById('sidebar').classList.remove('active');
  }
}

// Global search
function globalSearch(query) {
  if (query.length < 2) return;
  
  query = query.toLowerCase();
  const results = [];
  
  // Search calculators
  Object.keys(CALCULATORS).forEach(key => {
    const calc = CALCULATORS[key];
    if (calc.name.toLowerCase().includes(query) ||
        calc.category.toLowerCase().includes(query)) {
      results.push({
        type: 'calculator',
        id: key,
        name: calc.name,
        category: calc.category
      });
    }
  });
  
  // Search drugs
  Object.keys(DRUG_DATABASE).forEach(key => {
    const drug = DRUG_DATABASE[key];
    if (drug.name.toLowerCase().includes(query) ||
        drug.category.toLowerCase().includes(query)) {
      results.push({
        type: 'drug',
        id: key,
        name: drug.name,
        category: drug.category
      });
    }
  });
  
  // Display results (you can enhance this)
  console.log('Search results:', results);
}

// Toggle favorite
function toggleFavorite(calcId) {
  calcStorage.toggleFavorite(calcId);
  
  // Update UI
  const button = event.currentTarget;
  const icon = button.querySelector('i');
  
  if (icon.classList.contains('far')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    button.classList.add('active');
    showToast('Added to favorites', 'success');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    button.classList.remove('active');
    showToast('Removed from favorites', 'success');
  }
  
  loadFavorites();
}

// Load favorites
function loadFavorites() {
  const favorites = calcStorage.getFavorites();
  const containers = [
    document.getElementById('favorites-grid'),
    document.getElementById('all-favorites')
  ];
  
  containers.forEach(container => {
    if (!container) return;
    
    if (favorites.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--gray-400);">No favorite calculators yet. Click the star icon on any calculator to add it here.</p>';
      return;
    }
    
    let html = '';
    favorites.forEach(calcId => {
      const calc = CALCULATORS[calcId];
      if (!calc) return;
      
      html += `
        <div class="calc-card" onclick="openCalculator('${calcId}')">
          <div class="calc-icon"><i class="fas ${calc.icon}"></i></div>
          <h3>${calc.name}</h3>
          <p>${calc.category}</p>
          <button class="calc-favorite active" onclick="event.stopPropagation(); toggleFavorite('${calcId}')">
            <i class="fas fa-star"></i>
          </button>
        </div>
      `;
    });
    
    container.innerHTML = html;
  });
}

// Load history
function loadHistory() {
  const history = calcStorage.getHistory(20);
  const containers = [
    document.getElementById('recent-calculations'),
    document.getElementById('full-history')
  ];
  
  containers.forEach(container => {
    if (!container) return;
    
    if (history.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: var(--gray-400); padding: 2rem;">No calculation history yet.</p>';
      return;
    }
    
    let html = '';
    history.forEach(entry => {
      const calc = CALCULATORS[entry.calculatorId];
      const timeAgo = getTimeAgo(new Date(entry.timestamp));
      
      html += `
        <div class="recent-item">
          <i class="fas ${calc?.icon || 'fa-calculator'}"></i>
          <div class="recent-info">
            <strong>${entry.calculatorName}</strong>
            <p>Result: ${JSON.stringify(entry.result).substring(0, 100)}</p>
          </div>
          <small>${timeAgo}</small>
        </div>
      `;
    });
    
    container.innerHTML = html;
  });
}

// Clear history
function clearHistory() {
  if (confirm('Clear all calculation history?')) {
    calcStorage.clearHistory();
    loadHistory();
    showToast('History cleared', 'success');
  }
}

// Time ago helper
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Show profile
function showProfile() {
  showToast('Profile feature coming soon', 'info');
  document.getElementById('user-menu-panel').classList.add('hidden');
}

// Show settings
function showSettings() {
  showToast('Settings feature coming soon', 'info');
  document.getElementById('user-menu-panel').classList.add('hidden');
}

// Show activity
function showActivity() {
  showSection('history');
  document.getElementById('user-menu-panel').classList.add('hidden');
}

// Show emergency
function showEmergency() {
  showSection('er');
  showToast('Emergency section activated', 'warning');
}

// PDF Functions
function filterPDFs(category) {
  const pdfs = pdfStorage.getPDFs(category);
  const grid = document.getElementById('pdf-grid');
  
  // Update active button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Display PDFs (simplified - you can enhance)
  console.log('Filtered PDFs:', pdfs);
}

function openUploadModal() {
  document.getElementById('upload-modal').classList.add('active');
}

function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('active');
}

function handlePDFUpload(event) {
  event.preventDefault();
  
  const title = document.getElementById('pdf-title').value;
  const category = document.getElementById('pdf-category').value;
  const description = document.getElementById('pdf-description').value;
  const file = document.getElementById('pdf-file').files[0];
  
  if (!file) {
    showToast('Please select a file', 'error');
    return;
  }
  
  // In a real app, you'd upload to a server
  // For now, just save metadata
  pdfStorage.savePDF({
    title,
    category,
    description,
    fileName: file.name,
    fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
  });
  
  showToast('PDF uploaded successfully', 'success');
  closeUploadModal();
  
  // Add notification
  notificationStorage.addNotification(
    'success',
    'PDF Uploaded Successfully',
    `${title} has been added to the library`
  );
}

function viewPDF(fileName) {
  showToast('PDF viewer feature coming soon', 'info');
}

function downloadPDF(fileName) {
  showToast('Download feature coming soon', 'info');
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Export functions
window.toggleSidebar = toggleSidebar;
window.toggleNotifications = toggleNotifications;
window.toggleUserMenu = toggleUserMenu;
window.clearNotifications = clearNotifications;
window.toggleTheme = toggleTheme;
window.showSection = showSection;
window.globalSearch = globalSearch;
window.toggleFavorite = toggleFavorite;
window.loadFavorites = loadFavorites;
window.loadHistory = loadHistory;
window.clearHistory = clearHistory;
window.showToast = showToast;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.showActivity = showActivity;
window.showEmergency = showEmergency;
window.filterPDFs = filterPDFs;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.handlePDFUpload = handlePDFUpload;
window.viewPDF = viewPDF;
window.downloadPDF = downloadPDF;