import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/markt-zugang.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

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
      r: 1.2 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      amp: 3 + Math.random() * 6,
      alpha: 0.5 + Math.random() * 0.39
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

function makeWaveCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

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

  const waves = [
    { baseY: 0.3, amp: 28, speed: 0.00018, phase: 0 },
    { baseY: 0.55, amp: 22, speed: 0.00014, phase: 2.1 },
    { baseY: 0.78, amp: 32, speed: 0.00011, phase: 4.4 }
  ];

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.classList.contains('dark');
    const strokeAlpha = isDark ? 0.08 : 0.22;

    waves.forEach(wave => {
      const t = time * wave.speed;
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const y = wave.baseY * h
          + Math.sin((i / points) * Math.PI * 2.4 + t + wave.phase) * wave.amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(110, 231, 183, ${strokeAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function initStatCanvas() {
  makeWaveCanvas('statCanvas');
}

function initMzCanvas() {
  makeWaveCanvas('mzCanvas');
}

function initTechCanvas() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

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

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.classList.contains('dark');
    const alpha = isDark ? 0.05 : 0.14;
    const spacing = 64;
    const offset = (time * 0.012) % spacing;

    ctx.strokeStyle = `rgba(110, 231, 183, ${alpha})`;
    ctx.lineWidth = 1;

    for (let x = -h + offset; x < w + h; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + h, 0);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function initTechCards() {
  const section = document.getElementById('section-technologie');
  const grid = document.getElementById('techGrid');
  const infoPanel = document.getElementById('techInfo');
  const closeBtn = document.getElementById('techInfoClose');
  const titleEl = document.getElementById('techInfoTitle');
  const bodyEl = document.getElementById('techInfoBody');
  const iconEl = document.getElementById('techInfoIcon');
  const floatLeft = document.getElementById('techFloatLeft');
  const floatRight = document.getElementById('techFloatRight');
  if (!grid || !infoPanel || !section) return;

  const cards = grid.querySelectorAll('.tech-card');
  let activeCard = null;

  function parseDetail(raw) {
    if (!raw) return '';
    return raw.split(';;').map(pair => {
      const [label, text] = pair.split('::');
      return `<div class="tech-info-item"><strong>${label}:</strong> ${text}</div>`;
    }).join('');
  }

  function buildFloatIcons(container, iconSvg, count) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const wrap = document.createElement('span');
      wrap.className = 'tech-float-icon tech-float-icon-' + i;
      wrap.innerHTML = iconSvg;
      container.appendChild(wrap);
    }
  }

  function openInfo(card) {
    titleEl.textContent = card.dataset.title || '';
    bodyEl.innerHTML = parseDetail(card.dataset.detail);
    const iconSvg = card.querySelector('.tech-icon svg');
    const iconHtml = iconSvg ? iconSvg.outerHTML : '';
    iconEl.innerHTML = iconHtml;

    buildFloatIcons(floatLeft, iconHtml, 2);
    buildFloatIcons(floatRight, iconHtml, 2);

    infoPanel.classList.add('open');
    cards.forEach(c => c.classList.toggle('active', c === card));
    activeCard = card;
  }

  function closeInfo() {
    infoPanel.classList.remove('open');
    cards.forEach(c => c.classList.remove('active'));
    activeCard = null;
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (activeCard === card) {
        closeInfo();
        return;
      }
      openInfo(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeInfo);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInfo();
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) closeInfo();
    });
  }, { threshold: 0.1 });
  sectionObserver.observe(section);
}

function initCustomCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverTargets = 'a, button, .tech-card, .stat-item, .land-select-trigger, .land-select-item';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('cursor-hover');
    }
  });
}

function initNavProgress() {
  const nav = document.querySelector('nav');
  const navLinksEl = document.getElementById('navLinks');
  const track = document.getElementById('navProgressTrack');
  const plane = document.getElementById('navProgressPlane');
  const brand = document.querySelector('.nav-brand');
  const fill = document.getElementById('navProgressFill');
  if (!nav || !navLinksEl || !track || !plane) return;

  const sectionIds = ['section-allgemeines', 'section-technologie', 'section-mittelstand', 'section-konzerne', 'section-survey', 'section-politik'];
  const links = {};
  sectionIds.forEach(id => {
    const link = navLinksEl.querySelector(`a[href="#${id}"]`);
    if (link) links[id] = link;
  });
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function positionTrack() {
    const navRect = nav.getBoundingClientRect();
    const linksRect = navLinksEl.getBoundingClientRect();
    track.style.left = (linksRect.left - navRect.left) + 'px';
    track.style.width = linksRect.width + 'px';
  }

  function movePlaneTo(x) {
    plane.style.left = x + 'px';
    if (fill) {
      const clamped = Math.max(0, x);
      fill.style.width = clamped + 'px';
    }
  }

  function setBrandPosition() {
    const trackRect = track.getBoundingClientRect();
    if (brand) {
      const brandRect = brand.getBoundingClientRect();
      movePlaneTo(brandRect.left - trackRect.left);
    } else {
      movePlaneTo(0);
    }
    Object.values(links).forEach(l => l.classList.remove('nav-active'));
  }

  function moveToLink(link) {
    if (!link) return;
    const trackRect = track.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const centerX = (linkRect.left + linkRect.width / 2) - trackRect.left;
    movePlaneTo(centerX);
    Object.values(links).forEach(l => l.classList.remove('nav-active'));
    link.classList.add('nav-active');
  }

  positionTrack();
  setBrandPosition();

  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;

    if (scrollY < 80) {
      setBrandPosition();
      ticking = false;
      return;
    }

    let currentId = sectionIds[0];
    const midpoint = window.innerHeight / 2;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= midpoint && rect.bottom >= 0) {
        currentId = sec.id;
      }
    });

    moveToLink(links[currentId]);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  });

  window.addEventListener('resize', () => {
    positionTrack();
    updateOnScroll();
  });
}

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

const toggleBtn = document.getElementById('themeToggle');
const toggleText = toggleBtn ? toggleBtn.querySelector('.toggle-text') : null;
const root = document.documentElement;

root.classList.add('dark');
if (toggleText) {
  toggleText.textContent = 'Light Mode';
}

const visible = { politik: false, mittelstand: false, konzerne: false };

function redrawCharts() {
  if (visible.politik)     initPolitik(true);
  if (visible.mittelstand) initMittelstand(true);
  if (visible.konzerne)    initKonzerne(true);
}

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
initStatCanvas();
initMzCanvas();
initTechCanvas();
initTechCards();
initCustomCursor();
initEuropeMap();
initLaenderPanel();
initNavProgress();

window.addEventListener('resize', () => {
  redrawCharts();
});