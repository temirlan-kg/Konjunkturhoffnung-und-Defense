import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

// Hero-Canvas: feine Partikel fließen kontinuierlich von links nach rechts
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function spawn(initial) {
    const lanes = 7;
    const lane = Math.floor(Math.random() * lanes);
    const baseY = h * (0.12 + lane * (0.78 / (lanes - 1)));
    particles.push({
      x: initial ? Math.random() * w : -8,
      y: baseY + (Math.random() - 0.5) * h * 0.04,
      speed: 0.4 + Math.random() * 0.6,
      r: 1.1 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      amp: 3 + Math.random() * 6,
      alpha: 0.38 + Math.random() * 0.4
    });
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 80; i++) spawn(true);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.classList.contains('dark');
    const rgb = isDark ? '123,217,158' : '5,150,105';

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.speed;
      const yWobble = Math.sin(p.x * 0.012 + p.phase) * p.amp * 0.3;
      const midFactor = 1 - Math.abs((p.x / w) - 0.5) * 1.2;
      const fade = Math.max(0, Math.min(1, midFactor));

      ctx.beginPath();
      ctx.arc(p.x, p.y + yWobble, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${p.alpha * (0.25 + 0.75 * fade)})`;
      ctx.fill();

      if (p.x > w + 8) {
        particles.splice(i, 1);
        spawn(false);
      }
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
  });
}

// Hamburger-Menü
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Dark/Light Mode Elemente holen
const toggleBtn = document.getElementById('themeToggle');
const toggleText = toggleBtn ? toggleBtn.querySelector('.toggle-text') : null;
const root = document.documentElement;

// Standardmäßig Dark Mode setzen
root.classList.add('dark');
if (toggleText) {
  toggleText.textContent = 'Light Mode';
}

// Status, welche Sektionen bereits betreten wurden (für Redraws)
const visible = { politik: false, mittelstand: false, konzerne: false };

// Hilfsfunktion zum Neuzeichnen der Charts bei Theme-Wechsel
function redrawCharts() {
  if (visible.politik)     initPolitik(true);
  if (visible.mittelstand) initMittelstand(true);
  if (visible.konzerne)    initKonzerne(true);
}

// Event Listener für den Theme-Toggle
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    if (toggleText) {
      toggleText.textContent = root.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
    }
    redrawCharts();
  });
}

const scroller = scrollama();

scroller
  .setup({
    step: '.scroll-section, .konzerne-scrolly',
    offset: 0.3
  })
  .onStepEnter(({ element }) => {
    element.classList.add('is-active');

    if (element.id === 'section-politik') {
      visible.politik = true;
      initPolitik();
    }
    if (element.id === 'section-mittelstand') {
      visible.mittelstand = true;
      initMittelstand();
    }
    if (element.id === 'section-konzerne') {
      visible.konzerne = true;
      initKonzerne();
    }
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });

const scrollyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.scrolly-step').forEach(s => s.classList.remove('is-active'));
      entry.target.classList.add('is-active');
    }
  });
}, {
  root: null,
  rootMargin: '-20% 0px -40% 0px',
  threshold: 0.1
});

document.querySelectorAll('.scrolly-step').forEach(el => {
  scrollyObserver.observe(el);
});

initHeroCanvas();
initEuropeMap();
initLaenderPanel();

window.addEventListener('resize', () => {
  redrawCharts();
});