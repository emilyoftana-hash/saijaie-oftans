// ---------- floating hearts background ----------
const bg = document.getElementById("bg");
const hearts = ["💗", "💖", "💕", "❤️", "💘"];
for (let i = 0; i < 22; i++) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 28 + "px";
  h.style.animationDuration = 8 + Math.random() * 10 + "s";
  h.style.animationDelay = -Math.random() * 14 + "s";
  bg.appendChild(h);
}

// ---------- the buttons ----------
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

const messages = [
  "Oops, that button is shy 🙈",
  "Too slow! 😜",
  "You can't catch it…",
  "Are you sure you want to press that? 🥺",
  "It really doesn't want to be pressed 💔",
  "Just press the other one, please 💖",
  "The 'No' button has left the chat.",
];

let escaped = false;
let dodges = 0;

function dodge(cursorX, cursorY) {
  // First time: lift the button out of the card so it can roam the full screen
  if (!escaped) {
    const r = noBtn.getBoundingClientRect();
    document.body.appendChild(noBtn);
    noBtn.classList.add("escaped");
    noBtn.style.left = r.left + "px";
    noBtn.style.top = r.top + "px";
    void noBtn.offsetWidth; // force reflow so the next move animates
    escaped = true;
  }

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const margin = 16;
  const maxX = window.innerWidth - w - margin;
  const maxY = window.innerHeight - h - margin;

  let nx, ny, tries = 0;
  do {
    nx = margin + Math.random() * Math.max(maxX - margin, 1);
    ny = margin + Math.random() * Math.max(maxY - margin, 1);
    tries++;
  } while (
    tries < 40 &&
    Math.hypot(nx + w / 2 - cursorX, ny + h / 2 - cursorY) < 220
  );

  noBtn.style.left = nx + "px";
  noBtn.style.top = ny + "px";

  dodges++;
  hint.textContent = messages[(dodges - 1) % messages.length];

  // The "yes" button slowly gets bigger every time "no" runs away
  const scale = Math.min(1 + dodges * 0.06, 1.6);
  yesBtn.style.transform = `scale(${scale})`;
}

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Runs away when the cursor gets close, hovers, taps or tries to click
document.addEventListener("pointermove", (e) => {
  const c = centerOf(noBtn);
  if (Math.hypot(c.x - e.clientX, c.y - e.clientY) < 90) dodge(e.clientX, e.clientY);
});

noBtn.addEventListener("mouseenter", (e) => dodge(e.clientX, e.clientY));

noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  dodge(e.clientX, e.clientY);
});

noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    dodge(t.clientX, t.clientY);
  },
  { passive: false }
);

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const c = centerOf(noBtn);
  dodge(c.x, c.y);
});

// keyboard users: moving focus onto it also makes it run
noBtn.addEventListener("focus", () => {
  const c = centerOf(noBtn);
  dodge(c.x, c.y);
  noBtn.blur();
});

// ---------- "Okay I will come back" -> next section ----------
yesBtn.addEventListener("click", () => {
  hint.textContent = "Thank you… 🥹💖";
  document.body.classList.add("leaving");
  setTimeout(() => (window.location.href = "bouquet.html"), 900);
});