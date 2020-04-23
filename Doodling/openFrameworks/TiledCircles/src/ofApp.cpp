#include "ofApp.h"

int width = 1024;
int height = 768;
int griditems = 5;
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

	img.allocate(width, height, OF_IMAGE_COLOR);
	img.setColor(ofColor::white);
	img.update();
	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_RIGHT);
	gui->addTextInput("message", "Tiled Circles by TheCell");
}

//--------------------------------------------------------------
void ofApp::update(){

}

//--------------------------------------------------------------
void ofApp::draw(){
	/*img.setColor(ofColor::white);
	img.update();
	img.draw(0, 0);*/
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
	fillWithShapes(color1);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key)
{
	if (key == 'x')
	{
		gui->setVisible(false);
		//img.draw(0, 0, width, height);
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

void ofApp::fillWithShapes(ofColor color)
{
	int widthSpace = width / (griditems + 1);
	int heightSpace = height / (griditems + 1);
	for (int y = 0; y < griditems; y++)
	{
		for (int x = 0; x < griditems; x++)
		{
			ofSetColor(color);
			ofDrawCircle(widthSpace + x * widthSpace, heightSpace + y * heightSpace, widthSpace / 8);
		}
	}
}

void ofApp::fillWithBackground(ofColor color, float xOffsetpercent, float yOffsetpercent, float rotateDegree)
{
	int widthSpace = width / (griditems * 2 + 1);
	int heightSpace = height / (griditems * 2 + 1);
	for (int y = 0; y < griditems * 2 + 2; y++)
	{
		for (int x = 0; x < griditems * 2 + 2; x++)
		{
			ofPushMatrix();
			ofTranslate(x * widthSpace + widthSpace * xOffsetpercent, y * heightSpace + heightSpace * yOffsetpercent);
			ofRotate(rotateDegree);
			ofSetColor(color);
			ofDrawRectangle(-widthSpace / 8, -widthSpace / 16, widthSpace / 8, widthSpace / 16);
			ofPopMatrix();
		}
	}
}