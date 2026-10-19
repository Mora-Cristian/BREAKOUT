const canvas = document.getElementById("quadrato");
const ctx = canvas.getContext("2d"); //creo un elemento canvas
const points = document.getElementById("points");


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

//velocità della palla
const VELOCITA = 5;
let punteggio = 0;
let blocchiDistrutti = 0;
let velo = VELOCITA;

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

//palla
 const palla = {
    x: navicella.x + navicella.larghezza / 2,
    y: navicella.y - 8,
    raggio: 8,
    dx: VELOCITA,            // velocità orizzontale
    dy: -VELOCITA   ,           // velocità verticale (negativo = verso l'alto)
    colore: "white",
    inMovimento: false
 };

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
};


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

function disegnaPalla() {
    ctx.fillStyle = palla.colore;
    ctx.beginPath();
    ctx.arc(palla.x, palla.y, palla.raggio, 0, Math.PI * 2);
    ctx.fill();
}


function disegna() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // mi pulisce tutto il canvas
    disegnaMattoncini();
    disegnaNavicella();
    disegnaPalla();
}

//movimento palla:
function aggiornaPalla() {
    // se non è partita, segue la navicella
    if (!palla.inMovimento) {
        palla.x = navicella.x + navicella.larghezza / 2;
        palla.y = navicella.y - palla.raggio;
        return;
    }

    palla.x += palla.dx;
    palla.y += palla.dy;

    // rimbalzo sui muri sinistro e destro
    if (palla.x - palla.raggio < 0) {
        palla.x = palla.raggio;
        palla.dx = Math.abs(palla.dx);
    }
    if (palla.x + palla.raggio > canvas.width) {
        palla.x = canvas.width - palla.raggio;
        palla.dx = -Math.abs(palla.dx);
    }

    // rimbalzo sul soffitto
    if (palla.y - palla.raggio < 0) {
        palla.y = palla.raggio;
        palla.dy = Math.abs(palla.dy);
    }

    // rimbalzo sulla navicella
    if (
        palla.dy > 0 &&
        palla.y + palla.raggio >= navicella.y &&
        palla.y + palla.raggio <= navicella.y + navicella.altezza &&
        palla.x >= navicella.x &&
        palla.x <= navicella.x + navicella.larghezza
    ) {
        // punto d'impatto: -1 = bordo sinistro, 0 = centro, 1 = bordo destro
        const centro = navicella.x + navicella.larghezza / 2;
        const impatto = (palla.x - centro) / (navicella.larghezza / 2);

        const angolo = impatto * (Math.PI / 3); // massimo 60° di inclinazione
        palla.dx = velo * Math.sin(angolo);
        palla.dy = -velo * Math.cos(angolo);
    }

    // se cade sotto il canvas, torna sulla navicella
    if (palla.y - palla.raggio > canvas.height) {
        palla.inMovimento = false;
        palla.dx = VELOCITA * Math.SQRT1_2;
        palla.dy = -VELOCITA * Math.SQRT1_2;
    }
}


//collisioni:
function collisioni() {
    for (const m of listaMattoncini) {
        if (!m.visibile) continue; // salto i blocchi già distrutti
         
        if (
            palla.x + palla.raggio > m.x && //la palla non è tutta a destra
            palla.x - palla.raggio < m.x + m.larghezza && //la palla non è tutta a sinistra
            palla.y + palla.raggio > m.y && //la palla non è tutta sopra
            palla.y - palla.raggio < m.y + m.altezza //la palla non è tutta sotto
        ) { 
            m.visibile = false;

            punteggio += 50;
            points.textContent = "Points: " + punteggio;
            blocchiDistrutti++;

            if (blocchiDistrutti % 15 === 0) {
                velo++;

                const modulo = Math.sqrt(palla.dx * palla.dx + palla.dy * palla.dy);
                palla.dx = (palla.dx / modulo) * velo;
                palla.dy = (palla.dy / modulo) * velo;
            }

            // capisco da che lato ho colpito: calcolo quanto la palla è "entrata" in ogni lato
            const dalSinistra = palla.x + palla.raggio - m.x;
            const dalDestra = m.x + m.larghezza - (palla.x - palla.raggio);
            const dalSopra = palla.y + palla.raggio - m.y;
            const dalSotto = m.y + m.altezza - (palla.y - palla.raggio);

            const minimo = Math.min(dalSinistra, dalDestra, dalSopra, dalSotto);

            if (minimo === dalSinistra || minimo === dalDestra) {
                palla.dx = -palla.dx; // colpito di lato
            } else {
                palla.dy = -palla.dy; // colpito sopra o sotto
            }

            break; // un solo mattoncino per frame
        }
    }
}

//PER STARTARE LA PARTITA:
canvas.addEventListener("click", function () {
    palla.inMovimento = true;
});

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        palla.inMovimento = true;
    }
});

//GIOCO IN MOVIMENTO:
function gioco() {
    aggiornaPalla();
    disegna();
    collisioni();
    requestAnimationFrame(gioco);
}

//INIZIO GIOCO:
//creo i mattoncini all'inizio per evitare di crearne all'infinito
creaMattoncini();
gioco();

canvas.addEventListener("mousemove", function (e) {
    // con questa funzione capiamo dove si trova il canvas e da quello prendiamo la distanza da togliere alla scala;
    const rect = canvas.getBoundingClientRect();
    
    //faccio la conversione in base allo spostamento
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
    

});