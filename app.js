const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();
const port = 8000;

var http = require('http');
var socket_io = require('socket.io');
var server = http.Server(app);
var io = socket_io(server);


// setup for body-parser module
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// express session middleware setup
app.use(session({
    secret: 'W$q4=25*8%v-}UV',
    resave: true,
    saveUninitialized: true
}));

// passport middleware setup ( it is mandatory to put it after session middleware setup)
app.use(passport.initialize());
app.use(passport.session());

// setup for loading static resources from 'public' directory
app.use(express.static(path.join(__dirname,'public')));

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));

require('./routes/index')(app, passport);







//socket
io.on('connection', function (socket) {

	// submit drawing on canvas to other clients
	socket.on('draw', function(obj) {
		socket.broadcast.emit('draw', obj);
	});

});






server.listen(process.env.PORT || 8080, function() {
	console.log('Server started at http://localhost:8000/login');
});


app.listen(port, () => console.log(`Server is running on port ${port}`));


