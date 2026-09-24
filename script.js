const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('bgMusic');
const typewriterElement = document.getElementById('typewriterText');

let isDrawing = false;
let musicStarted = false;
let typewriterStarted = false;

const poemText = `Si tus ojitos fueran estrellas,
me perdería feliz buscando mi camino en ellos,
pues entre la noche más oscura y lejana,
no hay brillo más puro ni faro más bello.

Te extraño en el silencio de cada momento,
te quiero en la distancia que nos separa hoy,
y aunque te busco en el mapa del viento,
es en tu recuerdo donde siempre estoy.

Si supieras la falta que le haces a mis días,
lo mucho que temo ver tu luz apagarse,
entenderías que en todas mis geografías
mi único deseo es jamás distanciarme.

Que si el cielo se apaga y el mundo se pierde,
a mí me bastaría solo con tu mirada,
para hallar el rumbo que a tu lado me vuelve
y no volver a sentirme lejos de nada.

Porque perderte sería perder el horizonte,
quedarme sin norte, sin guía y sin fe,
por eso le pido a tu nombre que me nombre, 
para no olvidarme de quién junto a ti fui.`;

// Escribe el poema lentamente y baja el scroll automáticamente mientras escribe
function typeWriter(text, i = 0) {
  if (i === 0) {
    typewriterElement.classList.add('typing');
  }

  if (i < text.length) {
    typewriterElement.textContent += text.charAt(i);
    
    const container = typewriterElement.parentElement;
    container.scrollTop = container.scrollHeight;

    setTimeout(() => typeWriter(text, i + 1), 70); // Velocidad suave
  } else {
    typewriterElement.classList.remove('typing');
  }
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function initCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#ff007f');
  gradient.addColorStop(0.5, '#b30059');
  gradient.addColorStop(1, '#660033');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const starColors = ['#ffffff', '#ffe6f2', '#ffd700', '#ff99dd'];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 4 + 2;
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    drawStar(x, y, 5, size, size / 2, color);
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ ¡Raspa aquí! ✨', canvas.width / 2, canvas.height / 2 - 5);
  
  ctx.font = '15px sans-serif';
  ctx.fillStyle = '#ffe6f2';
  ctx.fillText('Descubre nuestro secreto ❤️', canvas.width / 2, canvas.height / 2 + 25);
}

// Evalúa qué porcentaje del lienzo ha sido rascado
function checkScratchedPercentage() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparentPixels++;
    }
  }

  const percentage = (transparentPixels / (pixels.length / 4)) * 100;

  // Si se ha rascado más del 30%, desvanece la capa rascable para poder interactuar con el poema
  if (percentage > 30) {
    canvas.classList.add('disabled');
  }
}

function startScratch(e) {
  isDrawing = true;
  
  if (!musicStarted) {
    audio.play().catch(err => console.log("Audio bloqueado:", err));
    musicStarted = true;
  }

  if (!typewriterStarted) {
    typeWriter(poemText);
    typewriterStarted = true;
  }
  
  scratch(e);
}

function stopScratch() {
  if (isDrawing) {
    checkScratchedPercentage();
  }
  isDrawing = false;
  ctx.beginPath();
}

function scratch(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = 45;
  ctx.lineCap = 'round';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

canvas.addEventListener('mousedown', startScratch);
canvas.addEventListener('mouseup', stopScratch);
canvas.addEventListener('mousemove', scratch);

canvas.addEventListener('touchstart', startScratch);
canvas.addEventListener('touchend', stopScratch);
canvas.addEventListener('touchmove', scratch);

window.onload = initCanvas;