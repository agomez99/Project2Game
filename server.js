var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];

var words = [
	"school", "plant", "sun", "state", "eye", "city", "tree","farm","sea", 
	"night","life","rock","fire", "problem", "airplane", "top", "king",
    "space", "whale", "unicorn", "narwhal", "furniture","pigeon"
];
//random word from array.
function newWord() {
	wordcount = Math.floor(Math.random() * (words.length));
	return words[wordcount];
};

var wordcount;
io.on('connection', function (socket) 
{
	io.emit('userlist', users);

	socket.on('join', function(name) {
		socket.username = name;

		// automatically joins with username
		socket.join(name);
		console.log(socket.username + ' has joined the room. USER ID: ' + socket.id);

		// username to array
		users.push(socket.username);

		// if the player is first to join  with no players
		if (users.length == 1 || typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {

			// place player into 'drawer' room
			socket.join('drawer');

			// server to user
			io.in(socket.username).emit('drawer', socket.username);
			console.log(socket.username + ' is a drawer');

			// gets random word
			io.in(socket.username).emit('draw word', newWord());
				//console.log(socket.username + "'s + newWord());
		} 
		else {

			// additional players
			socket.join('guesser');

			// server  to  the user
			io.in(socket.username).emit('guesser', socket.username);
			console.log(socket.username + ' is a guesser');
		}
	
		// update all clients with the list of users
		io.emit('userlist', users);
		
	});

	// submit drawing on canvas to other clients
	socket.on('draw', function(obj) {
		socket.broadcast.emit('draw', obj);
	});

	// submit each client's guesses to all clients
	socket.on('guessword', function(data) {
		io.emit('guessword', { username: data.username, guessword: data.guessword})
		console.log('guessword event triggered on server from: ' + data.username + ' with word: ' + data.guessword);
	});

	socket.on('disconnect', function() {
		for (var i = 0; i < users.length; i++) {

			// remove user from users list
			if (users[i] == socket.username) {
				users.splice(i, 1);
			};
		};
		console.log(socket.username + ' has disconnected.');

		//update list of players
		io.emit('userlist', users);

		//no connections
		if ( typeof io.sockets.adapter.rooms['drawer'] === "undefined") {
			
			// generate random number based on length of users list
			var x = Math.floor(Math.random() * (users.length));
			console.log(users[x]);
			io.in(users[x]).emit('new drawer', users[x]);
		};
	});

	//new drawer actions
	socket.on('new drawer', function(name) {

		// remove user 
		socket.leave('guesser');

		// place player into room
		socket.join('drawer');
		console.log('new drawer emit: ' + name);

		// drawer to player
		socket.emit('drawer', name);
		
		// send a random word to the drawer
		io.in('drawer').emit('draw word', newWord());
	
	});

	socket.on('swap rooms', function(data) {

		// drawer leaves 
		socket.leave('drawer');
		socket.join('guesser');

		// player becomes drawer
		socket.emit('guesser', socket.username);

		// submit 'drawer' 
		io.in(data.to).emit('drawer', data.to);

		// new random word
		io.in(data.to).emit('draw word', newWord());
		io.emit('reset', data.to);

	});

	//when player guesses correct
	socket.on('correct answer', function(data) {
		io.emit('correct answer', data);
		console.log(data.username + ' guessed correctly with ' + data.guessword);
	});

	//clear screen
	socket.on('clear screen', function(name) {
		io.emit('clear screen', name);
	});

})

server.listen(process.env.PORT || 8000, function() {
	console.log('Server started at http://localhost:8000');
});