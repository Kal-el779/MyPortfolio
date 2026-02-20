const CONFIG = {
  STAR_COUNT: 500,
  STAR_SPEED: 2,
  STAR_COLOR: '#00f0ff',
  CONSTELLATION_POINTS: 120,
  CONSTELLATION_DISTANCE: 100,
  PRELOADER_DELAY: 5000
};

// ============================================
// Starfield Animation
// ============================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Recreate stars with new dimensions
  createStars(CONFIG.STAR_COUNT);
  // Recreate stars with new dimensions
  createStars(CONFIG.STAR_COUNT);
}

// Mouse interaction variables
let mouseX = 0;
let mouseY = 0;
let isAttracting = false;

// Event Listeners for interaction
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('mousedown', () => isAttracting = true);
canvas.addEventListener('mouseup', () => isAttracting = false);
canvas.addEventListener('mouseleave', () => isAttracting = false);

// Touch support
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
});
canvas.addEventListener('touchstart', (e) => {
  isAttracting = true;
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', () => isAttracting = false);

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      z: Math.random() * canvasWidth  // Depth for parallax effect
    });
  }
}

function drawStars() {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const focalLength = canvasWidth / 2;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];

    // Move star towards viewer
    star.z -= CONFIG.STAR_SPEED;
    if (star.z <= 0) {
      star.z = canvasWidth;
    }

    // 3D projection
    const scale = focalLength / star.z;
    const x = (star.x - centerX) * scale + centerX;
    const y = (star.y - centerY) * scale + centerY;

    // Skip stars outside viewport
    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
      continue;
    }

    // Size based on depth
    const size = (1 - star.z / canvasWidth) * 2;

    // Draw star
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.STAR_COLOR;
    ctx.fill();

    // Black Hole Attraction Effect
    if (isAttracting) {
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const attractionRadius = 200; // Radius of influence

      if (distance < attractionRadius) {
        // Calculate attraction force
        // The closer the star, the stronger the pull
        const force = (attractionRadius - distance) / attractionRadius;

        // Move star source (x, y) towards the projected ray of the mouse
        // We adjust the 3D coordinates based on the 2D offset 
        // Logic: Push 3D x/y so its 2D projection moves towards mouseX/Y
        // We scale back by Z to account for perspective
        const pushX = (dx / scale) * force * 0.15;
        const pushY = (dy / scale) * force * 0.15;

        star.x += pushX;
        star.y += pushY;
      }
    }
  }
}

function animateStarfield() {
  drawStars();
  requestAnimationFrame(animateStarfield);
}

// Initialize starfield
resizeCanvas();
animateStarfield();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// ============================================
// Mobile Navigation
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ============================================
// Constellation Canvas
// ============================================
const constellationCanvas = document.createElement('canvas');
constellationCanvas.id = 'constellationCanvas';
constellationCanvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  display: none;
`;
document.body.appendChild(constellationCanvas);

const cctx = constellationCanvas.getContext('2d');
let constellationPoints = [];
let constellationAnimationId = null;

function resizeConstellation() {
  constellationCanvas.width = window.innerWidth;
  constellationCanvas.height = window.innerHeight;

  // Generate constellation points
  constellationPoints = [];
  for (let i = 0; i < CONFIG.CONSTELLATION_POINTS; i++) {
    constellationPoints.push({
      x: Math.random() * constellationCanvas.width,
      y: Math.random() * constellationCanvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    });
  }
}

function drawConstellations() {
  cctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
  cctx.fillStyle = '#fff';

  constellationPoints.forEach((point, i) => {
    // Update position
    point.x += point.vx;
    point.y += point.vy;

    // Bounce off edges
    if (point.x < 0 || point.x > constellationCanvas.width) point.vx *= -1;
    if (point.y < 0 || point.y > constellationCanvas.height) point.vy *= -1;

    // Draw point
    cctx.beginPath();
    cctx.arc(point.x, point.y, 1.5, 0, 2 * Math.PI);
    cctx.fill();

    // Draw lines to nearby points
    for (let j = i + 1; j < constellationPoints.length; j++) {
      const otherPoint = constellationPoints[j];
      const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);

      if (distance < CONFIG.CONSTELLATION_DISTANCE) {
        cctx.strokeStyle = 'rgba(191, 0, 255, 0.2)';
        cctx.lineWidth = 0.5;
        cctx.beginPath();
        cctx.moveTo(point.x, point.y);
        cctx.lineTo(otherPoint.x, otherPoint.y);
        cctx.stroke();
      }
    }
  });
}

function animateConstellations() {
  drawConstellations();
  constellationAnimationId = requestAnimationFrame(animateConstellations);
}

function toggleConstellationCanvas() {
  if (document.body.classList.contains('stellar-mode')) {
    constellationCanvas.style.display = 'block';
    resizeConstellation();
    animateConstellations();
  } else {
    constellationCanvas.style.display = 'none';
    if (constellationAnimationId) {
      cancelAnimationFrame(constellationAnimationId);
      constellationAnimationId = null;
    }
  }
}

// Initialize constellation canvas
resizeConstellation();
window.addEventListener('resize', resizeConstellation);

// ============================================
// Stellar Mode - Mobile & Desktop
// ============================================
const stellarBtn = document.getElementById('stellarModeBtn');

// Mobile-friendly button toggle
if (stellarBtn) {
  stellarBtn.addEventListener('click', () => {
    document.body.classList.toggle('stellar-mode');
    stellarBtn.classList.toggle('active');
    toggleConstellationCanvas();

    // Update button text
    if (document.body.classList.contains('stellar-mode')) {
      stellarBtn.textContent = '✨ Normal Mode';
    } else {
      stellarBtn.textContent = '🌌 Stellar Mode';
    }
  });
}

// Keyboard shortcut for desktop (Press 'K')
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k') {
    document.body.classList.toggle('stellar-mode');
    if (stellarBtn) {
      stellarBtn.classList.toggle('active');
      if (document.body.classList.contains('stellar-mode')) {
        stellarBtn.textContent = '✨ Normal Mode';
      } else {
        stellarBtn.textContent = '🌌 Stellar Mode';
      }
    }
    toggleConstellationCanvas();
    console.log('%c🌌 Stellar Alignment Activated', 'color:#bf00ff; font-size:16px; font-family:monospace');
  }
});

// ============================================
// Scroll-Triggered Animations
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => fadeInObserver.observe(el));
});

// ============================================
// Preloader
// ============================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const blackHole = document.getElementById('blackHole');

  // Just show it spinning for however long you want
  const matterInterval = setInterval(spawnMatter, 50);

  setTimeout(() => {
    clearInterval(matterInterval);
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    setTimeout(() => preloader.remove(), 500);
  }, 3000);
});

function spawnMatter() {
  const blackHole = document.getElementById('blackHole');
  if (!blackHole) return;

  const particle = document.createElement('div');
  particle.classList.add('matter-particle');

  // Random start position around the center
  const angle = Math.random() * Math.PI * 2;
  const radius = 100 + Math.random() * 100; // Start 100-200px away
  const tx = Math.cos(angle) * radius;
  const ty = Math.sin(angle) * radius;

  // Set CSS variables for the animation start point
  particle.style.setProperty('--tx', `${tx}px`);
  particle.style.setProperty('--ty', `${ty}px`);

  // Randomize size and color slightly
  const size = Math.random() * 2 + 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  const colors = ['#ffaa00', '#ff4500', '#ffffff', '#bf00ff'];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];

  // Animate
  const duration = Math.random() * 1 + 0.5; // 0.5s to 1.5s
  particle.style.animation = `absorb ${duration}s ease-in forwards`;

  blackHole.appendChild(particle);

  // Cleanup
  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

// ============================================
// Contact Form Handler
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success!
        formStatus.style.display = 'block';
        formStatus.style.background = 'rgba(0, 240, 100, 0.1)';
        formStatus.style.border = '1px solid rgba(0, 240, 100, 0.3)';
        formStatus.style.color = '#00f064';
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      formStatus.style.display = 'block';
      formStatus.style.background = 'rgba(255, 0, 0, 0.1)';
      formStatus.style.border = '1px solid rgba(255, 0, 0, 0.3)';
      formStatus.style.color = '#ff6b6b';
      formStatus.textContent = '✗ Oops! Something went wrong. Please try again or email me directly.';
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Hide status after 5 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  });
}

// ============================================
// Project Expand/Collapse
// ============================================
function toggleProject(projectId) {
  const details = document.getElementById(`${projectId}-details`);
  const icon = document.getElementById(`${projectId}-icon`);

  if (details.classList.contains('active')) {
    details.classList.remove('active');
    icon.textContent = '+';
  } else {
    // Close all other projects first
    document.querySelectorAll('.project-details').forEach(detail => {
      detail.classList.remove('active');
    });
    document.querySelectorAll('.expand-btn span').forEach(span => {
      span.textContent = '+';
    });

    // Open clicked project
    details.classList.add('active');
    icon.textContent = '−';
  }
}