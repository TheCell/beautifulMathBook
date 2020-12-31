import java.util.*;

Options options;
PVector windowSize;
PVector imageSize;
PGraphics graphic;
PImage photo;

PShape hexagon;
HashSet<PVector> stampPositions = new HashSet<PVector>();

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
  prepareHexagon();
  photo = loadImage(options.imageUrl);
  prepareStampList(options.stampCount);
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
  shape(hexagon, 25, 25);
  image(photo, 0, 0);
  
  displayStamps();
}

void prepareHexagon()
{
  hexagon = createShape();
  hexagon.beginShape();
  hexagon.fill(0, 0, 255);
  hexagon.vertex(options.stampScale * 0, options.stampScale * -5);
  hexagon.vertex(options.stampScale * -4.3, options.stampScale * -2.5);
  hexagon.vertex(options.stampScale * -4.3, options.stampScale * 2.5);
  hexagon.vertex(options.stampScale * 0, options.stampScale * 5);
  hexagon.vertex(options.stampScale * 4.3, options.stampScale * 2.5);
  hexagon.vertex(options.stampScale * 4.3, options.stampScale * -2.5);
  hexagon.vertex(options.stampScale * 0, options.stampScale * -5);
  hexagon.endShape(CLOSE);
}

void prepareStampList(int stampCount)
{
  PVector start = new PVector(400, 200);
  Queue<PVector> point_queue = new LinkedList<PVector>(); // only hold points that were not already the center
  stampPositions.add(start);
  point_queue.add(start);
  
  while(stampPositions.size() < stampCount)
  {
    PVector newStart = point_queue.poll();
    PVector[] newPositions = getHexagonPositions(newStart);
    for (int i = 0; i < newPositions.length; i++)
    {
      // only add position if it is a new one
      if (stampPositions.add(newPositions[i]))
      {
        point_queue.add(newPositions[i]);
      }
    }
  }
}

PVector[] getHexagonPositions(PVector centralPoint)
{
  PVector[] sixPoints = new PVector[6];
  float radians = 0;
  for (int i = 0; i < 6; i++)
  {
    // sixPoints[i] = new PVector(centralPoint.x, centralPoint.y + options.hexagonDistance).rotate(degree);
    sixPoints[i] = new PVector(0, options.hexagonDistance).rotate(radians);
    sixPoints[i].x = sixPoints[i].x + centralPoint.x;
    sixPoints[i].y = sixPoints[i].y + centralPoint.y;
    // println(sixPoints[i].x, sixPoints[i].y, radians);
    radians += PI / 3;
  }
  return sixPoints;
}

void displayStamps()
{
  PVector[] stamps = new PVector[stampPositions.size()];
  stamps = stampPositions.toArray(stamps);
  
  for (int i = 0; i < stamps.length; i++)
  {
    shape(hexagon, stamps[i].x, stamps[i].y);
  }
}
