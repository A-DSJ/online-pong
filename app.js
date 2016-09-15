//Initialisation du server
var app = require('express')();
var	server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var openSockets = new Array();
var players = new Array();

server.listen(8082);

// ROUTAGE

app.get('/', function handler(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/onlinePong.js', function(req, res){
	res.sendFile(__dirname + '/onlinePong.js')
})

//Socket general
io.sockets.on('connect', function(socket){

	var id = makeId();
	socket.emit('welcome', 
		{message:"you are welcome", room_id:id});

	players[id] = 0;

	//Socket "room" (une partie de pong)
	openSockets[id] = io.of('/'+id)
		.on('connection', function(socket){

			players[id] = players[id] + 1;

			socket.emit('playerNumber', {player_id:players[id]});

			socket.on('update', function(X, Y, playerId){

				console.log(X + " " + Y + " " + playerId);

				socket.broadcast.emit('positionChange', X, Y, playerId);
			});
		});
});

function makeId(){
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	for (var i = 0; i < 10; i++) {
		id += possible.charAt(Math.floor(Math.random() 
			* possible.length));
	}

	return id;
}

//node app.js
// localhost:8081

//Error: listen EADDRINUSE :::8081

//https://github.com/MathieuNls/online-pong