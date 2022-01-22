// Genuary 2022
// JAN.17 "3 colors."
// By Roni Kaufman
// https://ronikaufman.github.io

let gfx, seed;
let lines = [];
const colorPalettes = [
  { background: '#212121', color1: '#2a9d8f', color2: '#e9c46a', color3: '#e76f51' },
  { background: '#212121', color1: '#e63946', color2: '#f1faee', color3: '#a8dadc' },
  { background: '#ffffff', color1: '#ffc8dd', color2: '#cdb4db', color3: '#a2d2ff' },
  { background: '#000000', color1: '#fca311', color2: '#e5e5e5', color3: '#ffffff' },
  { background: '#540b0e', color1: '#9e2a2b', color2: '#e09f3e', color3: '#fff3b0' }
]

const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}

const options = {
  background: '#212121',
  color1: '#2a9d8f',
  color2: '#e9c46a',
  color3: '#e76f51',
  margin: 25,
  gap: 10,
  linelength: 10,
  minlengthtodraw: 5,
  linethickness: 3,
  linestep: 1,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    gfx.noStroke();
    lines = [];
    loop();
  },
  save: function () {
    saveCanvas('Genuary22_12_seed-' + seed + '_date-' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
let colorController1 = folder1.addColor(options, 'background');
let colorController2 = folder1.addColor(options, 'color1');
let colorController3 = folder1.addColor(options, 'color2');
let colorController4 = folder1.addColor(options, 'color3');
folder1.add(options, 'margin', 0);
folder1.add(options, 'gap', 0);
folder1.add(options, 'linelength', 0);
folder1.add(options, 'minlengthtodraw', 1).step(1);
folder1.add(options, 'linethickness', 1);
folder1.add(options, 'linestep');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  let colorPalette = random(colorPalettes);
  colorController1.setValue(colorPalette.background);
  colorController2.setValue(colorPalette.color1);
  colorController3.setValue(colorPalette.color2);
  colorController4.setValue(colorPalette.color3);
  options.restart();
}

function draw() {
  drawImage();
  image(gfx, 0, 0);
}

function drawImage() {
  let noAddition = true;
  for (let i = 0; i < 100; i++) {
    if (makeLine()) {
      noAddition = false;
    }
  }
  if (noAddition) {
    noLoop();
  }
}

function makeLine() {
  let li = new Line(random(options.margin, width-options.margin), random(options.margin, height-options.margin));
  while (li.move());

  if (li.circles.length > options.minlengthtodraw) {
    lines.push(li);
    li.draw();
    return true;
  }
  
  return false;
}

function Line(x0, y0) {
  this.x = x0;
  this.y = y0;
  this.col = random([options.color1, options.color2, options.color3]);
  this.circles = [createVector(x0, y0)];
  this.d = options.linethickness;

  this.move = function() {
    // get the angle around the middle point
    let theta = atan2(this.y - height / 2, this.x - width / 2);
    let r = options.linestep;
    this.x += r * cos(theta);
    this.y += r * sin(theta);

    if (this.x < options.margin || this.x > width-options.margin || this.y < options.margin || this.y > height-options.margin) {
      return false;
    }
    
    let circ = createVector(this.x, this.y);
    for (let li of lines) {
      for (let c of li.circles) {
        if (circ.dist(c) < options.gap) {
          return false;
        }
      }
    }

    this.circles.push(circ);
    if (this.circles.length > options.linelength) {
      return false;
    }
    return true;
  }

  this.draw = function() {
    gfx.fill(this.col);
    for (let c of this.circles) {
      gfx.circle(c.x, c.y, this.d + random(-1, 1)*0.6);
    }
  }
}