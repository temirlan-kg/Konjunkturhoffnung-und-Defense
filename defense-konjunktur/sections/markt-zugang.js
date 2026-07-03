let wired = false;
let sectionObserverSet = false;

export function initMittelstand(force = false) {
  if (wired && !force) return;
  wired = true;

  const grid = document.getElementById('mzGrid');
  if (!grid) return;

  wireCards(grid);

  if (!sectionObserverSet) {
    setupResetObserver();
    sectionObserverSet = true;
  }
}

function wireCards(grid) {
  const cards = grid.querySelectorAll('.mz-card');

  cards.forEach(card => {
    const realValue = parseInt(card.dataset.real, 10);
    const guessBtns = card.querySelectorAll('.mz-guess-btn');
    const guessOptions = card.querySelector('.mz-guess-options');
    const guessResult = card.querySelector('.mz-guess-result');
    const guessValueEl = card.querySelector('.mz-guess-value');
    const revealBtn = card.querySelector('.mz-reveal-btn');
    const valueEl = card.querySelector('.mz-value');
    const barFill = card.querySelector('.mz-bar-fill');
    const feedbackEl = card.querySelector('.mz-feedback');

    let selectedGuess = null;
    let selectedBtn = null;

    guessBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedGuess = parseInt(btn.dataset.guess, 10);
        selectedBtn = btn;

        guessBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        guessOptions.style.display = 'none';
        guessValueEl.textContent = btn.dataset.guess + '%';
        guessResult.classList.add('show');
      });
    });

    revealBtn.addEventListener('click', () => {
      revealBtn.disabled = true;
      guessResult.classList.add('fade-out');

      const isCorrect = selectedGuess === realValue;

      if (isCorrect) {
        feedbackEl.innerHTML = '<span class="mz-feedback-correct">Richtig geraten! 🎉</span>';
        spawnConfetti(card);
      } else {
        feedbackEl.innerHTML = `<span class="mz-feedback-wrong">Knapp daneben! Die wahre Zahl ist ${realValue}%.</span>`;
        if (selectedBtn) {
          selectedBtn.classList.add('shake');
          setTimeout(() => selectedBtn.classList.remove('shake'), 500);
        }
      }
      feedbackEl.classList.add('show');

      animateCount(valueEl, realValue, 1100);
      barFill.style.width = realValue + '%';
      card.classList.add('revealed');

      setTimeout(() => {
        guessResult.style.display = 'none';
      }, 400);
    });
  });
}

function spawnConfetti(card) {
  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24'];
  const container = document.createElement('div');
  container.className = 'mz-confetti-layer';
  card.appendChild(container);

  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('span');
    piece.className = 'mz-confetti-piece';
    const angle = Math.random() * 360;
    const distance = 60 + Math.random() * 80;
    const tx = Math.cos(angle * Math.PI / 180) * distance;
    const ty = Math.sin(angle * Math.PI / 180) * distance - 40;
    piece.style.setProperty('--tx', tx + 'px');
    piece.style.setProperty('--ty', ty + 'px');
    piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = (40 + Math.random() * 20) + '%';
    piece.style.animationDelay = (Math.random() * 0.15) + 's';
    container.appendChild(piece);
  }

  setTimeout(() => {
    container.remove();
  }, 1400);
}

function resetSection() {
  const grid = document.getElementById('mzGrid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.mz-card');
  cards.forEach(card => {
    card.classList.remove('revealed');

    const guessBtns = card.querySelectorAll('.mz-guess-btn');
    const guessOptions = card.querySelector('.mz-guess-options');
    const guessResult = card.querySelector('.mz-guess-result');
    const guessValueEl = card.querySelector('.mz-guess-value');
    const revealBtn = card.querySelector('.mz-reveal-btn');
    const valueEl = card.querySelector('.mz-value');
    const barFill = card.querySelector('.mz-bar-fill');
    const feedbackEl = card.querySelector('.mz-feedback');
    const confettiLayer = card.querySelector('.mz-confetti-layer');

    guessBtns.forEach(b => b.classList.remove('selected'));
    guessOptions.style.display = 'flex';
    guessResult.classList.remove('show', 'fade-out');
    guessResult.style.display = '';
    guessValueEl.textContent = '';
    revealBtn.disabled = false;
    valueEl.textContent = '';
    barFill.style.width = '0%';
    feedbackEl.classList.remove('show');
    feedbackEl.innerHTML = '';
    if (confettiLayer) confettiLayer.remove();
  });
}

function setupResetObserver() {
  const section = document.getElementById('section-mittelstand');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        resetSection();
      }
    });
  }, { threshold: 0 });

  observer.observe(section);
}

function animateCount(el, target, duration) {
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + ' %';
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + ' %';
    }
  }
  requestAnimationFrame(step);
}