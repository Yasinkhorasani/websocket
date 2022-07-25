'use strict';

const socket = io.connect();
const elements = {};
const margin = 10;
const border = 1;

// Objekt, das die Richtung des eigenen Spieler enthält
const movement = {
    x: 0,
    y: 0
}

// Spielfiguren zeichnen
const renderPlayers = players => {
    const ctx = elements.spielfeld.getContext('2d');

    // ctx.clearRect(0, 0, elements.spielfeld.width, elements.spielfeld.height);

    // Das Objekt muss zunächst zu einem Array konvertiert werden
    Object.values(players).forEach(player => {
        ctx.beginPath();
        ctx.arc(
            player.x * elements.spielfeld.width,
            player.y * elements.spielfeld.height,
            2,
            0,
            2 * Math.PI,
        );
        ctx.fillStyle = player.color;
        ctx.fill();
    })
}

// Auf einen Statusupdate des Servers reagieren
const socketEventlistener = () => {
    socket.on('updateClient', renderPlayers);
}

// Dom-Elemente heraussuchen
const domMapping = () => {
    elements.spielfeld = document.querySelector('#spielfeld');
}

// Größe und Position des Canvas einstellen
const initCanvas = () => {
    elements.spielfeld.width = window.innerWidth - (margin * 2 + border * 2);
    elements.spielfeld.height = window.innerHeight - (margin * 2 + border * 2);
    elements.spielfeld.style.top = margin + 'px';
    elements.spielfeld.style.left = margin + 'px';
    elements.spielfeld.style.borderWidth = border + 'px';
}

// Tastatursteuerung
const initKeys = () => {

    // Taste drücken
    window.addEventListener('keydown', evt => {
        switch (evt.key) {
            case 'ArrowUp':
                movement.y = -1;
                break;
            case 'ArrowDown':
                movement.y = 1;
                break;
            case 'ArrowLeft':
                movement.x = -1;
                break;
            case 'ArrowRight':
                movement.x = 1;
                break;
            default:
                break;
        }
    })

    // Taste loslassen
    window.addEventListener('keyup', evt => {
        switch (evt.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                movement.y = 0;
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                movement.x = 0;
                break;
            default:
                break;
        }

    })
}

// Bewegungsdaten an den Server senden
const updateServer = () => {
    socket.emit('updateServer', movement);
}

// Initialisierung
const init = () => {
    domMapping();
    initKeys();
    initCanvas();
    socketEventlistener();
    setInterval(updateServer, 30);
}

init();