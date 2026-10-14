/**
 * MOTOR DE BATALLA DE UNDERTALE CON ATAQUES TEMÁTICOS DEL CERDITO 🐷
 * Y TRANSICIÓN A LA ESCENA DE LA CARTA CON "LOST GIRL"
 */

class UndertaleBattle {
  constructor() {
    // Referencias del DOM
    this.canvas = document.getElementById('battleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.boxMenuView = document.getElementById('boxMenuView');
    this.boxNarration = document.getElementById('boxNarration');
    this.boxOptionsGrid = document.getElementById('boxOptionsGrid');
    this.btnContinue = document.getElementById('btnContinue');
    this.enemySpeech = document.getElementById('enemySpeech');
    this.turnCounter = document.getElementById('turnCounter');
    this.hpFill = document.getElementById('hpFill');
    this.hpText = document.getElementById('hpText');
    this.overlay = document.getElementById('battleOverlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayBtn = document.getElementById('overlayBtn');
    this.battleBoxWrapper = document.getElementById('battleBoxWrapper');

    // Escenas
    this.sceneBattle = document.getElementById('sceneBattle');
    this.sceneLetter = document.getElementById('sceneLetter');
    this.btnReplay = document.getElementById('btnReplay');

    // Botones de acción
    this.btnFight = document.getElementById('btnFight');
    this.btnAct = document.getElementById('btnAct');
    this.btnItem = document.getElementById('btnItem');
    this.btnMercy = document.getElementById('btnMercy');

    // Estado del Jugador (Corazón rojo ❤️)
    this.playerHp = 20;
    this.maxHp = 20;
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      size: 11,
      speed: 2.8,
      invulnerable: false,
      invulnerableTimer: 0,
      visible: true
    };

    // Estado de la Batalla
    this.phase = 'MENU';
    this.turn = 1;
    this.mercyProgress = 0;
    this.isSpareable = false;
    this.items = [
      { name: 'Chocolate (+10 HP)', heal: 10, used: false },
      { name: 'Carta de Amor (+20 HP)', heal: 20, used: false }
    ];

    // Esquivar ataques (balas temáticas del cerdito)
    this.isDodging = false;
    this.dodgeDuration = 5.0; // 5 segundos
    this.dodgeTimer = 0;
    this.projectiles = [];
    this.keys = {};

    this.initControls();
    this.initButtons();
    this.initReplay();
    this.startPlayerTurn();
  }

  /* ------------------- CONTROLES Y TECLADO ------------------- */
  initControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if ((e.key.toLowerCase() === 'z' || e.key === 'Enter') && this.phase === 'NARRATION') {
        this.startEnemyTurn();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Controles táctiles / D-Pad
    const dpad = {
      'btnUp': 'arrowup',
      'btnDown': 'arrowdown',
      'btnLeft': 'arrowleft',
      'btnRight': 'arrowright'
    };

    Object.entries(dpad).forEach(([btnId, key]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        const press = (e) => { e.preventDefault(); this.keys[key] = true; };
        const release = (e) => { e.preventDefault(); this.keys[key] = false; };
        btn.addEventListener('touchstart', press);
        btn.addEventListener('touchend', release);
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
      }
    });

    // Control táctil arrastrando en el Canvas
    let touchDragging = false;
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.isDodging) return;
      touchDragging = true;
      this.handleTouchDrag(e);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isDodging || !touchDragging) return;
      e.preventDefault();
      this.handleTouchDrag(e);
    });

    this.canvas.addEventListener('touchend', () => { touchDragging = false; });

    // Botón continuar después de leer
    this.btnContinue.addEventListener('click', () => {
      window.audio.play('select');
      this.startEnemyTurn();
    });
  }

  handleTouchDrag(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const tx = (touch.clientX - rect.left) * scaleX;
    const ty = (touch.clientY - rect.top) * scaleY;
    const pad = this.player.size;
    this.player.x = Math.max(pad, Math.min(this.canvas.width - pad, tx));
    this.player.y = Math.max(pad, Math.min(this.canvas.height - pad, ty));
  }

  /* ------------------- BOTONES DE LA BATALLA ------------------- */
  initButtons() {
    const buttons = [this.btnFight, this.btnAct, this.btnItem, this.btnMercy];

    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => window.audio.play('move'));
    });

    // 1. PELEAR
    this.btnFight.addEventListener('click', () => {
      if (this.phase !== 'MENU') return;
      window.audio.play('select');
      this.showNarration(
        "* Intentas atacar, pero el Cerdito es demasiado tierno y esponjoso.\n* ¡No tienes el corazón para lastimarlo!",
        "¡Oink! ¿Querías un abrazo?"
      );
    });

    // 2. ACTUAR (Con las 4 opciones pedidas por el usuario)
    this.btnAct.addEventListener('click', () => {
      if (this.phase !== 'MENU') return;
      window.audio.play('select');
      this.showActSubmenu();
    });

    // 3. OBJETO
    this.btnItem.addEventListener('click', () => {
      if (this.phase !== 'MENU') return;
      window.audio.play('select');
      this.showItemSubmenu();
    });

    // 4. PERDONAR
    this.btnMercy.addEventListener('click', () => {
      if (this.phase !== 'MENU') return;
      window.audio.play('select');
      this.showMercySubmenu();
    });
  }

  initReplay() {
    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => {
        window.audio.stopLostGirl();
        window.audio.play('select');
        this.sceneLetter.classList.add('hidden');
        this.sceneBattle.classList.remove('hidden');
        this.playerHp = this.maxHp;
        this.mercyProgress = 0;
        this.isSpareable = false;
        this.turn = 1;
        this.items.forEach(it => it.used = false);
        this.startPlayerTurn();
      });
    }
  }

  /* ------------------- MENÚS Y SUBMENÚS ------------------- */
  startPlayerTurn() {
    this.phase = 'MENU';
    this.isDodging = false;
    this.canvas.style.display = 'none';
    this.boxMenuView.style.display = 'flex';
    this.boxOptionsGrid.style.display = 'none';
    this.btnContinue.style.display = 'none';
    this.updateHpUi();

    const idleTexts = [
      "* El Cerdito te mira curioso y mueve su colita.",
      "* El ambiente huele a trufas frescas y amor.",
      "* El Cerdito bosteza suavemente esperando tus caricias.",
      "* Valentina se mantiene llena de DETERMINACIÓN."
    ];
    const text = this.isSpareable
      ? "* ¡El Cerdito está completamente feliz! Puedes PERDONARLO."
      : idleTexts[(this.turn - 1) % idleTexts.length];

    typeWriter(this.boxNarration, text);
  }

  showActSubmenu() {
    this.phase = 'OPTIONS';
    this.boxNarration.textContent = "* Elige una acción con el Cerdito:";
    this.boxOptionsGrid.innerHTML = "";
    this.boxOptionsGrid.style.display = "grid";

    const actOptions = [
      {
        label: "1. Ofrecer trufa",
        action: () => {
          this.mercyProgress += 1;
          this.checkSpareable();
          this.showNarration(
            "* Le ofreces una deliciosa trufa al Cerdito.\n* ¡La devora al instante y sus ojitos brillan de felicidad!",
            "¡OINK! ¡Qué delicia! ¡Te quiero mucho! 💕"
          );
        }
      },
      {
        label: "2. Rascar panza",
        action: () => {
          this.mercyProgress += 1;
          this.checkSpareable();
          this.showNarration(
            "* Le rascas la pancita al Cerdito con suavidad.\n* Se tira al suelo y patalea feliz mientras ronronea.",
            "Oink oink... eso se siente tan relajante..."
          );
        }
      },
      {
        label: "3. Analizar",
        action: () => {
          this.showNarration(
            "* CERDITO - ATK 1 DEF 2.\n* Un tierno cerdito al que le encantan las trufas y que le hagan cariños.",
            "¿Me estás mirando con amor? Oink 🐷"
          );
        }
      },
      {
        label: "4. Cuidados y cariños",
        action: () => {
          this.mercyProgress += 2;
          this.checkSpareable();
          this.showNarration(
            "* Llenas al Cerdito de abrazos, mimos y palabras tiernas.\n* ¡El corazón del Cerdito se ha derretido por completo!",
            "¡OINK! ¡Eres la más linda de todas, Valentina! ❤️"
          );
        }
      }
    ];

    actOptions.forEach((opt) => {
      const div = document.createElement('div');
      div.className = 'menu-option';
      div.innerHTML = `<span class="opt-heart">❤️</span> ${opt.label}`;
      div.addEventListener('mouseenter', () => window.audio.play('move'));
      div.addEventListener('click', () => {
        window.audio.play('select');
        opt.action();
      });
      this.boxOptionsGrid.appendChild(div);
    });
  }

  showItemSubmenu() {
    this.phase = 'OPTIONS';
    this.boxNarration.textContent = "* Selecciona un objeto:";
    this.boxOptionsGrid.innerHTML = "";
    this.boxOptionsGrid.style.display = "grid";

    let available = 0;
    this.items.forEach((item) => {
      if (item.used) return;
      available++;
      const div = document.createElement('div');
      div.className = 'menu-option';
      div.innerHTML = `<span class="opt-heart">❤️</span> ${item.name}`;
      div.addEventListener('mouseenter', () => window.audio.play('move'));
      div.addEventListener('click', () => {
        window.audio.play('heal');
        item.used = true;
        this.playerHp = Math.min(this.maxHp, this.playerHp + item.heal);
        this.updateHpUi();
        this.showNarration(
          `* Usaste [${item.name}].\n* ¡Recuperaste vida! Tu HP está al máximo.`,
          "¡Oink! ¡Te ves con más energía!"
        );
      });
      this.boxOptionsGrid.appendChild(div);
    });

    if (available === 0) {
      this.boxNarration.textContent = "* Ya no tienes más objetos en tus bolsillos.";
      setTimeout(() => this.startPlayerTurn(), 1400);
    }
  }

  showMercySubmenu() {
    this.phase = 'OPTIONS';
    this.boxNarration.textContent = "* ¿Qué deseas hacer?";
    this.boxOptionsGrid.innerHTML = "";
    this.boxOptionsGrid.style.display = "grid";

    // Opción 1: Perdonar
    const divSpare = document.createElement('div');
    divSpare.className = `menu-option ${this.isSpareable ? 'yellow-text' : ''}`;
    divSpare.innerHTML = `<span class="opt-heart">❤️</span> * Perdonar`;
    divSpare.addEventListener('mouseenter', () => window.audio.play('move'));
    divSpare.addEventListener('click', () => {
      if (this.isSpareable) {
        this.victory();
      } else {
        window.audio.play('select');
        this.showNarration(
          "* Intentas perdonar, pero el Cerdito aún tiene ganas de jugar y recibir más mimos.\n* (Prueba actuando y dándole cariños o trufas).",
          "¡Oink! ¡Aún no quiero que te vayas!"
        );
      }
    });
    this.boxOptionsGrid.appendChild(divSpare);

    // Opción 2: Huir
    const divFlee = document.createElement('div');
    divFlee.className = 'menu-option';
    divFlee.innerHTML = `<span class="opt-heart">❤️</span> * Huir`;
    divFlee.addEventListener('mouseenter', () => window.audio.play('move'));
    divFlee.addEventListener('click', () => {
      window.audio.play('select');
      this.showNarration(
        "* Pero decidiste quedarte junto a tu cerdito.",
        "¡Oink! ¡Sabía que te quedarías conmigo!"
      );
    });
    this.boxOptionsGrid.appendChild(divFlee);
  }

  checkSpareable() {
    if (this.mercyProgress >= 3 && !this.isSpareable) {
      this.isSpareable = true;
      setTimeout(() => {
        window.audio.play('bell');
      }, 600);
    }
  }

  showNarration(text, speech = null) {
    this.phase = 'NARRATION';
    this.boxOptionsGrid.style.display = 'none';
    if (speech && this.enemySpeech) {
      this.enemySpeech.textContent = speech;
    }
    typeWriter(this.boxNarration, text, 20, () => {
      this.btnContinue.style.display = 'inline-block';
    });
  }

  /* ------------------- TURNO DEL CERDITO: ATAQUES TEMÁTICOS Y LENTOS ------------------- */
  startEnemyTurn() {
    this.phase = 'DODGING';
    this.isDodging = true;
    this.boxMenuView.style.display = 'none';
    this.canvas.style.display = 'block';

    if (this.battleBoxWrapper) {
      this.battleBoxWrapper.classList.add('dodging-mode');
    }

    // Posición del corazón: centrado horizontalmente y en la parte inferior para dar tiempo de reacción
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height * 0.72;
    this.player.invulnerable = false;
    this.projectiles = [];
    this.dodgeTimer = this.dodgeDuration;

    this.lastFrame = performance.now();
    requestAnimationFrame((t) => this.dodgeLoop(t));
  }

  // Generador de ataques porcinos según la ronda
  spawnThematicProjectiles() {
    const patternType = (this.turn % 3);

    // PATRÓN 1: OINKS REBOTANTES (Ondas de sonido "OINK" flotantes)
    if (patternType === 1) {
      if (Math.random() < 0.03 && this.projectiles.length < 5) {
        const fromLeft = Math.random() > 0.5;
        this.projectiles.push({
          x: fromLeft ? 10 : this.canvas.width - 10,
          y: Math.random() * (this.canvas.height - 50) + 25,
          vx: fromLeft ? 1.15 : -1.15,
          vy: (Math.random() - 0.5) * 0.5,
          size: 14,
          type: 'oink',
          color: '#ffffff',
          text: 'OINK'
        });
      }
    }

    // PATRÓN 2: HUELLITAS DE PEZUÑA DE CERDO DESCENDENTES
    else if (patternType === 2) {
      if (Math.random() < 0.035 && this.projectiles.length < 6) {
        this.projectiles.push({
          x: Math.random() * (this.canvas.width - 40) + 20,
          y: -15,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 1.15,
          size: 9,
          type: 'hoof',
          color: '#ffffff'
        });
      }
    }

    // PATRÓN 3: TRUFAS DELICIOSAS Y GOTITAS DE BARRO
    else {
      if (Math.random() < 0.035 && this.projectiles.length < 6) {
        this.projectiles.push({
          x: Math.random() * (this.canvas.width - 40) + 20,
          y: -15,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 1.1,
          size: 8,
          type: 'truffle',
          color: '#d48872'
        });
      }
    }

    // Proyectil bonus: En el último segundo, un corazoncito lento
    if (this.dodgeTimer < 1.6 && Math.random() < 0.03 && !this.projectiles.some(p => p.type === 'heart')) {
      this.projectiles.push({
        x: this.canvas.width / 2,
        y: 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.0,
        size: 9,
        type: 'heart',
        color: '#ff69b4'
      });
    }
  }

  updateDodging(dt) {
    if (!this.isDodging) return;

    this.dodgeTimer -= dt;
    if (this.dodgeTimer <= 0) {
      this.endEnemyTurn();
      return;
    }

    // Movimiento del jugador
    let dx = 0;
    let dy = 0;
    if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
    if (this.keys['arrowright'] || this.keys['d']) dx += 1;
    if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
    if (this.keys['arrowdown'] || this.keys['s']) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.player.x += dx * this.player.speed;
    this.player.y += dy * this.player.speed;

    // Confinar el corazón dentro de la caja (CORREGIDO EL BUG DE LA FLECHA ABAJO)
    const pad = this.player.size;
    this.player.x = Math.max(pad, Math.min(this.canvas.width - pad, this.player.x));
    this.player.y = Math.max(pad, Math.min(this.canvas.height - pad, this.player.y));

    // Invulnerabilidad (parpadeo)
    if (this.player.invulnerable) {
      this.player.invulnerableTimer--;
      this.player.visible = Math.floor(this.player.invulnerableTimer / 5) % 2 === 0;
      if (this.player.invulnerableTimer <= 0) {
        this.player.invulnerable = false;
        this.player.visible = true;
      }
    }

    this.spawnThematicProjectiles();

    // Actualizar balas y colisiones
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Colisión
      const dist = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (dist < (this.player.size * 0.65 + p.size * 0.75)) {
        this.takeDamage(2);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.x < -40 || p.x > this.canvas.width + 40 || p.y < -40 || p.y > this.canvas.height + 40) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  takeDamage(amount) {
    if (this.player.invulnerable) return;

    this.playerHp = Math.max(0, this.playerHp - amount);
    this.updateHpUi();
    this.player.invulnerable = true;
    this.player.invulnerableTimer = 50;

    window.audio.play('damage');

    if (this.playerHp <= 0) {
      this.gameOver();
    }
  }

  endEnemyTurn() {
    this.isDodging = false;
    if (this.battleBoxWrapper) {
      this.battleBoxWrapper.classList.remove('dodging-mode');
    }
    this.turn++;
    if (this.turnCounter) this.turnCounter.textContent = this.turn;
    this.startPlayerTurn();
  }

  /* ------------------- DIBUJADO DE SPRITES EN CANVAS ------------------- */
  drawHeart(x, y, size, color) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    const top = size * 0.3;
    this.ctx.moveTo(0, top);
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, top);
    this.ctx.bezierCurveTo(-size / 2, (size + top) / 2, 0, (size + top) / 1.5, 0, size);
    this.ctx.bezierCurveTo(0, (size + top) / 1.5, size / 2, (size + top) / 2, size / 2, top);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, top);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  // Dibujar pezuña de cerdo (huella doble hendida)
  drawPigHoof(x, y, size) {
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1.5;
    
    // Lóbulo izquierdo
    this.ctx.beginPath();
    this.ctx.ellipse(x - size * 0.35, y, size * 0.3, size * 0.6, -0.15, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Lóbulo derecho
    this.ctx.beginPath();
    this.ctx.ellipse(x + size * 0.35, y, size * 0.3, size * 0.6, 0.15, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Dibujar trufa redonda pixel
  drawTruffle(x, y, size) {
    this.ctx.save();
    this.ctx.fillStyle = '#8b5a2b';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Moteado de trufa
    this.ctx.fillStyle = '#d48872';
    this.ctx.fillRect(x - 2, y - 2, 3, 3);
    this.ctx.restore();
  }

  // Dibujar Oink
  drawOinkBubble(x, y, text) {
    this.ctx.save();
    this.ctx.fillStyle = '#000000';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 20, 11, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = '10px "VT323", monospace';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y + 1);
    this.ctx.restore();
  }

  renderDodge() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar proyectiles temáticos
    this.projectiles.forEach((p) => {
      if (p.type === 'oink') {
        this.drawOinkBubble(p.x, p.y, p.text);
      } else if (p.type === 'hoof') {
        this.drawPigHoof(p.x, p.y, p.size);
      } else if (p.type === 'truffle') {
        this.drawTruffle(p.x, p.y, p.size);
      } else if (p.type === 'heart') {
        this.drawHeart(p.x, p.y - 2, p.size * 1.3, '#ff69b4');
      }
    });

    // Dibujar alma roja del jugador (❤️)
    if (this.player.visible) {
      this.drawHeart(this.player.x, this.player.y - 3, this.player.size * 1.5, '#ff0000');
    }
  }

  dodgeLoop(time) {
    const dt = (time - this.lastFrame) / 1000;
    this.lastFrame = time;

    this.updateDodging(dt);
    this.renderDodge();

    if (this.isDodging) {
      requestAnimationFrame((t) => this.dodgeLoop(t));
    }
  }

  /* ------------------- ESTADOS FINALES ------------------- */
  updateHpUi() {
    const percent = (this.playerHp / this.maxHp) * 100;
    if (this.hpFill) this.hpFill.style.width = `${percent}%`;
    if (this.hpText) this.hpText.textContent = `${this.playerHp} / ${this.maxHp}`;
  }

  victory() {
    this.phase = 'VICTORY';
    this.isDodging = false;
    window.audio.play('victory');

    if (this.battleBoxWrapper) {
      this.battleBoxWrapper.classList.add('victory-mode');
    }

    if (this.enemySpeech) this.enemySpeech.textContent = "¡OINK! ¡Ganaste! ¡Te amo infinitamente! ❤️";
    this.overlay.classList.remove('hidden');
    this.overlayTitle.innerHTML = `
      ✨ ¡HAS PERDONADO AL CERDITO! ✨<br><br>
      * ¡VICTORIA! Obtuviste 0 EXP y 1000 de AMOR.<br>
      * El cerdito te sonríe feliz y te entrega su regalo.
    `;
    this.overlayBtn.textContent = "ABRIR CARTA DE AMOR ❤️";
    this.overlayBtn.onclick = () => {
      this.overlay.classList.add('hidden');
      if (this.battleBoxWrapper) {
        this.battleBoxWrapper.classList.remove('victory-mode');
      }
      // Transición al segundo apartado (La Carta Especial) y sonido Lost Girl
      this.sceneBattle.classList.add('hidden');
      this.sceneLetter.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.audio.playLostGirl();
    };
  }

  gameOver() {
    this.phase = 'GAMEOVER';
    this.isDodging = false;
    if (this.battleBoxWrapper) {
      this.battleBoxWrapper.classList.add('victory-mode');
    }
    this.overlay.classList.remove('hidden');
    this.overlayTitle.innerHTML = `
      ¡TE HAS QUEDADO SIN HP!<br><br>
      "Valentina... no te rindas.<br>
      ¡Mantente determinada!"
    `;
    this.overlayBtn.textContent = "REINTENTAR DESDE EL GUARDADO";
    this.overlayBtn.onclick = () => {
      this.overlay.classList.add('hidden');
      if (this.battleBoxWrapper) {
        this.battleBoxWrapper.classList.remove('victory-mode');
      }
      this.playerHp = this.maxHp;
      this.startPlayerTurn();
    };
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.battle = new UndertaleBattle();
});
