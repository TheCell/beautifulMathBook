Options options;
PVector windowSize;
PVector imageSize;
PGraphics graphic;

void settings()
{
  // setup window
  windowSize = new PVector(700, 400);
  imageSize = new PVector(700, 400);
  size((int)windowSize.x, (int)windowSize.y);
  pixelDensity(displayDensity());
}

void setup()
{
  // prepare independent image to have a custom resolution
  graphic = createGraphics((int)imageSize.x, (int)imageSize.y);
  frameRate(30);
  options = new Options();
  
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
  graphic.background(100);
  graphic.endDraw();
  
  image(graphic, 0, 0, windowSize.x, windowSize.y);
}
