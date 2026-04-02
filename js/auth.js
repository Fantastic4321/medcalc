// ==========================================
// AUTH.JS - Authentication & User Management
// ==========================================

// User Management
class AuthManager {
  constructor() {
    this.currentUserKey = 'medcalc_current_user';
    this.usersKey = 'medcalc_users';
    this.initDefaultAdmin();
  }

  // Initialize default admin account
  initDefaultAdmin() {
    const users = this.getUsers();
    if (users.length === 0) {
      this.register({
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'admin',
        department: 'general'
      });
    }
  }

  // Register new user
  register(userData) {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: this.hashPassword(userData.password),
      role: userData.role,
      department: userData.department,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    return { success: true, message: 'Registration successful', user: newUser };
  }

  // Login user
  login(email, password, rememberMe = false) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: 'Incorrect password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Set current user
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rememberMe: rememberMe
    };

    if (rememberMe) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(userSession));
    } else {
      sessionStorage.setItem(this.currentUserKey, JSON.stringify(userSession));
    }

    return { success: true, message: 'Login successful', user: userSession };
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.currentUserKey);
    sessionStorage.removeItem(this.currentUserKey);
  }

  // Get current user
  getCurrentUser() {
    const localUser = localStorage.getItem(this.currentUserKey);
    const sessionUser = sessionStorage.getItem(this.currentUserKey);
    
    const userStr = localUser || sessionUser;
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Get all users (admin only)
  getUsers() {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  // Simple password hashing (in production, use proper encryption)
  hashPassword(password) {
    // This is a simple hash - in production use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Update user profile
  updateProfile(userId, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Update current session if it's the current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedSession = { ...currentUser, ...updates };
      if (currentUser.rememberMe) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(updatedSession));
      } else {
        sessionStorage.setItem(this.currentUserKey, JSON.stringify(updatedSession));
      }
    }

    return { success: true, message: 'Profile updated' };
  }
}

// Initialize auth manager
const authManager = new AuthManager();

// Login Handler
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;

  const result = authManager.login(email, password, rememberMe);

  if (result.success) {
    showToast('Login successful! Welcome back.', 'success');
    setTimeout(() => {
      initializeApp();
    }, 500);
  } else {
    showToast(result.message, 'error');
  }
}

// Register Handler
function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const role = document.getElementById('register-role').value;
  const department = document.getElementById('register-department').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;

  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  const result = authManager.register({
    name, email, role, department, password
  });

  if (result.success) {
    showToast('Registration successful! Please login.', 'success');
    setTimeout(() => {
      showLogin();
    }, 1000);
  } else {
    showToast(result.message, 'error');
  }
}

// Logout Handler
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    authManager.logout();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
      location.reload();
    }, 500);
  }
}

// Get current user (helper function)
function getCurrentUser() {
  return authManager.getCurrentUser();
}

// Show login form
function showLogin() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}

// Show register form
function showRegister() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

// Initialize app after login
function initializeApp() {
  const user = getCurrentUser();
  
  if (!user) {
    // Show auth section
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    return;
  }

  // Hide auth, show main app
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('loading-screen').classList.add('hidden');

  // Set user info
  document.getElementById('user-name').textContent = user.name.split(' ')[0];
  document.getElementById('dashboard-user-name').textContent = user.name;
  document.getElementById('menu-user-name').textContent = user.name;
  document.getElementById('menu-user-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  // Update user avatars
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e40af&color=fff`;
  document.querySelectorAll('.user-avatar').forEach(img => {
    img.src = avatarUrl;
  });

  // Show/hide admin features
  if (user.role !== 'admin') {
    const adminElements = document.querySelectorAll('#admin-upload');
    adminElements.forEach(el => el.style.display = 'none');
  }

  // Update notification badge
  notificationStorage.updateBadge();

  // Load favorites
  loadFavorites();

  // Load history
  loadHistory();
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initializeApp();
  }, 1000); // Simulate loading
});

// Export for use in other files
window.authManager = authManager;
window.getCurrentUser = getCurrentUser;