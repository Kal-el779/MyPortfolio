// scripts.js

// Starfield background
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width
    });
  }
}

function drawStars() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const focalLength = canvas.width / 2;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;
    let k = focalLength / star.z;
    let x = (star.x - cx) * k + cx;
    let y = (star.y - cy) * k + cy;
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

    let size = (1 - star.z / canvas.width) * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
  }
}

function animateStarfield() {
  drawStars();
  requestAnimationFrame(animateStarfield);
}

resizeCanvas();
createStars(500);
animateStarfield();
window.addEventListener('resize', () => {
  resizeCanvas();
  createStars(500);
});

// Mobile Nav Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Stellar Mode Toggle (press M)
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k') {
    document.body.classList.toggle('stellar-mode');
    toggleConstellationCanvas();
    console.log('%c🌌 Stellar Alignment Activated', 'color:#bf00ff; font-size:16px; font-family:monospace');
  }
});

// 🌌 Constellation Canvas Setup
const constellationCanvas = document.createElement('canvas');
constellationCanvas.id = 'constellationCanvas';
constellationCanvas.style.position = 'fixed';
constellationCanvas.style.top = '0';
constellationCanvas.style.left = '0';
constellationCanvas.style.pointerEvents = 'none';
constellationCanvas.style.width = '100%';
constellationCanvas.style.height = '100%';
constellationCanvas.style.zIndex = '5';
document.body.appendChild(constellationCanvas);

const cctx = constellationCanvas.getContext('2d');
let points = [];

function resizeConstellation() {
  constellationCanvas.width = window.innerWidth;
  constellationCanvas.height = window.innerHeight;
  points = [];
  for (let i = 0; i < 120; i++) {
    points.push({
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

  points.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > constellationCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > constellationCanvas.height) p.vy *= -1;

    cctx.beginPath();
    cctx.arc(p.x, p.y, 1.5, 0, 2 * Math.PI);
    cctx.fill();

    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.hypot(p.x - points[j].x, p.y - points[j].y);
      if (dist < 100) {
        cctx.strokeStyle = 'rgba(191, 0, 255, 0.2)';
        cctx.lineWidth = 0.5;
        cctx.beginPath();
        cctx.moveTo(p.x, p.y);
        cctx.lineTo(points[j].x, points[j].y);
        cctx.stroke();
      }
    }
  });
}

function animateConstellations() {
  drawConstellations();
  requestAnimationFrame(animateConstellations);
}

function toggleConstellationCanvas() {
  if (document.body.classList.contains('stellar-mode')) {
    constellationCanvas.style.display = 'block';
    resizeConstellation();
    animateConstellations();
  } else {
    constellationCanvas.style.display = 'none';
  }
}

resizeConstellation();
window.addEventListener('resize', resizeConstellation);
constellationCanvas.style.display = 'none';

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  preloader.style.visibility = 'hidden';
  setTimeout(() => preloader.remove(), 500); // Optional: fully remove from DOM
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const blackHole = document.getElementById('blackHole');
  const profileTarget = document.getElementById('profilePicTarget');

  // Get the profile image container's position
  const targetRect = profileTarget.getBoundingClientRect();

  // Get center of screen
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Get offset to move blackHole to profile pic
  const offsetX = targetRect.left + targetRect.width / 2 - centerX;
  const offsetY = targetRect.top + targetRect.height / 2 - centerY;

  // Move and shrink black hole into position
  blackHole.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.95)`;
  blackHole.style.transition = 'transform 1s ease-in-out';

  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
  }, 1200);


  // Optional: replace with actual image later or fade it in
});
