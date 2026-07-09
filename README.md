# Konjunkturhoffnung & Defense

> Eine interaktive Datenvisualisierungs-Website zum Zusammenhang zwischen der europäischen Verteidigungsbranche und der wirtschaftlichen Entwicklung in Deutschland.

**Universitätsprojekt** — TH Nürnberg Georg Simon Ohm
**Kurs:** Data Motion / Interaction (Mirko Schramm)
**Sommersemester 2026**

---

## Über das Projekt

Der russische Angriffskrieg gegen die Ukraine und ein unsicherer gewordener Bündnispartner USA verändern die sicherheitspolitische Lage in Europa grundlegend. Deutschland reagiert mit historisch hohen Investitionen: bis 2029 sollen rund 152 Milliarden Euro in die Verteidigung fließen. Diese Zeitenwende betrifft nicht nur die Politik, sondern verändert Konjunktur, Industrie und Innovationslandschaft nachhaltig.

Die Website macht diese Entwicklung sichtbar. Sie führt die Nutzerinnen und Nutzer durch fünf Kapitel und kombiniert Textnarrative mit interaktiven Karten, Charts und Quiz-Elementen.

---

## Sektionen im Überblick

**Überblick**
Scrollytelling-Einleitung mit einer choroplethen Europakarte, die je nach Scroll-Position auf Deutschland, die führenden Rüstungsnationen und die NATO-Staaten fokussiert. Über ein Länder-Menü lassen sich Detailansichten mit den Top-3-Unternehmen einzelner Länder aufrufen.

**Europas Antwort**
Vier zentrale Kennzahlen zum europäischen Rüstungsboom, dargestellt als Kreissegmente mit dezenter Wellenanimation im Hintergrund.

**Technologie**
Fünf Karten zu den gefragtesten Feldern moderner Verteidigung: Drohnen, KI & Software, Cyberabwehr, New Space und Munition. Jede Karte lässt sich anklicken und öffnet Detailinformationen mit belegten Zahlen aus aktuellen Bitkom-Studien.

**Markt & Zugang**
Ein interaktives Schätzquiz zu den Hürden, mit denen deutsche DefTech-Startups konfrontiert sind. Nutzerinnen und Nutzer tippen ihre Vermutung an und erfahren die realen Werte aus dem Bitkom DefTech-Report 2026 (langsame Beschaffung, fehlendes Kapital, Zugang über Kooperation).

**Unternehmen**
Ein Bubble Chart vergleicht zehn deutsche und internationale Akteure aus vier Kategorien: klassische Rüstung, Defense-Pivot, Tech & Software sowie DefTech-Startups. Beim Scrollen durch die fünf Textkapitel werden jeweils die zugehörigen Bubbles hervorgehoben.

**Politik**
Ein Umschalter mit drei Ansichten (absolute Milliarden Euro, BIP-Anteil, Wachstum) visualisiert die Entwicklung der deutschen Verteidigungsausgaben bis 2029 im Vergleich zur EU-27.

---

## Technologie-Stack

- **Vite** als Build-Tool und Dev-Server
- **D3.js** und **TopoJSON** für die interaktive Europakarte
- **Highcharts** für Bubble Chart, Politik-Diagramm und Länderdetails
- **Scrollama** und **IntersectionObserver API** für Scroll-Trigger und Choreografie
- **HTML5 Canvas** für animierte Hintergründe (Partikel-System, Wellenanimationen)
- **Vanilla JavaScript** (ES-Module) und **CSS-Variablen** für Dark/Light Mode

---

## Datenquellen

- Bitkom Get Started, DefTech-Report 2026
- Bitkom Research, Kapitalmangel-Studie 2025
- Bitkom Wirtschaftsschutzstudie 2025
- BSI-Lagebericht zur IT-Sicherheit in Deutschland 2025
- EY/Deka Analysen 2025
- Bundestag, BMVg und EDA Defence Data 2024–2025
- Handelsblatt und produktion.de zu DefTech-Finanzierungsrunden 2025/26

---

## Projektstruktur

```
defense-konjunktur/
├── public/
│   └── data/
│       ├── laender.json
│       └── politik.json
├── sections/
│   ├── europe-map.js
│   ├── laender-panel.js
│   ├── konzerne.js
│   ├── markt-zugang.js
│   └── politik.js
├── index.html
├── main.js
├── style.css
├── vite.config.js
└── package.json
```

## Installation

Voraussetzungen: Node.js und npm.

```bash
git clone https://github.com/temirlan-kg/Konjunkturhoffnung-und-Defense.git
cd Konjunkturhoffnung-und-Defense/defense-konjunktur
npm install
npm run dev
```

Anschließend ist die Website unter `http://localhost:5173` erreichbar.

Für den Build und das Deployment auf GitHub Pages:

```bash
npm run build
npm run deploy
```

---

## Team
- Temirlan Anarkulov
- Semanur Asalioglu
- Manuel Nseguet Tchamfa

---

## Hinweis zur Entwicklung

Die technische Umsetzung entstand mit Unterstützung von KI-gestützten Programmierwerkzeugen. Konzept, redaktionelle Auswahl, Datenrecherche, inhaltliche Struktur und die kritische Bewertung aller Ergebnisse liegen bei den Autorinnen und Autoren.
