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

// ISO-2 Ländercodes für die Labels
const countryCodes = {
  'Germany': 'DE',
  'France': 'FR',
  'United Kingdom': 'GB',
  'Italy': 'IT',
  'Spain': 'ES',
  'Poland': 'PL',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Finland': 'FI',
  'Norway': 'NO',
  'Belgium': 'BE',
  'Greece': 'GR',
  'Romania': 'RO',
  'Czechia': 'CZ',
  'Denmark': 'DK',
  'Portugal': 'PT',
  'Austria': 'AT',
  'Hungary': 'HU',
  'Ireland': 'IE',
  'Switzerland': 'CH',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Croatia': 'HR',
  'Bulgaria': 'BG',
  'Lithuania': 'LT',
  'Latvia': 'LV',
  'Estonia': 'EE',
  'Iceland': 'IS',
  'Luxembourg': 'LU',
  'Albania': 'AL',
  'Serbia': 'RS',
  'Bosnia and Herz.': 'BA',
  'Montenegro': 'ME',
  'North Macedonia': 'MK',
  'Kosovo': 'XK',
  'Moldova': 'MD',
  'Ukraine': 'UA',
  'Belarus': 'BY',
  'Russia': 'RU',
  'Turkey': 'TR',
  'Cyprus': 'CY',
  'Malta': 'MT',
};

let drawn = false;

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

  const width = 600;
  const height = 600;

  const svg = d3.select('#europe-map')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const projection = d3.geoMercator()
    .center([15, 52])
    .scale(560)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath(projection);

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries).features;

      // Länder zeichnen
      svg.selectAll('path')
        .data(countries)
        .join('path')
        .attr('d', path)
        .attr('fill', d => {
          const val = ausgaben[d.properties.name];
          return val ? colorScale(val) : noDataColor;
        })
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.8)
        .style('transition', 'fill 0.3s ease')
        .append('title')
        .text(d => {
          const val = ausgaben[d.properties.name];
          return val ? `${d.properties.name}: ${val} Mrd. €` : d.properties.name;
        });

      // Ländercodes als Labels hinzufügen
      svg.selectAll('g.country-label')
        .data(countries.filter(d => countryCodes[d.properties.name]))
        .join('g')
        .attr('class', 'country-label')
        .attr('transform', d => {
          const centroid = path.centroid(d);
          return `translate(${centroid[0]}, ${centroid[1]})`;
        })
        .each(function(d) {
          const g = d3.select(this);
          const code = countryCodes[d.properties.name];

          // Hintergrund-Rechteck für Label
          g.append('rect')
            .attr('x', -10)
            .attr('y', -7)
            .attr('width', 20)
            .attr('height', 14)
            .attr('rx', 3)
            .attr('fill', labelBg)
            .attr('stroke', 'rgba(0,0,0,0.3)')
            .attr('stroke-width', 0.5);

          // Text
          g.append('text')
            .text(code)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '9px')
            .attr('font-weight', 'bold')
            .attr('fill', labelText)
            .style('pointer-events', 'none');
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