/**
 * IIIT BHOPAL x SPARK - AMONG US TOURNAMENT INTERACTIVE SCRIPT
 * Full Web Audio Synthesizer, Mini-tasks, Map Intel, Customizer & Ticket Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAudio();
  initBackgroundMusic();
  initStarfield();
  initEmergencySystem();
  initMiniTasks();
  initCampusMap();
  initAvatarCustomizer();
  initRegistration();
  initCountdown();
  initFAQ();
  initMobileNav();
});

/* ==========================================================================
   0. THEME CONTROLLER (LIGHT / DARK THEME)
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const storedTheme = localStorage.getItem('amongus_theme');

  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Dark';
      localStorage.setItem('amongus_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Light';
      localStorage.setItem('amongus_theme', 'dark');
    }
  }

  if (storedTheme === 'light') {
    applyTheme(true);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      playClickSound();
      const isCurrentlyLight = document.body.classList.contains('light-theme');
      applyTheme(!isCurrentlyLight);
    });
  }
}

/* ==========================================================================
   1. SOUND SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL AUDIO DEPENDENCIES)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  const toggleBtn = document.getElementById('sound-toggle');
  const storedSound = localStorage.getItem('amongus_sound_enabled');
  if (storedSound !== null) {
    soundEnabled = storedSound === 'true';
    updateSoundBtnUI(toggleBtn);
  }

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('amongus_sound_enabled', soundEnabled);
    updateSoundBtnUI(toggleBtn);
    if (soundEnabled) {
      ensureAudioContext();
      playClickSound();
    }
  });
}

function updateSoundBtnUI(btn) {
  if (soundEnabled) {
    btn.classList.remove('muted');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>`;
    btn.title = "Sound Enabled";
  } else {
    btn.classList.add('muted');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>`;
    btn.title = "Sound Muted";
  }
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playClickSound() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.09);
}

function playEmergencySiren() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';

  // Rising siren pattern
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.linearRampToValueAtTime(950, now + 0.35);
  osc.frequency.linearRampToValueAtTime(500, now + 0.7);
  osc.frequency.linearRampToValueAtTime(950, now + 1.05);
  osc.frequency.linearRampToValueAtTime(450, now + 1.4);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.linearRampToValueAtTime(0.28, now + 0.7);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

  // Temporarily duck BGM volume during emergency alarm
  if (bgmIsPlaying && bgmGainNode) {
    bgmGainNode.gain.setValueAtTime(0.03, now);
    bgmGainNode.gain.linearRampToValueAtTime(bgmVolume, now + 1.8);
  }

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 1.55);
}

function playTaskSuccessSound() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const startTime = audioCtx.currentTime + (idx * 0.1);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.23);
  });
}

function playVentSound() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.26);
}

function playElectricZapSound() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(700, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.11);
}

/* ==========================================================================
   BACKGROUND MUSIC ENGINE (ASPHALT RACING BEATS & AMONG US SPACE AMBIENCE)
   ========================================================================== */
let bgmGainNode = null;
let bgmIsPlaying = false;
let bgmIntervals = [];
let bgmVolume = 0.35;
let activeMusicOscillators = [];
let currentMusicTrack = 'asphalt'; // 'asphalt' or 'amongus'

function initBackgroundMusic() {
  const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
  const bgmStatusText = document.getElementById('bgm-status-text');
  const bgmTrackSelectBtn = document.getElementById('bgm-track-select-btn');
  const bgmTrackLabel = document.getElementById('bgm-track-label');
  const bgmVolumeSlider = document.getElementById('bgm-volume-slider');
  const dockBgmBtn = document.getElementById('dock-bgm-toggle');
  const dockMusicLabel = document.getElementById('dock-music-label');
  const toast = document.getElementById('music-welcome-toast');
  const toastPlayBtn = document.getElementById('toast-play-btn');
  const toastDismissBtn = document.getElementById('toast-dismiss-btn');

  // Load saved volume & track preference
  const storedVol = localStorage.getItem('amongus_bgm_volume');
  if (storedVol !== null) {
    bgmVolume = parseFloat(storedVol);
    if (bgmVolumeSlider) bgmVolumeSlider.value = bgmVolume;
  }

  const storedTrack = localStorage.getItem('amongus_bgm_track');
  if (storedTrack === 'amongus' || storedTrack === 'asphalt') {
    currentMusicTrack = storedTrack;
  }
  updateTrackBadgeUI();

  function updateTrackBadgeUI() {
    if (bgmTrackLabel) {
      if (currentMusicTrack === 'asphalt') {
        bgmTrackLabel.textContent = '🏎️ Asphalt Beat';
        bgmTrackSelectBtn.title = 'Current: Asphalt High-Octane Beat (Click for Among Us Space Ambience)';
      } else {
        bgmTrackLabel.textContent = '🛸 Skeld Mystery';
        bgmTrackSelectBtn.title = 'Current: Among Us Space Mystery (Click for Asphalt Racing Beat)';
      }
    }
  }

  function updateBgmUI(playing) {
    bgmIsPlaying = playing;
    if (bgmToggleBtn) {
      if (playing) {
        bgmToggleBtn.classList.add('playing');
        if (bgmStatusText) {
          bgmStatusText.textContent = 'MUSIC: ON';
          bgmStatusText.style.color = 'var(--color-cyan)';
        }
      } else {
        bgmToggleBtn.classList.remove('playing');
        if (bgmStatusText) {
          bgmStatusText.textContent = 'MUSIC: OFF';
          bgmStatusText.style.color = 'var(--text-muted)';
        }
      }
    }
    if (dockBgmBtn) {
      if (playing) {
        dockBgmBtn.classList.add('playing');
        if (dockMusicLabel) dockMusicLabel.textContent = 'Pause Music';
      } else {
        dockBgmBtn.classList.remove('playing');
        if (dockMusicLabel) dockMusicLabel.textContent = 'Play Music';
      }
    }
    if (toast && playing) {
      toast.classList.add('hidden');
    }
  }

  function startBGM() {
    ensureAudioContext();
    if (!audioCtx) return;

    if (!bgmGainNode) {
      bgmGainNode = audioCtx.createGain();
      bgmGainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      bgmGainNode.connect(audioCtx.destination);
    }

    // Smooth fade in
    bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    bgmGainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, bgmVolume), audioCtx.currentTime + 0.8);

    if (currentMusicTrack === 'asphalt') {
      startAsphaltMusicLoops();
    } else {
      startSpaceMusicLoops();
    }

    updateBgmUI(true);
    localStorage.setItem('amongus_bgm_playing', 'true');
  }

  function stopBGM() {
    if (bgmGainNode && audioCtx) {
      bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      bgmGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
    }
    stopCurrentMusicLoops();
    updateBgmUI(false);
    localStorage.setItem('amongus_bgm_playing', 'false');
  }

  function toggleBGM() {
    playClickSound();
    if (bgmIsPlaying) {
      stopBGM();
    } else {
      startBGM();
    }
  }

  if (bgmToggleBtn) bgmToggleBtn.addEventListener('click', toggleBGM);
  if (dockBgmBtn) dockBgmBtn.addEventListener('click', toggleBGM);

  // Switch Track Button
  if (bgmTrackSelectBtn) {
    bgmTrackSelectBtn.addEventListener('click', () => {
      playClickSound();
      currentMusicTrack = (currentMusicTrack === 'asphalt') ? 'amongus' : 'asphalt';
      localStorage.setItem('amongus_bgm_track', currentMusicTrack);
      updateTrackBadgeUI();

      if (bgmIsPlaying) {
        // Smoothly restart with new track style
        stopCurrentMusicLoops();
        if (currentMusicTrack === 'asphalt') {
          startAsphaltMusicLoops();
        } else {
          startSpaceMusicLoops();
        }
      }
    });
  }

  if (toastPlayBtn) {
    toastPlayBtn.addEventListener('click', () => {
      startBGM();
    });
  }

  if (toastDismissBtn && toast) {
    toastDismissBtn.addEventListener('click', () => {
      toast.classList.add('hidden');
    });
  }

  if (bgmVolumeSlider) {
    bgmVolumeSlider.addEventListener('input', (e) => {
      bgmVolume = parseFloat(e.target.value);
      localStorage.setItem('amongus_bgm_volume', bgmVolume);
      if (bgmGainNode && audioCtx && bgmIsPlaying) {
        bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        bgmGainNode.gain.setValueAtTime(Math.max(0.0001, bgmVolume), audioCtx.currentTime);
      }
    });
  }

  // Auto-start on first user interaction if previously enabled
  const initialInteraction = () => {
    ensureAudioContext();
    const shouldAutoPlay = localStorage.getItem('amongus_bgm_playing');
    if (shouldAutoPlay === 'true' && !bgmIsPlaying) {
      startBGM();
    }
    window.removeEventListener('click', initialInteraction);
  };
  window.addEventListener('click', initialInteraction, { once: true });
}

/* ==========================================================================
   TRACK 1: ASPHALT NITRO (HIGH-OCTANE ELECTRONIC RACING SYNTHWAVE)
   128 BPM, 4/4 Punchy Kicks, Snappy Noise Claps, Rolling Bassline & Lead
   ========================================================================== */
function startAsphaltMusicLoops() {
  if (!audioCtx || !bgmGainNode) return;
  stopCurrentMusicLoops();

  const bpm = 128;
  const beatIntervalMs = (60 / bpm) * 1000; // ~468.75ms
  const sixteenthMs = beatIntervalMs / 4;    // ~117.18ms
  let step = 0;

  // 1. Driving Synth Bassline Notes (E2, E2, G2, A2, B2, D3, E2, D2)
  const bassNotes = [82.41, 82.41, 98.00, 82.41, 110.00, 82.41, 123.47, 146.83];
  
  // 2. High-Energy Synth Lead Arpeggio (E4, G4, A4, B4, E5, D5, B4, G4)
  const leadNotes = [329.63, 392.00, 440.00, 493.88, 659.25, 587.33, 493.88, 392.00];

  // Master Clock for Asphalt Nitro Loop (16th notes @ 128 BPM)
  const clockInterval = setInterval(() => {
    if (!bgmIsPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const beatIndex = Math.floor(step / 4) % 4; // 0, 1, 2, 3
    const stepInBeat = step % 4; // 0, 1, 2, 3

    // A. PUNCHY SUB KICK (Every beat: steps 0, 4, 8, 12)
    if (stepInBeat === 0) {
      const kickOsc = audioCtx.createOscillator();
      const kickGain = audioCtx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(145, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      kickGain.gain.setValueAtTime(0.32, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(bgmGainNode);
      kickOsc.start(now);
      kickOsc.stop(now + 0.2);
    }

    // B. SNAPPY SNARE / CLAP (Beats 2 & 4: steps 4 and 12)
    if (step === 4 || step === 12) {
      const snareOsc = audioCtx.createOscillator();
      const snareGain = audioCtx.createGain();
      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(210, now);
      snareOsc.frequency.exponentialRampToValueAtTime(75, now + 0.1);

      snareGain.gain.setValueAtTime(0.2, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      snareOsc.connect(snareGain);
      snareGain.connect(bgmGainNode);
      snareOsc.start(now);
      snareOsc.stop(now + 0.16);
    }

    // C. CRISP OFFBEAT HI-HATS (8th note offbeats: steps 2, 6, 10, 14)
    if (stepInBeat === 2) {
      const hatOsc = audioCtx.createOscillator();
      const hatFilter = audioCtx.createBiquadFilter();
      const hatGain = audioCtx.createGain();

      hatOsc.type = 'sawtooth';
      hatOsc.frequency.setValueAtTime(8000, now);
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(7000, now);

      hatGain.gain.setValueAtTime(0.07, now);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      hatOsc.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(bgmGainNode);
      hatOsc.start(now);
      hatOsc.stop(now + 0.06);
    }

    // D. DRIVING 16TH-NOTE ROLLING SYNTH BASSLINE
    const bassOsc = audioCtx.createOscillator();
    const bassFilter = audioCtx.createBiquadFilter();
    const bassGain = audioCtx.createGain();

    const noteFreq = bassNotes[step % bassNotes.length];
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(noteFreq, now);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(650, now);
    bassFilter.Q.setValueAtTime(4, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(bgmGainNode);
    bassOsc.start(now);
    bassOsc.stop(now + 0.12);

    // E. SYNTH LEAD HOOK (Steps 0, 3, 6, 8, 11, 14)
    if (step === 0 || step === 3 || step === 6 || step === 8 || step === 11 || step === 14) {
      const leadOsc = audioCtx.createOscillator();
      const leadFilter = audioCtx.createBiquadFilter();
      const leadGain = audioCtx.createGain();

      const lFreq = leadNotes[(step + Math.floor(step / 8)) % leadNotes.length];
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(lFreq, now);

      leadFilter.type = 'bandpass';
      leadFilter.frequency.setValueAtTime(1400, now);
      leadFilter.Q.setValueAtTime(2, now);

      leadGain.gain.setValueAtTime(0.001, now);
      leadGain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      leadOsc.connect(leadFilter);
      leadFilter.connect(leadGain);
      leadGain.connect(bgmGainNode);
      leadOsc.start(now);
      leadOsc.stop(now + 0.19);
    }

    step = (step + 1) % 16;
  }, sixteenthMs);

  bgmIntervals.push(clockInterval);
}

/* ==========================================================================
   TRACK 2: SKELD MYSTERY (AMONG US SCI-FI SPACE AMBIENCE & SUSPENSE)
   ========================================================================== */
function startSpaceMusicLoops() {
  if (!audioCtx || !bgmGainNode) return;
  stopCurrentMusicLoops();

  // 1. Deep Space Sub-Drone (E1 41.2Hz and B1 61.7Hz with warm lowpass filter)
  const droneOsc1 = audioCtx.createOscillator();
  const droneOsc2 = audioCtx.createOscillator();
  const droneFilter = audioCtx.createBiquadFilter();
  const droneGain = audioCtx.createGain();

  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(41.2, audioCtx.currentTime);

  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(61.7, audioCtx.currentTime);

  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(130, audioCtx.currentTime);

  droneGain.gain.setValueAtTime(0.24, audioCtx.currentTime);

  droneOsc1.connect(droneFilter);
  droneOsc2.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(bgmGainNode);

  droneOsc1.start();
  droneOsc2.start();
  activeMusicOscillators.push(droneOsc1, droneOsc2);

  // 2. Suspense Motif (Eerie Among Us Notes: E3, G3, B3, F#3, D4, A3)
  const notes = [164.81, 196.00, 246.94, 185.00, 293.66, 220.00, 164.81, 146.83];
  let noteIndex = 0;

  const arpegInterval = setInterval(() => {
    if (!bgmIsPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const noteOsc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    const noteFilter = audioCtx.createBiquadFilter();

    noteOsc.type = 'triangle';
    noteOsc.frequency.setValueAtTime(notes[noteIndex % notes.length], now);
    noteIndex++;

    noteFilter.type = 'bandpass';
    noteFilter.frequency.setValueAtTime(550, now);
    noteFilter.Q.setValueAtTime(2.5, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    noteOsc.connect(noteFilter);
    noteFilter.connect(noteGain);
    noteGain.connect(bgmGainNode);

    noteOsc.start(now);
    noteOsc.stop(now + 1.35);
  }, 1600);
  bgmIntervals.push(arpegInterval);

  // 3. Heartbeat / Reactor Sub-Pulse (Every 2.4 seconds)
  const pulseInterval = setInterval(() => {
    if (!bgmIsPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const kickOsc = audioCtx.createOscillator();
    const kickGain = audioCtx.createGain();

    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(75, now);
    kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.22);

    kickGain.gain.setValueAtTime(0.16, now);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    kickOsc.connect(kickGain);
    kickGain.connect(bgmGainNode);

    kickOsc.start(now);
    kickOsc.stop(now + 0.25);
  }, 2400);
  bgmIntervals.push(pulseInterval);

  // 4. Cosmic Radar Echoes
  const cosmicInterval = setInterval(() => {
    if (!bgmIsPlaying || !audioCtx || Math.random() < 0.25) return;
    const now = audioCtx.currentTime;
    const pingOsc = audioCtx.createOscillator();
    const pingGain = audioCtx.createGain();

    const frequencies = [880, 1046.5, 1174.66, 1318.51, 1567.98];
    const f = frequencies[Math.floor(Math.random() * frequencies.length)];

    pingOsc.type = 'sine';
    pingOsc.frequency.setValueAtTime(f, now);

    pingGain.gain.setValueAtTime(0.0001, now);
    pingGain.gain.exponentialRampToValueAtTime(0.035, now + 0.05);
    pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    pingOsc.connect(pingGain);
    pingGain.connect(bgmGainNode);

    pingOsc.start(now);
    pingOsc.stop(now + 1.65);
  }, 3800);
  bgmIntervals.push(cosmicInterval);
}

function stopCurrentMusicLoops() {
  activeMusicOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  activeMusicOscillators = [];

  bgmIntervals.forEach(interval => clearInterval(interval));
  bgmIntervals = [];
}

/* ==========================================================================
   2. SPACE & STARFIELD CANVAS
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  const stars = [];
  const starCount = 120;

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        color: ['#ffffff', '#FFE5D1', '#67C9F5', '#FFD166'][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Floating ejected crewmate easter egg
  let floatingAstronaut = {
    x: -100,
    y: height * 0.4,
    rotation: 0,
    active: false,
    color: '#8DD982',
    name: 'Green was not The Impostor'
  };

  setInterval(() => {
    if (!floatingAstronaut.active && Math.random() < 0.4) {
      floatingAstronaut.active = true;
      floatingAstronaut.x = -80;
      floatingAstronaut.y = Math.random() * (height - 200) + 100;
      floatingAstronaut.rotation = 0;
      const crewColors = ['#F45858', '#8DD982', '#67C9F5', '#FFD166', '#B8A5F5'];
      floatingAstronaut.color = crewColors[Math.floor(Math.random() * crewColors.length)];
    }
  }, 12000);

  initStars();

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Stars
    for (let star of stars) {
      star.alpha += star.speed;
      const opacity = (Math.sin(star.alpha) + 1) / 2 * 0.8 + 0.2;
      ctx.fillStyle = star.color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // Floating astronaut in space
    if (floatingAstronaut.active) {
      floatingAstronaut.x += 1.8;
      floatingAstronaut.rotation += 0.015;

      ctx.save();
      ctx.translate(floatingAstronaut.x, floatingAstronaut.y);
      ctx.rotate(floatingAstronaut.rotation);

      // Draw Mini Floating Crewmate
      ctx.fillStyle = floatingAstronaut.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;

      // Backpack
      ctx.beginPath();
      ctx.roundRect(-24, -8, 10, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.roundRect(-14, -18, 28, 38, 14);
      ctx.fill();
      ctx.stroke();

      // Visor
      ctx.fillStyle = '#67C9F5';
      ctx.beginPath();
      ctx.roundRect(0, -12, 18, 12, 6);
      ctx.fill();
      ctx.stroke();

      // Visor glare
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(8, -8, 4, 2, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Subtle label
      ctx.font = '10px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(floatingAstronaut.name, floatingAstronaut.x - 50, floatingAstronaut.y + 40);

      if (floatingAstronaut.x > width + 100) {
        floatingAstronaut.active = false;
      }
    }

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   3. EMERGENCY SYSTEM & MODAL
   ========================================================================== */
function initEmergencySystem() {
  const triggerBtns = document.querySelectorAll('.js-emergency-trigger');
  const overlay = document.getElementById('emergency-overlay');
  const modal = document.getElementById('emergency-modal');
  const closeBtn = document.getElementById('close-emergency-modal');
  const suspectItems = document.querySelectorAll('.voting-crew-item');
  const voteResultText = document.getElementById('voting-result-text');

  function triggerEmergency() {
    playEmergencySiren();
    overlay.classList.add('active');

    setTimeout(() => {
      overlay.classList.remove('active');
      modal.classList.add('active');
    }, 700);
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerEmergency();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      playClickSound();
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Interactive Voting Screen
  const quotes = [
    "Red says: 'I was in CC3 doing code compiling tasks! Black is sus!'",
    "Blue claims: 'Saw Orange faking Admin swipe! Vote him out!'",
    "Cyan insists: 'Wait don't vote, I have visual MedBay scan!'",
    "Yellow panics: 'I was in the Hostel cafeteria grabbing chai!'",
    "Pink whispers: 'Why is Purple following me everywhere through the hallway?'",
    "Black shouts: 'SELF REPORT! He killed right in front of Electrical!'"
  ];

  suspectItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      playClickSound();
      suspectItems.forEach(i => i.classList.remove('voted'));
      item.classList.add('voted');
      const name = item.dataset.name || "Crewmate";
      const quote = quotes[index % quotes.length];
      voteResultText.innerHTML = `<strong>Voted for ${name}!</strong><br><span style="color: #FFE5D1; font-style: italic;">${quote}</span>`;
    });
  });
}

/* ==========================================================================
   4. PLAYABLE MINI-TASKS & GLOBAL TASK PROGRESS
   ========================================================================== */
let globalTaskScore = 35; // base percentage

function updateGlobalTaskBar(added) {
  globalTaskScore = Math.min(100, globalTaskScore + added);
  const bar = document.getElementById('global-task-fill');
  const label = document.getElementById('global-task-percentage');
  if (bar) bar.style.width = `${globalTaskScore}%`;
  if (label) label.textContent = `${globalTaskScore}%`;

  if (globalTaskScore >= 100) {
    const unlockedBanner = document.getElementById('task-unlocked-banner');
    if (unlockedBanner) {
      unlockedBanner.style.display = 'block';
    }
  }
}

function initMiniTasks() {
  // Task 1: Card Swipe
  initCardSwipeTask();

  // Task 2: Fix Wiring
  initWiringTask();

  // Task 3: Reactor Calibrator
  initCalibratorTask();
}

// 1. Card Swipe Task
function initCardSwipeTask() {
  const card = document.getElementById('swipe-card');
  const reader = document.getElementById('swipe-reader');
  const led = document.getElementById('reader-led');
  const statusMsg = document.getElementById('swipe-msg');
  const cardTaskCard = document.getElementById('task-card-1');

  if (!card || !reader) return;

  let isDragging = false;
  let startX = 0;
  let startTime = 0;
  let completed = false;

  function onStart(e) {
    if (completed) return;
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    startTime = Date.now();
    statusMsg.textContent = "Swiping card...";
    statusMsg.style.color = "#FFD166";
    playClickSound();
  }

  function onMove(e) {
    if (!isDragging || completed) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const delta = Math.max(0, Math.min(180, currentX - startX));
    card.style.transform = `translateX(${delta}px)`;
  }

  function onEnd(e) {
    if (!isDragging || completed) return;
    isDragging = false;
    const elapsed = Date.now() - startTime;
    const currentX = e.type.includes('touch') ? (e.changedTouches[0] ? e.changedTouches[0].clientX : startX) : e.clientX;
    const delta = currentX - startX;

    card.style.transform = 'translateX(0px)';

    if (delta < 100) {
      statusMsg.textContent = "SWIPE FAILED: Please swipe all the way through.";
      statusMsg.style.color = "#F45858";
      led.className = "reader-led red";
    } else if (elapsed < 200) {
      statusMsg.textContent = "TOO FAST! Please try again slower.";
      statusMsg.style.color = "#F45858";
      led.className = "reader-led red";
    } else if (elapsed > 900) {
      statusMsg.textContent = "TOO SLOW! Please swipe at steady speed.";
      statusMsg.style.color = "#F45858";
      led.className = "reader-led red";
    } else {
      // Success!
      completed = true;
      statusMsg.textContent = "ACCEPTED. THANK YOU!";
      statusMsg.style.color = "#8DD982";
      led.className = "reader-led green";
      cardTaskCard.classList.add('completed');
      const badge = cardTaskCard.querySelector('.task-status-pill');
      if (badge) badge.textContent = "COMPLETED";
      playTaskSuccessSound();
      updateGlobalTaskBar(22);
    }
  }

  card.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  card.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);
}

// 2. Fix Wiring Task
function initWiringTask() {
  const leftNodes = document.querySelectorAll('.wire-node-left');
  const rightNodes = document.querySelectorAll('.wire-node-right');
  const canvas = document.getElementById('wires-canvas');
  const statusMsg = document.getElementById('wires-msg');
  const wiringCard = document.getElementById('task-card-2');

  if (!canvas || leftNodes.length === 0) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawConnectedWires();
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = {
    red: '#F45858',
    blue: '#67C9F5',
    yellow: '#FFD166',
    pink: '#B8A5F5'
  };

  let connections = {}; // leftColor -> rightColor
  let activeLeftColor = null;
  let activeLeftPos = null;
  let currentMousePos = null;
  let completed = false;

  function getNodeCenter(node) {
    const rect = node.getBoundingClientRect();
    const parentRect = canvas.parentElement.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2
    };
  }

  function drawConnectedWires() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw confirmed connections
    for (let lColor in connections) {
      const leftNode = document.querySelector(`.wire-node-left[data-color="${lColor}"]`);
      const rightNode = document.querySelector(`.wire-node-right[data-color="${connections[lColor]}"]`);
      if (leftNode && rightNode) {
        const start = getNodeCenter(leftNode);
        const end = getNodeCenter(rightNode);

        ctx.beginPath();
        ctx.strokeStyle = colors[lColor] || '#fff';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(start.x + 60, start.y, end.x - 60, end.y, end.x, end.y);
        ctx.stroke();
      }
    }

    // Draw active dragging wire
    if (activeLeftPos && currentMousePos) {
      ctx.beginPath();
      ctx.strokeStyle = colors[activeLeftColor] || '#fff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.moveTo(activeLeftPos.x, activeLeftPos.y);
      ctx.lineTo(currentMousePos.x, currentMousePos.y);
      ctx.stroke();
    }
  }

  leftNodes.forEach(node => {
    node.addEventListener('click', () => {
      if (completed) return;
      playClickSound();
      activeLeftColor = node.dataset.color;
      activeLeftPos = getNodeCenter(node);
      statusMsg.textContent = `Connecting ${activeLeftColor.toUpperCase()} wire... Click matching terminal.`;
      statusMsg.style.color = colors[activeLeftColor];
    });
  });

  rightNodes.forEach(node => {
    node.addEventListener('click', () => {
      if (!activeLeftColor || completed) return;
      const targetColor = node.dataset.color;

      if (targetColor === activeLeftColor) {
        // Correct wire!
        connections[activeLeftColor] = targetColor;
        playElectricZapSound();
        drawConnectedWires();
        activeLeftColor = null;
        activeLeftPos = null;

        if (Object.keys(connections).length === 4) {
          completed = true;
          statusMsg.textContent = "WIRING COMPLETE! CIRCUITS RESTORED.";
          statusMsg.style.color = "#8DD982";
          wiringCard.classList.add('completed');
          const badge = wiringCard.querySelector('.task-status-pill');
          if (badge) badge.textContent = "COMPLETED";
          playTaskSuccessSound();
          updateGlobalTaskBar(22);
        } else {
          statusMsg.textContent = "Wire connected! Match remaining colors.";
          statusMsg.style.color = "#8DD982";
        }
      } else {
        // Mismatched wire
        statusMsg.textContent = "COLOR MISMATCH! Try the matching terminal.";
        statusMsg.style.color = "#F45858";
        playClickSound();
      }
    });
  });

  canvas.parentElement.addEventListener('mousemove', (e) => {
    if (!activeLeftPos || completed) return;
    const parentRect = canvas.parentElement.getBoundingClientRect();
    currentMousePos = {
      x: e.clientX - parentRect.left,
      y: e.clientY - parentRect.top
    };
    drawConnectedWires();
  });
}

// 3. Reactor Calibrator Task
function initCalibratorTask() {
  const dialHand = document.getElementById('calibrator-hand');
  const btn = document.getElementById('calibrate-btn');
  const statusMsg = document.getElementById('calibrate-msg');
  const dots = document.querySelectorAll('.stage-dot');
  const calibratorCard = document.getElementById('task-card-3');

  if (!dialHand || !btn) return;

  let stage = 0;
  let angle = 0;
  let speed = 2.4;
  let animationFrame;
  let completed = false;

  function rotateHand() {
    if (!completed) {
      angle = (angle + speed) % 360;
      dialHand.style.transform = `rotate(${angle}deg)`;
      animationFrame = requestAnimationFrame(rotateHand);
    }
  }
  rotateHand();

  btn.addEventListener('click', () => {
    if (completed) return;
    playClickSound();

    // The yellow sensor is at top (around 345deg to 15deg)
    const normalizedAngle = angle;
    const isTargetHit = normalizedAngle >= 340 || normalizedAngle <= 20;

    if (isTargetHit) {
      // Hit stage!
      playElectricZapSound();
      if (dots[stage]) dots[stage].classList.add('active');
      stage++;

      if (stage >= 3) {
        completed = true;
        cancelAnimationFrame(animationFrame);
        dialHand.style.transform = 'rotate(0deg)';
        statusMsg.textContent = "REACTOR OUTPUT STABILIZED!";
        statusMsg.style.color = "#8DD982";
        btn.disabled = true;
        btn.textContent = "CALIBRATED";
        calibratorCard.classList.add('completed');
        const badge = calibratorCard.querySelector('.task-status-pill');
        if (badge) badge.textContent = "COMPLETED";
        playTaskSuccessSound();
        updateGlobalTaskBar(22);
      } else {
        speed += 1.2; // faster each stage
        statusMsg.textContent = `Stage ${stage}/3 calibrated! Hit it again!`;
        statusMsg.style.color = "#FFD166";
      }
    } else {
      // Missed! Reset to stage 0
      stage = 0;
      speed = 2.4;
      dots.forEach(d => d.classList.remove('active'));
      statusMsg.textContent = "MISSED! Calibration reset to Stage 1.";
      statusMsg.style.color = "#F45858";
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE CAMPUS SKELD MAP
   ========================================================================== */
function initCampusMap() {
  const roomNodes = document.querySelectorAll('.room-node');
  const ventNodes = document.querySelectorAll('.vent-node');
  const intelTitle = document.getElementById('intel-room-name');
  const intelBadge = document.getElementById('intel-badge-text');
  const intelDesc = document.getElementById('intel-room-desc');
  const intelList = document.getElementById('intel-room-features');

  const campusData = {
    cafeteria: {
      badge: "Main Hub • IIIT Bhopal Canteen",
      title: "Cafeteria (The Central Commons)",
      desc: "The central gathering hall where emergency meetings are called. Features live snack counters, spectator projectors, and strategy tables.",
      features: [
        "Emergency Red Button console located on the central round table.",
        "Beverage & Energy bar sponsored by SPARK Tech Club.",
        "Direct vent routes connect secretly into Electrical & Admin."
      ]
    },
    admin: {
      badge: "Registration Desk • SAC Academic Wing",
      title: "Admin Block (Verification Deck)",
      desc: "Every crewmate must swipe their ID badge here before tournament lobbies commence. Map table shows real-time player locations across campus.",
      features: [
        "Card swipe mini-station for physical tournament check-ins.",
        "Live tournament bracket displays and referee assistance booth.",
        "Downloadable badge printing kiosk."
      ]
    },
    electrical: {
      badge: "CC3 Coding Lab • High Voltage Deck",
      title: "Electrical (CC-3 LAN Battle Station)",
      desc: "50 high-speed gaming rigs set up for high-stakes LAN rounds. Warning: Lighting sabotages frequently occur here!",
      features: [
        "Dedicated gigabit private LAN server for 0ms ping matches.",
        "Proximity voice audio mixing consoles for stage streams.",
        "Impostors' favorite spot — watch your back when rewiring circuits."
      ]
    },
    medbay: {
      badge: "Hostel Infirmary • Visual Tasks",
      title: "MedBay (Identity & Visual Scan)",
      desc: "Prove your innocence with the certified green holographic body scan! Only crewmates can complete this visual confirmation.",
      features: [
        "Holographic scanner booth with photo-op backdrop for players.",
        "Emergency medical & relaxation beanbag zone.",
        "High security zone with zero tolerance for impostor antics."
      ]
    },
    reactor: {
      badge: "Auditorium • Grand Finale Stage",
      title: "Reactor (The Championship Stage)",
      desc: "The heart of the ship where the top 10 final survivors battle live on the main auditorium stage with full surround sound and caster commentary.",
      features: [
        "Grand finalist isolation booths with pro headsets.",
        "Caster desk featuring IIIT Bhopal esports commentary.",
        "Trophy presentation and ₹20,000 prize ceremony."
      ]
    }
  };

  roomNodes.forEach(node => {
    node.addEventListener('click', () => {
      const roomKey = node.dataset.room;
      if (!campusData[roomKey]) return;

      playClickSound();
      roomNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const data = campusData[roomKey];
      intelBadge.textContent = data.badge;
      intelTitle.textContent = data.title;
      intelDesc.textContent = data.desc;

      intelList.innerHTML = data.features
        .map(f => `<li class="intel-point-item"><span class="intel-point-icon">✦</span><span>${f}</span></li>`)
        .join('');
    });
  });

  // Vent Clicking Easter Egg
  ventNodes.forEach(vent => {
    vent.addEventListener('click', (e) => {
      e.stopPropagation();
      playVentSound();
      intelBadge.textContent = "VENT DETECTED • SUSPICIOUS ACTIVITY";
      intelTitle.textContent = "Secret Campus Vent Route";
      intelDesc.textContent = "A metallic creak echoes... You just heard someone vent between Hostel 2 and Electrical! Keep an eye on whoever comes out of that hallway.";
      intelList.innerHTML = `
        <li class="intel-point-item"><span class="intel-point-icon">⚠️</span><span>Direct transit route used by Impostors for quick escapes.</span></li>
        <li class="intel-point-item"><span class="intel-point-icon">⚠️</span><span>If you witness someone venting, run to Cafeteria and smash the Emergency Button!</span></li>
      `;
    });
  });
}

/* ==========================================================================
   6. CREWMATE AVATAR CUSTOMIZER & ID PASS GENERATOR
   ========================================================================== */
function initAvatarCustomizer() {
  const colorBtns = document.querySelectorAll('.color-swatch-btn');
  const hatBtns = document.querySelectorAll('.hat-option-btn');
  const nameInput = document.getElementById('custom-cadet-name');
  const idInput = document.getElementById('custom-scholar-id');
  const tagPreview = document.getElementById('preview-tag-name');
  const subPreview = document.getElementById('preview-tag-sub');
  const downloadBtn = document.getElementById('download-crew-card-btn');

  // SVG Elements
  const crewBody = document.getElementById('svg-crew-body');
  const crewBackpack = document.getElementById('svg-crew-backpack');
  const crewShadow = document.getElementById('svg-crew-shadow');
  const hatGroup = document.getElementById('svg-hat-layer');

  let currentColor = '#F45858';
  let currentColorDark = '#C23333';
  let currentHat = 'none';

  const colorPalettes = {
    red: { light: '#F45858', dark: '#B32020' },
    blue: { light: '#2B6FF5', dark: '#153DA0' },
    green: { light: '#1CB04B', dark: '#0F692A' },
    pink: { light: '#ED54BA', dark: '#A4287C' },
    orange: { light: '#F07D18', dark: '#A84B05' },
    yellow: { light: '#FFD166', dark: '#C29828' },
    black: { light: '#3F474E', dark: '#22272B' },
    white: { light: '#D6E0F0', dark: '#8394A8' },
    purple: { light: '#846CC7', dark: '#4E3B87' },
    cyan: { light: '#67C9F5', dark: '#2E84AB' },
    lime: { light: '#8DD982', dark: '#529648' }
  };

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const c = btn.dataset.colorName;
      if (colorPalettes[c]) {
        currentColor = colorPalettes[c].light;
        currentColorDark = colorPalettes[c].dark;
        if (crewBody) crewBody.setAttribute('fill', currentColor);
        if (crewBackpack) crewBackpack.setAttribute('fill', currentColor);
        if (crewShadow) crewShadow.setAttribute('fill', currentColorDark);
      }
    });
  });

  const hatGraphics = {
    none: '',
    dum: `
      <!-- Sticky Note DUM -->
      <polygon points="85,32 135,30 132,66 82,64" fill="#FFEB3B" stroke="#000" stroke-width="2.5" />
      <text x="92" y="52" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" fill="#000">DUM</text>
    `,
    mini: `
      <!-- Mini Crewmate on Head -->
      <rect x="94" y="24" width="22" height="28" rx="8" fill="#67C9F5" stroke="#000" stroke-width="2.5" />
      <rect x="108" y="28" width="12" height="9" rx="4" fill="#E0F7FA" stroke="#000" stroke-width="1.8" />
    `,
    horns: `
      <!-- Viking Horns -->
      <path d="M78 45 Q 65 20 86 16 Q 84 32 88 42 Z" fill="#E0E0E0" stroke="#000" stroke-width="2" />
      <path d="M142 45 Q 155 20 134 16 Q 136 32 132 42 Z" fill="#E0E0E0" stroke="#000" stroke-width="2" />
      <rect x="84" y="38" width="52" height="8" rx="4" fill="#8D6E63" stroke="#000" stroke-width="2" />
    `,
    party: `
      <!-- Party Hat -->
      <polygon points="90,44 110,6 130,44" fill="#FF4081" stroke="#000" stroke-width="2.5" />
      <circle cx="110" cy="5" r="5" fill="#FFEB3B" stroke="#000" stroke-width="1.5" />
      <line x1="96" y1="32" x2="124" y2="32" stroke="#FFEB3B" stroke-width="3" />
    `,
    sprout: `
      <!-- Green Sprout -->
      <path d="M 110 40 Q 110 20 102 18 Q 98 28 108 34" fill="#8DD982" stroke="#000" stroke-width="2" />
      <path d="M 110 40 Q 112 16 122 18 Q 120 28 112 34" fill="#8DD982" stroke="#000" stroke-width="2" />
      <line x1="110" y1="40" x2="110" y2="44" stroke="#000" stroke-width="2.5" />
    `,
    halo: `
      <!-- Angel Halo -->
      <ellipse cx="110" cy="20" rx="30" ry="8" fill="none" stroke="#FFD166" stroke-width="4" />
      <line x1="110" y1="28" x2="110" y2="38" stroke="rgba(255,209,102,0.6)" stroke-width="2" />
    `,
    fedora: `
      <!-- Detective Fedora -->
      <ellipse cx="110" cy="40" rx="34" ry="7" fill="#3E2723" stroke="#000" stroke-width="2.5" />
      <rect x="92" y="22" width="36" height="20" rx="6" fill="#4E342E" stroke="#000" stroke-width="2.5" />
      <rect x="92" y="36" width="36" height="5" fill="#D32F2F" />
    `
  };

  hatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      hatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentHat = btn.dataset.hatName;
      if (hatGroup) {
        hatGroup.innerHTML = hatGraphics[currentHat] || '';
      }
    });
  });

  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim() || 'Cadet_Suspect';
    tagPreview.textContent = val.toUpperCase();
  });

  idInput.addEventListener('input', () => {
    const val = idInput.value.trim() || 'IIITB-2026-000';
    subPreview.textContent = `ID: ${val.toUpperCase()}`;
  });

  // Download Crewmate ID Badge (Canvas Render)
  downloadBtn.addEventListener('click', () => {
    playTaskSuccessSound();
    generateIDCardCanvas({
      name: nameInput.value.trim() || 'Cadet_Suspect',
      scholarId: idInput.value.trim() || 'IIITB-2026-999',
      color: currentColor,
      hat: currentHat
    });
  });
}

function generateIDCardCanvas(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 650;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');

  // Background Badge
  const grad = ctx.createLinearGradient(0, 0, 650, 380);
  grad.addColorStop(0, '#161938');
  grad.addColorStop(1, '#0C0E1E');
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, 650, 380, 24);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#67C9F5';
  ctx.lineWidth = 5;
  ctx.roundRect(0, 0, 650, 380, 24);
  ctx.stroke();

  // Header Banner
  ctx.fillStyle = '#F45858';
  ctx.fillRect(5, 5, 640, 56);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.fillText("IIIT BHOPAL • OFFICIAL CREWMATE ACCESS PASS", 24, 40);

  // Institution Sub-header
  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillStyle = '#FFE5D1';
  ctx.fillText("SPARK TECHNICAL SOCIETY • MISSION 01 CERTIFIED", 24, 86);

  // Avatar Box Frame
  ctx.fillStyle = '#090A14';
  ctx.strokeStyle = '#2D3460';
  ctx.lineWidth = 3;
  ctx.roundRect(30, 110, 170, 210, 16);
  ctx.fill();
  ctx.stroke();

  // Simple Crewmate Draw on Canvas
  const cx = 115, cy = 220;
  // Backpack
  ctx.fillStyle = data.color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.roundRect(cx - 50, cy - 20, 20, 55, 10);
  ctx.fill();
  ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.roundRect(cx - 30, cy - 50, 65, 95, 30);
  ctx.fill();
  ctx.stroke();
  // Visor
  ctx.fillStyle = '#67C9F5';
  ctx.roundRect(cx + 2, cy - 35, 42, 28, 12);
  ctx.fill();
  ctx.stroke();

  // Badge Details
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.fillText(data.name.toUpperCase(), 230, 150);

  ctx.font = '14px "Inter", sans-serif';
  ctx.fillStyle = '#A3ADC2';
  ctx.fillText("SECURITY CLEARANCE:", 230, 185);
  ctx.fillStyle = '#8DD982';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText("LEVEL 4 • AUTHORIZED TO REPAIR CIRCUITS", 230, 208);

  ctx.fillStyle = '#A3ADC2';
  ctx.font = '14px "Inter", sans-serif';
  ctx.fillText("SCHOLAR / REGISTRATION NO:", 230, 245);
  ctx.fillStyle = '#FFD166';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(data.scholarId.toUpperCase(), 230, 268);

  // Barcode decoration
  ctx.fillStyle = '#FFFFFF';
  for (let x = 230; x < 580; x += Math.random() * 8 + 3) {
    ctx.fillRect(x, 300, Math.random() * 3 + 1, 35);
  }

  // Trigger Download
  const link = document.createElement('a');
  link.download = `IIITB_AmongUs_${data.name}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* ==========================================================================
   7. TOURNAMENT REGISTRATION FORM & BOARDING PASS
   ========================================================================== */
function initRegistration() {
  const form = document.getElementById('tournament-reg-form');
  const modeBtns = document.querySelectorAll('.reg-mode-btn');
  const squadFields = document.querySelectorAll('.squad-only-field');
  const successCard = document.getElementById('registration-success-card');
  const passDetails = document.getElementById('pass-ticket-details');

  let currentMode = 'solo';

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;

      if (currentMode === 'squad') {
        squadFields.forEach(el => el.style.display = 'block');
      } else {
        squadFields.forEach(el => el.style.display = 'none');
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-player-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const scholar = document.getElementById('reg-scholar-no').value.trim();
      const college = document.getElementById('reg-college').value.trim();
      const discord = document.getElementById('reg-discord').value.trim();
      const device = document.getElementById('reg-device').value;
      const terms = document.getElementById('reg-terms').checked;

      if (!name || !email || !scholar || !college || !terms) {
        alert("⚠️ Incomplete mission log! Please fill in all required fields and accept the anti-cheat code.");
        return;
      }

      playTaskSuccessSound();

      const ticketId = 'SUS-' + Math.floor(100000 + Math.random() * 900000);
      const regData = {
        ticketId,
        mode: currentMode.toUpperCase(),
        name,
        email,
        scholar,
        college,
        discord: discord || "Not provided",
        device,
        registeredAt: new Date().toLocaleString()
      };

      // Save locally
      localStorage.setItem('amongus_iiitb_ticket', JSON.stringify(regData));

      // Display ticket
      form.style.display = 'none';
      successCard.style.display = 'block';

      // 1. Populate On-Screen Page 1 Pass Preview
      passDetails.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #2D3460; padding-bottom: 12px; margin-bottom: 12px;">
          <div>
            <span style="font-size: 0.75rem; color: #67C9F5; font-weight: 800; text-transform: uppercase;">PASS CODE</span>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; color: #FFD166;">${ticketId}</h4>
          </div>
          <span style="background: #8DD982; color: #000; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 4px;">CONFIRMED</span>
        </div>
        <p style="margin-bottom: 6px;"><strong>CREWMATE:</strong> ${name}</p>
        <p style="margin-bottom: 6px;"><strong>INSTITUTION:</strong> ${college}</p>
        <p style="margin-bottom: 6px;"><strong>SCHOLAR NO:</strong> ${scholar}</p>
        <p style="margin-bottom: 6px;"><strong>TOURNAMENT FORMAT:</strong> ${currentMode.toUpperCase()} SHOWDOWN</p>
        <p style="margin-bottom: 6px;"><strong>PREFERRED DEVICE:</strong> ${device}</p>
        <p style="font-size: 0.8rem; color: #A3ADC2; margin-top: 12px;">Bring this pass to CC3 / Discord at 10:00 AM on Match Day!</p>
      `;

      // 2. Populate On-Screen Page 2 Congratulations Box
      const congratsCadetDetails = document.getElementById('congrats-cadet-details');
      if (congratsCadetDetails) {
        congratsCadetDetails.innerHTML = `
          <p><strong>ENLISTED CADET:</strong> ${name.toUpperCase()} • <strong>SCHOLAR NO:</strong> ${scholar.toUpperCase()}</p>
          <p><strong>INSTITUTION:</strong> ${college.toUpperCase()} • <strong>FORMAT:</strong> ${currentMode.toUpperCase()} SHOWDOWN</p>
          <p style="color: #8DD982; margin-top: 6px;">✓ Clearance Level 4 Cleared • 0% Suspect Rating</p>
        `;
      }

      // 3. Populate Dedicated Printable 2-Page Document
      const pTicket = document.getElementById('print-ticket-id');
      const pName = document.getElementById('print-name');
      const pCollege = document.getElementById('print-college');
      const pScholar = document.getElementById('print-scholar');
      const pFormat = document.getElementById('print-format');
      const pDevice = document.getElementById('print-device');
      const pDiscord = document.getElementById('print-discord');
      const pCertName = document.getElementById('print-cert-name');
      const pCertCollege = document.getElementById('print-cert-college');
      const pCertScholar = document.getElementById('print-cert-scholar');

      if (pTicket) pTicket.textContent = ticketId;
      if (pName) pName.textContent = name;
      if (pCollege) pCollege.textContent = college;
      if (pScholar) pScholar.textContent = scholar;
      if (pFormat) pFormat.textContent = `${currentMode.toUpperCase()} SHOWDOWN`;
      if (pDevice) pDevice.textContent = device;
      if (pDiscord) pDiscord.textContent = discord || "Not Provided";
      if (pCertName) pCertName.textContent = name.toUpperCase();
      if (pCertCollege) pCertCollege.textContent = college.toUpperCase();
      if (pCertScholar) pCertScholar.textContent = scholar.toUpperCase();

      // 4. Bind Print Button
      const printBtn = document.getElementById('print-registration-btn');
      if (printBtn) {
        printBtn.onclick = () => {
          playTaskSuccessSound();
          window.print();
        };
      }

      // 5. Bind Enlist Another Cadet Button
      const resetBtn = document.getElementById('register-new-btn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          playClickSound();
          form.reset();
          form.style.display = 'block';
          successCard.style.display = 'none';
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
      }

      // Scroll into view smoothly
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/* ==========================================================================
   8. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl) return;

  // Set target event date: 18 days from now or Nov 14, 2026
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 18);
  targetDate.setHours(10, 0, 0, 0);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      playClickSound();
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   10. MOBILE NAVIGATION & NAVBAR SCROLL
   ========================================================================== */
function initMobileNav() {
  const navBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.querySelector('.navbar');

  if (navBtn && navLinks) {
    navBtn.addEventListener('click', () => {
      playClickSound();
      navLinks.classList.toggle('active');
    });
  }

  // Smooth scroll and close mobile menu on item click
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    l.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('active');
    });
  });

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}
