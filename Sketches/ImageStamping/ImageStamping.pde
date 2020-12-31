import java.util.*;

Options options;
PVector windowSize;
PVector imageSize;
PGraphics graphic;
PImage photo;
PImage maskedPhoto;

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
  noLoop();
  // prepare independent image to have a custom resolution
  graphic = createGraphics((int)imageSize.x, (int)imageSize.y);
  
  options = new Options();
  
  photo = loadImage(options.imageUrl);
  maskedPhoto = loadImage(options.imageUrl);
  prepareHexagon();
  //prepareStampList(options.stampCount);
  
}

void mousePressed()
{
  prepareStampList(options.stampCount);
  redraw();
}

void draw()
{
  graphic.beginDraw();
  graphic.background(100);
  graphic.endDraw();
  
  image(graphic, 0, 0, windowSize.x, windowSize.y);  
  //shape(hexagon, 25, 25);
  image(photo, 0, 0);
  background(128,200,30);
  PGraphics mask = createMask();
  maskedPhoto.mask(mask.get());
  image(photo, 0, 0);
  image(maskedPhoto, photo.width, 0);
  PGraphics miniImage = stitchedImage(maskedPhoto);
  image(miniImage, photo.width + maskedPhoto.width, 0);
  displayStamps();
}

void prepareHexagon()
{
  hexagon = createShape();
  hexagon.beginShape();
  hexagon.noStroke();
  hexagon.fill(255);
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
  stampPositions = new HashSet<PVector>();
  PVector start = new PVector(mouseX, mouseY);
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

PGraphics createMask()
{
  PGraphics cutMask = createGraphics(photo.width, photo.height);
  
  PVector[] stamps = new PVector[stampPositions.size()];
  stamps = stampPositions.toArray(stamps);
  cutMask.beginDraw();
  cutMask.background(0);
  cutMask.smooth();
  for (int i = 0; i < stamps.length; i++)
  {
    cutMask.shape(hexagon, stamps[i].x, stamps[i].y);
  }
  cutMask.endDraw();
  return cutMask;
}

PGraphics stitchedImage(PImage cutMask)
{
  int imgSize = (int) (options.stampCount * options.stampScale * 10);
  PGraphics stitchedImage = createGraphics(imgSize, imgSize);
  float hexagonWidth = options.stampScale * 5 * 2;
  float hexagonHeight = options.stampScale * 4.3 * 2;
  
  PVector[] stamps = new PVector[stampPositions.size()];
  PVector[] stichStampPositions = getStitchedHexagonPositions();
  stamps = stampPositions.toArray(stamps);
  for (int i = 0; i < stamps.length; i++)
  {
    println(stichStampPositions[i]);
    println(stamps[i]);
    println(cutMask);
    println(stitchedImage);
    println((int) (stamps[i].x - hexagonWidth / 2));
    println((int) (stamps[i].y - hexagonHeight / 2));
    println((int) hexagonWidth);
    println((int) hexagonHeight);
    println((int) stichStampPositions[i].x);
    println((int) stichStampPositions[i].y);
    println((int) hexagonWidth);
    println((int) hexagonHeight);
    println(cutMask.width);
    println(cutMask.height);
    stitchedImage.copy( //<>//
    cutMask,
    (int) (stamps[i].x - hexagonWidth / 2),
    (int) (stamps[i].y - hexagonHeight / 2), 
    (int) hexagonWidth,
    (int) hexagonHeight,
    (int) stichStampPositions[i].x,
    (int) stichStampPositions[i].y,
    (int) hexagonWidth,
    (int) hexagonHeight);
  }
  
  return stitchedImage;
}

PVector[] getStitchedHexagonPositions()
{
  float hexagonWidth = options.stampScale * 5 * 2;
  float hexagonHeight = options.stampScale * 4.3 * 2;
  
  PVector[] stitchedHexagons = new PVector[stampPositions.size()];
  stitchedHexagons = stampPositions.toArray(stitchedHexagons);
  for (int i = 0; i < stampPositions.size(); i++)
  {
    PVector stitchPos = new PVector(
      stitchedHexagons[i].x - hexagonWidth / 2,
      stitchedHexagons[i].y - hexagonHeight / 2);
    stitchedHexagons[i] = stitchPos; 
  }
  
  return stitchedHexagons;
}
