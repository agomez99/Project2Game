
// 'use strict';

// Canvas Javascript
// var users = [];

// (function() {
//   var socket = io();
//   var canvas = document.getElementsByClassName('canvas')[0];
//   var colors = document.getElementsByClassName('color');
//   var context = canvas.getContext('2d');

//   var current = {
//     color: 'black'
//   };
//   var drawing = false;


//   canvas.addEventListener('mousedown', onMouseDown, false);
//   canvas.addEventListener('mouseup', onMouseUp, false);
//   canvas.addEventListener('mouseout', onMouseUp, false);
//   canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
//   Touch support for mobile devices
//   canvas.addEventListener('touchstart', onMouseDown, false);
//   canvas.addEventListener('touchend', onMouseUp, false);
//   canvas.addEventListener('touchcancel', onMouseUp, false);
//   canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
	
//   for (var i = 0; i < colors.length; i++){
//     colors[i].addEventListener('click', onColorUpdate, false);
  
//   }

//   socket.on('drawing', onDrawingEvent);

//  window.addEventListener('resize', onResize, false);
//   onResize();


//   function drawLine(x0, y0, x1, y1, color, emit){

//     context.beginPath();
//     context.moveTo(x0, y0);
//     context.lineTo(x1, y1);
//     context.strokeStyle = color;
 
//     context.lineWidth = 6;
    
//     context.stroke();
//     context.closePath();
//     context.scale( 1, 1 )

//     if (!emit) { return; }
//     var w = canvas.width;
//     var h = canvas.height;

//     socket.emit('drawing', {
//       x0: x0 / w,
//       y0: y0 / h,
//       x1: x1 / w,
//       y1: y1 / h,
//       color: color
//     });
//   }

//   function onMouseDown(e){
//     drawing = true;
//     current.x = e.clientX||e.touches[0].clientX;
//     current.y = e.clientY||e.touches[0].clientY;
//   }

//   function onMouseUp(e){
//     if (!drawing) { return; }
//     drawing = false;
//     drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
//   }

//   function onMouseMove(e){
//     if (!drawing) { return; }
//     drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
//     current.x = e.clientX||e.touches[0].clientX;
//     current.y = e.clientY||e.touches[0].clientY;
//   }

//   function onColorUpdate(e){
//     current.color = e.target.className.split(' ')[1];
//   }


//   limit the number of events per second
//   function throttle(callback, delay) {
//     var previousCall = new Date().getTime();
//     return function() {
//       var time = new Date().getTime();

//       if ((time - previousCall) >= delay) {
//         previousCall = time;
//         callback.apply(null, arguments);
//       }
//     };
//   }

//   function onDrawingEvent(data){
//     var w = canvas.width;
//     var h = canvas.height;
//     drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
//   }

//   document.getElementById('clear').addEventListener('click', function() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//   }, false);

// function onResize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }
// })(); 

// Keep everything in anonymous function, called on window load.
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