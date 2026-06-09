// Dark/Light Mode Toggle
const toggleBtn = document.getElementById('themeToggle');
const root = document.documentElement;

toggleBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  if (root.classList.contains('dark')) {
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }
});
import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/mittelstand.js';
import { initKonzerne }    from './sections/konzerne.js';

const scroller = scrollama();

scroller
  .setup({
    step: '.scroll-section',
    offset: 0.4
  })
  .onStepEnter(({ element, index }) => {
    element.classList.add('is-active');
    if (index === 0) initPolitik();
    if (index === 1) initMittelstand();
    if (index === 2) initKonzerne();
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });