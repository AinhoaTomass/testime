// ── Messages ──────────────────────────────────────────────
const messages = [
  { text: "M'encanten els teus ulls", author: "— siempre" },
  { text: "Me encanta tu risa de tetera y de cerdito", author: "— de verdad" },
  { text: "Me gustas más cada día", author: "— en serio" },
  { text: "No sé cómo explicarlo, solo sé que eres tú", author: "— siempre tú" },
  { text: "Gracias por existir exactamente como eres", author: "— con todo mi corazón" },
  { text: "Ojalá pudieras verte como yo te veo", author: "— te aceituno" },
  { text: "M'enamores més cada día", author: "— sin duda" },
  { text: "Me gusta compartir gustos y hobbies", author: "— te amo" },
  { text: "Las paradas improvisadas en un viaje", author: "— sin duda" },
  { text: "Enseñarte rincones de Castellón", author: "— con todo mi corazón" },
  { text: "Tu paciencia", author: "— vale millones" },
  { text: "Eres mi hogar y mi lugar seguro", author: "— siempre" },
  { text: "Me encanta nuestro futuro juntas", author: "— de verdad" },
  { text: "Tus detalles más inesperados", author: "— sin duda" },
  { text: "Como me miras, haces que me olvide de lo malo", author: "— te quiamo" },
  { text: "Eres mi personita favorita", author: "— siempre" },
  { text: "Amo todo de ti", author: "— de verdad" },
  { text: "Me pierdo en ti", author: "— en serio" },
];

const FINAL_MESSAGE = {
  text: "Y esto es solo el principio...",
  author: "— para siempre",
};

// ── Special dates ─────────────────────────────────────────
const SPECIAL_DATES = [
  {
    check: (d, m, lastDay) => m === 12 && d === 31,
    icon: "🥂",
    text: "Feliz aniversario, mi vida. Un año más juntas.",
  },
  {
    check: (d, m, lastDay) => m === 7 && d === 29,
    icon: "🎂",
    text: "Feliz cumpleaños, personita. Que sea un día tan bonito como tú.",
  },
  {
    check: (d, m, lastDay) => d === lastDay,
    icon: "🌻",
    text: "Último día del mes. Solo quería recordarte que te quiero.",
  },
];

function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function checkSpecialDate() {
  const now  = new Date();
  const day  = now.getDate();
  const month = now.getMonth() + 1; // 1-based
  const last = getLastDayOfMonth(now);

  // Anniversary takes priority over last-day-of-month if both match
  for (const s of SPECIAL_DATES) {
    if (s.check(day, month, last)) {
      return s;
    }
  }
  return null;
}

function initSpecialBanner() {
  const special = checkSpecialDate();
  if (!special) return;

  const banner = document.getElementById('specialBanner');
  document.getElementById('specialIcon').textContent = special.icon;
  document.getElementById('specialText').textContent = special.text;

  // Slight delay so the page loads first
  setTimeout(() => banner.classList.add('visible'), 800);
}

// ── Sound (Web Audio API) ─────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playPop() {
  try {
    const ctx = getAudioCtx();

    // Soft bell-like tone
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Silently ignore if audio not supported
  }
}

// ── Vibration ─────────────────────────────────────────────
function vibrate() {
  if ('vibrate' in navigator) {
    navigator.vibrate(40);
  }
}

// ── Message logic ─────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let shuffled     = shuffle(messages);
let idx          = 0;
let showingFinal = false;

const heartBtn  = document.getElementById('heartBtn');
const msgBox    = document.getElementById('msgBox');
const msgText   = document.getElementById('msgText');
const msgAuthor = document.getElementById('msgAuthor');
const counter   = document.getElementById('counter');

function showMessage() {
  let m;

  if (showingFinal) {
    shuffled     = shuffle(messages);
    idx          = 0;
    showingFinal = false;
    m            = shuffled[idx++];
  } else if (idx >= shuffled.length) {
    showingFinal = true;
    m            = FINAL_MESSAGE;
  } else {
    m = shuffled[idx++];
  }

  if (showingFinal) {
    counter.classList.remove('visible');
  } else {
    counter.textContent = idx + ' / ' + messages.length;
    counter.classList.add('visible');
  }

  msgBox.classList.remove('visible');
  setTimeout(() => {
    msgText.textContent   = m.text;
    msgAuthor.textContent = m.author;
    msgBox.classList.add('visible');
  }, 350);
}

// ── Heart events ──────────────────────────────────────────
heartBtn.addEventListener('click', (e) => {
  showMessage();
  playPop();
  vibrate();
  spawnBurst(e.clientX, e.clientY);
});

heartBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  const t = e.changedTouches[0];
  showMessage();
  playPop();
  vibrate();
  spawnBurst(t.clientX, t.clientY);
}, { passive: false });

// ── Burst particles ───────────────────────────────────────
function spawnBurst(x, y) {
  const container = document.createElement('div');
  container.className = 'burst';
  container.style.left = x + 'px';
  container.style.top  = y + 'px';
  document.body.appendChild(container);

  for (let i = 0; i < 10; i++) {
    const el    = document.createElement('span');
    el.className = 'burst-heart';
    el.textContent = '♥';
    el.style.color = `hsl(${130 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%)`;
    const angle = (i / 10) * Math.PI * 2;
    const dist  = 50 + Math.random() * 70;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.animationDelay = Math.random() * 0.1 + 's';
    container.appendChild(el);
  }

  setTimeout(() => container.remove(), 1200);
}

// ── Carta content ─────────────────────────────────────────
const carta = {
  dear: "Para ti,",
  paragraphs: [
    "Hay cosas que a veces no sé cómo decirte en voz alta, así que las escribo aquí, donde puedo tomarme el tiempo de encontrar las palabras.",
    "Desde que estás en mi vida todo tiene más color. No es que antes fuera gris, pero contigo las cosas brillan de otra manera. Me gusta cómo me escuchas, cómo te ríes, cómo eres exactamente quien eres sin pedirte permiso a nadie.",
    "Me gusta que compartimos cosas pequeñas. Que puedo enseñarte un rincón de Castellón y que lo mires con los mismos ojos que yo. Que haya paradas improvisadas en los viajes. Que tu risa de tetera sea una de mis cosas favoritas del mundo.",
    "Gracias por tu paciencia. Por ser mi lugar seguro. Por hacer que me olvide de lo malo solo con mirarme.",
    "No sé muy bien qué nos depara el futuro, pero sé que quiero que estés en él. Me encanta nuestro futuro juntas.",
    "T'estime molt.",
  ],
  firma: "— siempre tuya 🌻",
};

// Render carta into the DOM
document.getElementById('cartaDear').textContent = carta.dear;
document.getElementById('cartaFirma').textContent = carta.firma;
const cartaBody = document.getElementById('cartaBody');
carta.paragraphs.forEach(text => {
  const p = document.createElement('p');
  p.textContent = text;
  cartaBody.appendChild(p);
});

// ── Carta modal ───────────────────────────────────────────
const cartaBtn     = document.getElementById('cartaBtn');
const cartaOverlay = document.getElementById('cartaOverlay');
const cartaClose   = document.getElementById('cartaClose');

cartaBtn.addEventListener('click', () => {
  cartaOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
});

function closeCarta() {
  cartaOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

cartaClose.addEventListener('click', closeCarta);

cartaOverlay.addEventListener('click', (e) => {
  if (e.target === cartaOverlay) closeCarta();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCarta();
});

// ── Floating sunflowers ───────────────────────────────────
const petalContainer = document.getElementById('petals');
const PETALS = ['🌻', '🌻', '🌻', '✿', '🌼'];

function spawnPetal() {
  const p = document.createElement('span');
  p.className = 'petal';
  p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left              = Math.random() * 100 + 'vw';
  p.style.fontSize          = (16 + Math.random() * 14) + 'px';
  p.style.animationDuration = (8  + Math.random() * 12) + 's';
  p.style.animationDelay    = (Math.random() * 6) + 's';
  petalContainer.appendChild(p);
  setTimeout(() => p.remove(), 22000);
}

for (let i = 0; i < 18; i++) spawnPetal();
setInterval(spawnPetal, 1800);

// ── Init ──────────────────────────────────────────────────
initSpecialBanner();
