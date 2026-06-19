document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // API Configuration
  const DEFAULT_API_URL = `${window.location.protocol}//${window.location.hostname}:8080`;
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

  // Project Form and Inputs
  const projectForm = document.getElementById('project-form');
  const projIdInput = document.getElementById('proj-id');
  const projTitleInput = document.getElementById('proj-title');
  const projTagInput = document.getElementById('proj-tag');
  const projDateInput = document.getElementById('proj-date');
  const projProjectUrlInput = document.getElementById('proj-project-url');
  const projCategorySelect = document.getElementById('proj-category');
  const projTechStackInput = document.getElementById('proj-tech-stack');
  const projImagePreview = document.getElementById('proj-image-preview');
  const projImageUpload = document.getElementById('proj-image-upload');
  const projImageUrlInput = document.getElementById('proj-image-url');
  const projDescInput = document.getElementById('proj-description');
  const projSubmitBtn = document.getElementById('proj-submit-btn');
  const projCancelBtn = document.getElementById('proj-cancel-btn');
  const projectFormTitle = document.getElementById('project-form-title');

  // Skill Form and Inputs
  const skillForm = document.getElementById('skill-form');
  const skillIdInput = document.getElementById('skill-id');
  const skillNameInput = document.getElementById('skill-name');
  const skillCategorySelect = document.getElementById('skill-category');
  const skillIconInput = document.getElementById('skill-icon');
  const skillIconColorSelect = document.getElementById('skill-icon-color');
  const skillSubmitBtn = document.getElementById('skill-submit-btn');
  const skillCancelBtn = document.getElementById('skill-cancel-btn');
  const skillFormTitle = document.getElementById('skill-form-title');

  // Set API Base Url in config tab
  apiBaseUrlInput.value = apiUrl;

  // Login API settings toggle and save
  const toggleApiSettingsBtn = document.getElementById('toggle-api-settings');
  const loginApiContainer = document.getElementById('login-api-container');
  const loginApiUrlInput = document.getElementById('login-api-url');
  const saveLoginApiBtn = document.getElementById('save-login-api');

  if (toggleApiSettingsBtn && loginApiContainer) {
    toggleApiSettingsBtn.addEventListener('click', () => {
      const isHidden = loginApiContainer.style.display === 'none' || !loginApiContainer.style.display;
      loginApiContainer.style.display = isHidden ? 'block' : 'none';
      if (isHidden && loginApiUrlInput) {
        loginApiUrlInput.value = localStorage.getItem('portfolioApiUrl') || DEFAULT_API_URL;
      }
    });
  }

  if (saveLoginApiBtn && loginApiUrlInput) {
    saveLoginApiBtn.addEventListener('click', () => {
      const newUrl = loginApiUrlInput.value.trim().replace(/\/+$/, ""); // Trim and remove trailing slashes
      if (newUrl) {
        localStorage.setItem('portfolioApiUrl', newUrl);
        apiUrl = newUrl;
        if (apiBaseUrlInput) apiBaseUrlInput.value = newUrl;
        showToast('API URL updated successfully!');
        loginApiContainer.style.display = 'none';
      }
    });
  }

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

  // Helper to toggle navbar visibility depending on auth state
  const navMenu = document.getElementById('nav-menu');
  const mobileToggle = document.getElementById('mobile-toggle');

  const toggleNavbarAuth = (isAuthenticated) => {
    if (navMenu) navMenu.style.display = isAuthenticated ? 'flex' : 'none';
    if (logoutBtn) logoutBtn.style.display = isAuthenticated ? 'inline-flex' : 'none';
    if (mobileToggle) mobileToggle.style.display = isAuthenticated ? 'inline-flex' : 'none';
  };

  // Check Auth State on load
  let checkAuth = () => {
    const token = localStorage.getItem('portfolioToken');
    if (token) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      toggleNavbarAuth(true);
      loadPortfolioDetails();
    } else {
      loginSection.style.display = 'flex';
      dashboardSection.style.display = 'none';
      toggleNavbarAuth(false);
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
  const handleLogout = () => {
    localStorage.removeItem('portfolioToken');
    showToast('Logged out successfully.');
    checkAuth();
  };

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

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
        } catch (e) { }
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

  // ==========================================================================
  // EXPERIENCE TIMELINE ACTIONS (CRUD)
  // ==========================================================================
  let experiences = [];
  const expListContainer = document.getElementById('experience-list-container');
  const expForm = document.getElementById('experience-form');
  const expIdInput = document.getElementById('exp-id');
  const expRoleInput = document.getElementById('exp-role');
  const expDurationInput = document.getElementById('exp-duration');
  const expDescInput = document.getElementById('exp-description');
  const expSubmitBtn = document.getElementById('exp-submit-btn');
  const expCancelBtn = document.getElementById('exp-cancel-btn');
  const expFormTitle = document.getElementById('experience-form-title');

  const loadExperiences = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/experiences`);
      if (response.ok) {
        experiences = await response.json();
        renderExperiencesAdmin();
      } else {
        showToast('Failed to load experiences.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading experiences. Make sure your server is online.', true);
    }
  };

  const renderExperiencesAdmin = () => {
    if (!expListContainer) return;
    expListContainer.innerHTML = '';

    if (experiences.length === 0) {
      expListContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No experiences defined yet.</p>';
      return;
    }

    experiences.forEach((exp, index) => {
      const card = document.createElement('div');
      card.className = 'experience-card-admin';

      const isFirst = index === 0;
      const isLast = index === experiences.length - 1;

      card.innerHTML = `
        <div class="card-info-admin">
          <h5 style="margin: 0; color: var(--text-primary); font-weight: 600;">${exp.role}</h5>
          <span style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">${exp.duration}</span>
        </div>
        <div class="card-actions-admin" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="admin-btn-icon move-up-btn" data-index="${index}" ${isFirst ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Up">
            <i data-lucide="arrow-up"></i>
          </button>
          <button type="button" class="admin-btn-icon move-down-btn" data-index="${index}" ${isLast ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Down">
            <i data-lucide="arrow-down"></i>
          </button>
          <button type="button" class="admin-btn-icon edit-btn" data-id="${exp.id}" aria-label="Edit item">
            <i data-lucide="edit-3"></i>
          </button>
          <button type="button" class="admin-btn-icon delete delete-btn" data-id="${exp.id}" aria-label="Delete item">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
      expListContainer.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Attach reordering events
    expListContainer.querySelectorAll('.move-up-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index > 0) {
          const temp = experiences[index];
          experiences[index] = experiences[index - 1];
          experiences[index - 1] = temp;
          await saveNewOrder();
        }
      });
    });

    expListContainer.querySelectorAll('.move-down-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index < experiences.length - 1) {
          const temp = experiences[index];
          experiences[index] = experiences[index + 1];
          experiences[index + 1] = temp;
          await saveNewOrder();
        }
      });
    });

    // Attach actions
    expListContainer.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const exp = experiences.find(e => e.id === id);
        if (exp) {
          prepareEditExperience(exp);
        }
      });
    });

    expListContainer.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this experience milestone?')) {
          await deleteExperience(id);
        }
      });
    });

    if (window.attachCursorListeners) {
      window.attachCursorListeners(expListContainer);
    }
  };

  const saveNewOrder = async () => {
    const orderedIds = experiences.map(exp => exp.id);
    try {
      showToast('Saving timeline order...');
      const response = await fetch(`${apiUrl}/api/experiences/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(orderedIds)
      });

      if (response.ok) {
        showToast('Timeline reordered successfully!');
        renderExperiencesAdmin();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to save new order.', true);
          await loadExperiences(); // Rollback on error
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to save reordered timeline.', true);
      await loadExperiences(); // Rollback on error
    }
  };

  const prepareEditExperience = (exp) => {
    expIdInput.value = exp.id;
    expRoleInput.value = exp.role;
    expDurationInput.value = exp.duration;
    expDescInput.value = exp.description;

    expFormTitle.textContent = 'Edit Experience';
    expSubmitBtn.innerHTML = `<span>Update Experience</span> <i data-lucide="check"></i>`;
    expCancelBtn.style.display = 'inline-flex';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Focus first input field and scroll to it
    expRoleInput.focus();
  };

  const resetExperienceForm = () => {
    expIdInput.value = '';
    expForm.reset();
    expFormTitle.textContent = 'Add New Experience';
    expSubmitBtn.innerHTML = `<span>Add Experience</span> <i data-lucide="plus"></i>`;
    expCancelBtn.style.display = 'none';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  if (expCancelBtn) {
    expCancelBtn.addEventListener('click', resetExperienceForm);
  }

  // Handle Form Submit
  if (expForm) {
    expForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = expIdInput.value;
      const role = expRoleInput.value.trim();
      const duration = expDurationInput.value.trim();
      const description = expDescInput.value.trim();

      const payload = { role, duration, description };

      const isEdit = id !== '';
      const url = isEdit ? `${apiUrl}/api/experiences/${id}` : `${apiUrl}/api/experiences`;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: getAuthHeaders('application/json'),
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showToast(isEdit ? 'Experience updated successfully!' : 'Experience added successfully!');
          resetExperienceForm();
          await loadExperiences();
        } else {
          if (response.status === 403 || response.status === 401) {
            showToast('Session expired. Please log in again.', true);
            localStorage.removeItem('portfolioToken');
            checkAuth();
          } else {
            showToast('Failed to save experience details.', true);
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error. Failed to save experience.', true);
      }
    });
  }

  // Handle Delete
  const deleteExperience = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null)
      });

      if (response.ok) {
        showToast('Experience milestone deleted successfully!');
        resetExperienceForm();
        await loadExperiences();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to delete experience.', true);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to delete experience.', true);
    }
  };

  // ==========================================================================
  // PROJECTS PORTFOLIO ACTIONS (CRUD & REORDER)
  // ==========================================================================
  let projects = [];
  const projectsListContainer = document.getElementById('projects-list-container');

  const loadProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      if (response.ok) {
        projects = await response.json();
        renderProjectsAdmin();
      } else {
        showToast('Failed to load projects.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading projects. Make sure your server is online.', true);
    }
  };

  const renderProjectsAdmin = () => {
    if (!projectsListContainer) return;
    projectsListContainer.innerHTML = '';

    if (projects.length === 0) {
      projectsListContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No projects defined yet.</p>';
      return;
    }

    projects.forEach((proj, index) => {
      const card = document.createElement('div');
      card.className = 'project-card-admin';

      const isFirst = index === 0;
      const isLast = index === projects.length - 1;

      card.innerHTML = `
        <div class="card-info-admin">
          <img src="${proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}" alt="${proj.title}" class="project-thumbnail-admin">
          <div class="card-info-text-admin">
            <h5 style="margin: 0; color: var(--text-primary); font-weight: 600;">${proj.title}</h5>
            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">${proj.tag} (${proj.date})</span>
          </div>
        </div>
        <div class="card-actions-admin" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="admin-btn-icon move-up-proj-btn" data-index="${index}" ${isFirst ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Up">
            <i data-lucide="arrow-up"></i>
          </button>
          <button type="button" class="admin-btn-icon move-down-proj-btn" data-index="${index}" ${isLast ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Down">
            <i data-lucide="arrow-down"></i>
          </button>
          <button type="button" class="admin-btn-icon edit-proj-btn" data-id="${proj.id}" aria-label="Edit item">
            <i data-lucide="edit-3"></i>
          </button>
          <button type="button" class="admin-btn-icon delete delete-proj-btn" data-id="${proj.id}" aria-label="Delete item">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
      projectsListContainer.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Attach reordering events
    projectsListContainer.querySelectorAll('.move-up-proj-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index > 0) {
          const temp = projects[index];
          projects[index] = projects[index - 1];
          projects[index - 1] = temp;
          await saveNewProjectsOrder();
        }
      });
    });

    projectsListContainer.querySelectorAll('.move-down-proj-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index < projects.length - 1) {
          const temp = projects[index];
          projects[index] = projects[index + 1];
          projects[index + 1] = temp;
          await saveNewProjectsOrder();
        }
      });
    });

    // Attach actions
    projectsListContainer.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const proj = projects.find(p => p.id === id);
        if (proj) {
          prepareEditProject(proj);
        }
      });
    });

    projectsListContainer.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this project?')) {
          await deleteProject(id);
        }
      });
    });

    if (window.attachCursorListeners) {
      window.attachCursorListeners(projectsListContainer);
    }
  };

  const saveNewProjectsOrder = async () => {
    const orderedIds = projects.map(proj => proj.id);
    try {
      showToast('Saving projects order...');
      const response = await fetch(`${apiUrl}/api/projects/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(orderedIds)
      });

      if (response.ok) {
        showToast('Projects reordered successfully!');
        renderProjectsAdmin();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to save new project order.', true);
          await loadProjects(); // Rollback on error
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to save reordered projects.', true);
      await loadProjects(); // Rollback on error
    }
  };

  const prepareEditProject = (proj) => {
    projIdInput.value = proj.id;
    projTitleInput.value = proj.title || '';
    projTagInput.value = proj.tag || '';
    projDateInput.value = proj.date || '';
    projProjectUrlInput.value = proj.projectUrl || '';
    projCategorySelect.value = proj.category || '';
    projTechStackInput.value = proj.techStack || '';
    projImageUrlInput.value = proj.imageUrl || '';
    projImagePreview.src = proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    projDescInput.value = proj.description || '';

    projectFormTitle.textContent = 'Edit Project';
    projSubmitBtn.innerHTML = `<span>Update Project</span> <i data-lucide="check"></i>`;
    projCancelBtn.style.display = 'inline-flex';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    projTitleInput.focus();
  };

  const resetProjectForm = () => {
    projIdInput.value = '';
    projectForm.reset();
    projImagePreview.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    projectFormTitle.textContent = 'Add New Project';
    projSubmitBtn.innerHTML = `<span>Add Project</span> <i data-lucide="plus"></i>`;
    projCancelBtn.style.display = 'none';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  if (projCancelBtn) {
    projCancelBtn.addEventListener('click', resetProjectForm);
  }

  // Upload Project Image directly to Spring Boot -> Cloudinary
  if (projImageUpload) {
    projImageUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Local preview before upload finishes
      const reader = new FileReader();
      reader.onload = (event) => {
        projImagePreview.src = event.target.result;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        showToast('Uploading screenshot to Cloudinary...');
        const response = await fetch(`${apiUrl}/api/portfolio/upload-image`, {
          method: 'POST',
          headers: getAuthHeaders(null),
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          projImageUrlInput.value = data.url;
          projImagePreview.src = data.url;
          showToast('Project screenshot uploaded successfully!');
        } else {
          let errMsg = 'Screenshot upload failed.';
          try {
            const resJson = await response.json();
            if (resJson && resJson.error) errMsg = resJson.error;
          } catch (e) { }
          showToast(errMsg, true);
        }
      } catch (err) {
        console.error(err);
        showToast('Error uploading screenshot to server.', true);
      }
    });
  }

  // Handle Project Form Submit
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = projIdInput.value;
      const title = projTitleInput.value.trim();
      const tag = projTagInput.value.trim();
      const date = projDateInput.value.trim();
      const projectUrl = projProjectUrlInput.value.trim();
      const category = projCategorySelect.value;
      const techStack = projTechStackInput.value.trim();
      const imageUrl = projImageUrlInput.value.trim();
      const description = projDescInput.value.trim();

      const payload = { title, tag, date, projectUrl, category, techStack, imageUrl, description };

      const isEdit = id !== '';
      const url = isEdit ? `${apiUrl}/api/projects/${id}` : `${apiUrl}/api/projects`;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: getAuthHeaders('application/json'),
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showToast(isEdit ? 'Project updated successfully!' : 'Project added successfully!');
          resetProjectForm();
          await loadProjects();
        } else {
          if (response.status === 403 || response.status === 401) {
            showToast('Session expired. Please log in again.', true);
            localStorage.removeItem('portfolioToken');
            checkAuth();
          } else {
            showToast('Failed to save project details.', true);
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error. Failed to save project.', true);
      }
    });
  }

  // Handle Delete
  const deleteProject = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null)
      });

      if (response.ok) {
        showToast('Project deleted successfully!');
        resetProjectForm();
        await loadProjects();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to delete project.', true);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to delete project.', true);
    }
  };

  // Modify checkAuth to trigger loading experiences & projects
  const oldCheckAuth = checkAuth;
  checkAuth = () => {
    const token = localStorage.getItem('portfolioToken');
    if (token) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      toggleNavbarAuth(true);
      loadPortfolioDetails();
      loadExperiences();
      loadProjects();
      loadSkills();
    } else {
      loginSection.style.display = 'flex';
      dashboardSection.style.display = 'none';
      toggleNavbarAuth(false);
    }
  };

  // ==========================================================================
  // SKILLSET INVENTORY ACTIONS (CRUD & REORDER)
  // ==========================================================================
  let skills = [];
  const skillsListContainer = document.getElementById('skills-list-container');

  const loadSkills = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/skills`);
      if (response.ok) {
        skills = await response.json();
        renderSkillsAdmin();
      } else {
        showToast('Failed to load skills.', true);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading skills. Make sure your server is online.', true);
    }
  };

  const renderSkillsAdmin = () => {
    if (!skillsListContainer) return;
    skillsListContainer.innerHTML = '';

    if (skills.length === 0) {
      skillsListContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No skills defined yet.</p>';
      return;
    }

    skills.forEach((skill, index) => {
      const card = document.createElement('div');
      card.className = 'skill-card-admin';

      const isFirst = index === 0;
      const isLast = index === skills.length - 1;

      card.innerHTML = `
        <div class="card-info-admin">
          <i data-lucide="${skill.icon || 'award'}" class="${skill.iconColor || 'var(--primary)'}" style="width: 24px; height: 24px;"></i>
          <div class="card-info-text-admin">
            <h5 style="margin: 0; color: var(--text-primary); font-weight: 600;">${skill.name}</h5>
            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">${skill.category}</span>
          </div>
        </div>
        <div class="card-actions-admin" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="admin-btn-icon move-up-skill-btn" data-index="${index}" ${isFirst ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Up">
            <i data-lucide="arrow-up"></i>
          </button>
          <button type="button" class="admin-btn-icon move-down-skill-btn" data-index="${index}" ${isLast ? 'disabled style="opacity: 0.25; cursor: not-allowed;"' : ''} aria-label="Move Down">
            <i data-lucide="arrow-down"></i>
          </button>
          <button type="button" class="admin-btn-icon edit-skill-btn" data-id="${skill.id}" aria-label="Edit item">
            <i data-lucide="edit-3"></i>
          </button>
          <button type="button" class="admin-btn-icon delete delete-skill-btn" data-id="${skill.id}" aria-label="Delete item">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;
      skillsListContainer.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Attach reordering events
    skillsListContainer.querySelectorAll('.move-up-skill-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index > 0) {
          const temp = skills[index];
          skills[index] = skills[index - 1];
          skills[index - 1] = temp;
          await saveNewSkillsOrder();
        }
      });
    });

    skillsListContainer.querySelectorAll('.move-down-skill-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (index < skills.length - 1) {
          const temp = skills[index];
          skills[index] = skills[index + 1];
          skills[index + 1] = temp;
          await saveNewSkillsOrder();
        }
      });
    });

    // Attach actions
    skillsListContainer.querySelectorAll('.edit-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const skill = skills.find(s => s.id === id);
        if (skill) {
          prepareEditSkill(skill);
        }
      });
    });

    skillsListContainer.querySelectorAll('.delete-skill-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this skill?')) {
          await deleteSkill(id);
        }
      });
    });

    if (window.attachCursorListeners) {
      window.attachCursorListeners(skillsListContainer);
    }
  };

  const saveNewSkillsOrder = async () => {
    const orderedIds = skills.map(s => s.id);
    try {
      showToast('Saving skills order...');
      const response = await fetch(`${apiUrl}/api/skills/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders('application/json'),
        body: JSON.stringify(orderedIds)
      });

      if (response.ok) {
        showToast('Skillset reordered successfully!');
        renderSkillsAdmin();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to save new skillset order.', true);
          await loadSkills(); // Rollback
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to save reordered skillset.', true);
      await loadSkills(); // Rollback
    }
  };

  const prepareEditSkill = (skill) => {
    skillIdInput.value = skill.id;
    skillNameInput.value = skill.name || '';
    skillCategorySelect.value = skill.category || '';
    skillIconInput.value = skill.icon || '';
    skillIconColorSelect.value = skill.iconColor || '';

    skillFormTitle.textContent = 'Edit Skill';
    skillSubmitBtn.innerHTML = `<span>Update Skill</span> <i data-lucide="check"></i>`;
    skillCancelBtn.style.display = 'inline-flex';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    skillNameInput.focus();
  };

  const resetSkillForm = () => {
    skillIdInput.value = '';
    skillForm.reset();
    skillFormTitle.textContent = 'Add New Skill';
    skillSubmitBtn.innerHTML = `<span>Add Skill</span> <i data-lucide="plus"></i>`;
    skillCancelBtn.style.display = 'none';
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  if (skillCancelBtn) {
    skillCancelBtn.addEventListener('click', resetSkillForm);
  }

  // Handle Skill Form Submit
  if (skillForm) {
    skillForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = skillIdInput.value;
      const name = skillNameInput.value.trim();
      const category = skillCategorySelect.value;
      const icon = skillIconInput.value.trim();
      const iconColor = skillIconColorSelect.value;

      const payload = { name, category, icon, iconColor };

      const isEdit = id !== '';
      const url = isEdit ? `${apiUrl}/api/skills/${id}` : `${apiUrl}/api/skills`;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: getAuthHeaders('application/json'),
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showToast(isEdit ? 'Skill updated successfully!' : 'Skill added successfully!');
          resetSkillForm();
          await loadSkills();
        } else {
          if (response.status === 403 || response.status === 401) {
            showToast('Session expired. Please log in again.', true);
            localStorage.removeItem('portfolioToken');
            checkAuth();
          } else {
            showToast('Failed to save skill details.', true);
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error. Failed to save skill.', true);
      }
    });
  }

  // Handle Delete
  const deleteSkill = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(null)
      });

      if (response.ok) {
        showToast('Skill deleted successfully!');
        resetSkillForm();
        await loadSkills();
      } else {
        if (response.status === 403 || response.status === 401) {
          showToast('Session expired. Please log in again.', true);
          localStorage.removeItem('portfolioToken');
          checkAuth();
        } else {
          showToast('Failed to delete skill.', true);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to delete skill.', true);
    }
  };

  // ==========================================================================
  // THEME SWITCHING (DARK / LIGHT)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const navbarMobileToggle = document.getElementById('mobile-toggle');
  const navBarMenu = document.getElementById('nav-menu');

  if (navbarMobileToggle && navBarMenu) {
    navbarMobileToggle.addEventListener('click', () => {
      navbarMobileToggle.classList.toggle('active');
      navBarMenu.classList.toggle('active');
    });
  }

  // ==========================================================================
  // CUSTOM CURSOR TRACKING
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  if (cursor && cursorGlow) {
    if (window.matchMedia('(pointer: coarse)').matches) {
      cursor.style.display = 'none';
      cursorGlow.style.display = 'none';
    } else {
      let mouseX = 0;
      let mouseY = 0;
      let glowX = 0;
      let glowY = 0;
      let isMoving = false;
      let hasMoved = false;

      // Permanently disable custom cursor if user interacts via touch screen
      document.addEventListener('touchstart', () => {
        cursor.style.display = 'none';
        cursorGlow.style.display = 'none';
      }, { once: true });

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        
        if (!hasMoved) {
          hasMoved = true;
          cursor.style.opacity = '1';
          cursorGlow.style.opacity = '1';
        }
        
        if (!isMoving) {
          isMoving = true;
          requestAnimationFrame(updateGlow);
        }
      });

      const updateGlow = () => {
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.15;
        glowY += dy * 0.15;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          glowX = mouseX;
          glowY = mouseY;
          cursorGlow.style.left = `${glowX}px`;
          cursorGlow.style.top = `${glowY}px`;
          isMoving = false;
        } else {
          requestAnimationFrame(updateGlow);
        }
      };

      const attachCursorListeners = (container = document) => {
        const interactiveElements = container.querySelectorAll('a, button, input, textarea, select, .sidebar-btn, .admin-btn-icon');
        interactiveElements.forEach(el => {
          if (el.dataset.cursorBound) return;
          el.dataset.cursorBound = 'true';

          el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'var(--secondary)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorGlow.style.borderColor = 'var(--secondary-glow)';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'var(--primary)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.borderColor = 'var(--primary-glow)';
          });
        });
      };

      attachCursorListeners();

      document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
      });
      document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      });

      // Export to window so dynamic lists can trigger re-binding
      window.attachCursorListeners = attachCursorListeners;
    }
  }

  // Initial Run
  checkAuth();
});
