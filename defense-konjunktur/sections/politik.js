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
        chart: {
          type: 'column', /* 🚀 Geändert auf Säulendiagramm */
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Verteidigungsausgaben Deutschland & EU-27 (Mrd. €)',
          style: { color: textColor, fontSize: '16px' }
        },
        xAxis: {
          categories: data.zeitverlauf.categories,
          labels: { style: { color: mutedColor } },
          gridLineWidth: 0,
          lineWidth: 1,
          lineColor: gridColor
        },
        yAxis: {
          title: { text: 'Milliarden Euro', style: { color: mutedColor }, align: 'high' },
          labels: { style: { color: mutedColor }, overflow: 'justify' },
          gridLineColor: gridColor,
          gridLineWidth: 1
        },
        tooltip: {
          /* 🚀 Das erweiterte HTML-Tooltip aus deinem Beispiel */
          headerFormat: `<div style="display: flex; flex-direction: column; gap: 4px; padding: 4px;">
                          <div class="highcharts-header" style="font-weight: bold; margin-bottom: 4px;">
                              Jahr {point.key}
                          </div>`,
          pointFormat: `<div style="display: flex; align-items: center; gap: 8px;">
                          <svg width="10" height="12">
                              <rect width="10" height="12" fill="{series.color}" rx="2" />
                          </svg>
                          <span style="color: ${mutedColor}">{series.name}:</span>
                          <b style="margin-left: auto; padding-left: 0.5em">{point.y} Mrd. €</b>
                        </div>`,
          footerFormat: '</div>',
          useHTML: true,
          shared: true /* Zeigt Deutschland und EU-27 zusammen an */
        },
        legend: {
          itemStyle: { color: textColor }
        },
        plotOptions: {
          /* 🚀 Einstellungen für die Säulen (Abrundung und Zahlen über den Säulen) */
          column: {
            borderRadius: 4,
            dataLabels: {
              enabled: true,
              style: {
                color: textColor,
                textOutline: 'none'
              }
            },
            groupPadding: 0.2
          }
        },
        series: [
          {
            name: 'Deutschland',
            data: data.zeitverlauf.deutschland,
            color: '#1d4ed8' /* Schickes Blau aus deinem CSS */
          },
          {
            name: 'EU-27',
            data: data.zeitverlauf.eu27,
            color: '#059669' /* Schickes Grün aus deinem CSS */
          }
        ],
        credits: { enabled: false }
      });
    });
}