# Konjunkturhoffnung und Defense

> Interaktive Datenvisualisierungs-Website zum Zusammenhang zwischen der europäischen Verteidigungsbranche und der wirtschaftlichen Entwicklung in Deutschland.

**Universitätsprojekt** — TH Nürnberg Georg Simon Ohm
Kurs: Data Motion / Interaction (Mirko Schramm), Sommersemester 2026

## Über das Projekt

Seit der Zeitenwende 2022 investieren europäische Staaten wieder systematisch in ihre Verteidigungsfähigkeit — militärisch und industriell. Die Website analysiert diesen Wandel datenbasiert und visuell zugänglich.

**These:** Der Rüstungsboom ist Realität — ob er zur Konjunkturhoffnung wird, entscheiden die nächsten Jahre.

## Sections

| Section | Visualisierung | Quelle |
|---------|----------------|--------|
| Allgemeines | Choropleth-Karte (D3.js + TopoJSON) | NATO, EDA Defence Data |
| Politik | Multi-Series Column Chart (Highcharts) | Bundestag, BMVg, EDA 2024–2025 |
| Mittelstand | Semi-Circle Donut Chart (Highcharts) | DIHK-Konjunkturumfrage April 2026 |
| Unternehmen | Bubble Chart + Metric Cards (Highcharts) | EY/Deka 2025, Bitkom DefTech Report 2026 |

## Tech-Stack

- **HTML5, CSS3, JavaScript (Vanilla, ES6+)** — Struktur, Styling, Logik
- **Vite** — Build-Tool mit Hot-Module-Reload
- **Highcharts** — Balken-, Donut- und Bubble-Charts
- **D3.js + TopoJSON** — Europa-Karte
- **Scrollama / Intersection Observer API** — Scroll-Animationen

## Installation & Start

Voraussetzung: Node.js v18 oder höher und npm.

\`\`\`bash
git clone https://github.com/dein-username/defense-konjunktur.git
cd defense-konjunktur
npm install
npm run dev
\`\`\`

Die Website ist anschließend unter \`http://localhost:5173/\` erreichbar.
Production-Build mit \`npm run build\`.

## Datenquellen

- **NATO** — Defence Expenditure Database
- **European Defence Agency (EDA)** — Defence Data 2024–2025
- **Bundestag / BMVg** — Haushaltspläne und Mittelplanung
- **DIHK** — Konjunkturumfrage April 2026
- **BDSV** — Bundesverband der Deutschen Sicherheits- und Verteidigungsindustrie
- **EY/Deka 2025, McKinsey, Universität Mannheim, Bitkom DefTech Report 2026**

## Team

- Temirlan Anarkulov
- Semanur Asalioglu
- Manuel Nseguet Tchamfa

**Stand:** Juni 2026 