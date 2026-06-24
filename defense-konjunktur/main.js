import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

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
  .setup({ step: '.scroll-section, .konzerne-scrolly', offset: 0.3 })
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

// Land-Dropdown & Detail-Panel
initLaenderPanel();

// Aktiver-Zustand der Scrollytelling-Steps für die Europa-Karte (Allgemeines)
const scrollyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.scrolly-step').forEach(s => s.classList.remove('is-active'));
      entry.target.classList.add('is-active');
    }
  });
}, { rootMargin: '-20% 0px -40% 0px', threshold: 0.1 });

document.querySelectorAll('.scrolly-step').forEach(el => {
  scrollyObserver.observe(el);
});