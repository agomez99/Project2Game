

// Keep everything in anonymous function, called on window load

var word = new Array()
word[0] = "dinasour"
word[1] = "automobile"
word[2] = "cat"
word[3] = "dog"
word[4] = "word"
word[5] = "letter"
word[6] = "number"
word[7] = "person"
word[8] = "pen"
word[9] = "police"
word[10] = "people"
word[11] = "sound"
word[12] = "water"
word[13] = "breakfast"
word[14] = "place"
word[15] = "man"
word[16] = "men"
word[17] = "woman"
word[18] = "women"
word[19] = "boy"
word[20] = "girl"
word[21] = "serial killer"
word[22] = "Oregon Trail"
word[23] = "week"
word[24] = "month"
word[25] = "name"
word[26] = "sentence"
word[27] = "line"
word[28] = "air"
var intWordIndex = 0;

// //Generate new word
function newWord() {

  //if (intWordIndex == word.length) 
  intWordIndex = word[Math.floor(Math.random()* word.length)];
  //var word = word[Math.floor(Math.random() * word.length)];

  document.getElementById('myWord').innerHTML = intWordIndex;
  //intWordIndex++;
  var canvas= document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0,  canvas.width, canvas.height);

};
// retrive from  JSON librayr alternative
//$.getJSON("../../library/nounslist.json", function (data) {
//   var arrItems = [];      // THE ARRAY TO STORE JSON ITEMS.
//   $.each(data, function (index, value) {
//       arrItems.push(value);    // PUSH THE VALUES INSIDE THE ARRAY.

// });
// });

function text(){
  var inputVal = document.getElementById("myInput").value;
      document.getElementById("playerInput").value = inputVal;
      document.getElementById("myInput").value = "";
    
}





if(window.addEventListener) {
  window.addEventListener('load', function () {
    var canvas, context, tool;
  
    function init () {
      // Find the canvas element.
      canvas = document.getElementById('canvas');
      if (!canvas) {
        alert('Error: I cannot find the canvas element!');
        return;
      }
  
      if (!canvas.getContext) {
        alert('Error: no canvas.getContext!');
        return;
      }
  
      // Get the 2D canvas context.
      context = canvas.getContext('2d');
      if (!context) {
        alert('Error: failed to getContext!');
        return;
      }
  
      // Pencil tool instance.
      tool = new tool_pencil();
  
      // Attach the mousedown, mousemove and mouseup event listeners.
      canvas.addEventListener('mousedown', ev_canvas, false);
      canvas.addEventListener('mousemove', ev_canvas, false);
      canvas.addEventListener('mouseup',   ev_canvas, false);
    }
  
    // This painting tool works like a drawing pencil which tracks the mouse 
    // movements.
    function tool_pencil () {
      var tool = this;
      this.started = false;
  
      // This is called when you start holding down the mouse button.
      // This starts the pencil drawing.
      this.mousedown = function (ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
      };
  
      // This function is called every time you move the mouse. Obviously, it only 
      // draws if the tool.started state is set to true (when you are holding down 
      // the mouse button).
      this.mousemove = function (ev) {
        if (tool.started) {
          context.lineTo(ev._x, ev._y);
          context.stroke();
        }
      };
  
      // This is called when you release the mouse button.
      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
        }
      };
    }
  
    $("#resetCanvas").click(function(){
      var canvas= document.getElementById('canvas');
     var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0,  canvas.width, canvas.height);
    });

    

    // The general-purpose event handler. This function just determines the mouse 
    // position relative to the canvas element.
    function ev_canvas (ev) {
      if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
      }
  
      // Call the event handler of the tool.
      var func = tool[ev.type];
      if (func) {
        func(ev);
      }
    }
  
    init();
  
  }, false); }


  $(document).ready(function() {
    newWord();
});