# 🎮 Valentine's Tale ❤️
### *Interactive Undertale-Style Web Experience & Custom Turn-Based Battle Engine*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Canvas API](https://img.shields.io/badge/Canvas_2D-000000?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio](https://img.shields.io/badge/Web_Audio_API-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

> **Valentine's Tale** es un proyecto web interactivo y minijuego de combate por turnos inspirado en la estética y mecánicas del galardonado videojuego *Undertale* (Toby Fox). Desarrollado íntegramente desde cero utilizando **Vanilla Web Technologies** (HTML5, CSS3 y JavaScript puro), sin librerías externas ni motores pesados.

---

## 📌 Demostración y Habilidades Técnicas

Este proyecto fue diseñado como parte de mi portafolio para demostrar el dominio de los fundamentos de la web moderna, la lógica de programación orientada a eventos, el desarrollo de videojuegos en navegador y el diseño de interfaces responsivas y temáticas:

### 1. ⚙️ Motor de Videojuego en HTML5 Canvas (60 FPS)
* **Game Loop & Timers:** Bucle de renderizado y actualización en tiempo real utilizando `requestAnimationFrame` con cálculo de Delta Time (`dt`) para mantener físicas constantes independientemente de la tasa de refresco del monitor.
* **Sistema de Colisiones Continuas:** Algoritmos de colisión circular y radial precisa entre el alma del jugador (❤️) y los proyectiles.
* **Patrones de Proyectiles Temáticos:**
  * Generación matemática de trayectorias para ondas sonoras rebotantes (*"OINKS"*), caída rítmica de pezuñas porcinas y dispersión suave de trufas.
  * Margen de invulnerabilidad temporal (*iframe*) con efecto de parpadeo visual tras recibir daño.
* **Morfismo Dinámico de la Caja de Batalla:** La caja de combate se adapta y redimensiona fluidamente (`transition: min-height 0.25s`) expandiéndose de 175px a 250px de altura para dar espacio vertical de reacción táctica al jugador.

### 2. 🧠 Máquina de Estados Finita (FSM) por Turnos
Implementación de la arquitectura clásica de RPG por turnos:
* **Fase del Jugador (Menú):** Selección interactiva entre las opciones `[ PELEAR ]`, `[ ACTUAR ]`, `[ OBJETO ]` y `[ PERDONAR ]`.
* **Submenú de ACTUAR con Lógica de Pacifismo:**
  * Acciones personalizadas: *Ofrecer trufa*, *Rascar panza*, *Analizar* y *Cuidados y cariños*.
  * Acumulación de puntos de empatía (*Mercy Meter*): al alcanzar el umbral requerido, el enemigo pasa al estado `Spareable` (su nombre se vuelve amarillo y se dispara la campana de perdón).
* **Fase del Enemigo (Esquivar Balas):** Transición a la arena de esquivar proyectiles durante un intervalo de 5 segundos antes de devolver el turno.
* **Transición de Escena a Recompensa:** Al resolver el encuentro de forma pacifista, la aplicación realiza una transición fluida al apartado de dedicatoria personal.

### 3. 🔊 Pipeline de Audio y Síntesis Web Audio
* **Efecto Máquina de Escribir Sincronizado:** Renderizado de texto letra por letra con reproducción de bips de voz retro sincronizados con cada carácter (`SND_TXT1.wav`).
* **Gestión de Canales de Sonido:** Controlador de audio que gestiona efectos de interfaz (`snd_movemenu`, `snd_select`), efectos de combate (`snd_damage`, `snd_heal`, `snd_bell`, `snd_dumbvictory`) y conmutación dinámica de bandas sonoras en formato `.ogg` (*Battle Theme* y *Lost Girl - Deltarune*).

### 4. 🎨 Arte Vectorial SVG y Diseño Retro Pixel-Perfect
* **Sprite Monstruo en Pixel Art:** Ilustración vectorial SVG personalizada para el enemigo ("Cerdito"), siguiendo los patrones monocromáticos, sombreado y proporciones de los sprites originales de batalla de *Undertale*.
* **Animaciones CSS:** Balanceo sutil de respiración (*idle bounce*), rotación de estrellas de guardado y líneas de escaneo retro CRT (*scanlines*).
* **Marco Estilo Polaroid:** Renderizado adaptativo de fotografía con sombra suave y rotación orgánica.

### 5. 📱 Soporte Multiplataforma y Accesibilidad Móvil
* **Controles Híbridos:**
  * **PC:** Soporte completo para teclado (Flechas de dirección, `WASD`, tecla `Z` y `Enter`).
  * **Móviles/Tablets:** Cruceta digital táctil integrada (*D-Pad*) y soporte nativo para arrastrar el corazón con el dedo (`Touch Events`) directamente en el Canvas.
* **Diseño 100% Responsivo:** Maquetación con CSS Flexbox y Grid totalmente centrada en el viewport y adaptada a cualquier tamaño de pantalla.

---

## 📂 Estructura del Código

```text
├── index.html           # Arquitectura semántica, escenas (Batalla / Carta) y SVGs
├── README.md            # Documentación técnica del proyecto
├── css/
│   └── style.css        # Estilos retro de 8 bits, animaciones, layout responsivo
├── js/
│   ├── game.js          # Motor del juego Canvas, bucle, colisiones y turnos
│   └── main.js          # Gestor de audio, efecto typewriter y eventos de UI
└── assets/
    ├── audio/           # Pistas musicales (.ogg) y efectos de sonido (.wav)
    └── img/             # Imágenes y fotografía del apartado de carta
```

---

## 🚀 Cómo Ejecutar el Proyecto en Local

No requiere NodeJS, servidores ni dependencias externas:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ChenteDev1/Valentina.git
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd Valentina
   ```
3. Abre `index.html` en cualquier navegador web moderno (Chrome, Brave, Edge, Firefox, Safari).

---

## 👤 Autor

* **ChenteDev1**
* GitHub: [@ChenteDev1](https://github.com/ChenteDev1)

---
*Inspirado en el universo de Undertale & Deltarune creado por Toby Fox.*
