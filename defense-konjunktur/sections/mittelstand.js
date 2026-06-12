import Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';

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
        type: 'pie',
        backgroundColor: 'transparent',
        options3d: { enabled: true, alpha: 45 },
        animation: false,
        events: {
          load: function() {
            // Alle Segmente sofort unsichtbar machen
            this.series[0].points.forEach(point => {
              if (point.graphic && point.graphic.element) {
                point.graphic.element.style.opacity = '0';
              }
            });

            // Dann nacheinander reinfliegen lassen
            segments.forEach((seg, i) => {
              setTimeout(() => {
                if (!this.series[0] || !this.series[0].points[i]) return;
                const point = this.series[0].points[i];
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
              }, i * 900);
            });
          }
        }
      },
      title: {
        text: 'Industriebetriebe & Defense-Markt (DIHK 2026)',
        style: { color: textColor, fontSize: '16px' }
      },
      subtitle: {
        text: 'Anteil der Unternehmen nach Marktstatus',
        style: { color: subtitleColor }
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
          animation: false,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: { color: textColor, textOutline: 'none', fontWeight: 'bold' }
          }
        }
      },
      series: [{
        name: 'Anteil',
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