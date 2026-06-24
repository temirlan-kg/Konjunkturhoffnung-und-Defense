import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';

let chartBubble = null;

export function initKonzerne(force = false) {
  // Wenn das Chart schon da ist und nicht erzwungen wird, nicht neu bauen
  if (chartBubble && !force) {
    if (chartBubble) chartBubble.reflow();
    return;
  }

  if (chartBubble) {
    chartBubble.destroy();
    chartBubble = null;
  }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';

  const target = document.getElementById('chart-bubble');
  if (!target) return;

  // WICHTIG: Erwirke eine feste Mindesthöhe im DOM, falls Highcharts sie verliert
  target.style.width = '100%';
  target.style.height = '550px';

  chartBubble = Highcharts.chart('chart-bubble', {
    chart: {
      type: 'bubble',
      backgroundColor: 'transparent',
      plotBorderWidth: 0,
      zooming: { type: 'xy' },
      height: 550,
      animation: { duration: 1000 }
    },
    title: {
      text: 'Rüstungsunternehmen im Vergleich',
      style: { color: textColor, fontSize: '16px', fontWeight: 'bold' }
    },
    subtitle: {
      text: 'X = Umsatzwachstum (%)  ·  Y = Defense-Anteil (%)  ·  Größe = Marktkapitalisierung',
      style: { color: mutedColor, fontSize: '11px' }
    },
    xAxis: {
      title: { text: 'Umsatzwachstum (%)', style: { color: mutedColor } },
      labels: { style: { color: mutedColor } },
      gridLineWidth: 1,
      gridLineColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      lineColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      tickColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      plotLines: [{
        color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        dashStyle: 'Dash',
        width: 1,
        value: 0
      }]
    },
    yAxis: {
      title: { text: 'Defense-Anteil (%)', style: { color: mutedColor } },
      labels: { style: { color: mutedColor } },
      gridLineWidth: 1,
      gridLineColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      startOnTick: false,
      endOnTick: false,
      plotLines: [{
        color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        dashStyle: 'Dash',
        width: 1,
        value: 50
      }]
    },
    legend: {
      enabled: true,
      itemStyle: { color: textColor },
      itemHoverStyle: { color: '#1d4ed8' }
    },
    tooltip: {
      useHTML: true,
      headerFormat: '',
      pointFormatter: function () {
        return `
          <div style="padding:6px; color: #000;">
            <b style="font-size:14px">${this.name}</b><br>
            Umsatzwachstum: <b>${this.x} %</b><br>
            Defense-Anteil: <b>${this.y} %</b><br>
            Marktkapitalisierung: <b>${this.z} Mrd. €</b><br>
            Bewertung: <b>${this.bewertung}</b>
          </div>
        `;
      }
    },
    plotOptions: {
      bubble: {
        minSize: 15,
        maxSize: 70,
        zMin: 0,
        zMax: 250,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: { color: textColor, textOutline: 'none', fontSize: '10px' }
        }
      }
    },
    series: [
      {
        name: 'Klassische Rüstung',
        color: 'rgba(88, 166, 255, 0.7)',
        data: [
          { name: 'Rheinmetall',         x: 36, y: 85, z: 28,  bewertung: 'Pivot erfolgreich' },
          { name: 'Hensoldt',            x: 18, y: 90, z: 6,   bewertung: 'Hohe Erwartungen' },
          { name: 'RENK',                x: 42, y: 95, z: 4,   bewertung: 'Risiko: Überbewertung' },
          { name: 'Thyssenkrupp Marine', x: 12, y: 70, z: 3,   bewertung: 'Solide, spezialisiert' },
        ]
      },
      {
        name: 'Defense-Pivot',
        color: 'rgba(63, 185, 80, 0.7)',
        data: [
          { name: 'Airbus Defence', x: 8,  y: 30, z: 12, bewertung: 'Diversifiziert' },
          { name: 'Diehl',          x: 22, y: 55, z: 2,  bewertung: 'Munition, stark' },
        ]
      },
      {
        name: 'Tech & Software',
        color: 'rgba(167, 139, 250, 0.7)',
        data: [
          { name: 'Palantir',    x: 55, y: 45, z: 180, bewertung: 'Hype möglich' },
          { name: 'SAP Defense', x: 10, y: 15, z: 220, bewertung: 'Randbereich' },
        ]
      },
      {
        name: 'Start-ups / DefTech',
        color: 'rgba(245, 158, 11, 0.7)',
        data: [
          { name: 'Helsing',         x: 120, y: 100, z: 1.7, bewertung: 'KI-Drohnen, sehr früh' },
          { name: 'Quantum Systems', x: 140, y: 100, z: 3,   bewertung: 'Drohnen, wächst schnell' },
          { name: 'ARX Robotics',    x: 110, y: 100, z: 0.5, bewertung: 'Bodenroboter, früh' },
        ]
      }
    ],
    credits: { enabled: false }
  });

  // Zwingt Highcharts, sich sofort an die Box-Größe anzupassen
  setTimeout(() => {
    if (chartBubble) chartBubble.reflow();
  }, 100);

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
  const section = document.querySelector('.konzerne-scrolly');
  const textContainer = document.querySelector('.konzerne-text');
  const steps = document.querySelectorAll('.konzerne-step');

  if (!section || !textContainer || window.innerWidth <= 1024) return;

  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    if (rect.top <= 0 && rect.bottom >= viewHeight) {
      const totalScrollableDistance = rect.height - viewHeight;
      const currentScrollProgress = Math.abs(rect.top);

      const maxTranslate = textContainer.scrollWidth - (window.innerWidth * 0.45);
      const percentage = Math.min(Math.max(currentScrollProgress / totalScrollableDistance, 0), 1);
      const translateX = percentage * maxTranslate;

      textContainer.style.transform = `translateX(-${translateX}px)`;

      // WICHTIG: Jedes Mal beim Scrollen das Chart updaten, damit es sichtbar bleibt
      if (chartBubble) chartBubble.reflow();
    } else if (rect.top > 0) {
      textContainer.style.transform = 'translateX(0px)';
    }
  });

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
    rootMargin: '0px -25% 0px -25%',
    threshold: 0.1
  });

  steps.forEach(step => stepObserver.observe(step));
}

function highlightSerie(serie) {
  if (!chartBubble || !serie) return;
  const ziel = serienNamen[serie];
  chartBubble.series.forEach(s => {
    s.update({ opacity: ziel === null ? 1 : (s.name === ziel ? 1 : 0.1) }, false);
  });
  chartBubble.redraw();
}