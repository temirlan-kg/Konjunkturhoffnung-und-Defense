 import Highcharts from 'highcharts';

let chart = null;
let observer = null;

export function initMittelstand(force = false) {
  if (chart && !force) return;
  if (chart) { chart.destroy(); chart = null; }
  if (observer) { observer.disconnect(); observer = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const subtitleColor = isDark ? '#8b949e' : '#475569';

  const segments = [
    { name: 'Kein Interesse / Sonstiges', y: 70.7, color: '#64748b', direction: 'left' },
    { name: 'Bereits aktiv', y: 17, color: '#3fb950', direction: 'right' },
    { name: 'Planen Einstieg', y: 12.3, color: '#58a6ff', direction: 'right' }
  ];

  function buildChart() {
    if (chart) { chart.destroy(); chart = null; }

    chart = Highcharts.chart('chart-mittelstand', {
      chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        animation: false,
        events: {
          load: function() {
            // Animation für jedes Segment
            this.series[0].points.forEach((point, i) => {
              const seg = segments[i];
              if (!seg) return;

              setTimeout(() => {
                if (point.graphic && point.graphic.element) {
                  const el = point.graphic.element;
                  const startX = seg.direction === 'left' ? -400 : 400;

                  el.style.transition = 'none';
                  el.style.transform = `translateX(${startX}px)`;
                  el.style.opacity = '0';

                  requestAnimationFrame(() => {
                    el.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out';
                    el.style.transform = 'translateX(0)';
                    el.style.opacity = '1';
                  });
                }

                // Data Label auch animieren
                if (point.dataLabel && point.dataLabel.element) {
                  const lbl = point.dataLabel.element;
                  lbl.style.transition = 'opacity 0.6s ease-out';
                  lbl.style.opacity = '0';
                  setTimeout(() => {
                    lbl.style.opacity = '1';
                  }, 400);
                }
              }, i * 700);
            });
          }
        }
      },
      title: {
        text: 'Mittelstand<br>im<br>Defense-Markt',
        align: 'center',
        verticalAlign: 'middle',
        y: 40,
        style: {
          fontSize: '1.1em',
          color: textColor,
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: 'Quelle: DIHK-Konjunkturumfrage April 2026',
        align: 'center',
        verticalAlign: 'bottom',
        style: { color: subtitleColor, fontSize: '11px' }
      },
      tooltip: {
        pointFormat: '<b>{point.name}</b>: {point.percentage:.1f} %'
      },
      plotOptions: {
        pie: {
          animation: false,
          dataLabels: {
            enabled: true,
            distance: -40,
            style: {
              fontWeight: 'bold',
              color: 'white',
              textOutline: 'none',
              fontSize: '12px'
            },
            format: '{point.percentage:.1f} %'
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%',
          borderWidth: 0
        }
      },
      series: [{
        type: 'pie',
        name: 'Marktstatus',
        innerSize: '50%',
        data: segments.map(s => ({ name: s.name, y: s.y, color: s.color }))
      }],
      credits: { enabled: false }
    });
  }

  const target = document.getElementById('chart-mittelstand');
  if (!target) return;

  buildChart();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        buildChart();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(target);
}