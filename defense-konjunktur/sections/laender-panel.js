import { markiereAktivesLand } from './europe-map.js';

let laenderDaten = null;

// Nur die drei Länder, die auch auf der Karte im Fokus stehen
const laenderReihenfolge = ['Germany', 'France', 'United Kingdom'];

export function initLaenderPanel() {
  fetch(`${import.meta.env.BASE_URL}data/laender.json`)
    .then(res => res.json())
    .then(data => {
      laenderDaten = data;
      baueDropdown();
      baueSchliessenButton();
    });
}

function baueDropdown() {
  const trigger = document.getElementById('land-select-trigger');
  const panel = document.getElementById('land-select-panel');
  const list = document.getElementById('land-select-list');
  const backdrop = document.getElementById('land-select-backdrop');
  const closeBtn = document.getElementById('land-select-close');
  if (!trigger || !panel || !list || !backdrop) return;

  list.innerHTML = laenderReihenfolge.map(key => {
    const l = laenderDaten[key];
    return `
      <button type="button" class="land-select-item" data-key="${key}" role="option">
        <span class="land-select-flag">${l.flagge}</span>
        <span>${l.name}</span>
      </button>
    `;
  }).join('');

  function openDropdown() {
    panel.classList.add('open');
    backdrop.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  backdrop.addEventListener('click', closeDropdown);
  if (closeBtn) closeBtn.addEventListener('click', closeDropdown);

  list.querySelectorAll('.land-select-item').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.key;
      closeDropdown();
      openLandPanel(key);
      markiereAktivesLand(key);
    });
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('land-select').contains(e.target)) {
      closeDropdown();
    }
  });
}

function baueSchliessenButton() {
  const btn = document.getElementById('panel-close');
  if (btn) {
    btn.addEventListener('click', schliessePanel);
  }
}

export function openLandPanel(key) {
  if (!laenderDaten || !laenderDaten[key]) return;
  const land = laenderDaten[key];

  const panel = document.getElementById('land-panel');
  if (!panel) return;

  const label = document.getElementById('land-select-label');
  if (label) label.textContent = `${land.flagge} ${land.name}`;

  document.querySelectorAll('.land-select-item').forEach(item => {
    item.classList.toggle('active', item.dataset.key === key);
  });

  document.getElementById('panel-flagge').textContent = land.flagge;
  document.getElementById('panel-name').textContent = land.name;

  const liste = document.getElementById('panel-top3');
  liste.innerHTML = land.top3.map((firma, i) => `
    <div class="firma-card">
      <div class="firma-rang">${i + 1}</div>
      <div class="firma-info">
        <div class="firma-name">${firma.name}</div>
        <div class="firma-fokus">${firma.fokus}</div>
      </div>
      <div class="firma-kap">${firma.marktkap}</div>
    </div>
  `).join('');

  panel.classList.add('open');
}

function schliessePanel() {
  const panel = document.getElementById('land-panel');
  if (panel) panel.classList.remove('open');

  const label = document.getElementById('land-select-label');
  if (label) label.textContent = 'Land auswählen …';

  document.querySelectorAll('.land-select-item').forEach(item => {
    item.classList.remove('active');
  });
}