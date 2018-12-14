class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  get norm() {
    var d = this.x*this.x + this.y*this.y + this.z*this.z;
    return Math.sqrt(d);
  }
  get normalized() {
    var n = this.norm;
    return new Vector(this.x / n, this.y / n, this.z / n);
  }
}

function drawFill(ctx, s, dx, dy) {
  ctx.fillStyle = "rgba(0, 255, 128, 0.45)";
  ctx.strokeStyle = "#007D00";
  ctx.beginPath();
  var v = s.vertex[0];
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

function drawShape(ctx, s) {
  s.faces.forEach((f) => drawFace(ctx, projectOb(f), s.x, s.y));
}

function drawSolid(ctx, s) {
  var d = new Vector(0, 0, 1);
  faces = bfCulling(s.faces, d);
  faces.forEach((f) => drawFaceF(ctx, projectOb(f), s.x, s.y));
}

function projectOb(f) {
  var cos120 = -0.5;
  var sin120 = 0.86602540378;
  var vertex = [];
  console.log("Projection of lx" + cos120 + ", ly" + sin120);
  for(let i = 0; i < f.vertex.length; i++) {
    let x = f.vertex[i].x;
    let y = f.vertex[i].y;
    let z = f.vertex[i].z;
    let xl = x + z*cos120;
    let yl = y + z*sin120;
    let v = [xl, yl, 0];
    vertex.push(v);
  }
  console.log("v0 : (" + vertex[0][0] + ", " + vertex[0][1] + ", " + vertex[0][2] + ")");
  var f = new Face(vertex);
  return f;
}

function drawFace(ctx, f, x, y) {
  var dx = (x*36)/5;
  var dy = (y*(-36))/5;
  f = converteTo(f);
  draw(ctx, f, dx, dy);
}

function drawFaceF(ctx, f, x, y) {
  var dx = (x*36)/5;
  var dy = (y*(-36))/5;
  f = converteTo(f);
  drawFill(ctx, f, dx, dy);
}

function crossProduct(e1, e2) {
  var i = e1.y*e2.z - e1.z*e2.y;
  var j = e1.z*e2.x - e1.x*e2.z;
  var k =  e1.x*e2.y - e1.y*e2.x;
  return new Vector(i, j, k);
}

function dotProduct(e1, e2) {
  return e1.x*e2.x + e1.y*e2.y + e1.z*e2.z;
}

function getNormal(f) {
  //var s = f.vertex.length;
  var v0 = f.vertex[0];
  var v1 = f.vertex[1];
  var v2 = f.vertex[2];
  var e1 = new Vector(v1.x - v0.x, v1.y - v0.y, v1.z - v0.z);
  var e2 = new Vector(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
  return crossProduct(e1, e2);
}

function bfCulling(faces, d) {
  var f = [];
  var normal;
  for(let i = 0; i < faces.length; i++) {
    console.log("Norma de Culling 1");
    normal = getNormal(faces[i]);
    let theta = dotProduct(d, normal);
    if (theta >= 0) {
      f.push(faces[i]);
    } else {
      console.log("Culled: ");
      console.log(faces[i]);
    }
  }
  return f;
}
