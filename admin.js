document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // API Configuration
  const DEFAULT_API_URL = 'http://localhost:8080';
  let apiUrl = localStorage.getItem('portfolioApiUrl') || DEFAULT_API_URL;

  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Forms and Inputs
  const profileForm = document.getElementById('profile-form');
  const socialsForm = document.getElementById('socials-form');
  const savePhotoBtn = document.getElementById('save-photo-btn');
  const saveApiBtn = document.getElementById('save-api-btn');
  const avatarUpload = document.getElementById('avatar-upload');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarUrlDisplay = document.getElementById('avatar-url-display');
  const apiBaseUrlInput = document.getElementById('api-base-url');

  // Set API Base Url in config tab
  apiBaseUrlInput.value = apiUrl;

  // Global State
  let portfolioDetails = null;

  // Helper to show messages
  const showToast = (msg, isError = false) => {
    toastMessage.textContent = msg;
    toast.style.borderColor = isError ? '#ff4d4d' : 'var(--primary)';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  };

  // Helper to get headers with JWT token
  const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('portfolioToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    return headers;
  };

  // Check Auth State on load
  const checkAuth = () => {
    const token = localStorage.getItem('portfolioToken');
    if (token) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      loadPortfolioDetails();
    } else {
      loginSection.style.display = 'block';
      dashboardSection.style.display = 'none';
    }
  };

  // Sidebar Tab Switcher
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  const formSections = document.querySelectorAll('.admin-form-section');

  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      formSections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.getAttribute('id') === target) {
          sec.classList.add('active');
        }
      });
    });
  });

  // Login Logic
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('portfolioToken', data.token);
        showToast('Login successful!');
        checkAuth();
      } else {
        const text = await response.text();
        showToast(text || 'Login failed. Invalid credentials.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not connect to the API server.', true);
    }
  });

  // Logout Logic
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('portfolioToken');
    showToast('Logged out successfully.');
    checkAuth();
  });

  // Load Portfolio Details from DB
  const loadPortfolioDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/portfolio`);
      if (response.ok) {
        portfolioDetails = await response.json();
        populateFields(portfolioDetails);
      } else {
        showToast('Failed to load portfolio details from database.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading details. Make sure your server is online.', true);
    }
  };

  // Populate form fields
  const populateFields = (data) => {
    if (!data) return;
    
    // Section 1: Core Details
    document.getElementById('profile-name').value = data.name || '';
    document.getElementById('profile-title').value = data.heroTitle || '';
    document.getElementById('profile-subtitle').value = data.heroSubtitle || '';
    document.getElementById('profile-bio').value = data.bio || '';
    document.getElementById('profile-exp').value = data.yearsExperience || '';
    document.getElementById('profile-projects').value = data.coreProjectsCount || '';
    document.getElementById('profile-academic').value = data.academicStand || '';

    // Section 2: Avatar
    if (data.avatarUrl) {
      avatarPreview.src = data.avatarUrl;
      avatarUrlDisplay.value = data.avatarUrl;
    }

    // Section 3: Socials & Contact
    document.getElementById('social-github').value = data.githubUrl || '';
    document.getElementById('social-linkedin').value = data.linkedinUrl || '';
    document.getElementById('social-email').value = data.email || '';
    document.getElementById('social-phone').value = data.phone || '';
    document.getElementById('social-location').value = data.location || '';
  };

  // Save Profile Details
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!portfolioDetails) portfolioDetails = {};

    portfolioDetails.name = document.getElementById('profile-name').value;
    portfolioDetails.heroTitle = document.getElementById('profile-title').value;
    portfolioDetails.heroSubtitle = document.getElementById('profile-subtitle').value;
    portfolioDetails.bio = document.getElementById('profile-bio').value;
    portfolioDetails.yearsExperience = document.getElementById('profile-exp').value;
    portfolioDetails.coreProjectsCount = document.getElementById('profile-projects').value;
    portfolioDetails.academicStand = document.getElementById('profile-academic').value;

    await saveDetails(portfolioDetails, 'Profile details updated!');
  });

  // Save Social Details
  socialsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!portfolioDetails) portfolioDetails = {};

    portfolioDetails.githubUrl = document.getElementById('social-github').value;
    portfolioDetails.linkedinUrl = document.getElementById('social-linkedin').value;
    portfolioDetails.email = document.getElementById('social-email').value;
    portfolioDetails.phone = document.getElementById('social-phone').value;
    portfolioDetails.location = document.getElementById('social-location').value;

    await saveDetails(portfolioDetails, 'Socials & Contact details updated!');
  });

  // Upload Avatar Image directly to Spring Boot -> Cloudinary
  avatarUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview before upload finishes
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      showToast('Uploading photo to Cloudinary...');
      const response = await fetch(`${apiUrl}/api/portfolio/upload-image`, {
        method: 'POST',
        headers: getAuthHeaders(null), // Empty Content-Type, browser sets boundary
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        avatarUrlDisplay.value = data.url;
        avatarPreview.src = data.url;
        showToast('Image uploaded to Cloudinary successfully! Press Save to apply.');
      } else {
        let errMsg = 'Image upload failed.';
        try {
          const resJson = await response.json();
          if (resJson && resJson.error) errMsg = resJson.error;
        } catch(e) {}
        showToast(errMsg, true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading image to server.', true);
    }
  });

  // Save Photo Config
  savePhotoBtn.addEventListener('click', async () => {
    if (!portfolioDetails) portfolioDetails = {};
    const url = avatarUrlDisplay.value;
    if (!url) {
      showToast('Please upload an image first.', true);
      return;
    }

    portfolioDetails.avatarUrl = url;
    await saveDetails(portfolioDetails, 'Avatar photo configuration saved!');
  });

  // Save Endpoint Config
  saveApiBtn.addEventListener('click', () => {
    const newUrl = apiBaseUrlInput.value.trim();
    if (!newUrl) return;
    localStorage.setItem('portfolioApiUrl', newUrl);
    apiUrl = newUrl;
    showToast('API Server endpoint updated!');
    loadPortfolioDetails();
  });

  // Put request to save whole details
  const saveDetails = async (data, successMessage) => {
    try {
      const response = await fetch(`${apiUrl}/api/portfolio`, {
        method: 'PUT',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        portfolioDetails = await response.json();
        populateFields(portfolioDetails);
        showToast(successMessage);
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to save configurations.', true);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to save details.', true);
    }
  };

  // Initial Run
  checkAuth();
});
