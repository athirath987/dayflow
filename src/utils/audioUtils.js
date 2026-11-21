// Web Audio API sound generator for DayFlow (100% offline, zero asset dependencies)

let audioCtx = null;
let ambientSource = null;
let ambientGain = null;
let currentAmbientType = "none";

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play pleasant gentle chime when timer finishes
export function playTimerChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord)
  const now = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + index * 0.12);

    gain.gain.setValueAtTime(0, now + index * 0.12);
    gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.12);
    osc.stop(now + index * 0.12 + 1.7);
  });
}

// Generate ambient focus sounds using noise synthesis and filtering
export function startAmbientSound(type = "rain", volume = 0.3) {
  stopAmbientSound();
  if (type === "none") return;

  const ctx = getAudioContext();
  if (!ctx) return;

  currentAmbientType = type;
  ambientGain = ctx.createGain();
  ambientGain.gain.setValueAtTime(volume, ctx.currentTime);
  ambientGain.connect(ctx.destination);

  if (type === "whitenoise" || type === "rain") {
    // Generate 5-second noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink/brown filtered noise
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter noise based on type
    const filter = ctx.createBiquadFilter();
    if (type === "rain") {
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
    } else {
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
    }

    noise.connect(filter);
    filter.connect(ambientGain);
    noise.start();
    ambientSource = noise;
  } else if (type === "drone") {
    // Binaural / meditation drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(136.1, ctx.currentTime); // OM frequency
    osc2.frequency.setValueAtTime(140.1, ctx.currentTime); // 4Hz theta wave beat

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    droneGain.connect(ambientGain);

    osc1.start();
    osc2.start();
    ambientSource = {
      stop: () => {
        osc1.stop();
        osc2.stop();
      }
    };
  }
}

export function setAmbientVolume(volume) {
  if (ambientGain && audioCtx) {
    ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}

export function stopAmbientSound() {
  if (ambientSource) {
    try {
      ambientSource.stop();
    } catch {
      // silent catch
    }
    ambientSource = null;
  }
  if (ambientGain) {
    ambientGain.disconnect();
    ambientGain = null;
  }
  currentAmbientType = "none";
}

export function getCurrentAmbientType() {
  return currentAmbientType;
}
