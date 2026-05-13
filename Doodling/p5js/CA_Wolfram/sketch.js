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
      lineArray[i] = 0;
      if (i == lineArray.length / 2)
      {
        lineArray[i] = 1;
      }
    }
  }
}

let lineArray = new Array(startupParameters.xSize);
let lineFeed = 0;

const options = {
  background: '#212121',
  foreground: '#ffae23',
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
  let atBottom = false;

  if (atBottom || lineFeed >= startupParameters.ySize)
  {
    atBottom = true;
    gfx.loadPixels();
    for (let i = 0; i < (startupParameters.ySize-1)*startupParameters.xSize*4; i++)
    {
      gfx.pixels[i] = gfx.pixels[i+startupParameters.xSize*4];
    }
    gfx.updatePixels();
  }

  if (!atBottom)
  {
    drawArr(lineArray, lineFeed);
    lineFeed++;
    nextEvolution(lineArray);
  } else {
    drawArr(lineArray, startupParameters.ySize - 1);
    nextEvolution(lineArray);
  }

  image(gfx, 0, 0);
}


function drawArr(arr, y)
{
  for (let i = 0; i < arr.length; i++)
  {
    if (arr[i] == 1)
    {
      gfx.stroke(options.background);
      gfx.point(i, y);
    } else {
      gfx.stroke(options.foreground);
      gfx.point(i, y);
    }
  }
}

function nextEvolution(arr)
{
  let tempArray = new Array(arr.length);

  for (let i = 0; i < arr.length; i++)
  {
    if (i == 0)
    {
      tempArray[i] = ruleprocess(arr[arr.length-1], arr[i], arr[i+1]);
    } else if (i == arr.length -1) {
      tempArray[i] = ruleprocess(arr[i-1], arr[i], arr[0]);
    } else {
      tempArray[i] = ruleprocess(arr[i-1], arr[i], arr[i+1]);
    }
  }

  lineArray = tempArray;
}

// Rule 90
function ruleprocess(one, two, three)
{
  let answer = 0;

  if (one == 0 && two == 0 && three == 0)
  {
    answer = 0;
  } else if (one == 0 && two == 0 && three == 1)
  {
    answer = 1;
  } else if (one == 0 && two == 1 && three == 0)
  {
    answer = 1;
  } else if (one == 1 && two == 0 && three == 0)
  {
    answer = 1;
  } else if (one == 0 && two == 1 && three == 1)
  {
    answer = 1;
  } else if (one == 1 && two == 0 && three == 1)
  {
    answer = 0;
  } else if (one == 1 && two == 1 && three == 0)
  {
    answer = 0;
  } else if (one == 1 && two == 1 && three == 1)
  {
    answer = 0;
  }

  return answer;
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