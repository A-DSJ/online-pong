//Initialisation du server
var app = require('express')();
var	server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8082);

// ROUTAGE

app.get('/', function handler(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connect', function(socket){

	socket.emit('welcome', 
		{message:"you are welcome"});
});

//node app.js
// localhost:8081

//Error: listen EADDRINUSE :::8081

//https://github.com/MathieuNls/online-pong