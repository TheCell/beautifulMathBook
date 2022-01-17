// source by https://openprocessing.org/sketch/1413816/
let gfx;
const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  },
  
}
const options = {
  background: '#000000',
  color1: '#d5ebdf',
  color2: '#1eb5da',
  possibilities: [0, 1 ,2, 3],
  tileSize: 40,
  borderSize: 3,
  maxRotation: Math.PI,
  autiodraw: false,
  redraw: function () {
    gfx.reset();
    // randomSeed(Math.random() * 100000);
    randomSeed(100000);
    gfx.strokeWeight(options.borderSize);
    gfx.stroke(0);
    gfx.background(options.background);
    let s = options.tileSize;
    const directions = [0, PI, -PI/2, PI/2]; // [down, up, right, left]
    let j = 0, i0 = [1, 3, 2, 0, 2];

    for (let y = -s/2; y < startupParameters.ySize; y += s) {
      let x = (j%5==4)?-s:0, i = i0[j%5];
      while (x < startupParameters.xSize+s) {
        pentagon(x, y, s, directions[i%4]);
        x += s*((i%4==2)?2:1);
        i++
      }
      j++;
    }
  },
  save: function () {
    saveCanvas('Genuary22_17_' + Date.now(), 'png');
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
folder1.addColor(options, 'background');
folder1.addColor(options, 'color1');
folder1.addColor(options, 'color2');
folder1.add(options, 'tileSize', 1);
folder1.add(options, 'autiodraw', false, true);
folder1.add(options, 'borderSize', 1).step(1);
folder1.add(options, 'maxRotation', 0, Math.PI * 2);
folder1.open();
gui.add(options, 'redraw');
gui.add(options, 'save');

function setup() {
  createCanvas(startupParameters.xSize, startupParameters.ySize);
  gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
  gfx.background(options.background);
  options.redraw();
}

function draw() {
  if (options.autiodraw) {
    options.redraw();
  }
  image(gfx, 0, 0);
}

function pentagon(x, y, s, dir) {
  gfx.push();
  gfx.translate(x+s/2, y+s/2);
  gfx.rotate(dir);
  
  let tile = random(options.possibilities);
  if (tile == 3) {
    gfx.fill(options.color2);
  } else {
    gfx.fill(options.color1);
  }
  
  gfx.noStroke();
  gfx.beginShape();
  gfx.vertex(-s*1.01/2, -s*1.01/2);
  gfx.vertex(s*1.01/2, -s*1.01/2);
  gfx.vertex(s*1.01/2, s*1.01/2);
  gfx.vertex(0.01, s*1.01);
  gfx.vertex(-s*1.01/2, s*1.01/2);
  gfx.endShape(CLOSE);
  
  if (tile == 3) {
    gfx.fill(options.color1);
  } else {
    gfx.fill(options.color2);
  }
  
  const d = s*sqrt(2)/2;
  gfx.stroke(options.background);
  if (tile == 0) {
    gfx.arc(0, s, d, d, 5*PI/4, 7*PI/4);
    gfx.line(-s/2, s/2-d/2, s/2, s/2-d/2);
    gfx.noStroke();
    gfx.rect(-s/2, -s/2, s, s-d/2);
    gfx.stroke(options.background);
    gfx.fill(options.color1);
    gfx.arc(-s/2, -s/2, d, d, 0, PI/2);
    gfx.arc(s/2, -s/2, d, d, PI/2, PI);
  } else if (tile == 1) {
    gfx.arc(0, s, d, d, 5*PI/4, 7*PI/4);
    gfx.arc(-s/2, 0, s-d, s-d, -PI/2, PI/2);
    gfx.arc(s/2, -s/2, 2*s-d, 2*s-d, PI/2, PI);
    gfx.fill(options.color1);
    gfx.arc(s/2, -s/2, d, d, PI/2, PI);
  } else if (tile == 2) {
    gfx.arc(0, s, d, d, 5*PI/4, 7*PI/4);
    gfx.arc(s/2, 0, s-d, s-d, PI/2, 3*PI/2);
    gfx.arc(-s/2, -s/2, 2*s-d, 2*s-d, 0, PI/2);
    gfx.fill(options.color1);
    gfx.arc(-s/2, -s/2, d, d, 0, PI/2);
  } else {
    gfx.arc(-s/2, -s/2, d, d, 0, PI/2);
    gfx.arc(s/2, -s/2, d, d, PI/2, PI);
    gfx.arc(-s/2, s/2, d, d, -PI/2, PI/4);
    gfx.arc(s/2, s/2, d, d, 3*PI/4, 3*PI/2);
  }
  
  gfx.pop();
}