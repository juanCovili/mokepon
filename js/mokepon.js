"use strict";

// ============================================================
//  MOKEPON — versión refactorizada
//  Juego piedra/papel/tijera temático (Agua > Fuego > Tierra > Agua)
// ============================================================

// ---------- Referencias al DOM ----------
const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
const sectionVerMapa = document.getElementById("ver-mapa");
const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const sectionReiniciar = document.getElementById("reiniciar");

const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const contenedorAtaques = document.getElementById("contenedorAtaques");

const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const sectionMensajes = document.getElementById("resultado");
const ataquesDelJugador = document.getElementById("ataques-del-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo");

const botonMascotaJugador = document.getElementById("btn-mascota");
const botonReiniciar = document.getElementById("btn-reiniciar");

const mapa = document.getElementById("mapa");
const lienzo = mapa.getContext("2d");

// ---------- Constantes de juego ----------
const TOTAL_ATAQUES = 5;
const VELOCIDAD = 5;
const MAPA_ANCHO = 700;
const MAPA_ALTO = 500;

// Reglas de victoria: clave le gana a valor
const REGLAS = {
    FUEGO: "TIERRA",
    AGUA: "FUEGO",
    TIERRA: "AGUA",
};

// Mapea el emoji del botón al tipo de ataque
const EMOJI_A_TIPO = {
    "🔥": "FUEGO",
    "💦": "AGUA",
    "🌱": "TIERRA",
};

// ---------- Estado del juego ----------
let mascotaJugador = null;        // objeto Mokepon del jugador
let mascotaEnemigo = null;        // objeto Mokepon del enemigo
let ataquesJugador = [];
let ataquesEnemigo = [];
let victoriasJugador = 0;
let victoriasEnemigo = 0;

let intervalo = null;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.png";

// ---------- Clase Mokepon ----------
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, x = 10, y = 10) {
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.x = x;
        this.y = y;
        this.ancho = 80;
        this.alto = 80;
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa;
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarMokepon() {
        lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
    }
}

// ---------- Fábrica de mokepones ----------
function crearMokepones() {
    const hipodoge = new Mokepon(
        "Hipodoge",
        "./assets/mokepons_mokepon_hipodoge_attack.png",
        5,
        "./assets/hipodoge.png"
    );
    const capipepo = new Mokepon(
        "Capipepo",
        "./assets/mokepons_mokepon_capipepo_attack.png",
        5,
        "./assets/capipepo.png"
    );
    const ratigueya = new Mokepon(
        "Ratigueya",
        "./assets/mokepons_mokepon_ratigueya_attack.png",
        5,
        "./assets/ratigueya.png"
    );

    hipodoge.ataques.push(
        { emoji: "💦", tipo: "AGUA", id: "btn-agua-1" },
        { emoji: "💦", tipo: "AGUA", id: "btn-agua-2" },
        { emoji: "💦", tipo: "AGUA", id: "btn-agua-3" },
        { emoji: "🔥", tipo: "FUEGO", id: "btn-fuego-1" },
        { emoji: "🌱", tipo: "TIERRA", id: "btn-tierra-1" }
    );
    capipepo.ataques.push(
        { emoji: "🌱", tipo: "TIERRA", id: "btn-tierra-1" },
        { emoji: "🌱", tipo: "TIERRA", id: "btn-tierra-2" },
        { emoji: "🌱", tipo: "TIERRA", id: "btn-tierra-3" },
        { emoji: "🔥", tipo: "FUEGO", id: "btn-fuego-1" },
        { emoji: "💦", tipo: "AGUA", id: "btn-agua-1" }
    );
    ratigueya.ataques.push(
        { emoji: "🔥", tipo: "FUEGO", id: "btn-fuego-1" },
        { emoji: "🔥", tipo: "FUEGO", id: "btn-fuego-2" },
        { emoji: "🔥", tipo: "FUEGO", id: "btn-fuego-3" },
        { emoji: "💦", tipo: "AGUA", id: "btn-agua-1" },
        { emoji: "🌱", tipo: "TIERRA", id: "btn-tierra-1" }
    );

    return [hipodoge, capipepo, ratigueya];
}

let mokepones = crearMokepones();

// Copias independientes para los enemigos en el mapa
let mokeponesEnemigos = [];

// ---------- Utilidades ----------
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function buscarMokepon(nombre) {
    return mokepones.find((m) => m.nombre === nombre) || null;
}

// ============================================================
//  Inicio del juego
// ============================================================
function iniciarJuego() {
    sectionVerMapa.style.display = "none";
    sectionReiniciar.style.display = "none";
    sectionSeleccionarAtaque.style.display = "none";

    mokepones.forEach((mokepon) => {
        contenedorTarjetas.innerHTML += `
            <input type="radio" name="mascota" id="${mokepon.nombre}" />
            <label class="tarjeta-de-mokepon" for="${mokepon.nombre}">
                <p>${mokepon.nombre}</p>
                <img src="${mokepon.foto}" alt="${mokepon.nombre}" />
            </label>
        `;
    });

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
    botonReiniciar.addEventListener("click", reiniciarJuego);
}

function seleccionarMascotaJugador() {
    const seleccionado = document.querySelector('input[name="mascota"]:checked');

    if (!seleccionado) {
        alert("Selecciona una mascota");
        return;
    }

    mascotaJugador = buscarMokepon(seleccionado.id);
    spanMascotaJugador.innerHTML = mascotaJugador.nombre;

    sectionSeleccionarMascota.style.display = "none";
    sectionVerMapa.style.display = "flex";

    mostrarAtaques(mascotaJugador.ataques);
    iniciarMapa();
}

// ============================================================
//  Selección de ataques
// ============================================================
function mostrarAtaques(ataques) {
    contenedorAtaques.innerHTML = "";
    ataques.forEach((ataque, index) => {
        contenedorAtaques.innerHTML += `
            <button data-index="${index}" class="boton-de-ataque BAtaque">${ataque.emoji}</button>
        `;
    });
    secuenciaAtaque();
}

function secuenciaAtaque() {
    const botones = document.querySelectorAll(".BAtaque");
    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            const index = Number(boton.dataset.index);
            ataquesJugador.push(mascotaJugador.ataques[index].tipo);
            boton.style.background = "#45474B";
            boton.disabled = true;
            iniciarPelea();
        });
    });
}

// ============================================================
//  Enemigo
// ============================================================
function seleccionarMascotaEnemigo() {
    const indice = aleatorio(0, mokepones.length - 1);
    mascotaEnemigo = mokepones[indice];
    spanMascotaEnemigo.innerHTML = mascotaEnemigo.nombre;
    generarAtaquesEnemigo();
}

// BUG CORREGIDO: el enemigo genera sus 5 ataques leyendo el TIPO real
// de un ataque elegido al azar de su repertorio (antes usaba índices mágicos).
function generarAtaquesEnemigo() {
    ataquesEnemigo = [];
    for (let i = 0; i < TOTAL_ATAQUES; i++) {
        const indice = aleatorio(0, mascotaEnemigo.ataques.length - 1);
        ataquesEnemigo.push(mascotaEnemigo.ataques[indice].tipo);
    }
}

// ============================================================
//  Combate
// ============================================================
function iniciarPelea() {
    if (ataquesJugador.length === TOTAL_ATAQUES) {
        combate();
    }
}

function combate() {
    for (let i = 0; i < TOTAL_ATAQUES; i++) {
        const jugador = ataquesJugador[i];
        const enemigo = ataquesEnemigo[i];

        if (jugador === enemigo) {
            crearMensaje("EMPATE", jugador, enemigo);
        } else if (REGLAS[jugador] === enemigo) {
            crearMensaje("GANASTE", jugador, enemigo);
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else {
            crearMensaje("PERDISTE", jugador, enemigo);
            victoriasEnemigo++;
            spanVidasEnemigo.innerHTML = victoriasEnemigo;
        }
    }
    revisarVidas();
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate!!");
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("¡Felicitaciones! ¡Ganaste! :)");
    } else {
        crearMensajeFinal("Oh no, perdiste :(");
    }
}

function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    sectionMensajes.innerHTML = resultado;

    const pJugador = document.createElement("p");
    const pEnemigo = document.createElement("p");
    pJugador.innerHTML = ataqueJugador;
    pEnemigo.innerHTML = ataqueEnemigo;
    ataquesDelJugador.appendChild(pJugador);
    ataquesDelEnemigo.appendChild(pEnemigo);
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal;
    sectionReiniciar.style.display = "block";

    // Deshabilita los botones de ataque restantes
    document.querySelectorAll(".BAtaque").forEach((boton) => {
        boton.disabled = true;
    });
}

function reiniciarJuego() {
    location.reload();
}

// ============================================================
//  Mapa (canvas)
// ============================================================
function iniciarMapa() {
    mapa.width = MAPA_ANCHO;
    mapa.height = MAPA_ALTO;

    // Enemigos posicionados en el mapa (copias independientes)
    mokeponesEnemigos = [
        new Mokepon("Hipodoge", "", 5, "./assets/hipodoge.png", 80, 120),
        new Mokepon("Capipepo", "", 5, "./assets/capipepo.png", 150, 95),
        new Mokepon("Ratigueya", "", 5, "./assets/ratigueya.png", 200, 190),
    ];

    intervalo = setInterval(pintarCanvas, 50);
    window.addEventListener("keydown", sePresionoUnaTecla);
    window.addEventListener("keyup", detenerMovimiento);
}

function pintarCanvas() {
    mascotaJugador.x += mascotaJugador.velocidadX;
    mascotaJugador.y += mascotaJugador.velocidadY;

    // Límites del mapa
    mascotaJugador.x = Math.max(0, Math.min(mascotaJugador.x, mapa.width - mascotaJugador.ancho));
    mascotaJugador.y = Math.max(0, Math.min(mascotaJugador.y, mapa.height - mascotaJugador.alto));

    lienzo.clearRect(0, 0, mapa.width, mapa.height);
    lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);

    mascotaJugador.pintarMokepon();
    mokeponesEnemigos.forEach((enemigo) => enemigo.pintarMokepon());

    if (mascotaJugador.velocidadX !== 0 || mascotaJugador.velocidadY !== 0) {
        mokeponesEnemigos.forEach((enemigo) => revisarColision(enemigo));
    }
}

function moverDerecha() { mascotaJugador.velocidadX = VELOCIDAD; }
function moverIzquierda() { mascotaJugador.velocidadX = -VELOCIDAD; }
function moverAbajo() { mascotaJugador.velocidadY = VELOCIDAD; }
function moverArriba() { mascotaJugador.velocidadY = -VELOCIDAD; }

function detenerMovimiento() {
    if (!mascotaJugador) return;
    mascotaJugador.velocidadX = 0;
    mascotaJugador.velocidadY = 0;
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp": moverArriba(); break;
        case "ArrowDown": moverAbajo(); break;
        case "ArrowLeft": moverIzquierda(); break;
        case "ArrowRight": moverDerecha(); break;
        default: break;
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaMascota = mascotaJugador.y;
    const abajoMascota = mascotaJugador.y + mascotaJugador.alto;
    const derechaMascota = mascotaJugador.x + mascotaJugador.ancho;
    const izquierdaMascota = mascotaJugador.x;

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return;
    }

    // Hay colisión: pasa a la pantalla de combate
    detenerMovimiento();
    clearInterval(intervalo);
    window.removeEventListener("keydown", sePresionoUnaTecla);
    window.removeEventListener("keyup", detenerMovimiento);

    sectionVerMapa.style.display = "none";
    sectionSeleccionarAtaque.style.display = "flex";
    seleccionarMascotaEnemigo();
}

// ---------- Arranque ----------
window.addEventListener("load", iniciarJuego);

// ---------- Exponer funciones para los onmousedown del HTML ----------
window.moverArriba = moverArriba;
window.moverAbajo = moverAbajo;
window.moverIzquierda = moverIzquierda;
window.moverDerecha = moverDerecha;
window.detenerMovimiento = detenerMovimiento;
