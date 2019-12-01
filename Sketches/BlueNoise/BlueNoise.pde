Options options;
PVector windowSize;
PVector imageSize;
PGraphics graphic;
PoissonDiscSampling pdSampling;

void settings()
{
  // setup window
  windowSize = new PVector(400, 400);
  imageSize = new PVector(200, 200);
  size((int)windowSize.x, (int)windowSize.y);
  pixelDensity(displayDensity());
}

void setup()
{
  // Poisson Disc Sampling
  // http://extremelearning.com.au/an-improved-version-of-bridsons-algorithm-n-for-poisson-disc-sampling/
  // https://www.youtube.com/watch?v=flQgnCUxHlw
  // prepare independent image to have a custom resolution
  graphic = createGraphics((int)imageSize.x, (int)imageSize.y);
  frameRate(30);
  options = new Options();
  pdSampling = new PoissonDiscSampling(
    options.minimumDistanceR, 
    options.constantK, 
    200, 
    200
  );
  
  println(
    "For interesting variables use the Options class, so people know where to tweak values, ex: "
    + options.exampleBool
  );
}

void mousePressed()
{
  redraw();
}

void draw()
{
  graphic.beginDraw();
  graphic.background(0);
  graphic.endDraw();
  
  pdSampling.iterate();
  pdSampling.populateImage(graphic);
  
  
  image(graphic, 0, 0, windowSize.x, windowSize.y);
}
