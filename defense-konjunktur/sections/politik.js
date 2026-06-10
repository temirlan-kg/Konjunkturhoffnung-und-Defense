import Highcharts from 'highcharts';

let chart = null;

export function initPolitik(force = false) {
  if (chart && !force) return;
  if (chart) { chart.destroy(); chart = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';
  const gridColor = isDark ? '#30363d' : '#e2e8f0';

  fetch('/data/politik.json')
    .then(res => res.json())
    .then(data => {
      chart = Highcharts.chart('chart-politik', {
        chart: { backgroundColor: 'transparent' },
        title: {
          text: 'Verteidigungsausgaben Deutschland & EU-27 (Mrd. €)',
          style: { color: textColor, fontSize: '16px' }
        },
        xAxis: {
          categories: data.zeitverlauf.categories,
          labels: { style: { color: mutedColor } }
        },
        yAxis: {
          title: { text: 'Milliarden Euro', style: { color: mutedColor } },
          labels: { style: { color: mutedColor } },
          gridLineColor: gridColor
        },
        legend: { itemStyle: { color: textColor } },
        series: [
          { name: 'Deutschland', data: data.zeitverlauf.deutschland, color: '#58a6ff', connectNulls: true },
          { name: 'EU-27', data: data.zeitverlauf.eu27, color: '#3fb950', connectNulls: true, dashStyle: 'Dash' }
        ],
        tooltip: { valueSuffix: ' Mrd. €' },
        credits: { enabled: false }
      });
    });
}