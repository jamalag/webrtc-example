
const express = require('express');

var io = require('socket.io');
({
    path:'/webrtc'
})

const app = express();
const port = 8008;

// app.get('/', (req, res)=> res.send('Hello'));

app.use(express.static(__dirname+'/build'))
app.get('/', (req, res, next) =>{
    res.sendFile(__dirname+'/build/index.html');
})

const server = app.listen(port, ()=> console.log('example app'));

io.listen(server);

const peers = io.of('/webrtcPeer');

let connectedPeers = new Map()

peers.on('connection', socket => {
    console.log(socket.id);
})