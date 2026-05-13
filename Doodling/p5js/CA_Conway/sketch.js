"use strict";

let gfx, seed;

const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);

    for (let i = 0; i < lineArray.length; i++)
    {
      lineArray[i] = random() > 0.5 ? 1 : 0;
    }
  }
}

let lineArray = new Array(startupParameters.xSize * startupParameters.ySize);

const options = {
  background: '#212121',
  foreground: '#7a746a',
  restart: function () {
    seed = Math.random() * 100000;
    randomSeed(seed);
    gfx.reset();
    gfx.background(options.background);
  },
  save: function () {
    saveCanvas(`Example_${new Date().getFullYear()}_seed-${seed}_date-${Date.now()}`, 'png');
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
folder1.addColor(options, 'foreground');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  drawArr(lineArray);
  nextEvolution(lineArray);

  image(gfx, 0, 0);
}


function drawArr(arr)
{
  for (let i = 0; i < arr.length; i++)
  {
    let x = i % startupParameters.xSize;
    let y = Math.floor(i / startupParameters.xSize);
    if (arr[i] == 1)
    {
      gfx.stroke(options.background);
      gfx.point(x, y);
    } else {
      gfx.stroke(options.foreground);
      gfx.point(x, y);
    }
  }
}

function nextEvolution(arr)
{
  let tempArray = new Array(arr.length);

  for (let i = 0; i < arr.length; i++)
  {
    const amountOfNeighbours = countNeighbours(arr, i);
    tempArray[i] = ruleprocess(arr[i], amountOfNeighbours);
  }

  lineArray = tempArray;
}

function ruleprocess(cell, amountOfLiveNeighbours)
{
  if (cell == 1) {
    if (amountOfLiveNeighbours < 2) {
      return 0;
    } else if (amountOfLiveNeighbours < 4) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if (amountOfLiveNeighbours == 3) {
      return 1;
    }

    return 0;
  }
}

function countNeighbours(arr, i) {
    let x = i % startupParameters.xSize;
    let y = Math.floor(i / startupParameters.xSize);

    const isTopBorder = y == 0;
    const isBottomBorder = y == startupParameters.ySize - 1;
    const isLeftBorder = x == 0;
    const isRightBorder = x == startupParameters.xSize - 1;

    let amountOfLiveNeighbours = 0;

    if (!isTopBorder && !isBottomBorder && !isLeftBorder && !isRightBorder) {
      // left right up down
      amountOfLiveNeighbours += arr[i - 1];
      amountOfLiveNeighbours += arr[i + 1];
      amountOfLiveNeighbours += arr[i - startupParameters.xSize];
      amountOfLiveNeighbours += arr[i + startupParameters.xSize];

      // diagonals
      amountOfLiveNeighbours += arr[i - startupParameters.xSize - 1];
      amountOfLiveNeighbours += arr[i - startupParameters.xSize + 1];
      amountOfLiveNeighbours += arr[i + startupParameters.xSize - 1];
      amountOfLiveNeighbours += arr[i + startupParameters.xSize + 1];
      return amountOfLiveNeighbours;
    }

    return 0;
}

function onFileSelected() {
  const input = document.getElementById('fileselector');
  const files = input.files;
  for (const file of files) {
    loadImage(URL.createObjectURL(file), onImageLoaded);
  };
}

function onImageLoaded(image) {
  gfx.image(image, 0, 0);
}