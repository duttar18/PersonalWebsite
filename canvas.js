var titleCanvas = document.querySelector('canvas');
titleCanvas.width = window.innerWidth;
titleCanvas.height = window.innerHeight;

var ctc = titleCanvas.getContext('2d');

var x = 100;
var y = 100;

function update(progress) {
    x++;
    y++;
};

function draw() {
    ctc.fillStyle="blue";
    ctc.fillRect(0,0,canvas.width,canvas.height);
    ctc.fillStyle="red";
    ctc.fillRect(x,y,100,100);
};

function loop(timestamp) {
  var progress = timestamp - lastRender;

  update(progress);
  draw();

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
};
var lastRender = 0;
window.requestAnimationFrame(loop);