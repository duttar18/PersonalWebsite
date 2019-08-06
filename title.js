var canvas = document.querySelector('canvas#title');
canvas.width = window.innerWidth;
canvas.height = '600';

var ctx = canvas.getContext('2d');


var distance = function(x1,x2,y1,y2){
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
};

var coffset = $("canvas#title").offset();

var points = [];
var strings = [];
var Point = function(x,y,p){
  // location
  this.x=x;
  this.y=y;

  // velocity
  this.vx=0;  
  this.vy=0;

  // acceleration
  this.ax=0;
  this.ay=0;

  // pegged to the wall
  this.p=p;
};
var String = function(a,b,k,l,e){
  //points
  this.a = a;
  this.b = b;

  //spring constant;
  this.k = -1*k;
  if(points[this.a].p || points[this.b].p){
    this.k*=2;
  }

  //length
  this.l = l;

  //how much till rip
  this.e = e;
};


//making pegs at top
for(var i =0; i<10; i++){
  points.push(new Point(100+50*i,100,true));
}

//rest of net
for(var i =0; i<9; i++){
  for(var j =0; j<10; j++){
    points.push(new Point(100+50*j,150+i*50,false));
    strings.push(new String(i*10+j,i*10+10+j,0.01,50,100));
  }
}
for(var i =0; i<9; i++){
  for(var j =0; j<9; j++){
    strings.push(new String(i*10+10+j,i*10+10+j+1,0.01,50,100));
  }
}

var held = [];
var drag = false;

function mouseDown(event){ 
  for(var i =0; i<points.length; i++){
    if(distance(event.clientX-coffset.left,points[i].x,event.clientY-coffset.top,points[i].y)<10){
      held.push(i);
    }
  }
  drag = true;
};
function mouseMove(event){
  for(var i=0; i<held.length;i++){
    points[held[i]].x = event.clientX-coffset.left;
    points[held[i]].y = event.clientY-coffset.top;
  }
}
function mouseUp(){
  drag = false;
  held = [];
};
function init() {
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);

}
init();

function update(progress,e) {
    var d,i;
    for(i =0; i<strings.length; i++){
      var d = distance(points[strings[i].a].x,points[strings[i].b].x,points[strings[i].a].y,points[strings[i].b].y);
      var pull = (d-strings[i].l)*strings[i].k;
      points[strings[i].a].ax+= pull*(points[strings[i].a].x-points[strings[i].b].x)/d;
      points[strings[i].a].ay+= pull*(points[strings[i].a].y-points[strings[i].b].y)/d;

      points[strings[i].b].ax-= pull*(points[strings[i].a].x-points[strings[i].b].x)/d;
      points[strings[i].b].ay-= pull*(points[strings[i].a].y-points[strings[i].b].y)/d;
    }
    for(var i=0; i<points.length; i++){
      if(points[i].p){
        points[i].vx=0;
        points[i].vy=0;
      }
      else{
        points[i].vx+=points[i].ax;
        points[i].vy+=points[i].ay+0.02;
      }
    }
    for(var i=0; i<points.length; i++){
      if(!points[i].p && distance(0,points[i].vx,0,points[i].vy)>0.05){
        points[i].x+=points[i].vx;
        points[i].y+=points[i].vy;
      }
      points[i].vx*=0.9;
      points[i].vy*=0.9;
      points[i].ax=0;
      points[i].ay=0;
    }
};
function draw() {
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.beginPath();
    for(var i = 0; i<strings.length; i++){
      ctx.moveTo(points[strings[i].a].x, points[strings[i].a].y);
      ctx.lineTo(points[strings[i].b].x, points[strings[i].b].y);
    }
    ctx.stroke();

    ctx.fillStyle= "blue";
    ctx.fill();
    for(var i=0; i<points.length; i++){
      ctx.beginPath();
      ctx.arc(points[i].x,points[i].y,5,0,2*Math.PI);
      ctx.stroke();
    }

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