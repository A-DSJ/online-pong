//Initialisation du server
var app = require('express')(),
	server = require('http').createServer(app);

server.listen(8082);

// ROUTAGE

app.get('/', function handler(req, res){
	res.sendFile(__dirname + '/index.html');
});

//node app.js
// localhost:8081

//Error: listen EADDRINUSE :::8081