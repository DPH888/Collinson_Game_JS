import { preloadedSounds } from "./asset_loading/asset_loader_sounds.mjs";
import { randomInteger } from "./utils.mjs";

function playRandomSoundEffect(volume = 0.7) {
  const randomIndex = randomInteger(preloadedSounds.randomSoundsArr.length);
  const soundFile = preloadedSounds.randomSoundsArr[randomIndex];
  soundFile.volume = volume;
  soundFile.play();
}

function playRandomSoundEffectFall(volume = 0.7) {
  let soundFile = preloadedSounds.bounceAudio;
  soundFile.volume = volume;
  soundFile.play();
}
function playBackgroundMusic(volume = 0.4) {
  let isMusicPlaying = false;
  var audio = preloadedSounds.bgMusicSound;
  if (audio) {
    audio.loop = true;
    audio.play().then(() => { // Handle play promise
      isMusicPlaying = false; // Reset flag after playback ends (or error)
    }).catch(() => {
      isMusicPlaying = false; // Reset flag in case of errors
    });
    audio.volume = volume;
  }
};

function initSoundEvents() {
  let isMusicPlayingClick = false; // Flag to track playback

  document.body.addEventListener('click', (event) => {

    if (!isMusicPlayingClick) { // Only play if not already playing
      playBackgroundMusic();
      isMusicPlayingClick = true; // Set flag to true after starting playback
    }
  });
}

export {playBackgroundMusic as playMusic, playRandomSoundEffect, initSoundEvents,playRandomSoundEffectFall};