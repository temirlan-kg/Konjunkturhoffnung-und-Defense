import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';

const toggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// Dark Mode als Standard
root.classList.add('dark');
toggleBtn.textContent = '☀️ Light Mode';

const visible = { politik: false, mittelstand: false, konzerne: false };

function redrawCharts() {
  if (visible.politik)     initPolitik(true);
  if (visible.mittelstand) initMittelstand(true);
  if (visible.konzerne)    initKonzerne(true);
}

toggleBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  toggleBtn.textContent = root.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  redrawCharts();
});

const scroller = scrollama();

scroller
  .setup({ step: '.scroll-section', offset: 0.4 })
  .onStepEnter(({ element }) => {
    element.classList.add('is-active');
    if (element.id === 'section-politik')     { visible.politik = true;     initPolitik(); }
    if (element.id === 'section-mittelstand') { visible.mittelstand = true; initMittelstand(); }
    if (element.id === 'section-konzerne')    { visible.konzerne = true;    initKonzerne(); }
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });

// Europa-Karte zeichnen
initEuropeMap();

/* 🚀 NEU: Diese Funktion steuert die Karte passend zum Text */
function updateMapHighlight(stepIndex) {
  const allCountries = document.querySelectorAll('.country-path');
  if (!allCountries.length) return; // Warten bis D3 fertig geladen ist

  // Schritt 01: Zeitenwende -> Zeige ganz Europa normal an
  if (stepIndex === '0') {
    allCountries.forEach(c => { c.style.opacity = '1'; });
  }
  // Schritt 02: Deutschland im Fokus -> Deutschland leuchtet auf, Rest wird blass
  else if (stepIndex === '1') {
    allCountries.forEach(c => {
      if (c.classList.contains('Germany')) {
        c.style.opacity = '1';
      } else {
        c.style.opacity = '0.2'; // Blende den Rest aus
      }
    });
  }
  // Schritt 03: Industrieller Wandel -> Wichtige Industrieländer zeigen (DE, FR, Italien, Polen)
  else if (stepIndex === '2') {
    allCountries.forEach(c => {
      if (c.classList.contains('Germany') || c.classList.contains('France') || c.classList.contains('Italy') || c.classList.contains('Poland')) {
        c.style.opacity = '1';
      } else {
        c.style.opacity = '0.2';
      }
    });
  }
  // Schritt 04: Neue Akteure -> Gesamtes Ökosystem leuchtet wieder auf
  else if (stepIndex === '3') {
    allCountries.forEach(c => { c.style.opacity = '1'; });
  }
}

// Scrollytelling Steps (linke Seite)
const scrollyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.scrolly-step').forEach(s => s.classList.remove('is-active'));
      entry.target.classList.add('is-active');

      /* 🚀 NEU: Rufe die Kartensteuerung auf */
      const stepIndex = entry.target.getAttribute('data-step');
      updateMapHighlight(stepIndex);
    }
  });
}, { rootMargin: '-20% 0px -40% 0px', threshold: 0.1 });

document.querySelectorAll('.scrolly-step').forEach(el => {
  scrollyObserver.observe(el);
});