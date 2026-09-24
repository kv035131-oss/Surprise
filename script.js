/**
 * Happy Birthday Vamshi Das - Interactive Proposal & Celebration Script
 * Plain Vanilla JavaScript - No External Dependencies Needed!
 */

// ==========================================
// 1. CONFIGURATION & CUSTOMIZATION
// Change these details as needed!
// ==========================================
const CONFIG = {
  herName: "Vamshi Das",
  yourName: "Vijay",
  dateText: "Tomorrow",
  timeText: "1:00 PM",
  placeText: "Special Secret Spot 🍷✨",
  dressCodeText: "Whatever makes you happy & glowing 💕",
  
  // Heartfelt message displayed on celebration screen
  heartfeltMessage: `Happy Birthday, Vamshi! 🎂 You bring so much joy, laughter, and warmth into my world. I wanted to make today extra special because you deserve all the happiness in the universe. I can't wait for tomorrow! ❤️`,
  
  // iCal Event details
  icsTitle: "Birthday Date with Vamshi Das 💖",
  icsDescription: "Happy Birthday Date! Dress code: Whatever makes you happy 💕",
  icsLocation: "Special Secret Spot",
  icsStartHour: 13, // 1:00 PM
  icsStartMinute: 0,
  icsDurationHours: 3
};

// Labels for No button dodging sequence
const NO_LABELS = [
  "No 💔",
  "Are you sure?",
  "Really?",
  "Think again 🥺",
  "Please?",
  "Last chance!",
  "Okay you can't click me 😎"
];

// Funny reaction messages on dodge
const DODGE_MESSAGES = [
  "Nice try 😏",
  "The No button is scared of you 🏃‍♂️",
  "Error 404: No not found 🤖",
  "Physics forbids clicking No ⚛️",
  "Quantum superposition: No is elsewhere 🌌",
  "Nice reflexes, but not fast enough! ⚡",
  "Nope! Still dodged! 🎯",
  "The universe wants you to click Yes! ✨",
  "Resistance is futile 💖",
  "Almost got it... but nope! 😜"
];

// State variables
let dodgeCount = 0;
let titleClickCount = 0;
let isAudioPlaying = false;
let audioContext = null;
let synthInterval = null;

// DOM Elements
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const dodgeMsg = document.getElementById("dodge-msg");
const quitMsg = document.getElementById("quit-msg");
const typingText = document.getElementById("typing-text");
const questionPage = document.getElementById("question-page");
const celebrationPage = document.getElementById("celebration-page");
const calendarBtn = document.getElementById("calendar-btn");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicText = document.getElementById("music-text");
const bgMusic = document.getElementById("bg-music");
const bdayTitle = document.getElementById("bday-title");
const easterEggToast = document.getElementById("easter-egg-toast");

// Setup customizable elements from CONFIG
document.getElementById("author-name").textContent = CONFIG.yourName;
document.getElementById("footer-author-name").textContent = CONFIG.yourName;
document.getElementById("card-date").textContent = CONFIG.dateText;
document.getElementById("card-time").textContent = CONFIG.timeText;
document.getElementById("card-place").textContent = CONFIG.placeText;
document.getElementById("heartfelt-text").textContent = CONFIG.heartfeltMessage;

// ==========================================
// 2. TYPING ANIMATION EFFECT
// ==========================================
const subtextPhrase = "I have one important question for you...";
let charIndex = 0;

function typeSubtext() {
  if (charIndex < subtextPhrase.length) {
    typingText.textContent += subtextPhrase.charAt(charIndex);
    charIndex++;
    setTimeout(typeSubtext, 60);
  }
}

// Start typing on load
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeSubtext, 400);

  // Quick Preview helper: ?page=2 directly shows celebration page
  if (window.location.search.includes("page=2")) {
    questionPage.classList.remove("page-active");
    questionPage.classList.add("page-hidden");
    celebrationPage.classList.remove("page-hidden");
    celebrationPage.classList.add("page-active");
    setTimeout(launchConfetti, 500);
  }
});

// ==========================================
// 3. ENHANCED RUNAWAY NO BUTTON LOGIC
// ==========================================

let lastNoPos = null;
let chaosTimer = null;

/**
 * Calculates a safe random position for No button inside viewport:
 * 1. Strict 16px margin from all viewport edges.
 * 2. Never overlaps Yes button or main question text.
 * 3. At least 150px jump distance from previous spot.
 * 4. Falls back to a safe corner if 20 random retries fail.
 */
function getSafeRandomPosition() {
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const questionElem = document.querySelector(".main-question");
  const questionRect = questionElem ? questionElem.getBoundingClientRect() : null;

  const bw = noRect.width || 110;
  const bh = noRect.height || 48;

  const margin = 16; // Mandatory 16px viewport edge margin
  const minX = margin;
  const maxX = Math.max(minX, vw - bw - margin);
  const minY = margin;
  const maxY = Math.max(minY, vh - bh - margin);

  const prevX = lastNoPos ? lastNoPos.x : (vw / 2);
  const prevY = lastNoPos ? lastNoPos.y : (vh / 2);

  const yesPadding = 35; // Avoid Yes button margin
  const questionPadding = 20; // Avoid Question text margin

  let newX = minX;
  let newY = minY;
  let valid = false;

  for (let tries = 0; tries < 20; tries++) {
    newX = Math.random() * (maxX - minX) + minX;
    newY = Math.random() * (maxY - minY) + minY;

    // Check jump distance (must be >= 150px away)
    const jumpDistance = Math.hypot(newX - prevX, newY - prevY);
    if (jumpDistance < 150 && tries < 15) continue;

    // Check overlap with Yes button
    const overlapsYes = 
      newX < yesRect.right + yesPadding &&
      newX + bw > yesRect.left - yesPadding &&
      newY < yesRect.bottom + yesPadding &&
      newY + bh > yesRect.top - yesPadding;

    if (overlapsYes) continue;

    // Check overlap with Question text
    let overlapsQuestion = false;
    if (questionRect) {
      overlapsQuestion = 
        newX < questionRect.right + questionPadding &&
        newX + bw > questionRect.left - questionPadding &&
        newY < questionRect.bottom + questionPadding &&
        newY + bh > questionRect.top - questionPadding;
    }

    if (overlapsQuestion) continue;

    valid = true;
    break;
  }

  // Fallback if 20 random retries didn't find an unblocked spot
  if (!valid) {
    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    const corners = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: maxY }
    ];

    corners.sort((a, b) => {
      const distA = Math.hypot(a.x - yesCenterX, a.y - yesCenterY);
      const distB = Math.hypot(b.x - yesCenterX, b.y - yesCenterY);
      return distB - distA; // Descending distance
    });

    newX = corners[0].x;
    newY = corners[0].y;
  }

  // Final strict clamping check
  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  return { x: newX, y: newY };
}

/**
 * Creates a playful puff/sparkle effect at the spot the No button left from.
 */
function spawnPuffEffect(x, y) {
  const puff = document.createElement("div");
  puff.className = "dodge-puff";
  puff.textContent = ["✨", "💨", "💖", "🌸", "⭐"][Math.floor(Math.random() * 5)];
  puff.style.left = `${x + 10}px`;
  puff.style.top = `${y + 10}px`;
  document.body.appendChild(puff);
  setTimeout(() => puff.remove(), 450);
}

/**
 * Ensures the No button stays strictly clamped inside viewport upon window resize / orientation change.
 */
function clampPositionInsideViewport() {
  if (!noBtn.classList.contains("runaway") || noBtn.style.display === "none") return;

  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const margin = 16;

  const rect = noBtn.getBoundingClientRect();
  const bw = rect.width || 100;
  const bh = rect.height || 45;

  let currentX = parseFloat(noBtn.style.left) || rect.left;
  let currentY = parseFloat(noBtn.style.top) || rect.top;

  const maxX = Math.max(margin, vw - bw - margin);
  const maxY = Math.max(margin, vh - bh - margin);

  const clampedX = Math.max(margin, Math.min(currentX, maxX));
  const clampedY = Math.max(margin, Math.min(currentY, maxY));

  noBtn.style.left = `${clampedX}px`;
  noBtn.style.top = `${clampedY}px`;

  devCheckBounds();
}

/**
 * Development safety check: logs warning if No button exceeds screen bounds.
 */
function devCheckBounds() {
  if (!noBtn.classList.contains("runaway") || noBtn.style.display === "none") return;
  const rect = noBtn.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (rect.left < 0 || rect.top < 0 || rect.right > vw || rect.bottom > vh) {
    console.warn("[DEV CHECK] No button exceeded viewport bounds!", {
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      viewport: { width: vw, height: vh }
    });
  }
}

// Window resize & orientation change handlers
window.addEventListener("resize", clampPositionInsideViewport);
window.addEventListener("orientationchange", () => setTimeout(clampPositionInsideViewport, 150));
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", clampPositionInsideViewport);
  window.visualViewport.addEventListener("scroll", clampPositionInsideViewport);
}

function dodgeNoButton() {
  if (dodgeCount >= 10) return;

  // Record old position for puff effect
  const oldRect = noBtn.getBoundingClientRect();
  if (oldRect.width > 0) {
    spawnPuffEffect(oldRect.left, oldRect.top);
  }

  dodgeCount++;

  // CHAOS MODE (After 5th dodge): Shake briefly before jumping & spontaneous jump timer
  if (dodgeCount > 5) {
    if (Math.random() < 0.4) {
      noBtn.classList.add("shaking");
      setTimeout(() => noBtn.classList.remove("shaking"), 150);
    }
    
    // Clear any previous chaos timer
    if (chaosTimer) clearTimeout(chaosTimer);
    
    // Spontaneous dodge timer: button moves even if cursor doesn't get close!
    if (dodgeCount < 10) {
      chaosTimer = setTimeout(() => {
        if (dodgeCount < 10 && !questionPage.classList.contains("page-hidden")) {
          dodgeNoButton();
        }
      }, Math.random() * 2000 + 2000);
    }
  }

  noBtn.classList.add("runaway");
  const pos = getSafeRandomPosition();
  lastNoPos = { x: pos.x, y: pos.y };

  // Calculate random wobble rotation (-15deg to +15deg)
  const randomRot = Math.floor(Math.random() * 31) - 15;

  // Scale calculations: shrink No (min 0.60), grow Yes (max 1.80)
  const noScale = Math.max(0.60, 1 - dodgeCount * 0.05);
  const yesScale = Math.min(1.80, 1 + dodgeCount * 0.08);

  noBtn.style.left = `${pos.x}px`;
  noBtn.style.top = `${pos.y}px`;
  noBtn.style.transform = `scale(${noScale}) rotate(${randomRot}deg)`;
  yesBtn.style.transform = `scale(${yesScale})`;

  // Update button label
  const labelIndex = Math.min(dodgeCount, NO_LABELS.length - 1);
  noBtn.textContent = NO_LABELS[labelIndex];

  // Update funny feedback message
  const msgIndex = (dodgeCount - 1) % DODGE_MESSAGES.length;
  dodgeMsg.textContent = DODGE_MESSAGES[msgIndex];
  dodgeMsg.style.opacity = "1";

  // Check bounds for dev warning
  devCheckBounds();

  // After 10th dodge: No button quits!
  if (dodgeCount >= 10) {
    if (chaosTimer) clearTimeout(chaosTimer);
    noBtn.classList.add("quitting");
    setTimeout(() => {
      noBtn.style.display = "none";
      dodgeMsg.style.display = "none";
      quitMsg.classList.remove("hidden");
    }, 400);
  }
}

// DESKTOP: Dodge when cursor comes within 100px proximity
document.addEventListener("mousemove", (e) => {
  if (dodgeCount >= 10 || questionPage.classList.contains("page-hidden")) return;
  
  const noRect = noBtn.getBoundingClientRect();
  if (noRect.width === 0) return;

  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;
  
  const distance = Math.hypot(e.clientX - noCenterX, e.clientY - noCenterY);

  // 100px proximity threshold
  if (distance < 100) {
    dodgeNoButton();
  }
});

// MOBILE & TOUCH: Dodge on touchstart / pointerdown before tap registers
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodgeNoButton();
}, { passive: false });

noBtn.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch" || e.pointerType === "pen") {
    e.preventDefault();
    dodgeNoButton();
  }
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dodgeNoButton();
});

// KEYBOARD ACCESSIBILITY: If user tabs to No button or presses Enter/Space, treat as dodge
noBtn.addEventListener("focus", () => {
  dodgeNoButton();
});

noBtn.addEventListener("keydown", (e) => {
  e.preventDefault();
  dodgeNoButton();
});

// ==========================================
// 4. YES BUTTON & CELEBRATION TRANSITION
// ==========================================
yesBtn.addEventListener("click", () => {
  // Play sound effect
  playVictoryTone();

  // Trigger celebration page transition
  questionPage.classList.remove("page-active");
  questionPage.classList.add("page-hidden");

  setTimeout(() => {
    celebrationPage.classList.remove("page-hidden");
    celebrationPage.classList.add("page-active");
    
    // Start heavy confetti burst
    launchConfetti();
  }, 300);
});

// ==========================================
// 5. EASTER EGG (5 Clicks on Heading)
// ==========================================
bdayTitle.addEventListener("click", () => {
  titleClickCount++;
  if (titleClickCount === 5) {
    easterEggToast.classList.remove("hidden");
    spawnHeartsAroundElement(bdayTitle);
    playSweetChime();
  } else if (titleClickCount > 5) {
    // Reset after extra clicks
    titleClickCount = 0;
    easterEggToast.classList.add("hidden");
  }
});

// ==========================================
// 6. ADD TO CALENDAR (.ics Generator)
// ==========================================
calendarBtn.addEventListener("click", () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const startHour = String(CONFIG.icsStartHour).padStart(2, "0");
  const startMinute = String(CONFIG.icsStartMinute).padStart(2, "0");
  const endHour = String(CONFIG.icsStartHour + CONFIG.icsDurationHours).padStart(2, "0");

  const dtStart = `${year}${month}${day}T${startHour}${startMinute}00`;
  const dtEnd = `${year}${month}${day}T${endHour}${startMinute}00`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vamshi Birthday Date//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `SUMMARY:${CONFIG.icsTitle}`,
    `DESCRIPTION:${CONFIG.icsDescription}`,
    `LOCATION:${CONFIG.icsLocation}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `Vamshi_Birthday_Date.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// ==========================================
// 7. BACKGROUND MUSIC & AUDIO SYNTH FALLBACK
// ==========================================
musicToggle.addEventListener("click", () => {
  if (!isAudioPlaying) {
    // Attempt HTML Audio play
    bgMusic.play().then(() => {
      setMusicState(true);
    }).catch(() => {
      // Fallback to Web Audio Synthesizer if no MP3 or blocked
      startProceduralAudio();
      setMusicState(true);
    });
  } else {
    bgMusic.pause();
    stopProceduralAudio();
    setMusicState(false);
  }
});

function setMusicState(playing) {
  isAudioPlaying = playing;
  if (playing) {
    musicToggle.classList.add("playing");
    musicIcon.textContent = "🔊";
    musicText.textContent = "Mute Music";
  } else {
    musicToggle.classList.remove("playing");
    musicIcon.textContent = "🎵";
    musicText.textContent = "Play Music";
  }
}

// Procedural Romantic Melody Synth (Fallback when no MP3 file exists!)
function startProceduralAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // Soft soothing melody notes (frequencies in Hz)
  const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 493.88];
  let step = 0;

  synthInterval = setInterval(() => {
    if (!isAudioPlaying) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(notes[step % notes.length], audioContext.currentTime);

    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 1.2);

    step++;
  }, 500);
}

function stopProceduralAudio() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

function playVictoryTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.4);
    });
  } catch (e) {
    // Audio Context not allowed or unsupported
  }
}

function playSweetChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ==========================================
// 8. CANVAS BACKGROUND PARTICLES & CONFETTI
// ==========================================
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Floating Hearts & Balloons Particles
class FloatingParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.size = Math.random() * 18 + 12;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
    this.opacity = Math.random() * 0.6 + 0.3;
    this.type = Math.random() > 0.4 ? "heart" : "balloon";
    this.color = ["#ff758f", "#ffb5a7", "#c77dff", "#ff4d6d", "#e0aaff"][
      Math.floor(Math.random() * 5)
    ];
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.02) * 0.5;

    if (this.y < -50) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === "heart") {
      drawHeart(ctx, this.x, this.y, this.size);
    } else {
      // Draw Balloon
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
      // Balloon string
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.size / 2);
      ctx.lineTo(this.x, this.y + this.size / 2 + 15);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawHeart(c, x, y, size) {
  c.beginPath();
  const topCurveHeight = size * 0.3;
  c.moveTo(x, y + topCurveHeight);
  c.bezierCurveTo(
    x, y,
    x - size / 2, y,
    x - size / 2, y + topCurveHeight
  );
  c.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2,
    x, y + size,
    x, y + size
  );
  c.bezierCurveTo(
    x, y + size,
    x + size / 2, y + (size + topCurveHeight) / 2,
    x + size / 2, y + topCurveHeight
  );
  c.bezierCurveTo(
    x + size / 2, y,
    x, y,
    x, y + topCurveHeight
  );
  c.closePath();
  c.fill();
}

// Confetti Particle System for Celebration
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 10 + 6;
    this.color = ["#ff4d6d", "#7209b7", "#4361ee", "#4cc9f0", "#38b000", "#ffb703"][
      Math.floor(Math.random() * 6)
    ];
    this.vx = (Math.random() - 0.5) * 14;
    this.vy = (Math.random() - 0.7) * 16;
    this.gravity = 0.35;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
  }

  update() {
    this.vx *= 0.98;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.008;
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

// Particle Arrays
const bgParticles = Array.from({ length: 25 }, () => new FloatingParticle());
let confettiParticles = [];

function launchConfetti() {
  const burstCount = 120;
  for (let i = 0; i < burstCount; i++) {
    confettiParticles.push(new ConfettiParticle(width / 2, height / 2));
    confettiParticles.push(new ConfettiParticle(width * 0.2, height * 0.4));
    confettiParticles.push(new ConfettiParticle(width * 0.8, height * 0.4));
  }
}

function spawnHeartsAroundElement(elem) {
  const rect = elem.getBoundingClientRect();
  for (let i = 0; i < 15; i++) {
    const heart = new FloatingParticle();
    heart.x = rect.left + Math.random() * rect.width;
    heart.y = rect.top + Math.random() * rect.height;
    heart.speedY = Math.random() * 2 + 1;
    heart.type = "heart";
    bgParticles.push(heart);
  }
}

// Canvas Animation Loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Render Background Floating Hearts/Balloons
  bgParticles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Render Active Confetti Particles
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const c = confettiParticles[i];
    c.update();
    c.draw();
    if (c.opacity <= 0 || c.y > height + 50) {
      confettiParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

// Start Canvas loop
animate();
