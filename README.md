# 🐾 Mokepon

Juego web tipo **piedra, papel o tijera** con temática de mascotas ("mokepones"), donde cada criatura tiene ataques elementales. Recorres un mapa en un `<canvas>`, chocas con un enemigo y se desata un combate por turnos.

> Proyecto desarrollado con **JavaScript vanilla, HTML5 Canvas y CSS** — sin frameworks ni dependencias.

<!-- Opcional: agrega una captura del juego -->
<!-- ![Captura de Mokepon](./assets/screenshot.png) -->

---

## 🎮 Cómo se juega

1. **Elige tu mokepon** (Hipodoge, Capipepo o Ratigueya).
2. **Recorre el mapa** con las flechas del teclado o los botones en pantalla.
3. Al **chocar con un enemigo** comienza el combate.
4. **Selecciona tus 5 ataques**; el enemigo genera los suyos al azar.
5. Gana quien acumule más rondas.

### Reglas de combate

| Ataque | Le gana a |
| ------ | --------- |
| 🔥 Fuego | 🌱 Tierra |
| 💦 Agua  | 🔥 Fuego  |
| 🌱 Tierra| 💦 Agua   |

---

## 🚀 Cómo ejecutarlo

No requiere instalación. Basta con abrir `index.html` en el navegador:

```bash
# Opción 1: abrir directamente
open index.html          # macOS

# Opción 2: servidor local (recomendado para evitar problemas con imágenes)
npx serve .
# o
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

---

## 🛠️ Tecnologías

- **JavaScript (ES6+)** — clases, `find`, arrow functions, estado centralizado.
- **HTML5 Canvas** — renderizado del mapa y las mascotas.
- **CSS3** — variables, flexbox, grid y diseño responsive.

---

## 📁 Estructura

```
mokepon/
├── index.html          # Estructura del juego
├── css/
│   └── styles.css      # Estilos y diseño responsive
├── js/
│   └── mokepon.js      # Lógica del juego (refactorizada)
├── assets/             # Imágenes de mokepones, mapa y fondo
└── legacy/             # Versión original conservada para comparar
```

---

## ✨ Mejoras en esta versión (refactor)

Respecto a la versión original (conservada en [`legacy/`](./legacy)):

- 🐛 **Bug de ataques del enemigo corregido:** antes elegía el ataque por índices mágicos (`== 1`, `== 3 || 4`), por lo que casi siempre atacaba con Tierra. Ahora lee el **tipo real** del ataque.
- 🐛 **Combate balanceado:** el enemigo genera sus 5 ataques de una sola vez, en lugar de uno por cada clic del jugador.
- 🧹 **Código limpio:** se eliminó código muerto/comentado y se centralizó el estado y las reglas.
- 🎨 **UI mejorada:** paleta consistente, botones de movimiento tipo D-pad, efectos hover y diseño responsive.
- 🗺️ **Límites del mapa:** la mascota ya no puede salirse del canvas.
- ♿ **HTML semántico** y accesible (`lang`, `viewport`, botones bien cerrados).
- ⚙️ **Loop del mapa detenido** al iniciar el combate (mejor rendimiento).

---

## 👤 Autor

**Juan Covili** — Ingeniero en Informática / Analista Programador
[GitHub](https://github.com/juanCovili) · [LinkedIn](https://www.linkedin.com/in/juan-covili-02b2a114b) · [Portafolio](https://juancovili.com)
