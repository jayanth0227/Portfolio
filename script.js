document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // INITIALIZE LUCIDE ICONS
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // CUSTOM CURSOR TRACKING
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  if (cursor && cursorGlow) {
    // Hide custom cursor on devices with touch screens (mobile/tablets)
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
        
        // Main cursor moves instantly
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
        // Linear interpolation (lerp) for smooth lag-free delay
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.15;
        glowY += dy * 0.15;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        // Stop animation loop when close enough to save CPU resources
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

      // Hover animation triggers on interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .filter-btn, .project-card');
      interactiveElements.forEach(el => {
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

      // Click micro-interaction
      document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
      });
      document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    }
  }

  // ==========================================================================
  // THEME SWITCHING (DARK / LIGHT)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve previous choice or system default
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  htmlElement.setAttribute('data-theme', initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================================================
  // NAVBAR SCROLL & ACTIVE INDICATOR
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  let isScrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      isScrollTicking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        
        // Backdrop blur threshold
        if (scrollPos > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Scroll active navigation link update
        let currentActiveSectionId = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 120;
          const sectionHeight = section.offsetHeight;
          if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentActiveSectionId = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
            link.classList.add('active');
          }
        });
        
        isScrollTicking = false;
      });
    }
  });

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // HERO SECTION TYPEWRITER EFFECT
  // ==========================================================================
  const typingTextEl = document.getElementById('typing-text');
  if (typingTextEl) {
    const words = ["robust Spring Boot APIs", "scalable Java backends", "optimized database queries", "responsive web interfaces"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const handleTypewriter = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deletes faster than typing
      } else {
        typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      // Word finished typing
      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } 
      // Word finished deleting
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(handleTypewriter, typingSpeed);
    };

    // Begin typing
    setTimeout(handleTypewriter, 1000);
  }

  // ==========================================================================
  // SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.section-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to track it again
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================================================
  // PROJECTS CATEGORY FILTER
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active filter button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');
      const projectCards = document.querySelectorAll('.project-card');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Add subtle scale out animation before hiding
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // ==========================================================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm && statusMsg) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Real-time input checking
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
      });
    });

    const validateField = (field) => {
      const group = field.closest('.form-group');
      let isValid = true;

      if (field.required && !field.value.trim()) {
        isValid = false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          isValid = false;
        }
      }

      if (isValid) {
        group.classList.remove('invalid');
      } else {
        group.classList.add('invalid');
      }

      return isValid;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let formIsValid = true;

      // Validate all fields on submit
      inputs.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        
        // Visual submitting indicator
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span> <i data-lucide="loader-2" class="spin"></i>`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        // Web3Forms Access Key
        // Paste your Web3Forms access key inside the quotes below. Get it free from https://web3forms.com
        const WEB3FORMS_KEY = "5a143439-f547-44e0-84a8-b702f46a14fd"; 

        if (WEB3FORMS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY" || !WEB3FORMS_KEY) {
          statusMsg.innerHTML = `
            <i data-lucide="alert-circle" class="text-yellow"></i>
            <div class="msg-content">
              <h5>Key Required</h5>
              <p>Please paste your Web3Forms Access Key in script.js line 348.</p>
            </div>
          `;
          statusMsg.classList.add('active');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          setTimeout(() => {
            statusMsg.classList.remove('active');
          }, 6000);
          return;
        }

        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const subjectVal = document.getElementById('subject').value.trim();
        const messageVal = document.getElementById('message').value.trim();

        const payload = {
          access_key: WEB3FORMS_KEY,
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          from_name: "Jayanth Sai Portfolio Contact"
        };

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .then(async (response) => {
          const resData = await response.json();
          if (response.ok) {
            statusMsg.innerHTML = `
              <i data-lucide="check-circle" class="text-green"></i>
              <div class="msg-content">
                <h5>Message Sent!</h5>
                <p>Thanks for reaching out. I'll get back to you shortly.</p>
              </div>
            `;
            statusMsg.classList.add('active');
            contactForm.reset();
            
            // Clear active label invalid flags
            inputs.forEach(input => {
              const group = input.closest('.form-group');
              group.classList.remove('invalid');
            });
          } else {
            statusMsg.innerHTML = `
              <i data-lucide="alert-circle" class="text-red"></i>
              <div class="msg-content">
                <h5>Failed to Send</h5>
                <p>${resData.message || 'Something went wrong. Please try again.'}</p>
              </div>
            `;
            statusMsg.classList.add('active');
          }
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        })
        .catch((error) => {
          console.error(error);
          statusMsg.innerHTML = `
            <i data-lucide="alert-circle" class="text-red"></i>
            <div class="msg-content">
              <h5>Connection Error</h5>
              <p>Could not connect to the mail server. Please try again later.</p>
            </div>
          `;
          statusMsg.classList.add('active');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          setTimeout(() => {
            statusMsg.classList.remove('active');
          }, 6000);
        });
      }
    });
  }

  // ==========================================================================
  // UPDATE CURRENT FOOTER YEAR DYNAMICALLY
  // ==========================================================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // FETCH DYNAMIC PORTFOLIO DATA FROM BACKEND WITH STATIC FALLBACK
  // ==========================================================================
  const DEFAULT_API_URL = `${window.location.protocol}//${window.location.hostname}:8080`;
  const apiUrl = localStorage.getItem('portfolioApiUrl') || DEFAULT_API_URL;

  const loadDynamicPortfolioDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/portfolio`);
      if (response.ok) {
        const data = await response.json();
        updatePortfolioDOM(data);
      }
    } catch (err) {
      console.log('Backend not reachable. Serving static content.', err);
    }
  };

  const loadDynamicExperiences = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/experiences`);
      if (response.ok) {
        const data = await response.json();
        const timelineContainer = document.querySelector('.timeline-fullwidth .timeline');
        if (data && data.length > 0) {
          updateExperiencesDOM(data);
        } else if (timelineContainer) {
          timelineContainer.innerHTML = '<p class="timeline-empty-message" style="text-align: center; width: 100%; font-style: italic; color: var(--text-muted); opacity: 0.8; font-size: 0.95rem;">No experiences listed yet.</p>';
        }
      }
    } catch (err) {
      console.log('Backend experiences not reachable. Serving static content.', err);
    }
  };

  const updateExperiencesDOM = (experiences) => {
    const timelineContainer = document.querySelector('.timeline-fullwidth .timeline');
    if (!timelineContainer) return;

    // Clear static experience items
    timelineContainer.innerHTML = '';

    experiences.forEach((exp) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'timeline-item';

      const dotDiv = document.createElement('div');
      dotDiv.className = 'timeline-dot';

      const contentDiv = document.createElement('div');
      contentDiv.className = 'timeline-content';

      const dateSpan = document.createElement('span');
      dateSpan.className = 'timeline-date';
      dateSpan.textContent = exp.duration || '';

      const roleHeader = document.createElement('h5');
      roleHeader.textContent = exp.role || '';

      const descPara = document.createElement('p');
      descPara.textContent = exp.description || '';

      contentDiv.appendChild(dateSpan);
      contentDiv.appendChild(roleHeader);
      contentDiv.appendChild(descPara);

      itemDiv.appendChild(dotDiv);
      itemDiv.appendChild(contentDiv);

      timelineContainer.appendChild(itemDiv);
    });
  };

  const updatePortfolioDOM = (data) => {
    if (!data) return;

    // Update Hero Title
    const heroTitleEl = document.querySelector('.hero-title');
    if (heroTitleEl && data.heroTitle) {
      heroTitleEl.innerHTML = data.heroTitle;
    }

    // Update Hero Subtitle
    const heroSubtitleEl = document.querySelector('.hero-subtitle');
    if (heroSubtitleEl && data.heroSubtitle) {
      heroSubtitleEl.textContent = data.heroSubtitle;
    }

    // Update Name Logo
    const logoEl = document.getElementById('nav-logo');
    if (logoEl && data.name) {
      logoEl.innerHTML = `<span class="logo-accent">&lt;</span>${data.name}<span class="logo-accent"> /&gt;</span>`;
    }

    // Update Hero Avatar
    const avatarEl = document.querySelector('.hero-avatar');
    if (avatarEl && data.avatarUrl) {
      avatarEl.src = data.avatarUrl;
    }

    // Update About Bio (which might have newlines)
    const paragraphs = document.querySelectorAll('.about-content > p');
    if (paragraphs.length > 0 && data.bio) {
      const bioParagraphs = data.bio.split('\n\n');
      const aboutContentDiv = document.querySelector('.about-content');
      if (aboutContentDiv) {
        paragraphs.forEach(p => p.remove());
        const statsDiv = document.querySelector('.experience-stats');
        bioParagraphs.forEach(text => {
          const p = document.createElement('p');
          p.textContent = text;
          if (statsDiv) {
            aboutContentDiv.insertBefore(p, statsDiv);
          } else {
            aboutContentDiv.appendChild(p);
          }
        });
      }
    }

    // Update stats
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
      if (data.yearsExperience) {
        const num = statCards[0].querySelector('.stat-number');
        if (num) num.textContent = data.yearsExperience;
      }
      if (data.coreProjectsCount) {
        const num = statCards[1].querySelector('.stat-number');
        if (num) num.textContent = data.coreProjectsCount;
      }
      if (data.academicStand) {
        const num = statCards[2].querySelector('.stat-number');
        if (num) num.textContent = data.academicStand;
      }
    }

    // Update Contact Details
    if (data.email) {
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${data.email}`;
        if (link.textContent.includes('@')) {
          link.textContent = data.email;
        }
      });
    }

    if (data.phone) {
      const telLinks = document.querySelectorAll('a[href^="tel:"]');
      telLinks.forEach(link => {
        link.href = `tel:${data.phone.replace(/\s+/g, '')}`;
        if (link.textContent.startsWith('+') || link.textContent.match(/\d/)) {
          link.textContent = data.phone;
        }
      });
    }

    if (data.location) {
      const locationHeaders = document.querySelectorAll('.contact-details h5');
      locationHeaders.forEach(header => {
        if (header.textContent.trim() === 'Location') {
          const span = header.nextElementSibling;
          if (span) span.textContent = data.location;
        }
      });
    }

    // Social Links
    if (data.githubUrl) {
      const githubLinks = document.querySelectorAll('a[href*="github.com"]');
      githubLinks.forEach(link => {
        if (link.classList.contains('social-link') || link.textContent.trim().toLowerCase() === 'github') {
          link.href = data.githubUrl;
        }
      });
    }

    if (data.linkedinUrl) {
      const linkedinLinks = document.querySelectorAll('a[href*="linkedin.com"]');
      linkedinLinks.forEach(link => {
        if (link.classList.contains('social-link') || link.textContent.trim().toLowerCase() === 'linkedin') {
          link.href = data.linkedinUrl;
        }
      });
    }
  };

  const loadDynamicProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        const projectsContainer = document.getElementById('projects-grid');
        if (data && data.length > 0) {
          updateProjectsDOM(data);
        } else if (projectsContainer) {
          projectsContainer.innerHTML = '<p class="projects-empty-message" style="text-align: center; width: 100%; font-style: italic; color: var(--text-muted); opacity: 0.8; font-size: 0.95rem;">No projects listed yet.</p>';
        }
      }
    } catch (err) {
      console.log('Backend projects not reachable. Serving static content.', err);
    }
  };

  const updateProjectsDOM = (projects) => {
    const projectsContainer = document.getElementById('projects-grid');
    if (!projectsContainer) return;

    // Clear static project items
    projectsContainer.innerHTML = '';

    projects.forEach((proj) => {
      const article = document.createElement('article');
      article.className = 'project-card glass';
      article.setAttribute('data-category', proj.category || 'fullstack');

      // Create tech stack spans
      let techSpans = '';
      if (proj.techStack) {
        const techs = proj.techStack.split(',');
        techs.forEach(t => {
          if (t.trim()) {
            techSpans += `<span>${t.trim()}</span>\n`;
          }
        });
      }

      article.innerHTML = `
        <div class="project-img-container">
          <img src="${proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}"
            alt="${proj.title} Screenshot" class="project-img">
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span class="project-tag">${proj.tag || ''}</span>
            <span class="project-date">${proj.date || ''}</span>
          </div>
          <h3 class="project-title">${proj.title || ''}</h3>
          <p class="project-description">${proj.description || ''}</p>
          <div class="project-tech">
            ${techSpans}
          </div>
          <div class="project-footer">
            <a href="${proj.projectUrl || '#'}" target="_blank" rel="noopener noreferrer" class="project-btn-link">
              <span>View Code</span> <i data-lucide="github"></i>
            </a>
          </div>
        </div>
      `;

      projectsContainer.appendChild(article);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Re-attach hover cursor listeners to dynamic cards
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');
    if (cursor && cursorGlow && !window.matchMedia('(pointer: coarse)').matches) {
      const dynamicCards = projectsContainer.querySelectorAll('.project-card, .project-btn-link');
      dynamicCards.forEach(el => {
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
    }

    // Apply active filter to the newly loaded projects
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    if (activeFilterBtn) {
      const filterValue = activeFilterBtn.getAttribute('data-filter');
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.classList.add('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    }
  };

  const loadDynamicSkills = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/skills`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          updateSkillsDOM(data);
        }
      }
    } catch (err) {
      console.log('Backend skills not reachable. Serving static content.', err);
    }
  };

  const updateSkillsDOM = (skillsList) => {
    const skillsGrid = document.querySelector('.about-skills .skills-grid');
    if (!skillsGrid) return;

    // Clear static skills categories
    skillsGrid.innerHTML = '';

    // Group skills by category
    const groupedSkills = {};
    skillsList.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!groupedSkills[cat]) {
        groupedSkills[cat] = [];
      }
      groupedSkills[cat].push(skill);
    });

    // Render grouped categories
    Object.keys(groupedSkills).forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'skill-category';

      const catHeader = document.createElement('h4');
      catHeader.textContent = category;
      categoryDiv.appendChild(catHeader);

      const listDiv = document.createElement('div');
      listDiv.className = 'skills-list';

      groupedSkills[category].forEach(skill => {
        const pillDiv = document.createElement('div');
        pillDiv.className = 'skill-pill';

        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', skill.icon || 'award');
        if (skill.iconColor) {
          iconEl.className = skill.iconColor;
        }

        pillDiv.appendChild(iconEl);
        pillDiv.appendChild(document.createTextNode(` ${skill.name}`));

        listDiv.appendChild(pillDiv);
      });

      categoryDiv.appendChild(listDiv);
      skillsGrid.appendChild(categoryDiv);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Re-attach hover cursor listeners to dynamic skill pills
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');
    if (cursor && cursorGlow && !window.matchMedia('(pointer: coarse)').matches) {
      const dynamicPills = skillsGrid.querySelectorAll('.skill-pill');
      dynamicPills.forEach(el => {
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
    }
  };

  // Run dynamic fetch
  loadDynamicPortfolioDetails();
  loadDynamicExperiences();
  loadDynamicProjects();
  loadDynamicSkills();
});
