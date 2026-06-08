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