// // const letras = [
// //   'A','A','A','A','A','A','A','A','A','A',
// //   'E','E','E','E','E','E','E','E','E',
// //   'O','O','O','O','O','O','O',
// //   'S','S','S','S','S','S',
// //   'N','N','N','N','N',
// //   'R','R','R','R','R',
// //   'I','I','I','I','I',
// //   'L','L','L','L',
// //   'D','D','D','D',
// //   'C','C','C',
// //   'T','T','T',
// //   'U','U','U',
// //   'M','M','M',
// //   'P','P','P',
// //   'B','B',
// //   'G','G',
// //   'V','V',
// //   'Y','Y',
// //   'Qu',
// //   'H',
// //   'F',
// //   'Z',
// //   'J',
// //   'Ñ',
// //   'X',
// //   'K',
// //   'W'
// // ];

// // Frecuencia de aparición de letras en español según Wikipedia https://es.wikipedia.org/wiki/Frecuencia_de_aparici%C3%B3n_de_letras
// const letrasFrecuencia = [
//   { letra: 'E', frecuencia: 13.68 },
//   { letra: 'A', frecuencia: 12.53 },
//   { letra: 'O', frecuencia: 8.68 },
//   { letra: 'S', frecuencia: 7.98 },
//   { letra: 'R', frecuencia: 6.87 },
//   { letra: 'N', frecuencia: 6.71 },
//   { letra: 'I', frecuencia: 6.25 },
//   { letra: 'D', frecuencia: 5.86 },
//   { letra: 'L', frecuencia: 4.97 },
//   { letra: 'C', frecuencia: 4.68 },
//   { letra: 'T', frecuencia: 4.63 },
//   { letra: 'U', frecuencia: 3.93 },
//   { letra: 'M', frecuencia: 3.15 },
//   { letra: 'P', frecuencia: 2.51 },
//   { letra: 'B', frecuencia: 1.42 },
//   { letra: 'G', frecuencia: 1.01 },
//   { letra: 'V', frecuencia: 0.90 },
//   { letra: 'Y', frecuencia: 0.90 },
//   { letra: 'Q', frecuencia: 0.88 },
//   { letra: 'H', frecuencia: 0.70 },
//   { letra: 'F', frecuencia: 0.69 },
//   { letra: 'Z', frecuencia: 0.52 },
//   { letra: 'J', frecuencia: 0.44 },
//   { letra: 'Ñ', frecuencia: 0.31 },
//   { letra: 'X', frecuencia: 0.22 },
//   { letra: 'K', frecuencia: 0.02 },
//   { letra: 'W', frecuencia: 0.01 }
// ];

// let letrasPonderadas = [];

// letrasFrecuencia.forEach(item => {
//   const repeticiones = Math.round(item.frecuencia * 100);
//   for (let i = 0; i < repeticiones; i++) {
//     letrasPonderadas.push(item.letra);
//   }
// });

let palabrasValidas = [];

fetch('palabras.json')
  .then(res => res.json())
  .then(data => {
    palabrasValidas = data;
  });

let palabraActual = [];
let letrasSeleccionadas = [];
let filasActual = 4;
let columnasActual = 4;


function manejarSeleccion(div, index) {
    const fila = Math.floor(index / columnasActual);
    // console.log("fila: ", fila)
    
    const col = index % columnasActual;
    // console.log("col: ", col)
  
    // Si ya fue seleccionada, y es la ultima en la lista, confirmar palabra
    if (
        letrasSeleccionadas.length > 0 &&
        index === letrasSeleccionadas[letrasSeleccionadas.length - 1].index
      ) {
        confirmarPalabra();
        return; 
      }
      
  
    // Si no es la primera letra, validar adyacencia
    if (letrasSeleccionadas.length > 0) {
      const anterior = letrasSeleccionadas[letrasSeleccionadas.length - 1];
      const filaAnt = Math.floor(anterior.index / columnasActual);
      const colAnt = anterior.index % columnasActual;
  
      const esAdyacente =
        Math.abs(fila - filaAnt) <= 1 && Math.abs(col - colAnt) <= 1;
  
      if (!esAdyacente) {
        // No adyacente → reiniciar
        reiniciarPalabra();
        return;
      }
    }
  
    // Añadir la letra
    div.classList.add("seleccionada");
    palabraActual.push(div.textContent);
    letrasSeleccionadas.push({ div, index });

    document.getElementById("palabraActual").textContent = palabraActual.join('');

  }
  
  function confirmarPalabra() {
    if (palabraActual.length < 2) return;
  
    const palabra = palabraActual.join("");
    console.log("Palabra creada:", palabra);
    
    const validezDiv = document.getElementById("validez");

    if(palabrasValidas.includes(palabra.toLowerCase()) ){
        validezDiv.textContent = "La palabra es válida";
    } else {
        validezDiv.textContent = "La palabra no es válida";
    }
  
    // Reset
    reiniciarPalabra();
  }

  function actualizarPalabraEnPantalla() {
    const palabraDiv = document.getElementById("palabraActual");
    palabraDiv.textContent = palabraActual.join('');
  }

  function reiniciarPalabra() {
    letrasSeleccionadas.forEach(({ div }) => div.classList.remove("seleccionada"));
    palabraActual = [];
    letrasSeleccionadas = [];
  }
  
  

let minutos = 2;
let intervalo = null;

function ajustarMinutos(cambio) {
    minutos = Math.max(1, minutos + cambio);
    document.getElementById("minutos").textContent = minutos;
}

function iniciarTemporizador() {
    clearInterval(intervalo);

    // Desactivar botones
    document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent === "+" || btn.textContent === "-") {
        btn.disabled = true;
    }
    });
    document.getElementById("iniciarBtn").disabled = true;

    const totalSegundos = minutos * 60;
    let tiempoRestante = totalSegundos;
    const reloj = document.getElementById("reloj");

    actualizarReloj(tiempoRestante);
    intervalo = setInterval(() => {
    tiempoRestante--;
    if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        reloj.textContent = "¡Tiempo!";
        document.getElementById("alarma").play();

        // Rehabilitar botones
    document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent === "+" || btn.textContent === "-") {
        btn.disabled = false;
    }
    });
    } else {
        actualizarReloj(tiempoRestante);
    }
    }, 1000);
}

function actualizarReloj(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    document.getElementById("reloj").textContent =
    `${m}:${s.toString().padStart(2, "0")}`;
}

// function obtenerLetraAleatoria() {
//   return letrasPonderadas[Math.floor(Math.random() * letrasPonderadas.length)];
// }

function generarTablero(filas = 4, columnas = 4) {
    // Reiniciar el temporizador si hay uno activo
    clearInterval(intervalo);
    intervalo = null;

    filasActual = filas;
    columnasActual = columnas;


    // Rehabilitar el botón "Iniciar temporizador"
    document.getElementById("iniciarBtn").disabled = false;

    // Rehabilitar los botones de ajuste de tiempo
    document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent === "+" || btn.textContent === "-") {
        btn.disabled = false;
    }
    });

const totalLetras = filas * columnas;
const numVocales = Math.round(totalLetras * 0.4);
const numComunes = Math.round(totalLetras * 0.5);
const numRaras = totalLetras - numVocales - numComunes;

const vocales = ['A','E','I','O','U'];
const comunes = ['S','N','R','L','D','C','T','M','P','B','G'];
const raras = ['Z','J','Ñ','X','K','W','H','F','V','Y','Qu'];

function elegirAleatorias(arr, cantidad) {
    const seleccionadas = [];
    for (let i = 0; i < cantidad; i++) {
    const letra = arr[Math.floor(Math.random() * arr.length)];
    seleccionadas.push(letra);
    }
    return seleccionadas;
}

const letrasSeleccionadas = [
    ...elegirAleatorias(vocales, numVocales),
    ...elegirAleatorias(comunes, numComunes),
    ...elegirAleatorias(raras, numRaras)
];

// Mezclar las letras
for (let i = letrasSeleccionadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letrasSeleccionadas[i], letrasSeleccionadas[j]] = [letrasSeleccionadas[j], letrasSeleccionadas[i]];
}

    // Generar tablero
    const tablero = document.getElementById("tablero");
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 60px)`;
    tablero.style.gridTemplateRows = `repeat(${filas}, 60px)`;
    tablero.innerHTML = "";

    for (let i = 0; i < totalLetras; i++) {
        const div = document.createElement("div");
        div.className = "letra";
        const rotacion = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
        div.style.transform = `rotate(${rotacion}deg)`;
        div.textContent = letrasSeleccionadas[i];
        div.addEventListener("click", () => manejarSeleccion(div, i));

        tablero.appendChild(div);
    }


    document.getElementById("reloj").textContent = '';
}

// Generar uno inicial
generarTablero();