function draw(ctx, s, dx, dy) {
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
}

function drawFig(ctx, s) {
  var dx = (s.x*36)/5;
  var dy = (s.y*(-36))/5;
  var h = 720 - (s.height*36)/5;
  var w = (s.width*36)/5;
  console.log("dx: " + dx + " dy: " + dy);
  var f = s.faces[0];
  /*dx = dx - w/2;
  dy = dy - h;*/
  f = converteTo(f);
  draw(ctx, f, dx, dy);
}

function converteTo(f) {
  var vertex = [];
  for(let i = 0; i < f.vertex.length; i++) {
    let x = f.vertex[i].x;
    let y = f.vertex[i].y;
    let xi = (x*36)/5;
    let yi = (y*(-36))/5 + 720;
    let v = [xi, yi]
    /*console.log("(" + v[0] + ", " + v[1] + ")");*/
    vertex.push(v);
  }
  console.log(vertex[0]);
  var f = new Face(vertex);
  console.log(f.vertex[0]);
  return f;
}

function getMinMax(s) {
  var f = s.faces[0];
  var minx = 999;
  var maxx = 0;
  var miny = 999;
  var maxy = 0;
  for(let i = 0; i < f.vertex.length; i++) {
    let x = f.vertex[i].x;
    let y = f.vertex[i].y;
    if(x > maxx) {
      maxx = x;
    }
    if (x < minx) {
      minx = x;
    }
    if(y > maxy) {
      maxy = x;
    }
    if (y < miny) {
      miny = y;
    }
  }
  var height = maxy = miny;
  var width = maxx - minx;
  console.log("h: " + height + " w: " + width);
  return [height, width];
}

function multiply(m, t) {
  vertex = [];
  console.log("(" + t[0][0] + ", " + t[1][0] + ")");
  console.log("(" + t[0][1] + ", " + t[1][1] + ")");
  /*for(let i = 0; i < m.length; i++) {
    x = m[i].x;
    y = m[i].y;
    console.log("(" + x + ", " + y + ")");
  }*/
  for(let i = 0; i < m.length; i++) {
    xi = (m[i].x*t[0][0]) + (m[i].y*t[1][0]);
    yi = (m[i].x*t[0][1]) + (m[i].y*t[1][1]);
    console.log("(" + xi + ", " + yi + ")");
    vertex.push(new Vertice(xi, yi));
  }
  return vertex;
}

/*function draw(ctx, s) {
  ctx.beginPath();
  var dx = s.x;
  var dy = s.y;
  for(let i = 0; i < s.edges.length; i++) {
    let v0 = s.vertex[s.edges[i].a];
    let v1 = s.vertex[s.edges[i].b];
    ctx.moveTo(v0.x + dx, v0.y + dy);
    ctx.lineTo(v1.x + dx, v1.y + dy);
    let t = "e" + i + " (" + v0.x + ", " + v0.y + ")" + "; " + "(" + v1.x + ", " + v1.y + ")"
    console.log(t);
    ctx.stroke();
  }
}

function drawFill(ctx, s) {
  ctx.beginPath();
  var dx = s.x;
  var dy = s.y;
  var v0 = s.vertex[s.edges[0].a];
  var v1 = s.vertex[s.edges[0].b];
  ctx.moveTo(v0.x + dx, v0.y + dy);
  ctx.lineTo(v1.x +dx, v1.y + dy);
  for(let i = 1; i < s.edges.length; i++) {
    v0 = s.vertex[s.edges[i].a];
    v1 = s.vertex[s.edges[i].b];
    ctx.lineTo(v0.x + dx, v0.y + dy);
    ctx.lineTo(v1.x +dx, v1.y + dy);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}*/

class Vertice {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get vector() {
    return [this.x, this.y];
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get vector() {
    return [this.x, this.y];
  }
}

class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

class Face {
  constructor(vertex) {
    this.vertex = [];
    vertex.forEach((e) => this.vertex.push(new Vertice(e[0], e[1])));
  }
}

class Shape {
  constructor(name, faces, position) {
    this.name = name;
    this.x = position.x;
    this.y = position.y;
    this.faces = []
    faces.forEach((f) => this.faces.push(new Face(f)));
    var hw = getMinMax(this);
    this.height = hw[0];
    this.width = hw[1];
  }
  displace(x, y) {
    this.x += x;
    this.y += y;
  }
  transform(t) {
    this.faces[0].vertex = multiply(this.faces[0].vertex, t);
    /*var hw = getMinMax(this);
    this.height = hw[0];
    this.width = hw[1];*/
  }
}

/*class Shape {
  find(b) {
    for (let i = 0; i < this.vertex.length; i++) {
      if (this.vertex[i].x == b[0] && this.vertex[i].y == b[1]) {
        return i;
      }
    }
    return -1;
  }
  constructor(name, edges, position) {
    this.name = name;
    this.vertex = [];
    this.edges = [];
    this.x = position.x;
    this.y = position.y;
    for(let i = 0; i < edges.length; i++) {
      var a = [0, 0];
      for(let j = 0; j < 2; j++) {
        a[j] = this.find(edges[i][j]);
        if (a[j] == -1) {
          let v = new Vertice(edges[i][j][0], edges[i][j][1])
          a[j] = this.vertex.push(v) - 1;
        }
      }
      var e = new Edge(a[0], a[1]);
      this.edges.push(e);
    }
  }
}*/
