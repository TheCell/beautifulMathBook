"use strict";

let gfx, seed;
let currentImage = null;
let currentLowResImage = null;
let fsd = null;
let tsp = null;
let fsdImage = null;
let lineImage = null;

const startupParameters = {
  xSize: 600,
  ySize: 800,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);

    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
    currentImage.resize(startupParameters.xSize, 0);
    gfx.image(currentImage, 0, 0);
    currentLowResImage.resize(startupParameters.xSize / 16, 0);
    lineImage = createGraphics(startupParameters.xSize, startupParameters.ySize);
  }
}

const options = {
  background: '#000000',
  lineColor: '#47df5c',
  factor: 1,
  useGrayscale: true,
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
    currentImage.resize(startupParameters.xSize, 0);
    gfx.image(currentImage, 0, 0);
    // currentLowResImage.resize(startupParameters.xSize / 16, 0);
    // fsd = new floydSteinbergDithering(options.factor, options.useGrayscale);
    // fsdImage = fsd.getImage(currentLowResImage);
  },
  save: function () {
    saveCanvas(`Traveling-Salesman-Problem_${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
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
folder1.addColor(options, 'lineColor');
folder1.add(options, 'factor').step(1).min(1).max(10);
folder1.add(options, 'useGrayscale');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function preload() {
  currentImage = loadImage("example_image.jpg");
  currentLowResImage = loadImage("example_image.jpg");
}

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
  noSmooth();
  currentImage.resize(startupParameters.xSize, 0);
  gfx.image(currentImage, 0, 0);
  currentLowResImage.resize(startupParameters.xSize / 16, 0);
  fsd = new floydSteinbergDithering(options.factor, options.useGrayscale);
  fsdImage = fsd.getImage(currentLowResImage);
  tsp = new TravelingSalesmanSolver(getPointsFromImage(fsdImage));
  drawLineImage();
}

function draw() {
  // const lowRes = gfx;
  // const lowRes = gfx.resize(0, 50);
  // image(gfx, 0, 0);
  
  image(fsdImage, 0, 0, fsdImage.width * 16, fsdImage.height * 16);
  image(lineImage, 0, 0);
}

function drawLineImage() {
  const points = tsp.getPoints();
  lineImage.noFill();
  lineImage.stroke(options.lineColor);
  lineImage.beginShape();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    lineImage.vertex(point.x * 16, point.y * 16);
    lineImage.circle(point.x * 16, point.y * 16, 2);
  }
  lineImage.endShape();
  
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
  currentLowResImage = image;
  currentLowResImage.resize(startupParameters.xSize / 16, 0);
  fsdImage = fsd.getImage(currentLowResImage);
  const points = getPointsFromImage(fsdImage);
  console.log(`Loaded image with ${points.length} points.`);
  tsp = new TravelingSalesmanSolver(getPointsFromImage(fsdImage));
  drawLineImage();
}

function getPointsFromImage(img) {
	img.loadPixels();
	let points = [];
	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			let index = (x + y * img.width) * 4;
			let r = img.pixels[index];
			// let g = img.pixels[index + 1];
			// let b = img.pixels[index + 2];
			// let a = img.pixels[index + 3];
			if (r > 0) {
				points.push({ x, y });
			}
		}
	}
	return points;
}