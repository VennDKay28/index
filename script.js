const heartRain = document.getElementById('heart-rain');
const stars = document.getElementById('stars');
const celebrateBtn = document.getElementById('celebrateBtn');
const surpriseBtns = document.querySelectorAll('.surprise-btn');
const imageReveal = document.getElementById('imageReveal');
const revealImage = document.getElementById('revealImage');
const revealTitle = document.getElementById('revealTitle');
const revealText = document.getElementById('revealText');
const closeReveal = document.getElementById('closeReveal');
const sparkleLayer = document.getElementById('sparkleLayer');
const defaultRevealImage = 'img/HPBD.png';

function createStars(count = 45) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.transform = `scale(${0.5 + Math.random()})`;
    stars.appendChild(star);
  }
}

function dropHeart(isBurst = false, x = Math.random() * window.innerWidth, y = -30) {
  const heart = document.createElement('span');
  heart.className = `heart ${isBurst ? 'burst' : ''}`;
  heart.textContent = ['💖', '💘', '💝', '💕', '💗'][Math.floor(Math.random() * 5)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${16 + Math.random() * 22}px`;

  if (isBurst) {
    const moveX = `${-140 + Math.random() * 280}px`;
    const moveY = `${-180 + Math.random() * 120}px`;
    heart.style.setProperty('--x', moveX);
    heart.style.setProperty('--y', moveY);
  } else {
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
  }

  heartRain.appendChild(heart);
  setTimeout(() => heart.remove(), isBurst ? 1800 : 8000);
}

function heartShower(amount = 24, x = window.innerWidth / 2, y = window.innerHeight / 2) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      dropHeart(true, x, y);
    }, i * 60);
  }
}

function preloadRevealImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src || defaultRevealImage);
    img.onerror = () => resolve(defaultRevealImage);
    img.src = src || defaultRevealImage;
  });
}

function spawnRevealSparkles() {
  sparkleLayer.innerHTML = '';

  for (let i = 0; i < 14; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${8 + Math.random() * 84}%`;
    sparkle.style.top = `${10 + Math.random() * 78}%`;
    sparkle.style.animationDelay = `${i * 0.06}s`;
    sparkle.style.transform = `scale(${0.7 + Math.random() * 1.4})`;
    sparkleLayer.appendChild(sparkle);
  }
}

async function openReveal(button) {
  const imageSrc = await preloadRevealImage(button.dataset.image || defaultRevealImage);
  const accent = button.dataset.accent || 'rgba(255, 79, 163, 0.42)';

  revealImage.src = imageSrc;
  revealImage.alt = button.dataset.title || 'Ảnh bất ngờ';
  revealTitle.textContent = button.dataset.title || 'Khoảnh khắc bất ngờ';
  revealText.textContent = button.dataset.text || 'Ảnh của bạn vừa được mở ra với hiệu ứng mềm mại hơn.';
  imageReveal.style.setProperty('--reveal-accent', accent);

  imageReveal.classList.remove('active');
  void imageReveal.offsetWidth;
  imageReveal.classList.add('active');
  imageReveal.setAttribute('aria-hidden', 'false');

  spawnRevealSparkles();
  heartShower(18, window.innerWidth / 2, window.innerHeight / 2);
}

function closeRevealModal() {
  imageReveal.classList.remove('active');
  imageReveal.setAttribute('aria-hidden', 'true');
  sparkleLayer.innerHTML = '';
}

setInterval(() => dropHeart(false), 320);

celebrateBtn.addEventListener('click', () => {
  heartShower(30, window.innerWidth / 2, window.innerHeight / 2);
});

surpriseBtns.forEach((button) => {
  button.addEventListener('click', () => openReveal(button));
});

closeReveal.addEventListener('click', closeRevealModal);

imageReveal.addEventListener('click', (event) => {
  if (event.target === imageReveal) {
    closeRevealModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeRevealModal();
  }
});

window.addEventListener('click', (event) => {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => dropHeart(true, event.clientX, event.clientY), i * 30);
  }
});

createStars();
heartShower(18);
