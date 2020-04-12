import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Tentacles extends PApplet {

// https://twitter.com/Hau_kun/status/1248949717930631168
float t,r,d,x,y,a;

public void setup()
{
	
	noStroke();
	
}
public void draw()
{
	clear();
	t+=.005f;
	for( r=0; r<TAU; r+=PI/8)
	{
		x = y = 360;
		for( d=0; d<1; d+=.01f)
		{
			fill( r * 20 + 64, d * 255, 192);
			circle(
				x += cos(
					r + (a = bezierTangent( 0, sin(r), sin(t), sin(r+r*t), d ))
				)*3,
				y += sin(r+a)*3,
				d*9
			);
		}
	}
}
  public void settings() { 	size(720,720); 	pixelDensity(displayDensity()); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "Tentacles" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
