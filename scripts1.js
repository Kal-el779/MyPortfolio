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
}

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
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.STAR_COLOR;
    ctx.fill();
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
// Stellar Mode (Press 'K' to toggle)
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k') {
    document.body.classList.toggle('stellar-mode');
    toggleConstellationCanvas();
    console.log('%c🌌 Stellar Alignment Activated', 'color:#bf00ff; font-size:16px; font-family:monospace');
  }
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
// Preloader
// ============================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const blackHole = document.getElementById('blackHole');
  
  // Just show it spinning for however long you want
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    setTimeout(() => preloader.remove(), 500);
  }, 3000); // Change this number - 5000 = 5 seconds
});
