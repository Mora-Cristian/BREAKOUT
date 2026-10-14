const canvas = document.getElementById("quadrato");
const ctx = canvas.getContext("2d"); //creo un elemento canvas


//IMPORTANTE METTERLE ALL'INIZIO
canvas.width = 1000;
canvas.height = 700;

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
const colonne = 15  ;

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

function disegnaMattoncini() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // mi pulisce tutto il canvas

    for (let r = 0; r < righe; r++) {   
        for (let c = 0; c < colonne; c++) {
            const x = margineX + c * (larghezza + spazio); 
            const y = margineY + r * (altezza + spazio);

            ctx.fillStyle = colori[r];
            ctx.fillRect(x, y, larghezza, altezza); //riempie il triangolo
        }
    }
    disegnaNavicella();
}



disegnaMattoncini();