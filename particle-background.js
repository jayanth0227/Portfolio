/**
 * Anti Gravity Particle Background
 * A high-performance physics-based canvas background simulation.
 * Includes cursor attraction/repulsion gravity-well orbits, line connections, depth opacity, and scroll parallax.
 * Auto-pauses when out of viewport for optimal CPU/battery performance.
 */

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    
    // Depth factor: 0.5 (far/deep background) to 2.0 (near foreground)
    this.depth = Math.random() * 1.5 + 0.5;
    
    // Size scales with depth to create realistic perspective
    this.size = this.depth * 1.1;
    
    // Drift speed: distant particles float slower
    const speedMultiplier = this.depth * 0.12;
    this.vx = (Math.random() - 0.5) * speedMultiplier;
    this.vy = (Math.random() - 0.5) * speedMultiplier;
    
    // Parallax scrolling speed factor
    this.parallaxFactor = this.depth * 0.22;
    
    // Base transparency based on depth
    this.baseAlpha = Math.random() * 0.35 + 0.12;
    this.alpha = this.baseAlpha;
    
    // Proximity glow multiplier
    this.brightnessBoost = 0;
    
    // Curated design palette matching the portfolio
    const colors = [
      'rgba(79, 140, 255, ',   // Primary Glow: #4F8CFF (Indigo/Blue)
      'rgba(122, 162, 255, ',  // Secondary Glow: #7AA2FF (Light Blue)
      'rgba(255, 255, 255, '   // Subtle White Highlight
    ];

    // Color distribution: 50% primary, 40% secondary, 10% white
    const r = Math.random();
    if (r < 0.50) {
      this.colorPrefix = colors[0];
    } else if (r < 0.90) {
      this.colorPrefix = colors[1];
    } else {
      this.colorPrefix = colors[2];
    }
  }

  update(mouse, scrollY) {
    // Continuous smooth drift
    this.x += this.vx;
    this.y += this.vy;

    // Wrap-around screen bounds
    if (this.x < -15) this.x = this.canvasWidth + 15;
    if (this.x > this.canvasWidth + 15) this.x = -15;
    if (this.y < -15) this.y = this.canvasHeight + 15;
    if (this.y > this.canvasHeight + 15) this.y = -15;

    // Cursor influence calculations
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = (mouse.y + scrollY) - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const attractionRadius = 170;
      
      if (distance < attractionRadius) {
        // Proximity glow scaling
        const proximity = 1 - (distance / attractionRadius);
        this.brightnessBoost = proximity * 0.6;
        this.alpha = Math.min(1.0, this.baseAlpha + this.brightnessBoost);

        // Anti-Gravity Orbit Physics:
        // Pushes away if too close, pulls in if inside the radius.
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        const orbitEquilibrium = 65; // Distance at which push/pull balance
        let gravityForce = 0;

        if (distance > orbitEquilibrium) {
          // Pull inside gravity well
          gravityForce = (distance - orbitEquilibrium) * 0.00012 * this.depth;
        } else {
          // Push away (repel) to prevent overlapping clumping
          gravityForce = (distance - orbitEquilibrium) * 0.0008 * this.depth;
        }

        this.x += forceDirectionX * gravityForce * 1.6;
        this.y += forceDirectionY * gravityForce * 1.6;
      } else {
        // Smoothly return to default transparency
        this.brightnessBoost *= 0.94;
        this.alpha = Math.max(this.baseAlpha, this.baseAlpha + this.brightnessBoost);
      }
    } else {
      this.brightnessBoost *= 0.94;
      this.alpha = Math.max(this.baseAlpha, this.baseAlpha + this.brightnessBoost);
    }
  }

  draw(ctx, scrollY) {
    // Offset rendering position using vertical scroll for parallax depth
    const renderY = this.y - (scrollY * this.parallaxFactor);
    ctx.beginPath();
    ctx.arc(this.x, renderY, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.colorPrefix + this.alpha + ')';
    ctx.fill();
  }
}

class AntiGravityBackground {
  constructor() {
    this.canvas = document.getElementById('hero-particle-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.heroSection = document.getElementById('home');
    if (!this.heroSection) return;

    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      targetX: null,
      targetY: null
    };
    
    this.scrollY = window.scrollY;
    this.isVisible = true;
    this.resizeTimeout = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.setupPerformanceMonitor();
    this.animate();
  }

  resizeCanvas() {
    const rect = this.heroSection.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.particles.forEach(p => {
      p.canvasWidth = this.canvas.width;
      p.canvasHeight = this.canvas.height;
    });
  }

  createParticles() {
    this.particles = [];
    // Dynamic particle count: Fewer particles on mobile screens for CPU health
    const maxParticlesCount = window.innerWidth < 768 ? 40 : 115;

    for (let i = 0; i < maxParticlesCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  setupEventListeners() {
    // Mouse tracking relative to canvas bounding box
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.targetX = e.clientX - rect.left;
      this.mouse.targetY = e.clientY - rect.top;
    });

    // Clear target coordinates when cursor exits browser window
    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = null;
      this.mouse.targetY = null;
    });

    // Mobile touch tracking
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.touches[0].clientX - rect.left;
        this.mouse.targetY = e.touches[0].clientY - rect.top;
      }
    });

    window.addEventListener('touchend', () => {
      this.mouse.targetX = null;
      this.mouse.targetY = null;
    });

    // Scroll updates for parallax effect
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    // Debounced window resizing
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
        this.createParticles();
      }, 250);
    });
  }

  setupPerformanceMonitor() {
    // Auto-stops animation loops when hero section is not visible to save CPU/battery
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      
      observer.observe(this.heroSection);
    }
  }

  drawConnections() {
    const connectionRange = 100;
    const count = this.particles.length;

    for (let i = 0; i < count; i++) {
      const p1 = this.particles[i];
      const p1Y = p1.y - (this.scrollY * p1.parallaxFactor);

      for (let j = i + 1; j < count; j++) {
        const p2 = this.particles[j];

        // Depth restriction: only draw links between particles of similar depths
        if (Math.abs(p1.depth - p2.depth) > 0.55) continue;

        const p2Y = p2.y - (this.scrollY * p2.parallaxFactor);
        const dx = p1.x - p2.x;
        const dy = p1Y - p2Y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionRange) {
          // Fade connection based on distance
          const distanceAlpha = (1 - (dist / connectionRange)) * 0.12;
          
          // Connect active glow boost if any particle is activated near mouse
          let activeGlow = 0;
          if (p1.brightnessBoost > 0 || p2.brightnessBoost > 0) {
            activeGlow = Math.max(p1.brightnessBoost, p2.brightnessBoost) * 0.22;
          }

          const lineAlpha = distanceAlpha + activeGlow;
          if (lineAlpha <= 0) continue;

          // Select matching line color based on particle colors
          let strokeColor = `rgba(122, 162, 255, ${lineAlpha})`; // Secondary color
          if (p1.colorPrefix.includes('255, 255, 255')) {
            strokeColor = `rgba(255, 255, 255, ${lineAlpha * 0.6})`;
          } else if (p1.depth > 1.25) {
            strokeColor = `rgba(79, 140, 255, ${lineAlpha})`; // Primary color
          }

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1Y);
          this.ctx.lineTo(p2.x, p2Y);
          this.ctx.lineWidth = Math.min(p1.depth, p2.depth) * 0.45;
          this.ctx.strokeStyle = strokeColor;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    // If hero section has scrolled out of view, yield rendering loop cycles
    if (!this.isVisible) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    // Clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Smooth mouse coordinates interpolation (lerp) for soft delayed follow-tracking
    if (this.mouse.targetX !== null) {
      if (this.mouse.x === null) {
        this.mouse.x = this.mouse.targetX;
        this.mouse.y = this.mouse.targetY;
      } else {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
      }
    } else {
      this.mouse.x = null;
      this.mouse.y = null;
    }

    // Update and draw all particles
    this.particles.forEach(p => {
      p.update(this.mouse, this.scrollY);
      p.draw(this.ctx, this.scrollY);
    });

    // Draw constellation lines
    this.drawConnections();

    requestAnimationFrame(() => this.animate());
  }
}

// Start simulation on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new AntiGravityBackground();
});
