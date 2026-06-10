import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';

const toggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// Dark Mode als Standard
root.classList.add('dark');
toggleBtn.textContent = '☀️ Light Mode';

// Merken welche Sections schon sichtbar waren
const visible = { politik: false, mittelstand: false, konzerne: false };

// Charts neu zeichnen beim Mode-Wechsel
function redrawCharts() {
  if (visible.politik)     initPolitik(true);
  if (visible.mittelstand) initMittelstand(true);
  if (visible.konzerne)    initKonzerne(true);
}

toggleBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  if (root.classList.contains('dark')) {
    toggleBtn.textContent = '☀️ Light Mode';
  } else {
    toggleBtn.textContent = '🌙 Dark Mode';
  }
  redrawCharts();
});

const scroller = scrollama();

scroller
  .setup({ step: '.scroll-section', offset: 0.4 })
  .onStepEnter(({ element, index }) => {
    element.classList.add('is-active');
    if (index === 1) { visible.politik = true;     initPolitik(); }
    if (index === 2) { visible.mittelstand = true;  initMittelstand(); }
    if (index === 3) { visible.konzerne = true;     initKonzerne(); }
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });