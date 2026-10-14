/**
 * GESTOR DE AUDIO Y EFECTOS DE UNDERTALE & DELTARUNE
 */

class AudioManager {
  constructor() {
    this.soundEnabled = true;
    this.battleMusicEnabled = false;

    // Efectos de sonido de Undertale
    this.sounds = {
      text: new Audio('assets/audio/SND_TXT1.wav'),
      select: new Audio('assets/audio/snd_select.wav'),
      move: new Audio('assets/audio/snd_movemenu.wav'),
      damage: new Audio('assets/audio/snd_damage.wav'),
      heal: new Audio('assets/audio/snd_heal.wav'),
      save: new Audio('assets/audio/snd_save.wav'),
      bell: new Audio('assets/audio/snd_bell.wav'),
      victory: new Audio('assets/audio/snd_dumbvictory.wav')
    };

    // Ajustes de volumen de efectos
    this.sounds.text.volume = 0.35;
    this.sounds.select.volume = 0.5;
    this.sounds.move.volume = 0.4;
    this.sounds.damage.volume = 0.6;
    this.sounds.heal.volume = 0.6;
    this.sounds.save.volume = 0.6;
    this.sounds.bell.volume = 0.6;
    this.sounds.victory.volume = 0.65;

    // Pistas de música
    this.bgBattleMusic = document.getElementById('bgBattleMusic');
    this.bgLostGirl = document.getElementById('bgLostGirl');

    if (this.bgBattleMusic) this.bgBattleMusic.volume = 0.3;
    if (this.bgLostGirl) this.bgLostGirl.volume = 0.45;
  }

  play(key) {
    if (!this.soundEnabled || !this.sounds[key]) return;
    try {
      const sound = this.sounds[key].cloneNode();
      sound.volume = this.sounds[key].volume;
      sound.play().catch(() => {});
    } catch (e) {}
  }

  toggleBattleMusic() {
    if (!this.bgBattleMusic) return;
    this.battleMusicEnabled = !this.battleMusicEnabled;
    if (this.battleMusicEnabled) {
      this.bgBattleMusic.play().catch(() => {});
    } else {
      this.bgBattleMusic.pause();
    }
    const btn = document.getElementById('musicToggle');
    if (btn) btn.textContent = this.battleMusicEnabled ? "🎵 MÚSICA DE PELEA: ON" : "🎵 MÚSICA DE PELEA: OFF";
  }

  playLostGirl() {
    if (this.bgBattleMusic) this.bgBattleMusic.pause();
    if (this.bgLostGirl) {
      this.bgLostGirl.currentTime = 0;
      this.bgLostGirl.play().catch(() => {});
    }
  }

  stopLostGirl() {
    if (this.bgLostGirl) {
      this.bgLostGirl.pause();
      this.bgLostGirl.currentTime = 0;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) btn.textContent = this.soundEnabled ? "🔊 SONIDOS: ON" : "🔇 SONIDOS: OFF";
  }
}

window.audio = new AudioManager();

// Efecto máquina de escribir auténtico de Undertale
let typewriterTimeout = null;
function typeWriter(element, text, speed = 25, callback = null) {
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  element.textContent = "";
  let i = 0;

  function writeChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      if (text.charAt(i) !== " " && i % 2 === 0) {
        window.audio.play('text');
      }
      i++;
      typewriterTimeout = setTimeout(writeChar, speed);
    } else if (callback) {
      callback();
    }
  }
  writeChar();
}

// Inicialización de eventos globales
document.addEventListener('DOMContentLoaded', () => {
  const savePoint = document.getElementById('savePoint');
  const soundToggle = document.getElementById('soundToggle');
  const musicToggle = document.getElementById('musicToggle');

  // Punto de guardado
  if (savePoint) {
    savePoint.addEventListener('click', () => {
      window.audio.play('save');
      if (window.battle) {
        window.battle.playerHp = window.battle.maxHp;
        window.battle.updateHpUi();
        window.battle.showNarration(
          "* Pensar en lo mucho que te aman te llena de DETERMINACIÓN.\n* (HP restaurado al máximo)."
        );
      }
    });
  }

  // Toggles de audio
  if (soundToggle) soundToggle.addEventListener('click', () => window.audio.toggleSound());
  if (musicToggle) musicToggle.addEventListener('click', () => window.audio.toggleBattleMusic());
});
