import Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';

let chart = null;

export function initMittelstand(force = false) {
  if (chart && !force) return;
  if (chart) { chart.destroy(); chart = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const subtitleColor = isDark ? '#8b949e' : '#475569';

  fetch('/data/mittelstand.json')
    .then(res => res.json())
    .then(data => {
      chart = Highcharts.chart('chart-mittelstand', {
        chart: { type: 'pie', backgroundColor: 'transparent', options3d: { enabled: true, alpha: 45 } },
        title: { text: 'Industriebetriebe & Defense-Markt (DIHK 2026)', style: { color: textColor, fontSize: '16px' } },
        subtitle: { text: 'Anteil der Unternehmen nach Marktstatus', style: { color: subtitleColor } },
        plotOptions: {
          pie: {
            innerSize: 100, depth: 45,
            dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %', style: { color: textColor, textOutline: 'none', fontWeight: 'bold' } }
          }
        },
        series: [{ name: 'Anteil', data: [
          { name: 'Bereits aktiv', y: 17, color: '#3fb950' },
          { name: 'Planen Einstieg', y: 12.3, color: '#58a6ff' },
          { name: 'Kein Interesse / Sonstiges', y: 70.7, color: '#64748b' }
        ]}],
        credits: { enabled: false }
      });
    });
}