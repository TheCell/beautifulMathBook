let gfx, seed;
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
  background: '#110b11',
  foreground: '#a5d0a8',
  sampleAmount: 20000,
  scale: 200,
  centerX: 0,
  centerY: 0,
  a: 2.89,
  b: 5.63,
  restart: function () {
    hasDrawn = false;
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas(`${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
  },
  loadImage: function() {
    document.getElementById('fileselector').click();
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
folder1.add(options, 'loadImage');
folder1.add(options, 'sampleAmount', 100, 200000, 100).onChange(() => {
  options.restart();
});
folder1.add(options, 'scale', 1, 1000).onChange(() => {
  options.restart();
});
folder1.add(options, 'a').min(1).max(10).step(0.001).onChange(() => {
  options.restart();
});
folder1.add(options, 'b').min(1).max(10).step(0.001).onChange(() => {
  options.restart();
});
folder1.add(options, 'centerX').onChange(() => {
  options.restart();
});
folder1.add(options, 'centerY').onChange(() => {
  options.restart();
});
folder1.addColor(options, 'background').onChange(() => {
  options.restart();
});
folder1.addColor(options, 'foreground').onChange(() => {
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
  let x = 0.1;
  let y = 0.1;
  const a = options.a;
  const b = options.b;
  gfx.translate(gfx.width / 2 + options.centerX, gfx.height / 2 + options.centerY);
  gfx.stroke(options.foreground);
  for (let i = 0; i < amountOfPoints; i++) {
    let x1 = Math.sin(x * x - y * y + a);
    let y1 = Math.cos(2 * x * y - b);

    // Scale and plot
    let px = x1 * options.scale;
    let py = y1 * options.scale;

    gfx.point(px, py);

    // Update
    x = x1;
    y = y1;
  }
}

function onFileSelected() {
  const input = document.getElementById('fileselector');
  const files = input.files;
  for (const file of files) {
    loadImage(URL.createObjectURL(file), onImageLoaded);
  };
}

function onImageLoaded(image) {
  // now do stuff
  gfx.image(image, 0, 0);
}