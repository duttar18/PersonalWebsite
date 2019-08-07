var canvas = document.querySelector('canvas#title');
canvas.width = window.innerWidth;
canvas.height = '600';

var ctx = canvas.getContext('2d');


var distance = function(x1,x2,y1,y2){
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
};
var triarea = function(x1,y1,x2,y2,x3,y3){
  return Math.abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2;
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
var Str = function(a,b,k,l,e){
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

var ascii =[
  "0000000000000000000000000000",
  "0@00@00@@@00@000@000@@@@@0@0",
  "0@00@00@0000@000@000@000@0@0",
  "0@@@@00@@000@000@000@000@0@0",
  "0@00@00@0000@000@000@000@000",
  "0@00@00@@@00@@@0@@@0@@@@@0@0",
  "0000000000000000000000000000"
];

var w = 500;
var h = 200;
var i;
for(var j = 0; j<(ascii.length+1); j+=1){
  for( i = 0; i <(ascii[0].length+1);i+=1){
    if(j==0){
      points.push(new Point(i*w/(ascii[0].length+1)+canvas.width/2-w/2,j*h/(ascii.length+1)+canvas.height/2-h/2,true));
    }
    else{
      points.push(new Point(i*w/(ascii[0].length+1)+canvas.width/2-w/2,j*h/(ascii.length+1)+canvas.height/2-h/2,false));
    }
  }
}

var kk = 0.1;

for(var i = (ascii[0].length+1); i<points.length;i++){
  strings.push(new Str(i,i-(ascii[0].length+1),kk,h/((ascii.length+1)-1),100));
}
for(var i = (ascii[0].length+1)+1; i<points.length;i++){
  if(i%(ascii[0].length+1)!=0)  
    strings.push(new Str(i,i-1,kk,h/((ascii.length+1)-1),100));
  
}

var held = [];
var drag = false;
function mouseDown(event){ 
  for(var i =0; i<points.length; i++){
    if(distance(event.clientX-coffset.left,points[i].x,event.clientY-coffset.top,points[i].y)<15){
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



var shade = function(x1,y1,x2,y2,x3,y3,i,j){
  var s = triarea(x1,y1,x2,y2,x3,y3)*2/(w/(ascii[0].length+1)*h/(ascii.length+1));
  
  if(ascii[j].charAt(i)=="0"){
    return 'rgb(' + 255*s + ','+ 255*s +','+ 255*s +')';
  }
  else{
    return 'rgb(' + 255*s + ','+ 0 +','+ 0 +')';
  }
  
};


function update(progress,e) {
    var d,i;
    for(i =0; i<strings.length; i++){
      var d = distance(points[strings[i].a].x,points[strings[i].b].x,points[strings[i].a].y,points[strings[i].b].y);
      if((d-strings[i].l) <0){
        continue;
      }
      var pull = (d-strings[i].l)*strings[i].k;
      points[strings[i].a].ax+= pull*(points[strings[i].a].x-points[strings[i].b].x)/d;
      points[strings[i].a].ay+= pull*(points[strings[i].a].y-points[strings[i].b].y)/d;

      points[strings[i].b].ax-= pull*(points[strings[i].a].x-points[strings[i].b].x)/d;
      points[strings[i].b].ay-= pull*(points[strings[i].a].y-points[strings[i].b].y)/d;
    }
    for(var i=0; i<points.length; i++){
      points[i].vx+=points[i].ax;
      points[i].vy+=points[i].ay+0.1;
      var lim = 80;
      var sp = distance(0,points[i].vx,0,points[i].vy);
      if(sp>lim){
        points[i].vx*=lim/sp;
        points[i].vy*=lim/sp
      }
    }
    for(var i=0; i<held.length; i++){
      points[held[i]].vx=0;
      points[held[i]].vy=0;
    }
    for(var i=0; i<points.length; i++){
      if(!points[i].p){
        points[i].x+=points[i].vx;
        points[i].y+=points[i].vy;
      }
      points[i].vx*=0.95;
      points[i].vy*=0.95;
      points[i].ax=0;
      points[i].ay=0;
    }
};
function draw() {
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
/*
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.beginPath();
    for(var i = 0; i<strings.length; i++){
      ctx.moveTo(points[strings[i].a].x, points[strings[i].a].y);
      ctx.lineTo(points[strings[i].b].x, points[strings[i].b].y);
    }
    ctx.stroke();

    for(var i=0; i<points.length; i++){
      ctx.beginPath();
      ctx.arc(points[i].x,points[i].y,5,0,2*Math.PI);
      ctx.stroke();
    }*/

    for(var j = 0; j<(ascii.length+1)-1; j+=1){
      for( i = 0; i <(ascii[0].length+1)-1;i+=1){
        var x1=points[i+j*(ascii[0].length+1)].x;
        var y1=points[i+j*(ascii[0].length+1)].y;
        var x2=points[i+1+j*(ascii[0].length+1)].x;
        var y2=points[i+1+j*(ascii[0].length+1)].y;
        var x3=points[i+(j+1)*(ascii[0].length+1)].x;
        var y3=points[i+(j+1)*(ascii[0].length+1)].y;
        var x4=points[i+1+(j+1)*(ascii[0].length+1)].x;
        var y4=points[i+1+(j+1)*(ascii[0].length+1)].y;

        if((i+j)%2==0){
          ctx.fillStyle=shade(x1,y1,x2,y2,x3,y3,i,j);
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x3,y3);
          ctx.fill();
          
          ctx.fillStyle=shade(x4,y4,x2,y2,x3,y3,i,j);
          ctx.beginPath();
          ctx.moveTo(x4,y4);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x3,y3);
          ctx.fill();
        }
        else{
          ctx.fillStyle=shade(x1,y1,x4,y4,x3,y3,i,j);
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x4,y4);
          ctx.lineTo(x3,y3);
          ctx.fill();
          
          ctx.fillStyle=shade(x1,y1,x4,y4,x2,y2,i,j);
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x4,y4);
          ctx.lineTo(x2,y2);
          ctx.fill();
        }

      }
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