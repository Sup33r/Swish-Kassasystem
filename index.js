// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const swishQr = require('swish-qr');
const settings = require('./settings.json');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Ny klient anslöts');

    socket.on('sendAmount', (amount,ordernum) => {
        swishQr({
            amount: amount,
            lock: ['amount', 'number', 'message'],
            message: 'MüsliMix Beställning #'+ordernum,
            number: settings.swishNumber
        }).then(qrCode => {
            io.emit('displayAmount', { amount: amount, qrCode: qrCode });
        }).catch(err => {
            console.error(err); // Handle errors
        });
    });

    socket.on('disconnect', () => {
        console.log('Klient frånkopplades');
    });
});


server.listen(3000, () => {
    console.log('Lyssar på port 3000');
});
