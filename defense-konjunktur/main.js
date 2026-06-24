import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

// Dark/Light Mode Elemente holen
const toggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// Standardmäßig Dark Mode setzen (wie in deiner Config)
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

// ——————————————————————————————————————————————————————————————————————————
// SCROLLAMA SETUP (Für die großen Hauptsektionen)
// ——————————————————————————————————————————————————————————————————————————
const scroller = scrollama();

scroller
  .setup({
    step: '.scroll-section, .konzerne-scrolly', // Beide Sektions-Typen werden überwacht
    offset: 0.3
  })
  .onStepEnter(({ element }) => {
    element.classList.add('is-active');

    // Initialisiere die jeweiligen Sektionen punktgenau beim Betreten
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
      initKonzerne(); // Startet das Bubble-Chart
    }
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });

// ——————————————————————————————————————————————————————————————————————————
// NATIVER INTERSECTION OBSERVER (Für die Textschritte der Europa-Karte)
// ——————————————————————————————————————————————————————————————————————————
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

// Beobachtet die Textblöcke im Bereich "Allgemeines" (Europa-Karte)
document.querySelectorAll('.scrolly-step').forEach(el => {
  scrollyObserver.observe(el);
});

// ——————————————————————————————————————————————————————————————————————————
// INITIALISIERUNG BEIM SEITENSTART
// ——————————————————————————————————————————————————————————————————————————
initEuropeMap();
initLaenderPanel();

// Automatisches Resize-Handling für Highcharts bei Fensteränderungen
window.addEventListener('resize', () => {
  redrawCharts();
});