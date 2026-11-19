# Konjunkturhoffnung & Defense (Economic Hope & Defense)

An interactive data visualization website about the link between the European defense industry and economic development in Germany.

University project at TH Nürnberg Georg Simon Ohm
Course: Data Motion / Interaction (Mirko Schramm), Summer Semester 2026

## About the Project

Russia's war of aggression against Ukraine and an increasingly unreliable ally in the USA are fundamentally changing Europe's security situation. Germany is responding with historically high investments: around €152 billion is set to flow into defense by 2029. This turning point affects not only politics but also the economy, industry and innovation.

The website makes this development visible. It guides users through eight chapters, combining narrative text with interactive maps, charts, quizzes and a critical closing perspective.

## Sections

- **Hero**: Animated HUD-style intro with a pulsing protective shield over a small city skyline, intercepting incoming bombs from both sides.
- **Overview**: Scrollytelling intro with a choropleth map of Europe that focuses on Germany, the five leading defense nations and the NATO states as you scroll. A country menu opens detail views with each country's top 3 companies.
- **Europe's Response**: Four key figures on the European defense boom (SAFE loans, NATO target, planned investments until 2035, share of European companies), shown as glowing circle segments with an animated wave background.
- **Technology**: Five clickable cards on the most in-demand fields of modern defense: drones, AI & software, cyber defense, New Space and ammunition.
- **Politics**: A toggle with three views (absolute billions of euros, share of GDP, growth) showing German defense spending until 2029 compared to the EU-27.
- **Market & Access**: An interactive estimation quiz on the hurdles German DefTech startups face. Users guess and then see the real values, set against an animated cyber network background.
- **Companies**: A bubble chart comparing ten German and international players in four categories: traditional defense, defense pivot, tech & software and DefTech startups. Matching bubbles are highlighted while scrolling through the text.
- **Survey**: A carousel with five results from the Bitkom DefTech Survey 2026, shown as grouped, horizontal and stacked bar charts.
- **Downside: Risks & Open Questions**: A deliberately critical ending with four cards on debt financing, skills shortage, dependence on other countries and whether the boom will last.

## Tech Stack

- Vite (build tool and dev server)
- D3.js and TopoJSON (interactive map of Europe)
- Highcharts (bubble chart and politics chart)
- Scrollama and IntersectionObserver API (scroll triggers)
- HTML5 Canvas (animated backgrounds)
- Vanilla JavaScript (ES modules) and CSS variables for dark/light mode

## Installation

Requirements: Node.js and npm.

```bash
git clone https://github.com/temirlan-kg/Konjunkturhoffnung-und-Defense.git
cd Konjunkturhoffnung-und-Defense/defense-konjunktur
npm install
npm run dev
```

The website is then available at http://localhost:5173.

Build and deploy to GitHub Pages:

```bash
npm run build
npm run deploy
```

## Team

- Temirlan Anarkulov
- Semanur Asalioglu

## Note on Development

The technical implementation was created with the help of AI-assisted coding tools. Concept, editorial selection, data research, content structure and critical review of all results are the authors' own work.
