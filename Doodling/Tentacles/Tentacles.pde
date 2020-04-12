// https://twitter.com/Hau_kun/status/1248949717930631168
float t,r,d,x,y,a;

void setup()
{
	size(720,720);
	noStroke();
	pixelDensity(displayDensity());
}

void draw()
{
	clear();
	t+=.005;
	for( r=0; r<TAU; r+=PI/8)
	{
		x = y = 360;
		for( d=0; d<1; d+=.01)
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

void keyPressed()
{
	if (keyCode == 32) // space key
	{
		println("taking screenshot");
		String timeString = ""  + java.time.LocalDate.now() + "_" + java.time.LocalTime.now();
		timeString = timeString.replace(":", ".");
		saveFrame(timeString + "_Sketch.jpg");
	}
}