import Highcharts from 'highcharts';

let drawn = false;

export function initPolitik() {
  if (drawn) return;
  drawn = true;

  fetch('/data/politik.json')
    .then(res => res.json())
    .then(data => {
      Highcharts.chart('chart-politik', {
        chart: {
          backgroundColor: '#161b22'
        },
        title: {
          text: 'Verteidigungsausgaben Deutschland & EU-27 (Mrd. €)',
          style: { color: '#e6edf3' }
        },
        xAxis: {
          categories: data.zeitverlauf.categories,
          labels: { style: { color: '#8b949e' } }
        },
        yAxis: {
          title: { text: 'Milliarden Euro', style: { color: '#8b949e' } },
          labels: { style: { color: '#8b949e' } },
          gridLineColor: '#30363d'
        },
        legend: {
          itemStyle: { color: '#e6edf3' }
        },
        series: [
          {
            name: 'Deutschland',
            data: data.zeitverlauf.deutschland,
            color: '#58a6ff',
            connectNulls: true
          },
          {
            name: 'EU-27',
            data: data.zeitverlauf.eu27,
            color: '#3fb950',
            connectNulls: true,
            dashStyle: 'Dash'
          }
        ],
        tooltip: { valueSuffix: ' Mrd. €' },
        credits: { enabled: false }
      });
    });
}