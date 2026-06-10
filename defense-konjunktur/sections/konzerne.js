import Highcharts from 'highcharts';

let chart = null;

export function initKonzerne(force = false) {
  if (chart && !force) return;
  if (chart) { chart.destroy(); chart = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';
  const gridColor = isDark ? '#30363d' : '#e2e8f0';

  fetch('/data/konzerne.json')
    .then(res => res.json())
    .then(data => {
      chart = Highcharts.chart('chart-konzerne', {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'DefTech Venture Capital in Deutschland (Mio. €)', style: { color: textColor, fontSize: '16px' } },
        xAxis: { categories: data.vc_defenstech.categories, labels: { style: { color: mutedColor } } },
        yAxis: { title: { text: 'Millionen Euro', style: { color: mutedColor } }, labels: { style: { color: mutedColor } }, gridLineColor: gridColor },
        legend: { itemStyle: { color: textColor } },
        series: [{ name: 'VC-Volumen', data: data.vc_defenstech.volumen_mio, color: '#f78166' }],
        tooltip: { valueSuffix: ' Mio. €' },
        credits: { enabled: false }
      });
    });
}