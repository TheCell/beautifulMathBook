let gfx;
const lines = [];
const startupParameters = {
  xSize: 400,
  ySize: 400,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}
const options = {
  minimumRadiant: Math.PI / 6,
  background: '#212121',
  foreground: '#ffae23',
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    lines.length = 0;
    startSeed();
    drawLines(gfx);
  },
  save: function () {
    saveCanvas('Example_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 400);
startupParameterFolder.add(startupParameters, 'ySize', 400);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'minimumRadiant', 0, Math.PI * 2);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  image(gfx, 0, 0);
}

function drawLines(graphics) {
  lines.forEach(line => {
    graphics.stroke(options.foreground);
    graphics.strokeWeight(2);
    graphics.line(line.start.x, line.start.y, line.end.x, line.end.y);
  });
}

function addLine(startX, startY) {

}

function getAngle(excludeAngle) {
  const possibleMultiples = (Math.PI * 2) / options.minimumRadiant;
  // filter for same direction angles
  let nextAngle = options.minimumRadiant * random(0, possibleMultiples);
  return nextAngle;
}

function startSeed() {
  const start = createVector(0, random(0, startupParameters.ySize));
  const end = createVector(startupParameters.xSize, random(0, startupParameters.ySize));
  lines.push({
    start: start,
    end: end,
    angle: createVector(startupParameters.xSize, startupParameters.ySize / 2).angleBetween(end)
  });
}