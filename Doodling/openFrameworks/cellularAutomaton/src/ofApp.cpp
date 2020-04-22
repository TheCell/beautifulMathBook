#include "ofApp.h"

ofImage imageToDraw;
int reduceFactor = 1; // 1,2,4,etc.
int width = 1024 / reduceFactor;
int height = 768 / reduceFactor;
int *caRuleOutput = new int[8];
int *caCells = new int[width];
int currentLineToDraw = 0;
bool randomStart = false;
bool randomSeed = false;

//--------------------------------------------------------------
void ofApp::setup(){
	setRule(randomSeed);
	fillCells();
	imageToDraw.allocate(width, height, OF_IMAGE_COLOR);
	imageToDraw.setColor(ofColor::white);
	imageToDraw.update();

	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_RIGHT);
	gui->addTextInput("message", "Cellular Automaton by TheCell");

	gui->addToggle("Random Start", randomStart);
	gui->addToggle("Random Seed", randomSeed);
	gui->onToggleEvent(this, &ofApp::onToggleEvent);
}

void ofApp::onToggleEvent(ofxDatGuiToggleEvent e)
{
	if (e.target->is("Random Start"))
	{
		randomStart = !randomStart;
		reset();
	}
	else if (e.target->is("Random Seed"))
	{
		randomSeed = !randomSeed;
		setRule(randomSeed);
		reset();
	}
}

//--------------------------------------------------------------
void ofApp::update(){

}

//--------------------------------------------------------------
void ofApp::draw(){
	if (currentLineToDraw < height)
	{
		updateCA();
		updateImage();
		currentLineToDraw++;
	}

	imageToDraw.draw(0, 0, width * reduceFactor, height * reduceFactor);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
	if (key == 'x') {
		gui->setVisible(false);
		imageToDraw.draw(0, 0, width * reduceFactor, height * reduceFactor);
		imageToDraw.grabScreen(0, 0, ofGetWidth(), ofGetHeight());
		imageToDraw.save("screenshot" + ofGetTimestampString() + ".png");
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

void ofApp::updateCA()
{
	int* tempArr = new int[width];
	for (int i = 0; i < width; i++)
	{
		int leftCell, centerCell, rightCell;
		if (i == 0)
		{
			leftCell = 0;
		}
		else
		{
			leftCell = caCells[i - 1];
		}
		if (i == width - 1)
		{
			rightCell = 0;
		}
		else
		{
			rightCell = caCells[i + 1];
		}
		centerCell = caCells[i];

		if (leftCell && centerCell && rightCell)
		{
			tempArr[i] = caRuleOutput[0];
		}
		else if (leftCell && centerCell && !rightCell)
		{
			tempArr[i] = caRuleOutput[1];
		}
		else if (leftCell && !centerCell && rightCell)
		{
			tempArr[i] = caRuleOutput[2];
		}
		else if (leftCell && !centerCell && !rightCell)
		{
			tempArr[i] = caRuleOutput[3];
		}
		else if (!leftCell && centerCell && rightCell)
		{
			tempArr[i] = caRuleOutput[4];
		}
		else if (!leftCell && centerCell && !rightCell)
		{
			tempArr[i] = caRuleOutput[5];
		}
		else if (!leftCell && !centerCell && rightCell)
		{
			tempArr[i] = caRuleOutput[6];
		}
		else if (!leftCell && !centerCell && !rightCell)
		{
			tempArr[i] = caRuleOutput[7];
		}
	}
	for (int i = 0; i < width; i++)
	{
		//std::cout << caCells[i] << " ";
		caCells[i] = tempArr[i];
	}
	//std::cout << std::endl;

	delete[] tempArr;
	tempArr = NULL;
}

void ofApp::updateImage()
{
	for (int i = 0; i < width; i++)
	{
		ofColor color = ofColor::white;
		if (caCells[i])
		{
			color = ofColor::black;
		}
		imageToDraw.setColor(i, currentLineToDraw, color);
	}
	imageToDraw.update();
}

void ofApp::fillCells()
{
	for (int i = 0; i < width; i++)
	{
		if (randomStart)
		{
			caCells[i] = (int) ofRandom(0,2);
		}
		else
		{
			caCells[i] = 0;
		}
	}
	if (!randomStart)
	{
		caCells[width / 2] = 1;
	}
}

void ofApp::reset()
{
	imageToDraw.setColor(ofColor::white);
	currentLineToDraw = 0;
	fillCells();
}

void ofApp::setRule(bool random)
{
	if (random)
	{
		for (int i = 0; i < 8; i++)
		{
			caRuleOutput[i] = (int)ofRandom(0, 2);
		}
	}
	else
	{
		caRuleOutput[0] = 0;
		caRuleOutput[1] = 0;
		caRuleOutput[2] = 0;
		caRuleOutput[3] = 1;
		caRuleOutput[4] = 1;
		caRuleOutput[5] = 1;
		caRuleOutput[6] = 1;
		caRuleOutput[7] = 0;
	}
}