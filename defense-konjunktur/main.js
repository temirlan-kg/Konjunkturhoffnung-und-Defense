import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

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
const root = document.documentElement;

// Standardmäßig Dark Mode setzen
root.classList.add('dark');
if (toggleBtn) {
  toggleBtn.textContent = '☀️ Light Mode';
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
    toggleBtn.textContent = root.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
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

initEuropeMap();
initLaenderPanel();

window.addEventListener('resize', () => {
  redrawCharts();
});