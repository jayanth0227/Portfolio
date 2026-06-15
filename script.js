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
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Outer glow has a slight delay for smooth organic tracking
      cursorGlow.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 250, fill: 'forwards' });
    });

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

  window.addEventListener('scroll', () => {
    // Backdrop blur threshold
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active navigation link update
    let currentActiveSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
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
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active filter button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

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

        // Simulating server side submit with delay
        setTimeout(() => {
          // Success State visual trigger
          statusMsg.classList.add('active');
          
          // Reset button and form values
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          contactForm.reset();
          
          // Clear active labels by forcing placeholder behavior
          inputs.forEach(input => {
            const group = input.closest('.form-group');
            group.classList.remove('invalid');
          });

          // Automatically dismiss success window after 5 seconds
          setTimeout(() => {
            statusMsg.classList.remove('active');
          }, 5000);

        }, 1800);
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
  const DEFAULT_API_URL = 'http://localhost:8080';
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

  // Run dynamic fetch
  loadDynamicPortfolioDetails();
});
