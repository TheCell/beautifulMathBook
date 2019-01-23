PVector windowSize;
PVector imageSize;
PGraphics graphic;
ArrayList<Toothpick> picks;
float minX = 1;
float maxX = 1;

// Info for this Sketch
// Numberphile Terrific Toothpick Patterns: https://www.youtube.com/watch?v=_UtCli1SgjI
// Coding Challenge #126 https://www.youtube.com/watch?v=-OL_sw2MiYw
// TODO: refactor this. Add other versions, see numberphile video math unsolved
void settings()
{
  // setup window
  windowSize = new PVector(400, 400);
  imageSize = new PVector(400, 400);
  size((int)windowSize.x, (int)windowSize.y);
  pixelDensity(displayDensity());
}

void setup()
{
  // prepare independent image to have a custom resolution
  graphic = createGraphics((int)imageSize.x, (int)imageSize.y);
  
  picks = new ArrayList<Toothpick>();
  picks.add(new Toothpick(0, 0, 1));
  frameRate(30);
}

void mousePressed()
{
  redraw();
}

void draw()
{
  graphic.beginDraw();
  graphic.background(255);
  graphic.translate((int) (imageSize.x/2), (int)(imageSize.y/2));
  ArrayList<Toothpick> next = new ArrayList<Toothpick>();
  float factor = imageSize.x / (maxX - minX);
  graphic.scale(factor);
  
  for (Toothpick t : picks)
  {
    t.show(graphic);
    if (t.isNewToothPick)
    {
      minX = min(t.ax, minX);
      maxX = max(t.ax, maxX);
    }
  }
  graphic.endDraw();
  image(graphic, 0, 0, windowSize.x, windowSize.y);
  
  for (Toothpick t : picks)
  { 
    if (t.isNewToothPick)
    {
      Toothpick nextA = t.createA(picks);
      Toothpick nextB = t.createB(picks);
      if (nextA != null)
      {
        next.add(nextA);
      }
      if (nextB != null)
      {
        next.add(nextB);
      }
      
      t.isNewToothPick = false;
    }
  }
  
  picks.addAll(next);
}
