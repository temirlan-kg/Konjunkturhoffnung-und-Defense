import Highcharts from 'highcharts';

let chart = null;
let observer = null;
let cachedData = null;
let modus = 'absolut'; // 'absolut', 'bip' oder 'wachstum'

export function initPolitik(force = false) {
  if (chart && !force) return;
  if (chart) { chart.destroy(); chart = null; }
  if (observer) { observer.disconnect(); observer = null; }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e6edf3' : '#0f172a';
  const mutedColor = isDark ? '#8b949e' : '#475569';
  const gridColor = isDark ? '#30363d' : '#e2e8f0';

  function buildChart(data) {
    if (chart) { chart.destroy(); chart = null; }

    const istBip = modus === 'bip';
    const istWachstum = modus === 'wachstum';

    const abs = { de: data.zeitverlauf.deutschland, eu: data.zeitverlauf.eu27 };

    let serienDaten, einheit, yTitel, titelText;
    if (istWachstum) {
      // Index: jeder Wert relativ zum Startjahr (2023 = 100)
      serienDaten = {
        de: abs.de.map(v => Math.round((v / abs.de[0]) * 100)),
        eu: abs.eu.map(v => Math.round((v / abs.eu[0]) * 100))
      };
      einheit = '';
      yTitel = 'Index (2023 = 100)';
      titelText = 'Wachstum der Verteidigungsausgaben (Index, 2023 = 100)';
    } else if (istBip) {
      serienDaten = { de: data.zeitverlauf.deutschland_bip, eu: data.zeitverlauf.eu27_bip };
      einheit = '% des BIP';
      yTitel = '% des BIP';
      titelText = 'Verteidigungsausgaben Deutschland & EU-27 (% des BIP)';
    } else {
      serienDaten = { de: abs.de, eu: abs.eu };
      einheit = 'Mrd. €';
      yTitel = 'Milliarden Euro';
      titelText = 'Verteidigungsausgaben Deutschland & EU-27 (Mrd. €)';
    }

    chart = Highcharts.chart('chart-politik', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        animation: { duration: 1200 }
      },
      title: {
        text: titelText,
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
        title: { text: yTitel, style: { color: mutedColor } },
        labels: { style: { color: mutedColor } },
        gridLineWidth: 0,
        plotLines: istBip ? [{
          color: '#f59e0b',
          dashStyle: 'Dash',
          width: 1.5,
          value: 2,
          label: {
            text: 'NATO-Ziel 2 %',
            style: { color: '#f59e0b', fontSize: '10px' }
          },
          zIndex: 5
        }] : (istWachstum ? [{
          color: mutedColor,
          dashStyle: 'Dash',
          width: 1,
          value: 100,
          label: {
            text: 'Basis 2023',
            style: { color: mutedColor, fontSize: '10px' }
          },
          zIndex: 5
        }] : [])
      },
      tooltip: {
        headerFormat: `<div style="display: flex; flex-direction: column; gap: 4px; padding: 4px;">
                        <div class="highcharts-header" style="font-weight: bold; margin-bottom: 4px;">
                            Jahr {point.key}
                        </div>`,
        pointFormat: `<div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="10" height="12">
                            <rect width="10" height="12" fill="{series.color}" rx="2" />
                        </svg>
                        <span style="color: ${mutedColor}">{series.name}:</span>
                        <b style="margin-left: auto; padding-left: 0.5em">{point.y} ${einheit}</b>
                      </div>`,
        footerFormat: '</div>',
        useHTML: true,
        shared: true
      },
      legend: {
        itemStyle: { color: textColor }
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          animation: { duration: 1200 },
          dataLabels: {
            enabled: true,
            style: { color: textColor, textOutline: 'none' },
            format: istBip ? '{point.y} %' : '{point.y}'
          },
          groupPadding: 0.2
        }
      },
      series: [
        {
          name: 'Deutschland',
          data: serienDaten.de,
          color: '#1d4ed8'
        },
        {
          name: 'EU-27',
          data: serienDaten.eu,
          color: '#059669'
        }
      ],
      credits: { enabled: false }
    });
  }

  function setupToggle(data) {
    const btnAbsolut = document.getElementById('toggle-absolut');
    const btnBip = document.getElementById('toggle-bip');
    const btnWachstum = document.getElementById('toggle-wachstum');
    if (!btnAbsolut || !btnBip) return;

    function aktualisiere() {
      btnAbsolut.classList.toggle('aktiv', modus === 'absolut');
      btnBip.classList.toggle('aktiv', modus === 'bip');
      if (btnWachstum) btnWachstum.classList.toggle('aktiv', modus === 'wachstum');
    }

    btnAbsolut.onclick = () => { modus = 'absolut'; aktualisiere(); buildChart(data); };
    btnBip.onclick = () => { modus = 'bip'; aktualisiere(); buildChart(data); };
    if (btnWachstum) btnWachstum.onclick = () => { modus = 'wachstum'; aktualisiere(); buildChart(data); };

    aktualisiere();
  }

  function setupObserver(data) {
    const target = document.getElementById('chart-politik');
    if (!target) return;

    setupToggle(data);
    buildChart(data);

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          buildChart(data);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(target);
  }

  if (cachedData) {
    setupObserver(cachedData);
  } else {
    fetch(`${import.meta.env.BASE_URL}data/politik.json`)
      .then(res => res.json())
      .then(data => {
        cachedData = data;
        setupObserver(data);
      });
  }
}