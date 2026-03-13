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

// --- Helpers ---

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- State ---

let shuffled = shuffle(messages);
let idx = 0;
let showingFinal = false;

// --- DOM ---

const heartBtn  = document.getElementById('heartBtn');
const msgBox    = document.getElementById('msgBox');
const msgText   = document.getElementById('msgText');
const msgAuthor = document.getElementById('msgAuthor');
const counter   = document.getElementById('counter');

// --- Logic ---

function showMessage() {
  let m;

  if (showingFinal) {
    // After final message: reshuffle and start over
    shuffled = shuffle(messages);
    idx = 0;
    showingFinal = false;
    m = shuffled[idx++];
  } else if (idx >= shuffled.length) {
    // All messages shown: show final message
    showingFinal = true;
    m = FINAL_MESSAGE;
  } else {
    m = shuffled[idx++];
  }

  // Update counter (hidden during final message)
  if (showingFinal) {
    counter.classList.remove('visible');
  } else {
    counter.textContent = idx + ' / ' + messages.length;
    counter.classList.add('visible');
  }

  // Animate message transition
  msgBox.classList.remove('visible');
  setTimeout(() => {
    msgText.textContent   = m.text;
    msgAuthor.textContent = m.author;
    msgBox.classList.add('visible');
  }, 350);
}

// --- Events ---

heartBtn.addEventListener('click', (e) => {
  showMessage();
  spawnBurst(e.clientX, e.clientY);
});

heartBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  const t = e.changedTouches[0];
  showMessage();
  spawnBurst(t.clientX, t.clientY);
}, { passive: false });

// --- Burst particles ---

function spawnBurst(x, y) {
  const container = document.createElement('div');
  container.className = 'burst';
  container.style.left = x + 'px';
  container.style.top  = y + 'px';
  document.body.appendChild(container);

  const count = 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'burst-heart';
    el.textContent = '♥';
    el.style.color = `hsl(${130 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%)`;
    const angle = (i / count) * Math.PI * 2;
    const dist  = 50 + Math.random() * 70;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.animationDelay = Math.random() * 0.1 + 's';
    container.appendChild(el);
  }

  setTimeout(() => container.remove(), 1200);
}

// --- Floating sunflowers ---

const petalContainer = document.getElementById('petals');
const PETALS = ['🌻', '🌻', '🌻', '✿', '🌼'];

function spawnPetal() {
  const p = document.createElement('span');
  p.className = 'petal';
  p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left              = Math.random() * 100 + 'vw';
  p.style.fontSize          = (16 + Math.random() * 14) + 'px';
  p.style.animationDuration = (8 + Math.random() * 12) + 's';
  p.style.animationDelay    = (Math.random() * 6) + 's';
  petalContainer.appendChild(p);
  setTimeout(() => p.remove(), 22000);
}

for (let i = 0; i < 18; i++) spawnPetal();
setInterval(spawnPetal, 1800);
