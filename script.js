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
// 3. 6-LEVEL ESCALATING RUNAWAY NO BUTTON GAME
// ==========================================

let lastNoPos = null;
let lastMsgIndexPerLevel = {};
let currentLevel = 1;
let proximityThreshold = 100; // 100px for Level 1, 160px for Level 2+
let fakeDecoys = [];

// Level Titles & Messages
const LEVEL_TITLES = {
  1: "Level 1: Warm-up 🌸",
  2: "Level 2: Getting Serious 😏",
  3: "Level 3: Decoys 😜",
  4: "Level 4: Mind Games 🧠✨",
  5: "Level 5: Final Boss 😈🔥",
  6: "Level 6: Surrender 🏳️💖"
};

const LEVEL_MESSAGES = {
  1: [
    "Nice try 😏",
    "Warm-up round! 🏃‍♂️",
    "No button is stretching... 🧘",
    "Getting warmed up! 🔥",
    "Fast reflexes, but nope! ⚡"
  ],
  2: [
    "The No button got faster! 🏎️",
    "Did you feel that shake? 🫨",
    "Speed 100x activated! ⚡",
    "You're persistent! 💨",
    "Still dodging! 🎯",
    "Nice try! Speeding up! 🚀"
  ],
  3: [
    "Double trouble! Which one is real? 👯",
    "Decoy deployed! 🎭",
    "Oops, wrong No! 😜",
    "Shadow clone jutsu! 🥷",
    "Triplets?! 😱"
  ],
  4: [
    "Mind games engaged! 🧠",
    "Where did it go?! 🕵️‍♂️",
    "Illusion 100! 🌌",
    "Swapped! Fooled ya! 🔄",
    "Quantum teleportation! ⚛️"
  ],
  5: [
    "Boss level! 😈 You're so close!",
    "Energy dropping fast! ⚡",
    "The No button is losing strength! 🥵",
    "Almost out of fuel! ⛽",
    "Final stretch! Keep going! 🏁"
  ]
};

// DOM Level HUD Elements
const dodgeCountText = document.getElementById("dodge-count-text");
const levelBadge = document.getElementById("level-badge");
const levelUpToast = document.getElementById("level-up-toast");
const energyBarContainer = document.getElementById("energy-bar-container");
const energyBarFill = document.getElementById("energy-bar-fill");
const decoyContainer = document.getElementById("decoy-container");
const questionCard = document.querySelector(".card");

/**
 * Updates top HUD counter and badge.
 */
function updateHUD() {
  if (dodgeCountText) dodgeCountText.textContent = `Dodges: ${dodgeCount} 😏`;
  if (levelBadge) levelBadge.textContent = LEVEL_TITLES[currentLevel] || `Level ${currentLevel}`;
}

/**
 * Shows a pop-up banner when advancing to a new level.
 */
function showLevelUpBanner(levelNum) {
  if (!levelUpToast) return;
  const titleText = LEVEL_TITLES[levelNum] || `Level ${levelNum}`;
  levelUpToast.textContent = `✨ ${titleText} ✨`;
  levelUpToast.classList.remove("hidden");
  
  // Confetti pop for level up
  spawnPuffEffect(window.innerWidth / 2 - 20, 100);

  setTimeout(() => {
    levelUpToast.classList.add("hidden");
  }, 1600);
}

/**
 * Retrieves a non-repeating funny message for the current level.
 */
function getRandomLevelMessage(levelNum) {
  const pool = LEVEL_MESSAGES[levelNum] || LEVEL_MESSAGES[1];
  let lastIdx = lastMsgIndexPerLevel[levelNum] ?? -1;
  let newIdx = Math.floor(Math.random() * pool.length);

  // Avoid back-to-back repeats
  if (pool.length > 1 && newIdx === lastIdx) {
    newIdx = (newIdx + 1) % pool.length;
  }
  lastMsgIndexPerLevel[levelNum] = newIdx;
  return pool[newIdx];
}

/**
 * Calculates a safe random position for No button inside viewport:
 * 1. Strict 16px margin from all viewport edges.
 * 2. Never overlaps Yes button or main question text.
 * 3. At least 150px jump distance from previous spot.
 * 4. Falls back to a safe corner if 20 random retries fail.
 */
function getSafeRandomPosition(elem = noBtn) {
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
  const elemRect = elem.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const questionElem = document.querySelector(".main-question");
  const questionRect = questionElem ? questionElem.getBoundingClientRect() : null;

  const bw = elemRect.width || 100;
  const bh = elemRect.height || 45;

  const margin = 16;
  const minX = margin;
  const maxX = Math.max(minX, vw - bw - margin);
  const minY = margin;
  const maxY = Math.max(minY, vh - bh - margin);

  const prevX = lastNoPos ? lastNoPos.x : (vw / 2);
  const prevY = lastNoPos ? lastNoPos.y : (vh / 2);

  const yesPadding = 35;
  const questionPadding = 20;

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

  // Fallback corner if 20 tries fail
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
      return distB - distA;
    });

    newX = corners[0].x;
    newY = corners[0].y;
  }

  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  return { x: newX, y: newY };
}

/**
 * Creates a playful puff/sparkle effect at old spot.
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
 * Ensures No button stays clamped inside viewport upon resize/orientation change.
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

  // Also clamp fake decoys
  fakeDecoys.forEach((fake) => {
    let fx = parseFloat(fake.style.left) || 100;
    let fy = parseFloat(fake.style.top) || 100;
    fake.style.left = `${Math.max(margin, Math.min(fx, maxX))}px`;
    fake.style.top = `${Math.max(margin, Math.min(fy, maxY))}px`;
  });
}

// Window resize & orientation change listeners
window.addEventListener("resize", clampPositionInsideViewport);
window.addEventListener("orientationchange", () => setTimeout(clampPositionInsideViewport, 150));
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", clampPositionInsideViewport);
  window.visualViewport.addEventListener("scroll", clampPositionInsideViewport);
}

/**
 * LEVEL 3: Spawn Fake Decoy No Buttons
 */
function spawnDecoyButtons(count = 2) {
  clearDecoyButtons();
  for (let i = 0; i < count; i++) {
    const fake = document.createElement("button");
    fake.className = "fake-no-btn";
    fake.textContent = "No 💔";

    const pos = getSafeRandomPosition(fake);
    fake.style.left = `${pos.x}px`;
    fake.style.top = `${pos.y}px`;

    // Dodge on hover/touch
    fake.addEventListener("mousemove", (e) => {
      const rect = fake.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 100) {
        const p = getSafeRandomPosition(fake);
        fake.style.left = `${p.x}px`;
        fake.style.top = `${p.y}px`;
      }
    });

    fake.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const p = getSafeRandomPosition(fake);
      fake.style.left = `${p.x}px`;
      fake.style.top = `${p.y}px`;
    });

    // Clicking fake button pops it into heart confetti!
    fake.addEventListener("click", (e) => {
      e.preventDefault();
      spawnPuffEffect(parseFloat(fake.style.left), parseFloat(fake.style.top));
      dodgeMsg.textContent = "That was a decoy 😜";
      fake.style.transform = "scale(0)";
      setTimeout(() => fake.remove(), 200);
    });

    decoyContainer.appendChild(fake);
    fakeDecoys.push(fake);
  }
}

function clearDecoyButtons() {
  fakeDecoys.forEach((f) => f.remove());
  fakeDecoys = [];
}

/**
 * LEVEL 4: Mind Games Tricks
 */
function applyMindGameTrick() {
  const trickChoice = Math.floor(Math.random() * 5) + 1;

  switch (trickChoice) {
    case 1:
      // Swap positions with Yes button briefly
      const yesRect = yesBtn.getBoundingClientRect();
      noBtn.style.left = `${yesRect.left}px`;
      noBtn.style.top = `${yesRect.top}px`;
      dodgeMsg.textContent = "Swapped positions! 🔄";
      break;
    case 2:
      // Invisible trick
      noBtn.style.opacity = "0";
      dodgeMsg.textContent = "Where did it go?! 🕵️‍♂️";
      setTimeout(() => {
        noBtn.style.opacity = "1";
      }, 1000);
      break;
    case 3:
      // Sneaky label
      noBtn.textContent = "Yes 💚";
      dodgeMsg.textContent = "Sneaky! It says Yes now! 😜";
      setTimeout(() => {
        noBtn.textContent = "No 💔";
      }, 1000);
      break;
    case 4:
      // Loading error trick
      dodgeMsg.textContent = "Loading your No... 99%... Error 404 🤖";
      break;
    default:
      // Fast wobble
      noBtn.classList.add("shaking");
      setTimeout(() => noBtn.classList.remove("shaking"), 300);
      break;
  }
}

/**
 * MAIN DODGE HANDLER - Escalating 6-Level Game
 */
function dodgeNoButton() {
  if (dodgeCount >= 35) return;

  // Spawn puff effect at old spot
  const oldRect = noBtn.getBoundingClientRect();
  if (oldRect.width > 0) {
    spawnPuffEffect(oldRect.left, oldRect.top);
  }

  dodgeCount++;
  updateHUD();

  // Determine Level Transitions
  let newLevel = currentLevel;
  if (dodgeCount >= 35) {
    newLevel = 6;
  } else if (dodgeCount >= 29) {
    newLevel = 5;
  } else if (dodgeCount >= 21) {
    newLevel = 4;
  } else if (dodgeCount >= 13) {
    newLevel = 3;
  } else if (dodgeCount >= 6) {
    newLevel = 2;
  } else {
    newLevel = 1;
  }

  // Level Up Event
  if (newLevel !== currentLevel) {
    currentLevel = newLevel;
    showLevelUpBanner(currentLevel);

    // Level-specific setups
    if (currentLevel === 2) {
      proximityThreshold = 160; // Larger distance detection
      noBtn.style.transition = "left 0.15s ease, top 0.15s ease, transform 0.15s ease !important";
    } else if (currentLevel === 3) {
      spawnDecoyButtons(2);
    } else if (currentLevel === 4) {
      clearDecoyButtons();
    } else if (currentLevel === 5) {
      clearDecoyButtons();
      energyBarContainer.classList.remove("hidden");
    }
  }

  // Level 2+: Add screen shake on dodge
  if (currentLevel >= 2) {
    questionCard.classList.add("card-shake");
    setTimeout(() => questionCard.classList.remove("card-shake"), 220);
  }

  // Level 4: Apply mind game trick
  if (currentLevel === 4 && Math.random() < 0.6) {
    applyMindGameTrick();
  }

  // Level 5: Drain Boss Energy Bar
  if (currentLevel === 5 && energyBarFill) {
    const energyPercent = Math.max(0, 100 - (dodgeCount - 28) * 15);
    energyBarFill.style.width = `${energyPercent}%`;
  }

  // Position & Transform Calculations
  noBtn.classList.add("runaway");
  const pos = getSafeRandomPosition();
  lastNoPos = { x: pos.x, y: pos.y };

  const randomRot = Math.floor(Math.random() * 31) - 15;

  // Scale calculations per level
  let noScale = 1.0;
  if (currentLevel === 5) {
    noScale = 0.50; // Mini mini mini boss button
  } else {
    noScale = Math.max(0.60, 1 - dodgeCount * 0.02);
  }

  const yesScale = Math.min(1.85, 1 + dodgeCount * 0.04);

  noBtn.style.left = `${pos.x}px`;
  noBtn.style.top = `${pos.y}px`;
  noBtn.style.transform = `scale(${noScale}) rotate(${randomRot}deg)`;
  yesBtn.style.transform = `scale(${yesScale})`;

  // Update label sequence
  const labels = [
    "No 💔", "Are you sure?", "Really?", "Think again 🥺", "Please?", "Last chance!",
    "Faster! ⚡", "Still trying? 😜", "Decoy mode! 👯", "Mind games! 🧠", "Boss mode! 😈", "Surrender soon! 🏳️"
  ];
  const labelIndex = Math.min(dodgeCount - 1, labels.length - 1);
  noBtn.textContent = labels[labelIndex];

  // Update level funny message
  dodgeMsg.textContent = getRandomLevelMessage(currentLevel);
  dodgeMsg.style.opacity = "1";

  // LEVEL 6: SURRENDER AT DODGE 35
  if (dodgeCount >= 35) {
    clearDecoyButtons();
    noBtn.textContent = "🏳️ Surrender";
    noBtn.classList.add("quitting");
    
    if (energyBarContainer) energyBarContainer.classList.add("hidden");

    setTimeout(() => {
      noBtn.style.display = "none";
      dodgeMsg.style.display = "none";
      quitMsg.classList.remove("hidden");
      
      // Make Yes button pulse & glow with surrender animation!
      yesBtn.classList.add("yes-surrender-glow");
    }, 450);
  }
}

// DESKTOP: Proximity detection (100px on Level 1, 160px on Level 2+)
document.addEventListener("mousemove", (e) => {
  if (dodgeCount >= 35 || questionPage.classList.contains("page-hidden")) return;
  
  const noRect = noBtn.getBoundingClientRect();
  if (noRect.width === 0) return;

  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;
  
  const distance = Math.hypot(e.clientX - noCenterX, e.clientY - noCenterY);

  if (distance < proximityThreshold) {
    dodgeNoButton();
  }
});

// MOBILE & TOUCH: Touchstart & Pointerdown before tap registers
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

// KEYBOARD ACCESSIBILITY: Tabbing or pressing keys on No button triggers dodge
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
