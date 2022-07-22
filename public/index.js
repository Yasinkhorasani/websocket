'use strict';

import dom from './dom.js';

// Die Websocket-Library erzeugt ein globales Objekt namens "io"
// Die Connect-Methode ist asynchron
let socket = io.connect();

const elements = {};

// FUNKTIONEN
const sendMessage = () => {
    // Die emit()-Methode sendet eine Socket-Message an den Server
    socket.emit('msgFromClient', {
        text: elements.inputText.value,
        name: elements.inputName.value
    });
}

// Nachricht darstellen
const renderMsg = data => {
    const container = dom.create({
        classes: ['container'],
        parent: elements.ausgabe
    })

    dom.create({
        type: 'span',
        content: data.name,
        parent: container,
        classes: ['name']
    })

    dom.create({
        type: 'span',
        content: data.text,
        parent: container,
        classes: ['text']
    })

    dom.create({
        type: 'br',
        parent: container
    })

    dom.create({
        type: 'button',
        parent: container,
        content: `PM an ${data.socketID} senden`,
        listeners: {
            click() {
                let msg = prompt(`Nachricht an ${data.name}?`);

                socket.emit('PMFromClient', {
                    recipientID: data.socketID,
                    msg,
                    senderID: socket.id,
                    senderName: elements.inputName.value
                })
            }
        }
    })
}

const renderPM = data => {
    alert(`${data.senderName} schrieb: ${data.msg}`);
}

// Socket-Eventlisteners
socket.on('msgFromServer', renderMsg);

socket.on('PMFromServer', renderPM);


const domMapping = () => {
    elements.inputText = document.querySelector('#inputText');
    elements.inputName = document.querySelector('#inputName');
    elements.ausgabe = document.querySelector('#ausgabe');

    elements.inputText.addEventListener('change', sendMessage);

}

const init = () => {
    domMapping();
}

init();