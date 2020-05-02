var user;
 var socket = io();
function usernameAsk() {
  $(".grey-out").fadeIn(500);
  $(".user").fadeIn(500);
  $(".user").submit(function () {
    event.preventDefault();
    user = $("#username").val().trim();

    if (user == "") {
      return false;
    }
    $("#users").append(user);
    //console.log(user);
    // if (index > -1) {
    //     alert(user + ' already exists');
    //     return false
    // };

    $(".grey-out").fadeOut(300);
    $(".user").fadeOut(300);
  });
}


function clearCanvas() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  console.log("clearing called");
}


//function for perosn guessing
var guesser = function(){
}

//function for displaying word
var guessWord = function(data){

}

//display list of users playing
var users = [];
var userList = function(names){
users = names;
}

//new player drawer
var newDrawer =  function(){

}

//suplay when corrct answer is given
var correctAnswer = function(data){

}

//reset page with new drawer
var reset  = function(name){

}



var word = new Array();
word[0] = "dinasour";
word[1] = "automobile";
word[2] = "cat";
word[3] = "dog";
word[4] = "word";
word[5] = "letter";
word[6] = "number";
word[7] = "person";
word[8] = "pen";
word[9] = "police";
word[10] = "people";
word[11] = "sound";
word[12] = "water";
word[13] = "breakfast";
word[14] = "place";
word[15] = "man";
word[16] = "army";
word[17] = "woman";
word[18] = "oven";
word[19] = "boy";
word[20] = "girl";
word[21] = "ghost";
word[22] = "fire hydrant";
word[23] = "world";
word[24] = "month";
word[25] = "newspaper";
word[26] = "sentence";
word[27] = "line";
word[28] = "telvision";
var intWordIndex = 0;

// //Generate new word
function newWord() {
  intWordIndex = word[Math.floor(Math.random() * word.length)];
  document.getElementById("myWord").innerHTML = intWordIndex;
 clearCanvas();
}
// retrive from  JSON library alternative
//$.getJSON("../../library/nounslist.json", function (data) {
//   var arrItems = [];      // THE ARRAY TO STORE JSON ITEMS.
//   $.each(data, function (index, value) {
//       arrItems.push(value);    // PUSH THE VALUES INSIDE THE ARRAY.
// });
// });

function text() {
  var inputVal = document.getElementById("myInput").value;
  document.getElementById("playerInput").value = inputVal;
  document.getElementById("myInput").value = "";
}

$("#resetCanvas").click(function () {
 clearCanvas();
});




function download(){
  document.getElementById("downloader").download = "image.png";
  document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

var saveCanvas = function(){
  var canvas = document.getElementById("canvas");
  var d = canvas.toDataURL("image/png");
  var w=window.open('about:blank','image from canvas');
  w.document.write("<img src='"+d+"' alt='from canvas'/>");


}
window.addEventListener("DOMContentLoaded", function () {
  var mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: false,
  };


  // get canvas element and create context
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var width = window.innerWidth;
  var height = window.innerHeight;
  var socket = io.connect();

  //image background 
  document.getElementById("canvas").style.background = "url('images/art.jpg')";

  // register mouse event handlers
  canvas.onmousedown = function (e) {
    mouse.click = true;
  };
  canvas.onmouseup = function (e) {
    mouse.click = false;
  };

  canvas.onmousemove = function (e) {
    //offsety and offsetx worked to corect position
    mouse.pos.x = e.offsetX / width;
    mouse.pos.y = e.offsetY / height;
    mouse.move = true;
  };

  // draw line received from server
  socket.on("draw_line", function (data) {
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });


  // main loop, running every 25ms
  function mainLoop() {
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      // send line to to the server
      socket.emit("draw_line", { line: [mouse.pos, mouse.pos_prev] });
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }
  mainLoop();
});

$(document).ready(function () {
    clearCanvas();

   //usernameAsk();
  //saveCanvas();
  newWord();
  socket.on('clear screen', clearCanvas);



});
