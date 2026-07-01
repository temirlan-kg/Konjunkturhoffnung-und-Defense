import Highcharts from 'highcharts';
import { markiereAktivesLand } from './europe-map.js';

let laenderDaten = null;
let panelChart = null;
let aktuellesLand = '';

// Reihenfolge im Dropdown
const laenderReihenfolge = [
  'Germany', 'France', 'United Kingdom', 'Italy', 'Poland', 'Spain',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Belgium', 'Greece', 'Romania', 'Czechia', 'Portugal',
  'Hungary', 'Austria', 'Switzerland', 'Slovakia', 'Slovenia',
  'Croatia', 'Bulgaria', 'Ireland'
];

// Lädt die Länderdaten und baut das Dropdown auf
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

// Öffnet das Panel für ein Land (key = englischer Name, z. B. "Germany")
export function openLandPanel(key) {
  if (!laenderDaten || !laenderDaten[key]) return;
  const land = laenderDaten[key];
  aktuellesLand = key;

  const panel = document.getElementById('land-panel');
  if (!panel) return;

  // Trigger-Label synchron setzen
  const label = document.getElementById('land-select-label');
  if (label) label.textContent = `${land.flagge} ${land.name}`;

  // Aktives Item in der Liste markieren
  document.querySelectorAll('.land-select-item').forEach(item => {
    item.classList.toggle('active', item.dataset.key === key);
  });

  // Kopf füllen
  document.getElementById('panel-flagge').textContent = land.flagge;
  document.getElementById('panel-name').textContent = land.name;
  document.getElementById('panel-aktuell').textContent =
    land.ausgaben[land.ausgaben.length - 1] + ' Mrd. €';

  // Top-3-Unternehmen füllen
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

  // Panel sichtbar machen
  panel.classList.add('open');

  // Chart bauen (nach dem Einblenden, damit Breite stimmt)
  setTimeout(() => baueZeitreihe(land), 50);
}

function schliessePanel() {
  const panel = document.getElementById('land-panel');
  if (panel) panel.classList.remove('open');

  const label = document.getElementById('land-select-label');
  if (label) label.textContent = 'Land auswählen …';

  document.querySelectorAll('.land-select-item').forEach(item => {
    item.classList.remove('active');
  });

  aktuellesLand = '';
  if (panelChart) { panelChart.destroy(); panelChart = null; }
}

function baueZeitreihe(land) {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';

  if (panelChart) { panelChart.destroy(); panelChart = null; }

  panelChart = Highcharts.chart('panel-chart', {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      height: 220,
      animation: { duration: 800 }
    },
    title: {
      text: 'Verteidigungsausgaben (Mrd. €)',
      style: { color: textColor, fontSize: '13px' }
    },
    xAxis: {
      categories: land.jahre,
      labels: { style: { color: mutedColor, fontSize: '10px' } },
      lineColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    },
    yAxis: {
      title: { text: null },
      labels: { style: { color: mutedColor, fontSize: '10px' } },
      gridLineWidth: 0
    },
    legend: { enabled: false },
    tooltip: {
      pointFormat: '<b>{point.y} Mrd. €</b>'
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(88,166,255,0.5)'],
            [1, 'rgba(88,166,255,0.05)']
          ]
        },
        lineColor: '#58a6ff',
        lineWidth: 2,
        marker: { enabled: true, radius: 3, fillColor: '#58a6ff' }
      }
    },
    series: [{
      name: land.name,
      data: land.ausgaben
    }],
    credits: { enabled: false }
  });
}