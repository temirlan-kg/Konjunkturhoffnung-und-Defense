import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { openLandPanel } from './laender-panel.js';

// Verteidigungsausgaben 2024 (Mrd. €) — EDA / NATO Defence Data
const ausgaben = {
  'Germany': 72,
  'France': 59,
  'United Kingdom': 68,
  'Italy': 33,
  'Spain': 20,
  'Poland': 35,
  'Netherlands': 21,
  'Sweden': 12,
  'Finland': 7,
  'Norway': 9,
  'Belgium': 7,
  'Greece': 8,
  'Romania': 9,
  'Czechia': 6,
  'Denmark': 8,
  'Portugal': 4,
  'Austria': 4,
  'Hungary': 3,
};

// Klickbare Länder im Dropdown (Schritt 04 – gilt für die Auswahl im Menü)
const klickbareLaender = [
  'Germany', 'France', 'United Kingdom', 'Italy', 'Poland', 'Spain',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Belgium', 'Greece', 'Romania', 'Czechia', 'Portugal',
  'Hungary', 'Austria', 'Switzerland', 'Slovakia', 'Slovenia',
  'Croatia', 'Bulgaria', 'Ireland'
];

// Auf der Karte selbst im Vordergrund/klickbar bei Schritt 04: nur DE, FR, GB
const kartenFokusLaender = ['Germany', 'France', 'United Kingdom'];

const countryCodes = {
  'Germany': 'DE', 'France': 'FR', 'United Kingdom': 'GB', 'Italy': 'IT',
  'Spain': 'ES', 'Poland': 'PL', 'Netherlands': 'NL', 'Sweden': 'SE',
  'Finland': 'FI', 'Norway': 'NO', 'Belgium': 'BE', 'Greece': 'GR',
  'Romania': 'RO', 'Czechia': 'CZ', 'Denmark': 'DK', 'Portugal': 'PT',
  'Austria': 'AT', 'Hungary': 'HU', 'Ireland': 'IE', 'Switzerland': 'CH',
  'Slovakia': 'SK', 'Slovenia': 'SI', 'Croatia': 'HR', 'Bulgaria': 'BG',
  'Lithuania': 'LT', 'Latvia': 'LV', 'Estonia': 'EE', 'Iceland': 'IS',
  'Luxembourg': 'LU', 'Albania': 'AL', 'Serbia': 'RS', 'Bosnia and Herz.': 'BA',
  'Montenegro': 'ME', 'North Macedonia': 'MK', 'Kosovo': 'XK', 'Moldova': 'MD',
  'Ukraine': 'UA', 'Belarus': 'BY', 'Russia': 'RU', 'Turkey': 'TR',
  'Cyprus': 'CY', 'Malta': 'MT',
};

const stepConfigs = {
  '0': {
    highlight: null,
    scale: 1,
    center: [15, 52]
  },
  '1': {
    highlight: ['Germany'],
    scale: 2.2,
    center: [10.5, 51]
  },
  '2': {
    highlight: ['Germany', 'France', 'Italy', 'United Kingdom', 'Poland'],
    scale: 1.4,
    center: [8, 50]
  },
  '3': {
    highlight: kartenFokusLaender,
    scale: 1.7,
    center: [3, 50],
    klickbar: true
  }
};

let drawn = false;
let svg = null;
let mapGroup = null;
let pathsSelection = null;
let labelsSelection = null;
let projection = null;
let path = null;
let aktuellerStep = '0';
const baseScale = 560;
const baseCenter = [15, 52];
const width = 600;
const height = 600;

export function initEuropeMap() {
  if (drawn) return;
  drawn = true;

  const isDark = document.documentElement.classList.contains('dark');
  const noDataColor = isDark ? '#1c2333' : '#e2e8f0';
  const strokeColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  const labelBg = isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)';
  const labelText = isDark ? '#e6edf3' : '#0f172a';

  const colorScale = d3.scaleThreshold()
    .domain([5, 15, 30, 50, 70])
    .range(['#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#6ee7b7']);

  svg = d3.select('#europe-map')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  mapGroup = svg.append('g').attr('class', 'map-group');

  projection = d3.geoMercator()
    .center(baseCenter)
    .scale(baseScale)
    .translate([width / 2, height / 2]);

  path = d3.geoPath(projection);

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries).features;

      pathsSelection = mapGroup.selectAll('path')
        .data(countries)
        .join('path')
        .attr('d', path)
        .attr('class', d => 'country-path country-' + (countryCodes[d.properties.name] || 'xx'))
        .attr('fill', d => {
          const val = ausgaben[d.properties.name];
          return val ? colorScale(val) : noDataColor;
        })
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.8)
        .style('transition', 'fill 0.6s ease, opacity 0.8s ease, stroke-width 0.8s ease')
        .on('click', function(event, d) {
          // Nur in Schritt 04 (klickbar) und nur die aktuell im Fokus stehenden Länder
          if (!stepConfigs[aktuellerStep] || !stepConfigs[aktuellerStep].klickbar) return;
          const erlaubt = stepConfigs[aktuellerStep].highlight || klickbareLaender;
          if (!erlaubt.includes(d.properties.name)) return;
          openLandPanel(d.properties.name);
          markiereAktivesLand(d.properties.name);
        });

      pathsSelection.append('title')
        .text(d => {
          const val = ausgaben[d.properties.name];
          return val ? `${d.properties.name}: ${val} Mrd. €` : d.properties.name;
        });

      const fixedPositions = {
        'Norway': [10.5, 61],
        'Sweden': [15, 62],
        'Finland': [26, 64],
        'United Kingdom': [-2, 54],
        'Italy': [12.5, 43],
        'France': [2.5, 47],
      };

      labelsSelection = mapGroup.selectAll('g.country-label')
        .data(countries.filter(d => countryCodes[d.properties.name]))
        .join('g')
        .attr('class', 'country-label')
        .style('transition', 'opacity 0.8s ease')
        .attr('transform', d => {
          const name = d.properties.name;
          let pos;
          if (fixedPositions[name]) {
            pos = projection(fixedPositions[name]);
          } else {
            pos = path.centroid(d);
          }
          return `translate(${pos[0]}, ${pos[1]})`;
        })
        .each(function(d) {
          const g = d3.select(this);
          const code = countryCodes[d.properties.name];

          g.append('rect')
            .attr('x', -10)
            .attr('y', -7)
            .attr('width', 20)
            .attr('height', 14)
            .attr('rx', 3)
            .attr('fill', labelBg)
            .attr('stroke', 'rgba(0,0,0,0.3)')
            .attr('stroke-width', 0.5);

          g.append('text')
            .text(code)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '9px')
            .attr('font-weight', 'bold')
            .attr('fill', labelText)
            .style('pointer-events', 'none');
        });

      mapGroup.style('transition', 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)');

      // Initial: ausgezoomt + unsichtbar
      resetMap();

      // Beobachter starten
      setupScrollHighlight();
      setupIntroAnimation();
    });

  // Legende
  const legend = document.getElementById('map-legend');
  if (legend) {
    const items = [
      { c: '#6ee7b7', t: '> 70 Mrd.' },
      { c: '#93c5fd', t: '50–70' },
      { c: '#60a5fa', t: '30–50' },
      { c: '#3b82f6', t: '15–30' },
      { c: '#2563eb', t: '5–15' },
      { c: noDataColor, t: 'k. A.' },
    ];
    legend.innerHTML = items.map(i =>
      `<span><i style="background:${i.c}"></i>${i.t}</span>`
    ).join('');
  }
}

// Hebt das aktuell ausgewählte Land optisch hervor
export function markiereAktivesLand(name) {
  if (!pathsSelection) return;
  pathsSelection
    .style('stroke-width', d => d.properties.name === name ? 2.5 : 0.8)
    .attr('stroke', d => d.properties.name === name
      ? '#f59e0b'
      : (document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'));
}

// Setzt Karte auf "herausgezoomt + unsichtbar" zurück
function resetMap() {
  if (!mapGroup) return;
  mapGroup.style('transition', 'none');
  mapGroup.style('transform', 'translate(150px, 150px) scale(0.4)');
  mapGroup.style('transform-origin', '0 0');
  mapGroup.style('opacity', '0');
  // Force reflow damit Browser den Reset wirklich übernimmt
  void mapGroup.node().getBoundingClientRect();
  mapGroup.style('transition', 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease');
}

function setupScrollHighlight() {
  const steps = document.querySelectorAll('.scrolly-step');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepIndex = entry.target.getAttribute('data-step');
        applyStep(stepIndex);
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => stepObserver.observe(step));
}

function applyStep(stepIndex) {
  if (!pathsSelection || !labelsSelection || !mapGroup) return;

  aktuellerStep = stepIndex;
  const config = stepConfigs[stepIndex];
  if (!config) return;

  const targetPoint = projection(config.center);
  const cx = width / 2;
  const cy = height / 2;
  const dx = cx - targetPoint[0];
  const dy = cy - targetPoint[1];

  const tx = (cx - config.scale * (cx - dx));
  const ty = (cy - config.scale * (cy - dy));

  mapGroup.style('transition', 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease');
  mapGroup.style('opacity', '1');
  mapGroup.style('transform', `translate(${tx}px, ${ty}px) scale(${config.scale})`);
  mapGroup.style('transform-origin', `0 0`);

  const highlight = config.highlight;

  // Schritt 04: nur die im Fokus stehenden Länder hell + klickbar, Labels der anderen komplett ausblenden
  if (config.klickbar) {
    const fokus = highlight || klickbareLaender;
    pathsSelection
      .style('opacity', d => fokus.includes(d.properties.name) ? 1 : 0.15)
      .style('stroke-width', d => fokus.includes(d.properties.name) ? 1.5 : 0.6)
      .style('cursor', d => fokus.includes(d.properties.name) ? 'pointer' : 'default');
    labelsSelection.style('opacity', d => fokus.includes(d.properties.name) ? 1 : 0);
    return;
  }

  // Cursor zurücksetzen, wenn nicht klickbar
  pathsSelection.style('cursor', 'default');

  if (!highlight) {
    pathsSelection
      .style('opacity', 1)
      .style('stroke-width', 0.8);
    labelsSelection.style('opacity', 1);
  } else {
    pathsSelection
      .style('opacity', d => highlight.includes(d.properties.name) ? 1 : 0.2)
      .style('stroke-width', d => highlight.includes(d.properties.name) ? 1.5 : 0.5);

    // Labels nicht hervorgehobener Länder komplett ausblenden statt nur dimmen (verhindert Überlappungen wie "LU")
    labelsSelection
      .style('opacity', d => highlight.includes(d.properties.name) ? 1 : 0);
  }
}

function setupIntroAnimation() {
  const section = document.getElementById('section-allgemeines');
  const legendEl = document.getElementById('map-legend');
  if (!section || !mapGroup) return;

  if (legendEl) {
    legendEl.style.transition = 'opacity 0.5s ease';
    legendEl.style.opacity = '0';
  }

  const introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resetMap();
        if (legendEl) legendEl.style.opacity = '0';

        setTimeout(() => {
          mapGroup.style('opacity', '1');
          if (legendEl) legendEl.style.opacity = '1';
          applyStep('0');
        }, 100);
      } else {
        if (mapGroup) {
          mapGroup.style('transition', 'opacity 0.5s ease');
          mapGroup.style('opacity', '0');
        }
        if (legendEl) legendEl.style.opacity = '0';
      }
    });
  }, { threshold: 0.15 });

  introObserver.observe(section);
}