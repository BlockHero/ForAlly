const splash = document.getElementById("splash");

function hideSplashAndPlay() {
  splash.style.display = "none";

  const flipbook = document.getElementById("flipbook");
  flipbook.style.opacity = "1";
  flipbook.style.pointerEvents = "auto";

  tryPlayMusic();
}

// Splash click triggers
splash.addEventListener("click", hideSplashAndPlay);
splash.addEventListener("touchstart", hideSplashAndPlay, { once: true });

// Flip sound
const flipSound = new Audio("sounds/flip.mp3");
flipSound.volume = 0.6;

// Background music
const bgMusic = document.getElementById("bg-music");
function tryPlayMusic() {
  bgMusic.volume = 0.4;
  bgMusic.play().catch(() => {
    document.body.addEventListener("touchstart", playAfterTouch, { once: true });
    document.body.addEventListener("mousedown", playAfterTouch, { once: true });
  });
}
function playAfterTouch() {
  bgMusic.play();
}
tryPlayMusic();

// Variables for swipe detection
const pages = document.querySelectorAll(".page");
let current = 0;
let startX = null;
const swipeThreshold = 50;

// Swipe logic
function start(e) {
  startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function end(e) {
  if (startX === null) return;
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const diff = endX - startX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff < 0 && current < pages.length) {
      pages[current].classList.add("flipped");
      flipSound.currentTime = 0;
      flipSound.play();
      current++;
    } else if (diff > 0 && current > 0) {
      current--;
      pages[current].classList.remove("flipped");
      flipSound.currentTime = 0;
      flipSound.play();
    }
  }

  startX = null;
}

// ✅ Wait for all images before enabling swipe
window.addEventListener("load", () => {
  const allImages = document.querySelectorAll(".page img");
  let loaded = 0;

  allImages.forEach(img => {
    if (img.complete) {
      loaded++;
    } else {
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === allImages.length) enableFlip();
      });
    }
  });

  if (loaded === allImages.length) {
    enableFlip();
  }
});

// ✅ Only add swipe events after images are ready
function enableFlip() {
  document.addEventListener("touchstart", start, false);
  document.addEventListener("touchend", end, false);
  document.addEventListener("mousedown", start, false);
  document.addEventListener("mouseup", end, false);
}
