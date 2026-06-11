import * as d3 from 'd3';
import * as topojson from 'topojson-client';

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

let drawn = false;

export function initEuropeMap() {
  if (drawn) return;
  drawn = true;

  const isDark = document.documentElement.classList.contains('dark');
  const noDataColor = isDark ? '#1c2333' : '#e2e8f0';
  const strokeColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';

  const colorScale = d3.scaleThreshold()
    .domain([5, 15, 30, 50, 70])
    .range(['#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#6ee7b7']);

  const width = 480;
  const height = 520;

  const svg = d3.select('#europe-map')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const projection = d3.geoMercator()
    .center([10, 54])
    .scale(380)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries).features;

      svg.selectAll('path')
        .data(countries)
        .join('path')
        .attr('d', path)
        /* 🚀 NEU: Gibt jedem Land seinen Namen als CSS-Klasse (z.B. class="country-path Germany") */
        .attr('class', d => `country-path ${d.properties.name.replace(/\s+/g, '-')}`)
        .attr('fill', d => {
          const val = ausgaben[d.properties.name];
          return val ? colorScale(val) : noDataColor;
        })
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.5)
        .style('transition', 'fill 0.4s ease, opacity 0.4s ease') /* Übergang für Scrollytelling animieren */
        .append('title')
        .text(d => {
          const val = ausgaben[d.properties.name];
          return val ? `${d.properties.name}: ${val} Mrd. €` : d.properties.name;
        });
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