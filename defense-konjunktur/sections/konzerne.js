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
        gridLineWidth: 1,
        gridLineColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        gridLineDashStyle: 'Dash',
        lineColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        lineWidth: 1,
        tickColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        tickWidth: 1,
        plotLines: [{
          color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
          dashStyle: 'Dash',
          width: 1,
          value: 0,
          label: { text: 'Kein Wachstum', style: { color: mutedColor, fontSize: '10px' } }
        }]
      },
      yAxis: {
        title: { text: 'Defense-Anteil (%)', style: { color: mutedColor } },
        labels: { style: { color: mutedColor } },
        gridLineWidth: 1,
        gridLineColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        gridLineDashStyle: 'Dash',
        lineColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        lineWidth: 1,
        tickColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        tickWidth: 1,
        startOnTick: false,
        endOnTick: false,
        plotLines: [{
          color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
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
        bubble: {
          minSize: 18,
          maxSize: 90,
          animation: { duration: 1400 },
          marker: { states: { hover: { enabled: true, lineWidth: 2 } } }
        },
        series: { animation: { duration: 1400 } }
      },
      series: [
    {
      name: 'Klassische Rüstung',
      color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#58a6ff']] },
      data: [
        { name: 'Rheinmetall',         x: 36, y: 85, z: 40,  bewertung: 'Pivot erfolgreich' },
        { name: 'Hensoldt',            x: 18, y: 90, z: 15,  bewertung: 'Hohe Erwartungen' },
        { name: 'RENK',                x: 42, y: 95, z: 12,  bewertung: 'Risiko: Überbewertung' },
        { name: 'Thyssenkrupp Marine', x: 12, y: 70, z: 10,  bewertung: 'Solide, spezialisiert' },
      ]
    },
    {
      name: 'Defense-Pivot',
      color: { radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 }, stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#6ee7b7']] },
      data: [
        { name: 'Airbus Defence', x: 8,  y: 30, z: 22, bewertung: 'Diversifiziert' },
        { name: 'Diehl',          x: 22, y: 55, z: 12, bewertung: 'Munition, stark' },
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
        { name: 'Helsing',         x: 120, y: 100, z: 18, bewertung: 'KI-Drohnen, sehr früh' },
        { name: 'Quantum Systems', x: 200, y: 100, z: 25, bewertung: 'Drohnen, wächst schnell' },
        { name: 'ARX Robotics',    x: 180, y: 100, z: 12, bewertung: 'Bodenroboter, früh' },
      ]
    }
  ],
  credits: { enabled: false },
  responsive: {
    rules: [{
      condition: { maxWidth: 500 },
      chartOptions: {
        chart: { height: 380 },
        title: { style: { fontSize: '13px' } },
        subtitle: { style: { fontSize: '9px' } },
        legend: { itemStyle: { fontSize: '11px' } }
      }
    }]
  }
});

    chartBubble.reflow();
  }

  const target = document.getElementById('chart-bubble');
  if (!target) return;

  buildChart();
  setupScrollytelling();
  setupChartFadeOut();
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
    rootMargin: '-10% 0px -20% 0px',
    threshold: 0.15
  });

  steps.forEach(step => stepObserver.observe(step));
}

function setupChartFadeOut() {
  const lastStep = document.querySelector('.konzerne-step-last');
  const chartWrap = document.getElementById('konzerneChartWrap');
  if (!lastStep || !chartWrap) return;

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const rect = entry.boundingClientRect;
      const rootRect = entry.rootBounds;

      if (!entry.isIntersecting && rootRect && rect.bottom < rootRect.top) {
        chartWrap.classList.add('fade-out');
      } else {
        chartWrap.classList.remove('fade-out');
      }
    });
  }, {
    root: null,
    threshold: 0
  });

  fadeObserver.observe(lastStep);
}

function highlightSerie(serie) {
  if (!chartBubble) return;
  const ziel = serienNamen[serie];

  chartBubble.series.forEach(s => {
    const istAktiv = ziel === null || s.name === ziel;
    const istAlleModus = ziel === null;

    s.update({
      opacity: istAktiv ? 1 : 0.15,
      marker: {
        fillOpacity: istAktiv ? 0.85 : 0.15,
        lineWidth: istAktiv && !istAlleModus ? 3 : 1,
        lineColor: istAktiv && !istAlleModus ? 'rgba(255,255,255,0.6)' : undefined,
        states: {
          hover: { enabled: true, lineWidth: 2 }
        }
      }
    }, false);

    s.points.forEach(point => {
      if (istAktiv && !istAlleModus) {
        point.update({
          marker: {
            radius: undefined,
            radiusPlus: 12
          }
        }, false);
      } else {
        point.update({
          marker: {
            radius: undefined,
            radiusPlus: 0
          }
        }, false);
      }
    });
  });

  chartBubble.redraw(true);
}