class PoissonDiscSampling
{
  private float distanceR;
  private float constantK;
  private PVector[] grid;
  private float cellSize;
  private float imageWidth;
  private float imageHeight;
  private int cols;
  private int rows;
  private ArrayList<PVector> activeList;
  
  public PoissonDiscSampling(float distance, float k, float imageWidth, float imageHeight)
  {
    this.distanceR = distance;
    this.constantK = k;
    this.cellSize = distance / sqrt(2);
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    
    // Step 0
    this.cols = floor(imageWidth / cellSize);
    this.rows = floor(imageHeight / cellSize);
    grid = new PVector[rows*cols];
    
    for (int i = 0; i < rows * cols; i++)
    {
      grid[i] = new PVector(0, 0);
    }
    
    // step 1
    activeList = new ArrayList<PVector>();
    startSampling();
  }
  
  private void startSampling()
  {
    // select random point and init active list
    // int randomPoint = (int) random(0, grid.length - 1);
    int x = (int) random(imageWidth);
    int y = (int) random(imageHeight);
    int i = floor(x / cellSize);
    int j = floor(y / cellSize);
    PVector pos = new PVector(x, y);
    grid[i + j * cols] = pos;
    activeList.add(pos);
  }
  
  public void iterate()
  {
    // step 2
    // edge cases still buggy I think
    for (int total = 0; total < 5; total++)
    {
      if (activeList.size() > 0)
      {
        int randomIndex = (int) random(0, activeList.size());
        PVector activePosition = activeList.get(randomIndex);
        boolean found = false;
        
        for (int i = 0; i < constantK; i++)
        {
          PVector samplePos = PVector.random2D();
          float distance = random(distanceR, distanceR * 2);
          samplePos.setMag(distance);
          samplePos.add(activePosition);
          
          int columnPos = (int) (samplePos.x / cellSize);
          int rowPos = (int) (samplePos.y / cellSize);
          
          if (
            rowPos > rows
            || columnPos > cols
            || columnPos < 0
            || rowPos < 0
            || columnPos + rowPos * cols > grid.length -1
            || grid[columnPos + rowPos * cols].mag() > 0)
          {
            continue;
          }
          
          boolean isOk = true;
          for (int y = -1; y <= 1; y++)
          {
            for (int x = -1; x <= 1; x++)
            {
              int gridIndex = columnPos + x + (rowPos + y) * cols;
              if (gridIndex > 0 && gridIndex < cols * rows - 1)
              {
                PVector neighbor = grid[gridIndex];
                if (neighbor.mag() > 0)
                {
                  float checkDistance = PVector.dist(samplePos, neighbor);
                  if (checkDistance < distanceR)
                  {
                    isOk = false;
                  }
                }
              }
            }
          }
          
          if (isOk)
          {
            found = true;
            grid[columnPos + rowPos * cols] = samplePos;
            activeList.add(samplePos);
          }
        }
        
        activeList.remove(randomIndex);
      }
    }
  }
  
  public void populateImage(PGraphics image)
  {
    //image.loadPixels();
    image.beginDraw();
    image.stroke(0);
    image.fill(255, 255, 255);
    for (int i = 0; i < rows * cols; i++)
    {
      PVector gridInfo = grid[i];
      if (gridInfo.mag() > 0)
      {
        image.arc( i % cols * cellSize, i / rows * cellSize, cellSize, cellSize, 0, TWO_PI);
        //println("drawing circle at x " + i % cols * cellSize + " and y " + i / rows * cellSize);
        //image.pixels[ (int) (i * cellSize * cellSize)] = color(255,255,255);
      }
      else
      {
        //image.pixels[ (int) (i * cellSize * cellSize)] = color(0,255,0);
      }
    }
    
    image.fill(255, 0, 255);
    for (int i = 0; i < activeList.size(); i++)
    {
      PVector activePos = activeList.get(i);
      image.arc( activePos.x, activePos.y, cellSize, cellSize, 0, TWO_PI);
    }
    //image.updatePixels();
    image.endDraw();
  }
}
