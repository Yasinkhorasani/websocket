'use strict';

// Express
const express = require('express');
const expressServer = express();
expressServer.use(express.static('public'));

// Http
const http = require('http');
const httpServer = http.Server(expressServer);

// Socket
const socketIo = require('socket.io');
const io = socketIo(httpServer);

// VARIABLEN
const sockets = {};


// Eventlistener, um auf die Verbindung zu reagieren
io.on('connect', socket => {

    // Der Socket wird im globalen Objekt abgelegt
    // Der Key ist die Socket-ID
    sockets[socket.id] = socket;

    socket.on('msgFromClient', data => {
        //console.log(data);
        data.socketID = socket.id;
        io.emit('msgFromServer', data);
    })

    socket.on('PMFromClient', data => {
        sockets[data.recipientID].emit('PMFromServer', data);
    })
})


// Server starten
httpServer.listen(80, err => console.log(err || 'Server läuft'));