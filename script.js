const canvas = document.getElementById("quadrato");
const ctx = canvas.getContext("2d"); //creo un elemento canvas


//IMPORTANTE METTERLE ALL'INIZIO
canvas.width = 1000;
canvas.height = 600;

//creo l'oggetto perchè mi serve per il movimento di essa
const navicella = {
    id: "navicella",
    x: (canvas.width - 100) / 2,
    y: canvas.height - 30,
    larghezza: 100,
    altezza: 15,
    velocita: 8,
    colore: "white"
};



const righe = 8;
const colonne = 15;

const larghezza = 60;
const altezza = 20;
const spazio = 5;

const margineX = 15; //(canvas.width - (colonne * larghezza + (colonne - 1) * spazio)) / 2
const margineY = 30;

const colori = [
    "red",          // B
    "orange",       // R
    "yellow",       // E
    "green",        // A
    "lightskyblue", // K
    "blue",         // O
    "plum",         // U
    "purple"        // T
];

function disegnaNavicella() {
    ctx.fillStyle = navicella.colore;

    ctx.beginPath(); //serve per dire che stai disegnando una nuova forma, con fillrect non serve.
    ctx.roundRect(
        navicella.x,
        navicella.y,
        navicella.larghezza,
        navicella.altezza,
        5
    );
    ctx.fill();
}

const listaMattoncini = [];
function creaMattoncini() {
    for (let r = 0; r < righe; r++) {
        for (let c = 0; c < colonne; c++) {
            listaMattoncini.push({
                x: margineX + c * (larghezza + spazio),
                y: margineY + r * (altezza + spazio),
                larghezza: larghezza,
                altezza: altezza,
                colore: colori[r],
                visibile: true
            });
        }
    }
}


function disegnaMattoncini() {
    for (const m of listaMattoncini) {
        if (m.visibile) {
            ctx.fillStyle = m.colore;
            ctx.fillRect(m.x, m.y, m.larghezza, m.altezza);
        }
    }
}

function disegna() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // mi pulisce tutto il canvas
    disegnaMattoncini();
    disegnaNavicella();
}

//INIZIO GIOCO:
//senò crea all'infinito i mattoncini
creaMattoncini();
disegna();

canvas.addEventListener("mousemove", function (e) {
    // con questa funzione capiamo dove si trova il canvas e da quello prendiamo la distanza da togliere alla scala;

    const rect = canvas.getBoundingClientRect();

    const scalaX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scalaX;

    // centro la navicella sul mouse
    navicella.x = mouseX - navicella.larghezza / 2;

    // la blocco dentro i bordi in 10 px del canvas dal blocco almeno è più ordinato e chiaro 
    if (navicella.x < 10) {
        navicella.x = 10;
    }
    if (navicella.x + navicella.larghezza > canvas.width - 10) {
        navicella.x = canvas.width - navicella.larghezza - 10;
    }

    disegna();
    

});