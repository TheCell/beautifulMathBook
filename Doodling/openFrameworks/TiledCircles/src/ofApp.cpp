#include "ofApp.h"

int width = 1024;
int height = 768;
int griditems = 5;
float shadowOffset = 0.04;
int globalXOffset = 0;
int globalYOffset = 0;

ofColor color1;
ofColor color2;
ofColor color3;
ofColor color4;

//--------------------------------------------------------------
void ofApp::setup(){
	color1 = ofColor(238, 171, 190);
	color2 = ofColor(125, 194, 183);
	color3 = ofColor(3, 142, 204);
	color4 = ofColor(245, 239, 101);

	/*img.allocate(width, height, OF_IMAGE_COLOR);
	img.setColor(ofColor::white);
	img.update();*/
	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_RIGHT);
	gui->addTextInput("message", "Tiled Circles by TheCell");
}

//--------------------------------------------------------------
void ofApp::update()
{
	globalXOffset++;
	globalYOffset++;
	if (globalXOffset > width / (griditems + 1))
	{
		globalXOffset = 0;
	}
	if (globalYOffset > height / (griditems + 1))
	{
		globalYOffset = 0;
	}
}

//--------------------------------------------------------------
void ofApp::draw(){
	/*img.setColor(ofColor::white);
	img.update();
	img.draw(0, 0);*/
	//img.setColor(ofColor::white);
	ofBackground(ofColor::white);
	fillWithBackground(ofColor(0, 255), 0.3, .1, 110);
	fillWithBackground(ofColor(0, 255), 0.7, .1, 20);
	fillWithBackground(ofColor(0, 255), 0.5, .5, 40);
	fillWithBackground(ofColor(0, 255), 0.7, .6, -10);
	fillWithBackground(ofColor(0, 255), 0.1, .8, 60);
	fillWithBackground(ofColor(0, 255), 0.1, .3, 80);
	fillWithBackground(ofColor(0, 255), 0.9, .3, 10);
	fillWithBackground(ofColor(0, 255), 0.3, .7, 30);
	fillWithBackground(ofColor(0, 255), 0.8, .6, 130);
	
	/*fillWithBackground(ofColor(0, 255), 0.5, 0, 60);

	fillWithBackground(ofColor(0, 255), .25, .25, -20);
	fillWithBackground(ofColor(0, 255), 0.75, .25, -20);

	fillWithBackground(ofColor(0, 255), .25, .75, 10);
	fillWithBackground(ofColor(0, 255), 0.75, .75, 10);

	fillWithBackground(ofColor(0, 255), 0, .75, 10);
	fillWithBackground(ofColor(0, 255), 0.5, .75, 10);*/
	//fillWithBackground(ofColor(0, 255), .5, 0, 60);
	//fillWithBackground(ofColor(0, 255), .75, .1, 60);
	/*fillWithBackground(ofColor(0, 255), 0, .25, 15);
	fillWithBackground(ofColor(0, 255), .25, .25, 45);
	fillWithBackground(ofColor(0, 255), .5, .25, 75);
	fillWithBackground(ofColor(0, 255), .75, .25, 90);
	fillWithBackground(ofColor(0, 255), 0, .5, 15);
	fillWithBackground(ofColor(0, 255), .25, .5, 45);
	fillWithBackground(ofColor(0, 255), .5, .5, 75);
	fillWithBackground(ofColor(0, 255), .75, .5, 90);
	fillWithBackground(ofColor(0, 255), 0, .75, 15);
	fillWithBackground(ofColor(0, 255), .25, .75, 45);
	fillWithBackground(ofColor(0, 255), .5, .75, 75);
	fillWithBackground(ofColor(0, 255), .75, .75, 90);*/
	fillWithCircles(color1);
	fillWithQuads(color4);
	fillWithLines(color2);
	fillWithSprings(color3);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key)
{
	if (key == 'x')
	{
		gui->setVisible(false);
		//img.draw(0, 0, width, height);
		this->draw();
		img.grabScreen(0, 0, ofGetWidth(), ofGetHeight());
		img.save("screenshot" + ofGetTimestampString() + ".png");
		gui->setVisible(true);
	}
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

void ofApp::fillWithCircles(ofColor color)
{
	int widthSpace = width / (griditems + 1);
	int heightSpace = height / (griditems + 1);
	float offset;

	ofPushMatrix();
	ofTranslate(globalXOffset, globalYOffset);
	for (int y = -1; y < griditems + 2; y++)
	{
		offset = widthSpace * -0.3 * y;
		for (int x = -1; x < griditems + 2; x++)
		{
			ofSetColor(ofColor::black);
			ofDrawCircle(widthSpace + widthSpace * shadowOffset + x * widthSpace + offset, heightSpace + heightSpace * shadowOffset + y * heightSpace, widthSpace / 12);
			ofSetColor(color);
			ofDrawCircle(widthSpace + x * widthSpace + offset, heightSpace + y * heightSpace, widthSpace / 12);
		}
	}
	ofPopMatrix();
}

void ofApp::fillWithQuads(ofColor color)
{
	int widthSpace = width / (griditems + 1);
	int heightSpace = height / (griditems + 1);

	float shadowwidthoffset = widthSpace * shadowOffset;
	float shadowheightoffset = heightSpace * shadowOffset;
	float xOffset;
	float yOffset = heightSpace * 0.4;

	ofPushMatrix();
	ofTranslate(globalXOffset, globalYOffset);
	for (int y = -1; y < griditems + 2; y++)
	{
		xOffset = widthSpace * -0.3 * y;

		for (int x = -1; x < griditems + 2; x++)
		{
			ofSetColor(ofColor::black);
			ofDrawRectangle(widthSpace + shadowwidthoffset + x * widthSpace + xOffset, heightSpace + shadowheightoffset + y * heightSpace + yOffset, widthSpace / 6, widthSpace / 6);
			ofSetColor(color);
			ofDrawRectangle(widthSpace + x * widthSpace + xOffset, heightSpace + y * heightSpace + yOffset, widthSpace / 6, widthSpace / 6);
		}
	}
	ofPopMatrix();
}

void ofApp::fillWithLines(ofColor color)
{
	int widthSpace = width / (griditems + 1);
	int heightSpace = height / (griditems + 1);

	float shadowwidthoffset = widthSpace * shadowOffset;
	float shadowheightoffset = heightSpace * shadowOffset;
	float xOffset;
	float yOffset = heightSpace * 0.8;

	ofPushMatrix();
	ofTranslate(globalXOffset, globalYOffset);
	for (int y = -1; y < griditems + 2; y++)
	{
		xOffset = widthSpace * -0.3 * y + widthSpace * -0.7;
		for (int x = -1; x < griditems + 2; x++)
		{
			ofPushMatrix();
			ofTranslate(widthSpace + shadowwidthoffset + x * widthSpace + xOffset, heightSpace + shadowheightoffset + y * heightSpace + yOffset);
			ofRotateDeg(-35);
			ofSetColor(ofColor::black);
			ofDrawRectangle(0, 0, widthSpace / 1.6, widthSpace / 12);
			ofRotateDeg(35);
			ofSetColor(color);
			ofTranslate(-shadowwidthoffset, -shadowheightoffset);
			ofRotateDeg(-35);
			ofDrawRectangle(0, 0, widthSpace / 1.6, widthSpace / 12);
			ofPopMatrix();
		}
	}
	ofPopMatrix();
}

void ofApp::fillWithSprings(ofColor color)
{
	int widthSpace = width / (griditems + 1);
	int heightSpace = height / (griditems + 1);

	float shadowwidthoffset = widthSpace * shadowOffset;
	float shadowheightoffset = heightSpace * shadowOffset;
	float xOffset;
	float yOffset = heightSpace * 0.1;
	float rotateDegree = 35;

	ofPushMatrix();
	ofTranslate(globalXOffset, globalYOffset);
	for (int y = -1; y < griditems + 2; y++)
	{
		xOffset = widthSpace * -0.3 * y + widthSpace * -0.6;
		for (int x = -1; x < griditems + 2; x++)
		{
			ofPushMatrix();
			ofTranslate(widthSpace + shadowwidthoffset + x * widthSpace + xOffset, heightSpace + shadowheightoffset + y * heightSpace + yOffset);
			ofRotateDeg(rotateDegree);
			ofSetColor(ofColor::black);
			ofSetLineWidth(widthSpace / 16);
			std::vector <ofPolyline> polyline;
			polyline.push_back(ofPolyline());
			polyline.back().addVertex(-widthSpace / 4, -heightSpace / 8);
			polyline.back().addVertex(-widthSpace / 8, heightSpace / 8);
			polyline.back().addVertex(0, -heightSpace / 8);
			polyline.back().addVertex(widthSpace / 8, heightSpace / 8);
			polyline.back().addVertex(widthSpace / 4, -heightSpace / 8);
			
			for (auto & line : polyline)
			{
				line.draw();
			}
			ofRotateDeg(-rotateDegree);
			ofSetColor(color);
			ofTranslate(-shadowwidthoffset, -shadowheightoffset);
			ofRotateDeg(rotateDegree);

			for (auto & line : polyline)
			{
				line.draw();
			}
			//ofDrawRectangle(0, 0, widthSpace / 1.6, widthSpace / 12);
			ofPopMatrix();
		}
	}
	ofPopMatrix();
}

void ofApp::fillWithBackground(ofColor color, float xOffsetpercent, float yOffsetpercent, float rotateDegree)
{
	int scaleFactor = 3;
	int widthSpace = width / (griditems * scaleFactor + 1);
	int heightSpace = height / (griditems * scaleFactor + 1);

	ofPushMatrix();
	ofTranslate(globalXOffset, globalYOffset);
	for (int y = 0; y < griditems * scaleFactor + 2; y++)
	{
		for (int x = 0; x < griditems * scaleFactor + 2; x++)
		{
			ofPushMatrix();
			ofTranslate(x * widthSpace + widthSpace * xOffsetpercent, y * heightSpace + heightSpace * yOffsetpercent);
			ofRotateDeg(rotateDegree);
			ofSetColor(color);
			ofDrawRectangle(-widthSpace / 8, -widthSpace / 16, widthSpace / 8, widthSpace / 16);
			ofPopMatrix();
		}
	}
	ofPopMatrix();
}