import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';

let chartBubble = null;

export function initKonzerne(force = false) {
  if (chartBubble && !force) return;
  if (chartBubble) { chartBubble.destroy(); chartBubble = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';

  function buildChart() {
    if (chartBubble) { chartBubble.destroy(); chartBubble = null; }

    chartBubble = Highcharts.chart('chart-bubble', {
      chart: {
        type: 'bubble',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        zooming: { type: 'xy' },
        height: 650,
        animation: { duration: 1400 }
      },
      title: {
        text: 'Rüstungsunternehmen im Vergleich',
        style: { color: textColor, fontSize: '16px' }
      },
      subtitle: {
        text: 'X = Umsatzwachstum (%)  ·  Y = Defense-Anteil (%)  ·  Größe = Marktkapitalisierung (Mrd. €)',
        style: { color: mutedColor, fontSize: '11px' }
      },
      xAxis: {
        title: { text: 'Umsatzwachstum (%)', style: { color: mutedColor } },
        labels: { style: { color: mutedColor } },
        gridLineWidth: 0,
        lineColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        tickColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        plotLines: [{
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          dashStyle: 'Dash',
          width: 1,
          value: 0,
          label: { text: 'Kein Wachstum', style: { color: mutedColor, fontSize: '10px' } }
        }]
      },
      yAxis: {
        title: { text: 'Defense-Anteil (%)', style: { color: mutedColor } },
        labels: { style: { color: mutedColor } },
        gridLineWidth: 0,
        startOnTick: false,
        endOnTick: false,
        plotLines: [{
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          dashStyle: 'Dash',
          width: 1,
          value: 50,
          label: { text: '50 % Defense', style: { color: mutedColor, fontSize: '10px' } }
        }]
      },
      legend: { enabled: true, itemStyle: { color: textColor } },
      tooltip: {
        useHTML: true,
        headerFormat: '',
        pointFormatter: function () {
          return `
            <div style="padding:6px">
              <b style="font-size:14px">${this.name}</b><br>
              <span style="color:${mutedColor}">Umsatzwachstum:</span> <b>${this.x} %</b><br>
              <span style="color:${mutedColor}">Defense-Anteil:</span> <b>${this.y} %</b><br>
              <span style="color:${mutedColor}">Marktkapitalisierung:</span> <b>${this.z} Mrd. €</b><br>
              <span style="color:${mutedColor}">Bewertung:</span> <b>${this.bewertung}</b>
            </div>
          `;
        }
      },
      plotOptions: {
        bubble: { animation: { duration: 1400 }, marker: { states: { hover: { enabled: true, lineWidth: 2 } } } },
        series: { animation: { duration: 1400 } }
      },
      series: [
        {
          name: 'Klassische Rüstung',
          color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#58a6ff']] },
          data: [
            { name: 'Rheinmetall',         x: 36, y: 85, z: 28,  bewertung: 'Pivot erfolgreich' },
            { name: 'Hensoldt',            x: 18, y: 90, z: 6,   bewertung: 'Hohe Erwartungen' },
            { name: 'RENK',                x: 42, y: 95, z: 4,   bewertung: 'Risiko: Überbewertung' },
            { name: 'Thyssenkrupp Marine', x: 12, y: 70, z: 3,   bewertung: 'Solide, spezialisiert' },
          ]
        },
        {
          name: 'Defense-Pivot',
          color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#3fb950']] },
          data: [
            { name: 'Airbus Defence', x: 8,  y: 30, z: 12, bewertung: 'Diversifiziert' },
            { name: 'Diehl',          x: 22, y: 55, z: 2,  bewertung: 'Munition, stark' },
          ]
        },
        {
          name: 'Tech & Software',
          color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#a78bfa']] },
          data: [
            { name: 'Palantir',    x: 55, y: 45, z: 180, bewertung: 'Hype möglich' },
            { name: 'SAP Defense', x: 10, y: 15, z: 220, bewertung: 'Randbereich' },
          ]
        },
        {
          name: 'Start-ups / DefTech',
          color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#f59e0b']] },
          data: [
            { name: 'Helsing',         x: 120, y: 100, z: 1.7, bewertung: 'KI-Drohnen, sehr früh' },
            { name: 'Quantum Systems', x: 200, y: 100, z: 3,   bewertung: 'Drohnen, wächst schnell' },
            { name: 'ARX Robotics',    x: 180, y: 100, z: 0.5, bewertung: 'Bodenroboter, früh' },
          ]
        }
      ],
      credits: { enabled: false }
    });

    chartBubble.reflow();
  }

  const target = document.getElementById('chart-bubble');
  if (!target) return;

  buildChart();
  setupScrollytelling();
}

const serienNamen = {
  all:       null,
  klassisch: 'Klassische Rüstung',
  pivot:     'Defense-Pivot',
  tech:      'Tech & Software',
  startup:   'Start-ups / DefTech'
};

function setupScrollytelling() {
  const steps = document.querySelectorAll('.konzerne-step');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach(s => s.classList.remove('is-active'));
        entry.target.classList.add('is-active');
        highlightSerie(entry.target.getAttribute('data-serie'));
      }
    });
  }, {
    root: null,
    // -10% oben und -20% unten gibt dem letzten Schritt maximalen Spielraum zum Aktivieren
    rootMargin: '-10% 0px -20% 0px',
    threshold: 0.15
  });

  steps.forEach(step => stepObserver.observe(step));
}

function highlightSerie(serie) {
  if (!chartBubble) return;
  const ziel = serienNamen[serie];
  chartBubble.series.forEach(s => {
    s.update({ opacity: ziel === null ? 1 : (s.name === ziel ? 1 : 0.1) }, false);
  });
  chartBubble.redraw();
}