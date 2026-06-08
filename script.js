window.onload = () => {
alert("script loaded");

const canvas = document.getElementById("rainCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// NEW: Resize canvas when browser window changes size
window.addEventListener("resize", resizeCanvas);

// ---------------- SETTINGS ----------------
let windTarget = 0;
let wind = 0;
let flash = 0;
let rainCount = 250;

// ---------------- RAIN ----------------
class RainDrop {
  constructor(layer = 1) {
    this.layer = layer;
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.len = 8 + Math.random() * 10;
    this.speed = (2 + Math.random() * 4) * this.layer;
  }

  update() {
    this.y += this.speed;
    this.x += wind * this.layer;

    if (this.y > canvas.height) {
      ripples.push(new Ripple(this.x, canvas.height - 5));
      this.reset();
      this.y = 0;
    }

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
  }

  draw() {
    ctx.strokeStyle = this.layer === 1 ? "#8ecfff" : "#5a8bbd";
    ctx.lineWidth = this.layer;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - wind * 4, this.y + this.len);
    ctx.stroke();
  }
}

// ---------------- RIPPLE ----------------
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.alpha = 1;
  }

  update() {
    this.radius += 2.2;
    this.alpha -= 0.018;
  }

  draw() {
    ctx.strokeStyle = `rgba(180,220,255,${this.alpha})`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------------- ARRAYS ----------------
let rain = [];
let ripples = [];

// layered rain
function createRain() {
  rain = [];
  for (let i = 0; i < rainCount; i++) {
    rain.push(new RainDrop(Math.random() > 0.5 ? 1 : 0.7));
  }
}
createRain();

// ---------------- INTERACTION ----------------
window.addEventListener("mousemove", (e) => {
  windTarget = (e.clientX / window.innerWidth - 0.5) * 3;
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  ripples.push(new Ripple(
    e.clientX - rect.left,
    e.clientY - rect.top
  ));
});

document.getElementById("thunderBtn").onclick = () => {
  flash = 1;
};

document.getElementById("rainSlider").oninput = (e) => {
  rainCount = parseInt(e.target.value);
  createRain();
};

// ---------------- LIGHTNING ----------------
function randomLightning() {
  if (Math.random() < 0.003) {
    flash = 1;
  }
}

// ---------------- ANIMATE ----------------
function animate() {

  wind += (windTarget - wind) * 0.05;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#02040a");
  grad.addColorStop(1, "#0b1f3a");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(30,80,140,0.08)";
  ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height);

  rain.forEach(r => {
    r.update();
    r.draw();
  });

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].draw();

    if (ripples[i].alpha <= 0) {
      ripples.splice(i, 1);
    }
  }

  if (flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flash -= 0.04;
  }

  randomLightning();

  requestAnimationFrame(animate);
}

animate();

};
