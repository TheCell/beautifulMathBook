#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup()
{
	gui = new ofxDatGui(ofxDatGuiAnchor::TOP_RIGHT);
	gui->addHeader(":: Smudged Images by TheCell ::");
	gui->addSlider("imageSize", 1, 150, 100);
	gui->addFooter();

	imageScaler = gui->getSlider("imageSize");
	imageScaler->setPrecision(0);
	imageScaler->onSliderEvent(this, &ofApp::onImageResize);
	image.load("images/TheGhostNebula.jpeg");
	originalImageWidth = image.getWidth();
	originalImageHeight = image.getHeight();
}

//--------------------------------------------------------------
void ofApp::update()
{
	
}

//--------------------------------------------------------------
void ofApp::draw()
{
	image.draw(0, 0, originalImageWidth * resizeScale, originalImageWidth * resizeScale);
	
	this->smudgeImage();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key)
{
	if (key == 'x')
	{
		gui->setVisible(false);
		this->draw();
		ofImage img;
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
void ofApp::dragEvent(ofDragInfo dragInfo) {

}

//--------------------------------------------------------------
void ofApp::onImageResize(ofxDatGuiSliderEvent e)
{
	resizeScale = 1.5 * e.scale;
}

//--------------------------------------------------------------
void ofApp::smudgeImage()
{
	ofImage img;
	img.grabScreen(0, 0, ofGetWidth(), ofGetHeight());
	ofPixels& pixels = img.getPixels();
	//vector<char> pixelVector(pixels.operator[]);
	int rowSize = pixels.getHeight();
	for (int j = 0; j < rowSize; j++)
	{
		
	//	std::partial_sort(pixelVector.begin() + j * pixels.getWidth(), pixelVector.begin() + j * pixels.getWidth() + rowSize, pixelVector.end());
		for (int i = 0; i < rowSize; i++)
		{
			char c = pixels[j * rowSize + i];
			c << 1;
			pixels[j * rowSize + i] = c;
		}
	}

	//char* newPixels = pixelVector.data();
	//ofPixels newPix = ofPixels(&newPixels)
	//img.setFromPixels()
	img.setFromPixels(pixels);

	img.draw(0, 0);
}
