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

// Resize canvas when browser size changes
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

    // Stronger wind influence
    this.x += wind * 2 * this.layer;

    if (this.y > canvas.height) {
      ripples.push(new Ripple(this.x, canvas.height - 5));
      this.reset();
      this.y = 0;
    }

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
  }

  draw() {

    // Brighter rain colors
    ctx.strokeStyle =
      this.layer === 1
        ? "#b9e6ff"
        : "#84b8e6";

    ctx.lineWidth = this.layer;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);

    // Stronger visual angle from wind
    ctx.lineTo(
      this.x - wind * 10,
      this.y + this.len
    );

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
    ctx.strokeStyle = `rgba(200,230,255,${this.alpha})`;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
}

// ---------------- ARRAYS ----------------
let rain = [];
let ripples = [];

function createRain() {
  rain = [];

  for (let i = 0; i < rainCount; i++) {
    rain.push(
      new RainDrop(
        Math.random() > 0.5 ? 1 : 0.7
      )
    );
  }
}

createRain();

// ---------------- INTERACTION ----------------
window.addEventListener("mousemove", (e) => {

  // Much stronger wind effect
  windTarget =
    (e.clientX / window.innerWidth - 0.5) * 10;

});

canvas.addEventListener("click", (e) => {

  const rect =
    canvas.getBoundingClientRect();

  ripples.push(
    new Ripple(
      e.clientX - rect.left,
      e.clientY - rect.top
    )
  );
});

document.getElementById("thunderBtn").onclick = () => {
  flash = 1.4;
};

document.getElementById("rainSlider").oninput = (e) => {
  rainCount = parseInt(e.target.value);
  createRain();
};

// ---------------- LIGHTNING ----------------
function randomLightning() {
  if (Math.random() < 0.003) {
    flash = 1.4;
  }
}

// ---------------- ANIMATION ----------------
function animate() {

  wind += (windTarget - wind) * 0.05;

  // Brighter storm sky
  const grad = ctx.createLinearGradient(
    0,
    0,
    0,
    canvas.height
  );

  grad.addColorStop(0, "#18395f");
  grad.addColorStop(1, "#2f5c87");

  ctx.fillStyle = grad;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Water reflection
  ctx.fillStyle = "rgba(120,180,255,0.10)";

  ctx.fillRect(
    0,
    canvas.height * 0.75,
    canvas.width,
    canvas.height
  );

  // Rain
  rain.forEach(r => {
    r.update();
    r.draw();
  });

  // Ripples
  for (let i = ripples.length - 1; i >= 0; i--) {

    ripples[i].update();
    ripples[i].draw();

    if (ripples[i].alpha <= 0) {
      ripples.splice(i, 1);
    }
  }

  // Lightning flash
  if (flash > 0) {

    ctx.fillStyle =
      `rgba(220,240,255,${flash})`;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle =
      `rgba(180,220,255,${flash * 0.4})`;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    flash -= 0.025;
  }

  randomLightning();

  requestAnimationFrame(animate);
}

animate();

};
