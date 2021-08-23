let gfx;
let noiseDrawn = false;

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
  background: '#8C001A',
  foreground: '#FF9000',
  noiseSeed: 1,
  noiseScale: 100,
  linelenght: 5,
  linesegments: 5,
  linecount: 1000,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    noiseDrawn = false;
    noiseSeed(options.noiseSeed);
  },
  save: function () {
    saveCanvas('Perlinnoise-Waves_' + Date.now(), 'png');
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
folder1.addColor(options, 'foreground');
folder1.add(options, 'noiseSeed').step(1).listen().onChange(() => {
  options.restart();
});
folder1.add(options, 'noiseScale').min(1).max(200).step(1).onChange(() => {
  options.restart();
});
folder1.add(options, 'linelenght').min(1).onChange(() => {
  options.restart();
});
folder1.add(options, 'linesegments').min(1).max(100).step(1).onChange(() => {
  options.restart();
});
folder1.add(options, 'linecount').min(1).step(1).onChange(() => {
  options.restart();
});
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  options.noiseSeed = Math.round(Math.random() * 1000);
  console.log(options.noiseSeed);
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (!noiseDrawn) {
    noiseMap();
    noiseDrawn = true;
  }
  image(gfx, 0, 0);
}

function noiseMap() {
  gfx.stroke(options.foreground);
  gfx.noFill();
  gfx.strokeWeight(4);

  for (let i = 0; i < options.linecount; i++) {
    gfx.beginShape();
    let currentPoint = createVector(Math.round(random() * startupParameters.xSize) - options.linelenght * 5, Math.round(random() * startupParameters.ySize));
    let direction = createVector(1, 0);

    gfx.curveVertex(currentPoint.x, currentPoint.y);
    gfx.curveVertex(currentPoint.x, currentPoint.y);

    for (let j = 0; j < options.linesegments; j++) {
      const noiseValue = noise(currentPoint.x / options.noiseScale, currentPoint.y / options.noiseScale);
      direction.y = lerp(-1, 1, noiseValue);
      direction.x = 1 - direction.y;
      direction.normalize();
      direction.setMag(options.linelenght);

      currentPoint.add(direction);
      gfx.curveVertex(currentPoint.x, currentPoint.y);
    }
    gfx.curveVertex(currentPoint.x, currentPoint.y);
    gfx.endShape();
  }
}