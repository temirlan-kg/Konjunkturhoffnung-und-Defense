import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';

let chartBubble = null;

export function initKonzerne(force = false) {
  if (chartBubble && !force) return;
  if (chartBubble) { chartBubble.destroy(); chartBubble = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';

  chartBubble = Highcharts.chart('chart-bubble', {
    chart: {
      type: 'bubble',
      backgroundColor: 'transparent',
      plotBorderWidth: 0,
      zooming: { type: 'xy' }
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
        label: {
          text: 'Kein Wachstum',
          style: { color: mutedColor, fontSize: '10px' }
        }
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
        label: {
          text: '50 % Defense',
          style: { color: mutedColor, fontSize: '10px' }
        }
      }]
    },
    legend: {
      enabled: true,
      itemStyle: { color: textColor }
    },
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
    series: [
      {
        name: 'Klassische Rüstung',
        color: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#58a6ff']]
        },
        data: [
          { name: 'Rheinmetall',        x: 36,  y: 85, z: 28,  bewertung: 'Pivot erfolgreich' },
          { name: 'Hensoldt',           x: 18,  y: 90, z: 6,   bewertung: 'Hohe Erwartungen' },
          { name: 'RENK',               x: 42,  y: 95, z: 4,   bewertung: 'Risiko: Überbewertung' },
          { name: 'Thyssenkrupp Marine',x: 12,  y: 70, z: 3,   bewertung: 'Solide, spezialisiert' },
        ]
      },
      {
        name: 'Defense-Pivot',
        color: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#3fb950']]
        },
        data: [
          { name: 'Airbus Defence', x: 8,  y: 30, z: 12, bewertung: 'Diversifiziert' },
          { name: 'Diehl',          x: 22, y: 55, z: 2,  bewertung: 'Munition, stark' },
        ]
      },
      {
        name: 'Tech & Software',
        color: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#a78bfa']]
        },
        data: [
          { name: 'Palantir',    x: 55, y: 45, z: 180, bewertung: 'Hype möglich' },
          { name: 'SAP Defense', x: 10, y: 15, z: 220, bewertung: 'Randbereich' },
        ]
      },
      {
        name: 'Start-ups / DefTech',
        color: {
          radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
          stops: [[0, 'rgba(255,255,255,0.8)'], [1, '#f59e0b']]
        },
        data: [
          { name: 'Helsing',         x: 120, y: 100, z: 1.7, bewertung: 'KI-Drohnen, sehr früh' },
          { name: 'Quantum Systems', x: 200, y: 100, z: 3,   bewertung: 'Drohnen, wächst schnell' },
          { name: 'ARX Robotics',    x: 180, y: 100, z: 0.5, bewertung: 'Bodenroboter, früh' },
        ]
      }
    ],
    credits: { enabled: false }
  });
}