# Konjunkturhoffnung und Defense

> Eine interaktive Datenvisualisierungs-Website zum Zusammenhang zwischen der europäischen Verteidigungsbranche und der wirtschaftlichen Entwicklung in Deutschland.

**Universitätsprojekt** — TH Nürnberg Georg Simon Ohm
**Kurs:** Data Motion / Interaction (Mirko Schramm)
**Sommersemester 2026**

---

## Über das Projekt

Seit der Zeitenwende 2022 hat sich die sicherheitspolitische Lage in Europa grundlegend verändert. Staaten investieren wieder systematisch in ihre Verteidigungsfähigkeit — nicht nur militärisch, sondern auch industriell. Diese Website analysiert diesen Wandel datenbasiert und visuell zugänglich.

**These:** *Der Rüstungsboom ist Realität — ob er zur Konjunkturhoffnung wird, entscheiden die nächsten Jahre.*

### Zielgruppe
- Unternehmen
- Mittelständische Unternehmer

### Gestaltungsprinzipien
- Niedrigschwellig
- Faktennah
- Visuell stark
- Quellenbasiert

---

## Features

- **Interaktive Europa-Karte** mit Verteidigungsausgaben pro Land
- **Vier datengetriebene Visualisierungen** (Karte, Donut, Balken, Bubble)
- **Scroll-getriggerte Animationen** mit Intersection Observer API
- **Dark- und Light-Mode** mit dynamischem Chart-Re-Rendering
- **Sticky-Split-Screen-Layout** für Storytelling
- **Hot-Module-Reload** über Vite

---

## Sections

| Section | Visualisierung | Quelle |
|---------|----------------|--------|
| **Allgemeines** | Choropleth-Karte (D3.js + TopoJSON) | NATO, EDA Defence Data |
| **Politik** | Multi-Series Column Chart (Highcharts) | Bundestag, BMVg, EDA 2024–2025 |
| **Mittelstand** | Semi-Circle Donut Chart (Highcharts) | DIHK-Konjunkturumfrage April 2026 |
| **Unternehmen** | Bubble Chart + Metric Cards (Highcharts) | EY/Deka 2025, Bitkom DefTech Report 2026 |

---

## 🛠️ Tech-Stack

### Entwicklungsumgebung
- **PyCharm** — Code-Editor
- **Vite** — Build-Tool mit Hot-Module-Reload
- **Node.js** (v24+) — JavaScript-Runtime
- **npm** — Package Manager

### Sprachen
- **HTML5** — Struktur
- **CSS3** — Styling, Animationen, Dark/Light-Mode
- **JavaScript (Vanilla, ES6+)** — Logik & Interaktionen
- **JSON** — Datenformat

### Bibliotheken
- **[Highcharts](https://www.highcharts.com/)** — Balken-, Donut- und Bubble-Charts
- **[highcharts-3d](https://www.highcharts.com/docs/chart-and-series-types/3d-charts)** — 3D-Erweiterung
- **[highcharts-more](https://www.highcharts.com/docs/chart-and-series-types/bubble-series)** — Bubble-Charts
- **[D3.js](https://d3js.org/)** — Datengetriebene Visualisierungen (Europa-Karte)
- **[TopoJSON](https://github.com/topojson/topojson)** — Kompaktes Geo-Datenformat
- **[Scrollama](https://github.com/russellsamora/scrollama)** — Scroll-Trigger
- **Intersection Observer API** — Native Browser-Schnittstelle für Scroll-Animationen

### Versionierung
- **Git** & **GitHub**

---

## Installation & Start

### Voraussetzungen
- Node.js v18 oder höher
- npm

### Setup

```bash
# Repository klonen
git clone https://github.com/temirlan-kg/Konjunkturhoffnung-und-Defense.git

# Ins Projektverzeichnis wechseln
cd Konjunkturhoffnung-und-Defense/defense-konjunktur

# Abhängigkeiten installieren
npm install

# Development-Server starten
npm run dev
```

Während der Entwicklung läuft die Website lokal unter `http://localhost:5173/Konjunkturhoffnung-und-Defense/`.

### Live-Version

Die veröffentlichte Website ist über GitHub Pages erreichbar:

**https://temirlan-kg.github.io/Konjunkturhoffnung-und-Defense/**

### Build & Deployment

Production-Build erstellen und auf GitHub Pages veröffentlichen:

```bash
npm run build && npm run deploy
```

---

## Datenquellen

### Offizielle Statistiken
- **NATO** — Defence Expenditure Database
- **European Defence Agency (EDA)** — Defence Data 2024–2025
- **Bundestag** — Haushaltspläne und Sondervermögen
- **Bundesministerium der Verteidigung (BMVg)** — Mittelplanung

### Verbandsdaten
- **DIHK** — Konjunkturumfrage April 2026
- **BDSV** — Bundesverband der Deutschen Sicherheits- und Verteidigungsindustrie

### Wirtschaftsstudien
- **EY/Deka 2025** — Beschäftigungsprognose
- **McKinsey** — Marktvolumen-Analyse
- **Universität Mannheim** — Fiskalmultiplikator-Studie
- **Bitkom DefTech Report 2026**

---


## 👥 Team
- **Temirlan Anarkulov**
- **Semanur Asalioglu**
- **Manuel Nseguet Tchamfa**
---


**Stand:** Juni 2026
