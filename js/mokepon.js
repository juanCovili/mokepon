const sectionReiniciar = document.getElementById('reiniciar')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const botonMascotaJugador = document.getElementById('btn-mascota')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVidasJugador=document.getElementById('vidas-jugador')
const spanVidasEnemigo=document.getElementById('vidas-enemigo')
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const botonReiniciar = document.getElementById('btn-reiniciar')

const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let mokepones = []
let ataqueEnemigo = []
let vidasEnemigo = 3
let vidasJugador = 3
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego 
let botonAgua 
let botonTierra
let botones = []
let ataqueJugador = []
let indexAtaqueEnemigo
let indexAtaqueJugador
let victoriasJugador = 0
let victoriasEnemigo = 0

let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/mokemap.png'
let mascotaJugadorObjeto

class Mokepon{
    constructor(nombre,foto,vida,fotoMapa,x=10,y=10){
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.x = x
        this.y = y
        this.ancho = 80
        this.alto= 80
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarMokepon(){
        lienzo.drawImage(
        this.mapaFoto,  
        this.x,
        this.y,
        this.ancho,
        this.alto
        )
    }
}

let hipodoge = new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',5,'./assets/hipodoge.png')
let capipepo = new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',5,'./assets/capipepo.png')
let ratigueya = new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',5,'./assets/ratigueya.png')

let hipodogeEnemigo = new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',5,'./assets/hipodoge.png',80,120)
let capipepoEnemigo = new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',5,'./assets/capipepo.png',150,95)
let ratigueyaEnemigo = new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',5,'./assets/ratigueya.png',200,190)

hipodoge.ataques.push(
    {nombre: '💦', id:'btn-agua'},
    {nombre: '💦', id:'btn-agua'},
    {nombre: '💦', id:'btn-agua'},
    {nombre: '🔥', id:'btn-fuego'},
    {nombre: '🌱', id:'btn-tierra'},
)

capipepo.ataques.push(
    {nombre: '🌱', id:'btn-tierra'},
    {nombre: '🌱', id:'btn-tierra'},
    {nombre: '🌱', id:'btn-tierra'},
    {nombre: '🔥', id:'btn-fuego'},
    {nombre: '💦', id:'btn-agua'},
)

ratigueya.ataques.push(
    {nombre: '🔥', id:'btn-fuego'},
    {nombre: '🔥', id:'btn-fuego'},
    {nombre: '🔥', id:'btn-fuego'},
    {nombre: '💦', id:'btn-agua'},
    {nombre: '🌱', id:'btn-tierra'},
)

mokepones.push(hipodoge,capipepo,ratigueya)

function iniciarJuego(){
    sectionVerMapa.style.display='none'
    sectionReiniciar.style.display= 'none'
    sectionSeleccionarAtaque.style.display = 'none'
    mokepones.forEach((mokepon)=>{
        opcionDeMokepones = `
            <input type="radio" name="mascota" id=${mokepon.nombre}>
            <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones
        inputHipodoge = document.getElementById('Hipodoge')
        inputCapipepo = document.getElementById('Capipepo')
        inputRatigueya = document.getElementById('Ratigueya')
    })
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click',reiniciarJuego)
}

function seleccionarMascotaJugador(){
    sectionSeleccionarMascota.style.display = 'none'
    //sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display='flex'
    //let imagenDeCapipepo = new Image()
    //imagenDeCapipepo.src = capipepo.foto
    //lienzo.fillRect(5,15,20,40)
    /////
    
    if (inputHipodoge.checked){
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked){
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked){
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert('Selecciona una mascota')
    }
    extraerAtaques(mascotaJugador)
    iniciarMapa()
    
}

function extraerAtaques(mascotaJugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque)=>{
        ataquesMokepon = `
            <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })
    botonFuego = document.getElementById('btn-fuego')
    botonAgua = document.getElementById('btn-agua')
    botonTierra = document.getElementById('btn-tierra')
    botones = document.querySelectorAll('.BAtaque')
    // console.log(botones)
    // botonFuego.addEventListener('click', ataqueFuego)
    // botonAgua.addEventListener('click',ataqueAgua)
    // botonTierra.addEventListener('click',ataqueTierra)
}

function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener('click',(e)=>{
            if (e.target.textContent==='🔥'){
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#45474B'
                boton.disabled = true
            } else if (e.target.textContent === '💦'){
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#45474B'
                boton.disabled = true
            } else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#45474B'
                boton.disabled = true
            }
            ataqueAleatorioEnemigo()
        })
    })
}

function seleccionarMascotaEnemigo(){
    let mascotaAleatoria = aleatorio(0,mokepones.length-1)
    spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatoria].nombre
    ataquesMokeponEnemigo = mokepones[mascotaAleatoria].ataques
    secuenciaAtaque()
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length-1)
    if (ataqueAleatorio == 1) {
        ataqueEnemigo.push('FUEGO')
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push('AGUA')
    } else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    //combate()
    iniciarPelea()
}

function iniciarPelea(){
    if(ataqueJugador.length === 5){
        combate()
    }
}

function indexAmbosOponentes(jugador,enemigo){
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){
    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index]===ataqueEnemigo[index]){
            indexAmbosOponentes(index,index)
            crearMensaje("EMPATE")
        } else if (ataqueJugador[index]=== 'FUEGO' && ataqueEnemigo[index]==='TIERRA'){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML=victoriasJugador
        } else if (ataqueJugador[index]==='AGUA'&& ataqueEnemigo[index]==='FUEGO'){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML=victoriasJugador
        } else if (ataqueJugador[index]==='TIERRA' && ataqueEnemigo[index]==='AGUA'){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML=victoriasJugador
        } else {
            indexAmbosOponentes(index,index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }
    revisarVidas()
    // if (ataqueEnemigo == ataqueJugador){
    //     crearMensaje("EMPATE")
    // } else if (ataqueJugador == 'Fuego' && ataqueEnemigo == 'Tierra'){
    //     crearMensaje("GANASTE")
    //     vidasEnemigo--
    //     spanVidasEnemigo.innerHTML = vidasEnemigo
    // } else if (ataqueJugador == 'Agua' && ataqueEnemigo == 'Fuego'){
    //     crearMensaje("GANASTE")
    //     vidasEnemigo--
    //     spanVidasEnemigo.innerHTML = vidasEnemigo
    // } else if (ataqueJugador == 'Tierra' && ataqueEnemigo == 'Agua'){
    //     crearMensaje("GANASTE")
    //     vidasEnemigo--
    //     spanVidasEnemigo.innerHTML = vidasEnemigo
    // } else {
    //     crearMensaje("PERDISTE")
    //     vidasJugador--
    //     spanVidasJugador.innerHTML = vidasJugador
    // }
    //revisarVidas()
}

function revisarVidas(){
    if (victoriasJugador===victoriasEnemigo){
        crearMensajeFinal("Esto fue un empate!!")
    } else if (victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("Felicitaciones!!!! Ganaste!!! :)")
    } else{
        crearMensajeFinal("Oh No Perdiste :(")
    }
}

function crearMensajeFinal(resultadoFinal){
    let parrafo = document.createElement('p')
    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display= 'block'
}

function crearMensaje(resultado){
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')
    sectionMensajes.innerHTML=resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo
    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function reiniciarJuego(){
    location.reload()
}

function aleatorio(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

function pintarCanvas(){
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0,0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()
    hipodogeEnemigo.pintarMokepon()
    capipepoEnemigo.pintarMokepon()
    ratigueyaEnemigo.pintarMokepon()
    if(mascotaJugadorObjeto.velocidadX !==0 || mascotaJugadorObjeto.velocidadY !==0){
        revisarColision(hipodogeEnemigo)
        revisarColision(capipepoEnemigo)
        revisarColision(ratigueyaEnemigo)
    }
}

function moverDerecha(){
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda(){
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo(){
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba(){
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento(){
    
   mascotaJugadorObjeto.velocidadX = 0
   mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        default:
            break;
    } 
}

function iniciarMapa(){
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    mapa.width=700 //320
    mapa.height=500 //240
    intervalo = setInterval(pintarCanvas,50)
    window.addEventListener('keydown',sePresionoUnaTecla)
    window.addEventListener('keyup',detenerMovimiento)
}

function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x
    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return
    } 
    detenerMovimiento()
    sectionSeleccionarAtaque.style.display='flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    //alert("Hay colision" + enemigo.nombre)
}

window.addEventListener('load', iniciarJuego)