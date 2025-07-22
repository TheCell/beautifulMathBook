"use strict";

let gfx, seed;
let currentImage = null;

const startupParameters = {
  xSize: 600,
  ySize: 800,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);

    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
    currentImage.resize(startupParameters.xSize, 0);
    gfx.image(currentImage, 0, 0);
  }
}

const options = {
  background: '#000000',
  factor: 1,
  useGrayscale: true,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    currentImage.resize(startupParameters.xSize, 0);
    gfx.image(currentImage, 0, 0);
  },
  save: function () {
    saveCanvas(`Dithering_${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
  },
  loadImage: function() {
    document.getElementById('fileselector').click();
  }
}

// Creating a GUI with options.
let gui = new dat.GUI({name: 'Customization'});
let startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
let folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.add(options, 'loadImage');
folder1.addColor(options, 'background');
folder1.add(options, 'factor').step(1).min(1).max(10);
folder1.add(options, 'useGrayscale');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function preload() {
  currentImage = loadImage("example_image.jpg");
}

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
  noSmooth();
  currentImage.resize(startupParameters.xSize, 0);
  gfx.image(currentImage, 0, 0);
}

function draw() {
  let fsd = new floydSteinbergDithering(options.factor, options.useGrayscale);
  const img = fsd.getImage(gfx);
  // image(gfx, 0, 0);
  image(img, 0, 0);
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
  // gfx.image(image, 0, 0);
  currentImage = image;
  currentImage.resize(startupParameters.xSize, 0);
  gfx.image(currentImage, 0, 0);
}