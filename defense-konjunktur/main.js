import scrollama from 'scrollama';
import { initPolitik }     from './sections/politik.js';
import { initMittelstand } from './sections/markt-zugang.js';
import { initKonzerne }    from './sections/konzerne.js';
import { initEuropeMap }   from './sections/europe-map.js';
import { initLaenderPanel } from './sections/laender-panel.js';

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let bombs = [];
  let flashes = [];
  let cityBuildings = [];
  let cityTrees = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    buildCityData();
  }

  function domes() {
    const cx = w / 2;
    const groundY = h * 0.97;
    return [
      { cx, groundY, rx: w * 0.5,  ry: h * 0.36, alpha: 0.12, clipTop: h * 0.65 },
      { cx, groundY, rx: w * 0.42, ry: h * 0.30, alpha: 0.22, clipTop: h * 0.71 },
      { cx, groundY, rx: w * 0.34, ry: h * 0.24, alpha: 0.30, clipTop: h * 0.75 }
    ];
  }

  function domePoint(dome, t) {
    return {
      x: dome.cx + dome.rx * Math.cos(t),
      y: dome.groundY - dome.ry * Math.sin(t)
    };
  }

  function spawnBomb() {
    const ds = domes();
    const dome = ds[Math.floor(Math.random() * ds.length)];
    const t = 0.1 + Math.random() * (Math.PI - 0.2);
    const target = domePoint(dome, t);
    const dx = target.x - dome.cx;
    const dy = target.y - dome.groundY;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;
    const outerDist = len + 120 + Math.random() * 160;
    bombs.push({
      x: dome.cx + nx * outerDist,
      y: dome.groundY + ny * outerDist,
      tx: target.x,
      ty: target.y,
      angle: Math.atan2(ny, nx),
      speed: 1.5 + Math.random() * 1.3,
      size: 0.55 + Math.random() * 0.2
    });
  }

  function buildCityData() {
    const groundY = h * 0.97;

    const left = [
      { x: w * 0.11,  wgt: 22, hgt: 44, roof: 'peak' },
      { x: w * 0.145, wgt: 26, hgt: 68, roof: 'flat' },
      { x: w * 0.185, wgt: 20, hgt: 34, roof: 'peak' },
      { x: w * 0.22,  wgt: 30, hgt: 88, roof: 'flat' },
      { x: w * 0.265, wgt: 20, hgt: 54, roof: 'tank' }
    ];
    const right = [
      { x: w * 0.715, wgt: 20, hgt: 54, roof: 'tank' },
      { x: w * 0.755, wgt: 30, hgt: 88, roof: 'flat' },
      { x: w * 0.80,  wgt: 20, hgt: 34, roof: 'peak' },
      { x: w * 0.835, wgt: 26, hgt: 68, roof: 'flat' },
      { x: w * 0.875, wgt: 22, hgt: 44, roof: 'peak' }
    ];

    cityBuildings = [...left, ...right].map(b => {
      const y = groundY - b.hgt;
      const cols = b.wgt > 24 ? 3 : 2;
      const colGap = b.wgt / (cols + 1);
      const windows = [];
      for (let row = y + 8; row < y + b.hgt - 8; row += 11) {
        for (let c = 1; c <= cols; c++) {
          windows.push({ x: b.x + colGap * c - 1, y: row, lit: Math.random() < 0.75 });
        }
      }
      return { ...b, y, windows };
    });

    cityTrees = [
      w * 0.30, w * 0.325, w * 0.35,
      w * 0.645, w * 0.67, w * 0.695
    ].map(tx => ({ x: tx, size: 8 + Math.random() * 5 }));
  }

  function drawBuildings() {
    const groundY = h * 0.97;
    const fillCol = '#10161f';
    const strokeCol = '#232c38';
    const winColLit = 'rgba(251, 191, 36, 0.85)';
    const winColOff = 'rgba(139, 148, 158, 0.18)';
    const lampCol = 'rgba(139, 148, 158, 0.5)';

    ctx.strokeStyle = 'rgba(139, 148, 158, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.07, groundY);
    ctx.lineTo(w * 0.33, groundY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.67, groundY);
    ctx.lineTo(w * 0.93, groundY);
    ctx.stroke();

    const lamps = [w * 0.085, w * 0.18, w * 0.30, w * 0.70, w * 0.82, w * 0.905];
    lamps.forEach(lx => {
      ctx.strokeStyle = lampCol;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx, groundY);
      ctx.lineTo(lx, groundY - 24);
      ctx.stroke();
      ctx.fillStyle = 'rgba(253, 230, 138, 0.85)';
      ctx.beginPath();
      ctx.arc(lx, groundY - 26, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    cityTrees.forEach(t => {
      ctx.strokeStyle = '#3a2a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(t.x, groundY);
      ctx.lineTo(t.x, groundY - t.size * 0.9);
      ctx.stroke();

      ctx.fillStyle = '#1c3326';
      ctx.beginPath();
      ctx.arc(t.x, groundY - t.size * 1.5, t.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2d4a3a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    cityBuildings.forEach(b => {
      ctx.fillStyle = fillCol;
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 1;
      ctx.fillRect(b.x, b.y, b.wgt, b.hgt);
      ctx.strokeRect(b.x, b.y, b.wgt, b.hgt);

      if (b.roof === 'peak') {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + b.wgt / 2, b.y - 10);
        ctx.lineTo(b.x + b.wgt, b.y);
        ctx.closePath();
        ctx.fillStyle = fillCol;
        ctx.fill();
        ctx.stroke();
      }

      if (b.roof === 'tank') {
        ctx.beginPath();
        ctx.arc(b.x + b.wgt / 2, b.y - 6, b.wgt * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = fillCol;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.x + b.wgt / 2, b.y - 6 - b.wgt * 0.32);
        ctx.lineTo(b.x + b.wgt / 2, b.y - 6 - b.wgt * 0.32 - 8);
        ctx.stroke();
      }

      b.windows.forEach(win => {
        ctx.fillStyle = win.lit ? winColLit : winColOff;
        ctx.fillRect(win.x, win.y, 2, 2);
      });
    });
  }

  function drawDomes() {
    const isDark = document.documentElement.classList.contains('dark');
    const rgb = isDark ? '230, 237, 243' : '15, 40, 30';
    const ds = domes();

    ds.forEach((dome) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, dome.clipTop, w, h - dome.clipTop);
      ctx.clip();

      ctx.beginPath();
      ctx.ellipse(dome.cx, dome.groundY, dome.rx, dome.ry, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb}, ${dome.alpha + 0.2})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    });
  }

  function drawBombs() {
    bombs.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.scale(b.size, b.size);

      ctx.fillStyle = '#4b5563';
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.lineTo(-20, -3);
      ctx.lineTo(-20, 3);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(4, -3.8);
      ctx.lineTo(8.5, -8);
      ctx.lineTo(8.5, -3.8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(4, 3.8);
      ctx.lineTo(8.5, 8);
      ctx.lineTo(8.5, 3.8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }

  function drawFlashes() {
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      f.life++;
      const progress = f.life / f.maxLife;
      const r = 5 + progress * 16;
      const alpha = 1 - progress;

      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (f.life >= f.maxLife) flashes.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    drawDomes();
    drawBuildings();

    if (Math.random() < 0.07 && bombs.length < 16) spawnBomb();

    for (let i = bombs.length - 1; i >= 0; i--) {
      const b = bombs[i];
      const dx = b.tx - b.x;
      const dy = b.ty - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        flashes.push({ x: b.tx, y: b.ty, life: 0, maxLife: 24 });
        bombs.splice(i, 1);
        continue;
      }

      b.x += (dx / dist) * b.speed;
      b.y += (dy / dist) * b.speed;
    }

    drawBombs();
    drawFlashes();

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function makeWaveCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  const waves = [
    { baseY: 0.3, amp: 28, speed: 0.00018, phase: 0 },
    { baseY: 0.55, amp: 22, speed: 0.00014, phase: 2.1 },
    { baseY: 0.78, amp: 32, speed: 0.00011, phase: 4.4 }
  ];

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.classList.contains('dark');
    const strokeAlpha = isDark ? 0.08 : 0.22;

    waves.forEach(wave => {
      const t = time * wave.speed;
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const y = wave.baseY * h
          + Math.sin((i / points) * Math.PI * 2.4 + t + wave.phase) * wave.amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(110, 231, 183, ${strokeAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function initStatCanvas() {
  const canvas = document.getElementById('statCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let sparkles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function spawnSparkle(baseY) {
    const x = Math.random() * w;
    sparkles.push({
      x,
      baseY,
      size: 1.5 + Math.random() * 2.5,
      life: 0,
      maxLife: 50 + Math.random() * 50
    });
  }

  const ribbons = [
    { ampBase: 65, freq: 1.3, speed: 0.00020, phase: 0,   widthPx: 4,   alpha: 0.85, blur: 22 },
    { ampBase: 48, freq: 1.9, speed: 0.00016, phase: 2.2, widthPx: 2.5, alpha: 0.55, blur: 16 },
    { ampBase: 80, freq: 0.9, speed: 0.00012, phase: 4.6, widthPx: 5,   alpha: 0.4,  blur: 26 }
  ];

 function draw(time) {
    ctx.clearRect(0, 0, w, h);

    const isMobileLayout = window.innerWidth <= 768;
    const baseY = isMobileLayout ? h * 0.5 : h * 0.72;

    ribbons.forEach(rib => {
      const t = time * rib.speed;
      ctx.beginPath();
      const points = 90;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const y = baseY + Math.sin((i / points) * Math.PI * 2 * rib.freq + t + rib.phase) * rib.ampBase;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(110, 231, 183, ${rib.alpha})`;
      ctx.lineWidth = rib.widthPx;
      ctx.shadowColor = 'rgba(110, 231, 183, 1)';
      ctx.shadowBlur = rib.blur;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    if (Math.random() < 0.08) spawnSparkle(baseY);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.life++;
      const progress = s.life / s.maxLife;
      const alpha = Math.sin(progress * Math.PI);

      const y = s.baseY + Math.sin((s.x / w) * Math.PI * 2 + time * 0.0002) * 60;

      ctx.beginPath();
      ctx.arc(s.x, y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 255, 240, ${alpha})`;
      ctx.shadowColor = 'rgba(220, 255, 240, 1)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (s.life >= s.maxLife) sparkles.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function initMzCanvas() {
  const canvas = document.getElementById('mzCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let nodes = [];
  let edges = [];
  let packets = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    buildNetwork();
  }

  function buildNetwork() {
    nodes = [];
    edges = [];
    packets = [];

    const area = w * h;
    const count = Math.max(70, Math.round(area / 9000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        bright: Math.random() < 0.28
      });
    }

    const edgeSet = new Set();
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((other, j) => ({ j, d: Math.hypot(n.x - other.x, n.y - other.y) }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3 + Math.floor(Math.random() * 3));

      dists.forEach(o => {
        const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
        if (!edgeSet.has(key) && o.d < Math.min(w, h) * 0.28) {
          edgeSet.add(key);
          edges.push({ a: i, b: o.j });
        }
      });
    });
  }

  function spawnPacket() {
    if (!edges.length) return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    packets.push({
      edge,
      progress: 0,
      speed: 0.006 + Math.random() * 0.008,
      reverse: Math.random() < 0.5
    });
  }

  function drawNetwork() {
    const isDark = document.documentElement.classList.contains('dark');
    const lineColor = isDark ? '59, 130, 246' : '30, 64, 175';
    const lineAlpha = isDark ? 0.22 : 0.4;
    const nodeDimColor = isDark ? '59, 130, 246' : '30, 64, 175';
    const nodeBrightColor = isDark ? '191, 219, 254' : '29, 78, 216';

    ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
    ctx.lineWidth = 1;
    edges.forEach(e => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.bright ? 2.6 : 1.6, 0, Math.PI * 2);
      ctx.fillStyle = n.bright
        ? `rgba(${nodeBrightColor}, 1)`
        : `rgba(${nodeDimColor}, ${isDark ? 0.45 : 0.65})`;
      if (n.bright) {
        ctx.shadowColor = `rgba(${nodeBrightColor}, 0.95)`;
        ctx.shadowBlur = 8;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function drawPackets() {
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }

      const a = nodes[p.reverse ? p.edge.b : p.edge.a];
      const b = nodes[p.reverse ? p.edge.a : p.edge.b];
      const x = a.x + (b.x - a.x) * p.progress;
      const y = a.y + (b.y - a.y) * p.progress;

      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 197, 253, 0.95)';
      ctx.shadowColor = 'rgba(147, 197, 253, 0.9)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawShield(time) {
    const cx = w * 0.92;
    const cy = h * 0.5;
    const pulse = (Math.sin(time * 0.0018) + 1) / 2;
    const scale = 1 + pulse * 0.12;
    const alpha = 0.35 + pulse * 0.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.bezierCurveTo(10, -18, 18, -14, 18, -6);
    ctx.bezierCurveTo(18, 8, 10, 20, 0, 26);
    ctx.bezierCurveTo(-10, 20, -18, 8, -18, -6);
    ctx.bezierCurveTo(-18, -14, -10, -18, 0, -22);
    ctx.closePath();
    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(96, 165, 250, 0.8)';
    ctx.shadowBlur = 10 + pulse * 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.lineTo(-2, 6);
    ctx.lineTo(8, -9);
    ctx.strokeStyle = `rgba(96, 165, 250, ${alpha + 0.15})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    drawNetwork();

    if (Math.random() < 0.04) spawnPacket();
    drawPackets();

    drawShield(time);

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

function initTechCanvas() {
  // Hintergrund-Animation entfernt
}

function initTechCards() {
  const section = document.getElementById('section-technologie');
  const grid = document.getElementById('techGrid');
  const infoPanel = document.getElementById('techInfo');
  const closeBtn = document.getElementById('techInfoClose');
  const titleEl = document.getElementById('techInfoTitle');
  const bodyEl = document.getElementById('techInfoBody');
  const iconEl = document.getElementById('techInfoIcon');
  const floatLeft = document.getElementById('techFloatLeft');
  const floatRight = document.getElementById('techFloatRight');
  if (!grid || !infoPanel || !section) return;

  const cards = grid.querySelectorAll('.tech-card');
  let activeCard = null;

  function parseDetail(raw) {
    if (!raw) return '';
    return raw.split(';;').map(pair => {
      const [label, text] = pair.split('::');
      return `<div class="tech-info-item"><strong>${label}:</strong> ${text}</div>`;
    }).join('');
  }

  function buildFloatIcons(container, iconSvg, count) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const wrap = document.createElement('span');
      wrap.className = 'tech-float-icon tech-float-icon-' + i;
      wrap.innerHTML = iconSvg;
      container.appendChild(wrap);
    }
  }

  function openInfo(card) {
    titleEl.textContent = card.dataset.title || '';
    bodyEl.innerHTML = parseDetail(card.dataset.detail);
    const iconSvg = card.querySelector('.tech-icon svg');
    const iconHtml = iconSvg ? iconSvg.outerHTML : '';
    iconEl.innerHTML = iconHtml;

    buildFloatIcons(floatLeft, iconHtml, 2);
    buildFloatIcons(floatRight, iconHtml, 2);

    infoPanel.classList.add('open');
    cards.forEach(c => c.classList.toggle('active', c === card));
    activeCard = card;
  }

  function closeInfo() {
    infoPanel.classList.remove('open');
    cards.forEach(c => c.classList.remove('active'));
    activeCard = null;
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (activeCard === card) {
        closeInfo();
        return;
      }
      openInfo(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeInfo);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInfo();
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) closeInfo();
    });
  }, { threshold: 0.1 });
  sectionObserver.observe(section);
}

function initCustomCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverTargets = 'a, button, .tech-card, .stat-item, .land-select-trigger, .land-select-item';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('cursor-hover');
    }
  });
}

function initNavProgress() {
  const nav = document.querySelector('nav');
  const navLinksEl = document.getElementById('navLinks');
  const track = document.getElementById('navProgressTrack');
  const plane = document.getElementById('navProgressPlane');
  const brand = document.querySelector('.nav-brand');
  const fill = document.getElementById('navProgressFill');
  if (!nav || !navLinksEl || !track || !plane) return;

  const sectionIds = ['section-allgemeines', 'section-technologie', 'section-politik', 'section-mittelstand', 'section-konzerne', 'section-survey', 'section-fazit'];
  const links = {};
  sectionIds.forEach(id => {
    const link = navLinksEl.querySelector(`a[href="#${id}"]`);
    if (link) links[id] = link;
  });
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function positionTrack() {
    const navRect = nav.getBoundingClientRect();
    const linksRect = navLinksEl.getBoundingClientRect();
    track.style.left = (linksRect.left - navRect.left) + 'px';
    track.style.width = linksRect.width + 'px';
  }

  function movePlaneTo(x) {
    plane.style.left = x + 'px';
    if (fill) {
      const clamped = Math.max(0, x);
      fill.style.width = clamped + 'px';
    }
  }

  function setBrandPosition() {
    const trackRect = track.getBoundingClientRect();
    if (brand) {
      const brandRect = brand.getBoundingClientRect();
      movePlaneTo(brandRect.left - trackRect.left);
    } else {
      movePlaneTo(0);
    }
    Object.values(links).forEach(l => l.classList.remove('nav-active'));
  }

  function moveToLink(link) {
    if (!link) return;
    const trackRect = track.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const centerX = (linkRect.left + linkRect.width / 2) - trackRect.left;
    movePlaneTo(centerX);
    Object.values(links).forEach(l => l.classList.remove('nav-active'));
    link.classList.add('nav-active');
  }

  positionTrack();
  setBrandPosition();

  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;

    if (scrollY < 80) {
      setBrandPosition();
      ticking = false;
      return;
    }

    let currentId = sectionIds[0];
    const midpoint = window.innerHeight / 2;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= midpoint && rect.bottom >= 0) {
        currentId = sec.id;
      }
    });

    moveToLink(links[currentId]);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  });

  window.addEventListener('resize', () => {
    positionTrack();
    updateOnScroll();
  });
}

const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

const toggleBtn = document.getElementById('themeToggle');
const toggleText = toggleBtn ? toggleBtn.querySelector('.toggle-text') : null;
const root = document.documentElement;

root.classList.add('dark');
if (toggleText) {
  toggleText.textContent = 'Light Mode';
}

const visible = { politik: false, mittelstand: false, konzerne: false };

function redrawCharts() {
  if (visible.politik)     initPolitik(true);
  if (visible.mittelstand) initMittelstand(true);
  if (visible.konzerne)    initKonzerne(true);
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    if (toggleText) {
      toggleText.textContent = root.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
    }
    redrawCharts();
  });
}

const scroller = scrollama();

scroller
  .setup({
    step: '.scroll-section, .konzerne-scrolly',
    offset: 0.3
  })
  .onStepEnter(({ element }) => {
    element.classList.add('is-active');

    if (element.id === 'section-politik') {
      visible.politik = true;
      initPolitik();
    }
    if (element.id === 'section-mittelstand') {
      visible.mittelstand = true;
      initMittelstand();
    }
    if (element.id === 'section-konzerne') {
      visible.konzerne = true;
      initKonzerne();
    }
  })
  .onStepExit(({ element }) => {
    element.classList.remove('is-active');
  });

const scrollyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.scrolly-step').forEach(s => s.classList.remove('is-active'));
      entry.target.classList.add('is-active');
    }
  });
}, {
  root: null,
  rootMargin: '-20% 0px -40% 0px',
  threshold: 0.1
});

document.querySelectorAll('.scrolly-step').forEach(el => {
  scrollyObserver.observe(el);
});

initHeroCanvas();
initStatCanvas();
initMzCanvas();
initTechCanvas();
initTechCards();
initEuropeMap();
initLaenderPanel();
initNavProgress();

window.addEventListener('resize', () => {
  redrawCharts();
});