let gfx;
let hasDrawn = false;
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
  background: '#aaccf0',
  foreground: '#2a445b',
  sampleAmount: 5000,
  zoom: 1,
  wrap: false,
  zoomPointX: 0,
  zoomPointY: 0,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    hasDrawn = false;
  },
  save: function () {
    saveCanvas('Hénon-Attractor' + Date.now(), 'png');
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
folder1.addColor(options, 'background').onChange(() => {
  options.restart();
});
folder1.addColor(options, 'foreground').onChange(() => {
  options.restart();
});
folder1.add(options, 'sampleAmount').min(100).step(100).onChange(() => {
  options.restart();
});
folder1.add(options, 'zoom').min(1).step(0.01).onChange(() => {
  options.restart();
});
folder1.add(options, 'zoomPointX').min(-5).max(5).onChange(() => {
  options.restart();
});
folder1.add(options, 'zoomPointY').min(-5).max(5).onChange(() => {
  options.restart();
});
folder1.add(options, 'wrap').onChange(() => {
  options.restart();
});
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (!hasDrawn) {
    drawPoints(gfx, options.sampleAmount);
    hasDrawn = true;
  }
  image(gfx, 0, 0);
}

function drawPoints(gfx, amountOfPoints) {
  let previousPoint = createVector(0.5, 0.5);
  gfx.loadPixels();
  const d = gfx.pixelDensity();
  const width = gfx.width * d * 4;
  const drawcolor = color(options.foreground);

  for(let i = 0; i < amountOfPoints; i++) {
    const newX = previousPoint.y + 1 - (1.4 * previousPoint.x * previousPoint.x);
    const newY = previousPoint.x * 0.3;
    previousPoint = createVector(newX, newY);

    let drawX = map(newX, -1.5 * 1 / options.zoom, 1.5 * 1 / options.zoom, 0, startupParameters.xSize);
    let drawY = map(newY, -1.5 * 1 / options.zoom, 1.5 * 1 / options.zoom, 0, startupParameters.ySize);

    drawX = Math.round(drawX + lerp(-startupParameters.xSize, startupParameters.xSize, (1 + options.zoomPointX) / 2));
    drawY = Math.round(drawY + lerp(-startupParameters.ySize, startupParameters.ySize, (1 + options.zoomPointY * -1) / 2));

    if (!options.wrap) {
      skip = drawX >= startupParameters.xSize || drawX < 0;
      if (skip) {
        continue;
      }
    }
  
    gfx.pixels[width * drawY + drawX * 4] = red(options.foreground);
    gfx.pixels[width * drawY + drawX * 4 + 1] = green(options.foreground);
    gfx.pixels[width * drawY + drawX * 4 + 2] = blue(options.foreground);
    gfx.pixels[width * drawY + drawX * 4 + 3] = 255;
  }

  gfx.updatePixels();
}