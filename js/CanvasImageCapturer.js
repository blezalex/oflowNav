function CanvasImageCapturer(canvasElement) {	
	var height = canvasElement.height;
	var width = canvasElement.width;

	var proxyCanvas = document.createElement("canvas");
	proxyCanvas.setAttribute('height', height);
	proxyCanvas.setAttribute('width', width);

	var proxyContext = proxyCanvas.getContext('2d');

	this.getImageData = function() {
		proxyContext.drawImage(canvasElement, 0, 0);

		return proxyContext.getImageData(0, 0, width, height);
	}
}