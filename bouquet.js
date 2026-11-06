// ================= I LOVE YOU words moving in the background =================
const bg = document.getElementById("bg");
const COUNT = 36;

for (let i = 0; i < COUNT; i++) {
  const w = document.createElement("span");
  const goesUp = i % 3 !== 0; // 2/3 float upward, 1/3 slide sideways
  w.className = "word " + (goesUp ? "up" : "side");
  w.textContent = "I LOVE YOU";

  const size = 14 + Math.random() * 30;
  w.style.fontSize = size + "px";
  w.style.opacity = (0.15 + Math.random() * 0.45).toFixed(2);
  w.style.setProperty("--r0", (Math.random() * 30 - 15).toFixed(1) + "deg");
  w.style.setProperty("--r1", (Math.random() * 30 - 15).toFixed(1) + "deg");

  if (goesUp) {
    w.style.left = Math.random() * 85 + "vw";
    w.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
    w.style.animationDuration = 12 + Math.random() * 14 + "s";
  } else {
    w.style.setProperty("--y", Math.random() * 90 + "vh");
    w.style.setProperty("--dy", (Math.random() * 30 - 15).toFixed(0) + "vh");
    w.style.animationDuration = 18 + Math.random() * 16 + "s";
  }
  w.style.animationDelay = -Math.random() * 25 + "s"; // already scattered on load
  bg.appendChild(w);
}

// ================= Build the bouquet (SVG) =================
const svg = document.getElementById("bouquet");

const flowers = [
  { x: 200, y: 140, c: "#e63946", s: 1.3 },  // centre, the first bud
  { x: 128, y: 205, c: "#ff4d6d", s: 1.1 },
  { x: 272, y: 205, c: "#ff758f", s: 1.1 },
  { x: 82,  y: 280, c: "#ff8fa3", s: 0.95 },
  { x: 318, y: 280, c: "#d90429", s: 0.95 },
  { x: 160, y: 290, c: "#ff5d8f", s: 1.0 },
  { x: 240, y: 290, c: "#f72585", s: 1.0 },
];

function petals() {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += `<path class="petal" style="--r:${i * 45}deg" d="M0 0 C-13 -8 -14 -30 0 -36 C14 -30 13 -8 0 0Z"/>`;
  }
  for (let i = 0; i < 6; i++) {
    out += `<path class="petal inner" style="--r:${i * 60 + 20}deg" d="M0 0 C-13 -8 -14 -30 0 -36 C14 -30 13 -8 0 0Z"/>`;
  }
  return out;
}

let stems = "";
let leaves = "";
let blooms = "";

flowers.forEach((f, i) => {
  const mx = (200 + f.x) / 2;
  const my = (440 + f.y) / 2 + 30;
  stems += `<path class="stem" pathLength="1" d="M200 440 Q ${mx} ${my} ${f.x} ${f.y}"/>`;

  // a leaf roughly halfway up each stem (not on the centre one)
  if (i > 0) {
    const lx = mx + (f.x < 200 ? -6 : 6);
    const ly = my - 10;
    const angle = f.x < 200 ? 200 : -20;
    leaves += `<g transform="translate(${lx} ${ly}) rotate(${angle})"><path class="leaf" d="M0 0 Q14 -11 30 0 Q14 11 0 0Z"/></g>`;
  }

  blooms += `
    <g transform="translate(${f.x} ${f.y})">
      <g class="flower" id="flower${i}" style="--c:${f.c};--s:${f.s}">
        ${petals()}
        <circle class="core" r="5"/>
      </g>
    </g>`;
});

const wrapping = `
  <g id="wrap">
    <path d="M105 392 L295 392 L228 505 L172 505 Z" fill="#ffd6e0" fill-opacity="0.92"/>
    <path d="M105 392 L200 420 L295 392" fill="none" stroke="#ff8fa3" stroke-width="2"/>
    <path d="M150 392 L190 505 M250 392 L210 505" stroke="#ffb3c6" stroke-width="1.5" fill="none"/>
    <!-- bow -->
    <g transform="translate(200 430)">
      <ellipse cx="-22" cy="0" rx="22" ry="12" fill="#c9184a" transform="rotate(-18 -22 0)"/>
      <ellipse cx="22"  cy="0" rx="22" ry="12" fill="#c9184a" transform="rotate(18 22 0)"/>
      <path d="M0 6 L-14 40 L-4 34 L0 44 L4 34 L14 40Z" fill="#a4133c"/>
      <circle r="8" fill="#ff4d6d"/>
    </g>
  </g>`;

svg.innerHTML = `<g id="rise">${stems}${leaves}${blooms}${wrapping}</g>`;

// ================= The slow transformation timeline =================
const rise = document.getElementById("rise");
const caption = document.getElementById("caption");
const finalBox = document.getElementById("final");
const $ = (sel) => document.querySelectorAll(sel);

function say(text) {
  caption.classList.remove("visible");
  setTimeout(() => {
    caption.textContent = text;
    caption.classList.add("visible");
  }, 700);
}

const timeline = [
  // 1. the bouquet pops up, starting as one tiny bud
  [600, () => {
    rise.classList.add("show");
    document.getElementById("flower0").classList.add("bud");
    say("It starts as one tiny bud…");
  }],

  // 2. stems and leaves grow
  [4200, () => {
    $(".stem").forEach((s, i) => setTimeout(() => s.classList.add("grow"), i * 350));
    say("Then the stems reach out, slowly, one by one…");
  }],
  [7800, () => {
    $(".leaf").forEach((l, i) => setTimeout(() => l.classList.add("grow"), i * 300));
  }],

  // 3. more buds pop up
  [9000, () => {
    flowers.forEach((_, i) => {
      if (i > 0) setTimeout(() => document.getElementById("flower" + i).classList.add("bud"), i * 450);
    });
    say("More buds appear, each in its own time…");
  }],

  // 4. WHY it is slow
  [13500, () => say("Why so slowly? Because anything real needs time to grow, and I don't want to rush us.")],

  // 5. the buds open and change colour
  [19000, () => {
    document.getElementById("flower0").classList.add("bloom");
    say("Every petal opens a little at a time, like my heart opening to you again…");
  }],
  [22000, () => {
    flowers.forEach((_, i) => {
      if (i > 0) setTimeout(() => document.getElementById("flower" + i).classList.add("bloom"), i * 1200);
    });
  }],

  // 6. wrapping, ribbon and the final words
  [31000, () => {
    document.getElementById("wrap").classList.add("show");
    say("A bouquet that blooms slowly lasts the longest. So does love.");
  }],
  [36000, () => {
    say("I'm sorry. Thank you for coming back to me.");
    finalBox.classList.add("show");
  }],
];

timeline.forEach(([ms, fn]) => setTimeout(fn, ms));

document.getElementById("replay").addEventListener("click", () => location.reload());