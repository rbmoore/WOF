var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(3000);

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {});

server.listen(3001, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

var host = null;
var board = null;
var players = [];

// WebSocket server
wsServer.on('request', function(request) {
	var connection = request.accept(null, request.origin);

	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			console.log('MESSAGE RECEIVED: ' + message.utf8Data);

			var json = JSON.parse(message.utf8Data);

			if (json.type === 'ID') {
				if (json.value === 'HOST') {
					host = connection;
				} else if (json.value === 'BOARD') {
					board = connection;
				}
			}

			if (json.type === 'INTRO' ||
				json.type === 'INTROSTOP' ||
				json.type === 'CLEARPLAYERS' ||
				json.type === 'ADDPLAYER' ||
				json.type === 'NEWPUZZLE' ||
				json.type === 'SPIN' ||
				json.type === 'GUESSLETTER' ||
				json.type === 'SETPLAYER' ||
				json.type === 'NEXTPLAYER' ||
				json.type === 'SOLVEPUZZLE') {
				board.sendUTF(message.utf8Data);
			}
		}
	});

	connection.on('close', function(connection) {
		console.log('CONNECTION CLOSE');
	});
});
