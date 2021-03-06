var socket = io();
var user;






//display backgorund image
document.getElementById("canvas").style.background = "url('images/canvas2.jpg')";

//save canvas button
function saveCanvas() {
    var canvas = document.getElementById("canvas");
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-image.png";
    link.href = image;
    link.click();
}





//intro login screen
function introScreen() {
    $('.grey-out').fadeIn(500);
    $('.user').fadeIn(500);
    $('.user').submit(function(){
        event.preventDefault();
        user = $('#username').val().trim();
        if (user == '') {
            return false
        };

        var index = users.indexOf(user);
        if (index > -1) {
            alert(user + ' name already exists');
            return false
        };
        
        socket.emit('join', user);
        $('.grey-out').fadeOut(300);
        $('.user').fadeOut(300);
        $('input.guess-input').focus();
    });
};

var context;
var canvas;
var click = false;

//clear screen
var clearScreen = function() {
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
};

//function for handling players guess
var guesser = function() {
    clearScreen();
    click = false;
    console.log('draw status: ' + click);
    $('.draw').hide();
    $('#guesses').empty();
    console.log('You are a guesser');
    $('#guess').show();
    $('.guess-input').focus();

    $('#guess').on('submit', function() {
        event.preventDefault();
        var guess = $('.guess-input').val();

        if (guess == '') {
            return false
        };

        console.log(user + "'s guess was : " + guess);
        socket.emit('guessword', {username: user, guessword: guess});
        $('.guess-input').val('');
    });
};

//guess word
var guessword = function(data){
    $('#guesses').text(data.username + "'s guess: " + data.guessword);
    if (click == true && data.guessword == $('span.word').text() ) {
        console.log('guesser: ' + data.username + ' draw-word: ' + $('span.word').text());
        socket.emit('correct answer', {username: data.username, guessword: data.guessword});
        socket.emit('swap rooms', {from: user, to: data.username});
        click = false;
    }
};

//retreive word
var wordToDraw = function(word) {
    $('span.word').text(word);
    console.log('Your word to draw is: ' + word);
};


//display players names
var users = [];
var userlist = function(names) {
    users = names;
    var html = '<p>' + 'Players' + '</p>';
    for (var i = 0; i < names.length; i++) {
        html += '<li>'  + names[i] + '</li>';
    };
    $('ul').html(html);
};
 
//new drawer
var newDrawer = function() {
    clearScreen();
    $('#guesses').empty();
};

//player answers correctly
var correctAnswer = function(data) {
    $('#guesses').html('<p>' + data.username + ' guessed correctly!' + '</p>');
};

//rest for new game 
var reset = function(name) {
    clearScreen();
    console.log("clearscreen is called here")
    $('#guesses').empty();
    console.log('New drawer: ' + name);
    //correctAnswer();
    $('#guesses').html('<p>' + name + ' is the new drawer' +'</p>');


};
var color;

// mouse draw function
var draw = function(obj) {
    context.fillStyle = obj.color;
    context.beginPath();
    context.arc(obj.position.x, obj.position.y,
                    5, 0, 2 * Math.PI);
    context.fill();
};


//function handling mouse operations
var drawerMouse = function() {
    clearScreen();
    click = true;

    console.log('draw status: ' + click);
    $('#guess').hide();
    $('#guesses').empty();
    $('.draw').show();

    var drawing;
    var obj = {};

    //color picked
    $('.draw-buttons').on('click', 'button', function(){
        obj.color = $(this).attr('value');

        console.log(obj.color);

        //clear screen update to black
        if (obj.color === '0') {
 
            socket.emit('clear screen', user);
            context.fillStyle = 'black';
            return;
        };
    });

    console.log('You are the drawer');

    $('.users').on('dblclick', 'li', function() {
        if (click == true) {
            var target = $(this).text();
            socket.emit('swap rooms', {from: user, to: target});
        };
    });

    canvas.on('mousedown', function(event) { 
        drawing = true;   
    });
    canvas.on('mouseup', function(event) {
        drawing = false;
    });

    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        obj.position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        
        if (drawing == true && click == true) {
            draw(obj);
            socket.emit('draw', obj);
        };
    });

};



//loads all functions
$(document).ready(function() {
    canvas = $('#canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    introScreen();
    socket.on('userlist', userlist);
    socket.on('guesser', guesser);
    socket.on('guessword', guessword);
    socket.on('draw', draw);
    socket.on('draw word', wordToDraw);
    socket.on('drawer', drawerMouse);
    socket.on('new drawer', newDrawer);
    socket.on('correct answer', correctAnswer);
    socket.on('reset', reset);
    socket.on('clear screen', clearScreen);

});