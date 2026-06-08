import Highcharts from 'highcharts';

let drawn = false;

export function initKonzerne() {
  if (drawn) return;
  drawn = true;

  fetch('/data/konzerne.json')
    .then(res => res.json())
    .then(data => {
      Highcharts.chart('chart-konzerne', {
        chart: {
          type: 'column',
          backgroundColor: '#161b22'
        },
        title: {
          text: 'DefTech Venture Capital in Deutschland (Mio. €)',
          style: { color: '#e6edf3' }
        },
        xAxis: {
          categories: data.vc_defenstech.categories,
          labels: { style: { color: '#8b949e' } }
        },
        yAxis: {
          title: { text: 'Millionen Euro', style: { color: '#8b949e' } },
          labels: { style: { color: '#8b949e' } },
          gridLineColor: '#30363d'
        },
        series: [{
          name: 'VC-Volumen',
          data: data.vc_defenstech.volumen_mio,
          color: '#f78166'
        }],
        tooltip: { valueSuffix: ' Mio. €' },
        credits: { enabled: false }
      });
    });
}