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
  const gapColor = isDark ? '#6b7684' : '#94a3b8';

  function buildChart(data) {
    if (chart) { chart.destroy(); chart = null; }

    const istBip = modus === 'bip';
    const istWachstum = modus === 'wachstum';

    const rohCategories = data.zeitverlauf.categories;
    const abs = { de: data.zeitverlauf.deutschland, eu: data.zeitverlauf.eu27 };

    let roheDaten, einheit, yTitel, titelText;
    if (istWachstum) {
      roheDaten = {
        de: abs.de.map(v => Math.round((v / abs.de[0]) * 100)),
        eu: abs.eu.map(v => Math.round((v / abs.eu[0]) * 100))
      };
      einheit = '';
      yTitel = 'Index (2023 = 100)';
      titelText = 'Wachstum der Verteidigungsausgaben (Index, 2023 = 100)';
    } else if (istBip) {
      roheDaten = { de: data.zeitverlauf.deutschland_bip, eu: data.zeitverlauf.eu27_bip };
      einheit = '% des BIP';
      yTitel = '% des BIP';
      titelText = 'Verteidigungsausgaben Deutschland & EU-27 (% des BIP)';
    } else {
      roheDaten = { de: abs.de, eu: abs.eu };
      einheit = 'Mrd. €';
      yTitel = 'Milliarden Euro';
      titelText = 'Verteidigungsausgaben Deutschland & EU-27 (Mrd. €)';
    }

    // Lücke in den Jahren finden (z. B. 2026 -> 2029)
    let lueckeIndex = -1;
    let lueckeDiff = 0;
    for (let i = 0; i < rohCategories.length - 1; i++) {
      const a = parseInt(rohCategories[i], 10);
      const b = parseInt(rohCategories[i + 1], 10);
      if (!isNaN(a) && !isNaN(b) && (b - a) > 1) {
        lueckeIndex = i;
        lueckeDiff = b - a;
        break;
      }
    }

    // Kategorien & Daten aufbauen, ggf. mit leerer Spacer-Spalte an der Lücke
    let categories = [...rohCategories];
    let deData = [...roheDaten.de];
    let euData = [...roheDaten.eu];
    let spacerPos = null;

    if (lueckeIndex >= 0) {
      const insertAt = lueckeIndex + 1;
      categories.splice(insertAt, 0, '');
      deData.splice(insertAt, 0, null);
      euData.splice(insertAt, 0, null);
      spacerPos = insertAt;
    }

    // Letzten Punkt (Prognosejahr) optisch abheben, wenn eine Lücke existiert
    const forecastIndex = spacerPos !== null ? categories.length - 1 : -1;
    function alsForecast(arr, farbe) {
      return arr.map((v, i) => {
        if (i === forecastIndex && v !== null) {
          return { y: v, color: farbe, borderColor: farbe, borderWidth: 1, dashStyle: 'Dash' };
        }
        return v;
      });
    }

    const deColor = '#1d4ed8';
    const euColor = '#059669';
    const deSeriesData = forecastIndex >= 0 ? alsForecast(deData, 'rgba(29,78,216,0.45)') : deData;
    const euSeriesData = forecastIndex >= 0 ? alsForecast(euData, 'rgba(5,150,105,0.45)') : euData;

    // Kennzahl für Callout: Wachstum Deutschland seit erstem Jahr
    const deWachstumProzent = Math.round(((abs.de[abs.de.length - 1] / abs.de[0]) - 1) * 100);
    const euWachstumProzent = Math.round(((abs.eu[abs.eu.length - 1] / abs.eu[0]) - 1) * 100);

    chart = Highcharts.chart('chart-politik', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        animation: { duration: 1200 },
        events: {
          render: function () {
            const c = this;
            if (c.__zickzack) { c.__zickzack.destroy(); c.__zickzack = null; }
            if (spacerPos === null) return;

            const xPos = c.xAxis[0].toPixels(spacerPos, false);
            const top = c.plotTop;
            const bottom = c.plotTop + c.plotHeight;
            const zz = 6;
            const mid = top + (bottom - top) * 0.5;

            const path = [
              'M', xPos, top,
              'L', xPos, mid - 18,
              'L', xPos - zz, mid - 10,
              'L', xPos + zz, mid - 2,
              'L', xPos - zz, mid + 6,
              'L', xPos + zz, mid + 14,
              'L', xPos, mid + 22,
              'L', xPos, bottom
            ];

            c.__zickzack = c.renderer.path(path)
              .attr({
                'stroke-width': 1.5,
                stroke: gapColor,
                dashstyle: 'Dash',
                zIndex: 5
              })
              .add();
          }
        }
      },
      title: {
        text: titelText,
        style: { color: textColor, fontSize: '16px' }
      },

      xAxis: {
        categories: categories,
        labels: {
          style: { color: mutedColor },
          formatter: function () {
            return this.value === '' ? '' : this.value;
          }
        },
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: gridColor
      },
      yAxis: {
        title: { text: yTitel, style: { color: mutedColor } },
        labels: { style: { color: mutedColor } },
        gridLineWidth: 0,
        startOnTick: false,
        endOnTick: false,
        maxPadding: 0.1,
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
            text: `Basis ${rohCategories[0]}`,
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
          groupPadding: 0.15,
          pointPadding: 0.08
        }
      },
      series: [
        {
          name: 'Deutschland',
          data: deSeriesData,
          color: deColor
        },
        {
          name: 'EU-27',
          data: euSeriesData,
          color: euColor
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
