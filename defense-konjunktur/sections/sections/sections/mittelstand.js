import Highcharts from 'highcharts';

let drawn = false;

export function initMittelstand() {
  if (drawn) return;
  drawn = true;

  fetch('/data/mittelstand.json')
    .then(res => res.json())
    .then(data => {
      Highcharts.chart('chart-mittelstand', {
        chart: {
          type: 'pie',
          backgroundColor: '#161b22'
        },
        title: {
          text: 'Industriebetriebe & Defense-Markt (DIHK 2026)',
          style: { color: '#e6edf3' }
        },
        plotOptions: {
          pie: {
            innerSize: '50%',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: { color: '#e6edf3' }
            }
          }
        },
        series: [{
          name: 'Anteil',
          colorByPoint: true,
          data: data.marktstatus
        }],
        colors: ['#3fb950', '#58a6ff', '#30363d'],
        credits: { enabled: false }
      });
    });
}