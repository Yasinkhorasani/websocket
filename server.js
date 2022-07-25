'use strict';

// Module
const colors = require('colors');

// VARIABLEN
const players = {};

// Express
const express = require('express');
const expressServer = express();
expressServer.use(express.static('public'));

// http
const http = require('http');
const httpServer = http.Server(expressServer);

// Websocket
const socketIO = require('socket.io');
const io = socketIO(httpServer);

// Socket-Eventlisteners
io.on('connect', socket => {
    players[socket.id] = new Player();
    // console.log(`Verbindung hergestellt. ID: ${colors.yellow(socket.id)}`);

    socket.on('updateServer', movement => {
        const p = players[socket.id];
        p.x += movement.x * p.speed;
        p.y += movement.y * p.speed;
    })

    socket.on('disconnect', () => delete players[socket.id]);
})

// Klassen
class Player {
    constructor() {
        this.x = Math.random();
        this.y = Math.random();
        this.color = createColor();
        this.speed = .005;
    }
}

// FUNKTIONEN
// Zufällige Zahl erzeugen
const createNumber = (min, max) => ~~(Math.random() * (max - min + 1) + min);

// Zufällige Farbe erzeugen
const createColor = () => `hsl(${createNumber(0, 360)},100%,50%)`;

// Alle Positionsdaten an Client senden
const updateClient = () => {
    io.emit('updateClient', players);
}

const init = () => {
    httpServer.listen(80, err => {
        if (err) console.log(err)
        else {
            console.log('Server läuft');
            setInterval(updateClient, 30);
        }
    });
}

// INIT
init();
