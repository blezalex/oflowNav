function NavController(camera, controlElement, stepSize, turnRate) 	{
	this.camera  = camera;
	this.controlElement = controlElement;
	this.stepSize = stepSize;
	this.turnRate = turnRate;

	pressed={};
	this.pressed = pressed;
	controlElement.onkeydown=function(e){
	     e = e || window.event;
	     pressed[e.keyCode] = true;
	}

	controlElement.onkeyup=function(e){
	     e = e || window.event;
	     delete pressed[e.keyCode];
	}

	this.cameraLookDirection = new THREE.Vector3(0, 0, 1);
}

NavController.prototype.processInput = function(){
	if (pressed['W'.charCodeAt(0)])
	{
		var moveStep = this.cameraLookDirection.clone().multiplyScalar(this.stepSize);
		this.camera.position.add(moveStep);
	}
	if (pressed['S'.charCodeAt(0)])
	{
		var moveStep = this.cameraLookDirection.clone().multiplyScalar(-this.stepSize);
		this.camera.position.add(moveStep);
	}
	if (pressed['D'.charCodeAt(0)])
	{
		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), -this.turnRate);
	}
	if (pressed['A'.charCodeAt(0)])
	{
		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), this.turnRate);
	}

	var currentLookDirection = new THREE.Vector3().addVectors(camera.position, this.cameraLookDirection);
	camera.lookAt(currentLookDirection);
}