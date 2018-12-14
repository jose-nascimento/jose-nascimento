//Intensity(a) = (1, 0.5, 0)
//gradient points: 0, length/2
//(1, 0.5, 0)*(255, 255, 255)*A

function getN(v0, v1, v2) {
  var e1 = new Vector(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
  var e2 = new Vector(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
  return crossProduct(e1, e2);
}

class Gradient {
  constructor(f) {
    var src = new Vector(200, 200, 100);
    var color = new Vector(1, 0.5, 0.2);
    var int = new Vector(255, 255, 255);
    var len = f.vertex.length;
    var med = len/2;
    console.log("len: " + len + ", med: " + med);
    var v0a = f.vertex[len - 1];
    var v1a = f.vertex[0];
    var v2a = f.vertex[1];
    console.log("Norma de Gradient 1");
    var na = getN(v0a, v1a, v2a);
    console.log("Norma A: (" + na.x + ", " + na.y + ", " + na.z + ")");
    var v0b = f.vertex[med - 1];
    var v1b = f.vertex[med];
    var v2b = f.vertex[med + 1];
    console.log("Norma de Gradient 2");
    var nb = getN(v0b, v1b, v2b);
    console.log("Norma B: (" + nb.x + ", " + nb.y + ", " + nb.z + ")");
    var la = new Vector(src.x - v1a.x, src.y - v1a.y, src.z - v1a.z);
    var lb = new Vector(src.x - v1b.x, src.y - v1b.y, src.z - v1b.z);
    console.log("A - L: (" + src.x + "-" + v1a.x + ", " + src.y + "-" + v1a.y + ", " + src.z + "-" + v1a.z +")");
    var thetA = dotProduct(na.normalized, la.normalized);
    //console.log("Theta A: " + thetA);
    var thetB = dotProduct(nb.normalized, lb.normalized);
    //console.log("Theta A: " + thetB);
    var grad = new Vector(int.x*color.x, int.y*color.y, int.z*color.z);
    var p1 = new Vector(Math.max(grad.x*thetA, 0), Math.max(grad.y*thetA, 0), Math.max(grad.z*thetA, 0));
    var p2 = new Vector(Math.max(grad.x*thetB, 0), Math.max(grad.y*thetB, 0), Math.max(grad.z*thetB, 0));
    var s1 = (p1.x < 16)? "#0" : "#";
    s1 += Number(parseInt(p1.x , 10)).toString(16) + ((p1.y < 16)? "0" : "");
    s1 += Number(parseInt(p1.y , 10)).toString(16) + ((p1.z < 16)? "0" : "");
    s1 += Number(parseInt(p1.z , 10)).toString(16);
    var s2 = (p2.x < 16)? "#0" : "#";
    s2 += Number(parseInt(p2.x , 10)).toString(16) + ((p2.y < 16)? "0" : "");
    s2 += Number(parseInt(p2.y , 10)).toString(16) + ((p2.z < 16)? "0" : "");
    s2 += Number(parseInt(p2.z , 10)).toString(16);
    //console.log(p1);
    //console.log(p2);
    console.log("C: " + s1 + " " + s2);
    this.start = "" + s1;
    this.stop = "" + s2;
  }
}

function minMaxZ(f) {
  var min = 999;
  var max = 0;
  for(let i = 0; i < f.vertex.length; i++) {
    let z = f.vertex[i].z;
    if(z > max) {
      max = z;
    }
    if (z < min) {
      min = z;
    }
  }
  f.minz = min;
  f.maxz = max;
  var avg = (min + max) / 2;
  f.avgz = avg;
  return new Vector(min, max);
}

function drawGrad(ctx, s, g, dx, dy) {
  var l = s.vertex.length/2;
  var v = s.vertex[0];
  var v2 = s.vertex[l];
  var grd = ctx.createLinearGradient(v.x + dx, v.y + dy, v2.x + dx, v2.y + dy);
  grd.addColorStop(0, g.start);
  grd.addColorStop(1, g.stop);
  ctx.fillStyle = grd;
  ctx.strokeStyle = grd;
  ctx.beginPath();
  console.log("(" + (v.x + dx) + ", " + (v.y + dy) + ")");
  ctx.moveTo(v.x + dx, v.y + dy);
  for(let i = 1; i < s.vertex.length; i++) {
    v = s.vertex[i];
    console.log("(" + (v.x + dx) + ", " + (v.y + dy) + ")");
    ctx.lineTo(v.x + dx, v.y + dy);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function drawFaceG(ctx, f, g, x, y) {
  var dx = (x*36)/5;
  var dy = (y*(-36))/5;
  f = converteTo(f);
  drawGrad(ctx, f, g, dx, dy);
}

function drawShady(ctx, s) {
  //var dx = (s.x*36)/5;
  //var dy = (s.y*(-36))/5;
  var d = new Vector(0, 0, 1);
  s.faces.forEach((f) => console.log(f));
  var faces = bfCulling(s.faces, d);
  faces.forEach((f) => minMaxZ(f));
  faces.sort(function(a, b) {
    if (a.avgz < b.avgz) {
      return -1;
    } else if (a.avgz > b.avgz) {
      return 1;
    } else {
      return 0;
    }
  });
  var grads = [];
  faces.forEach((f) => grads.push(new Gradient(f)));
  for(let i = 0; i < faces.length; i++) {
    drawFaceG(ctx, projectOb(faces[i]), grads[i], s.x, s.y);
  }
}
