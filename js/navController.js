function NavController(camera, controlElement, stepSize, turnRate, goalPosition) 	{
	this.camera  = camera;
	this.controlElement = controlElement;
	this.stepSize = stepSize;
	this.turnRate = turnRate;

	this.goalPosition = goalPosition;

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

NavController.prototype.processInput = function(magnitudes){
	var moved = false;

	if (pressed['W'.charCodeAt(0)])
	{
		var moveStep = this.cameraLookDirection.clone().multiplyScalar(this.stepSize);
		this.camera.position.add(moveStep);
		moved = true;
	}
	if (pressed['S'.charCodeAt(0)])
	{
		var moveStep = this.cameraLookDirection.clone().multiplyScalar(-this.stepSize);
		this.camera.position.add(moveStep);
		moved = true;
	}
	if (pressed['D'.charCodeAt(0)])
	{
		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), -this.turnRate);
		moved = true;
	}
	if (pressed['A'.charCodeAt(0)])
	{
		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), this.turnRate);
		moved = true;
	}

	if (pressed['T'.charCodeAt(0)])
	{
		var vectorLookingAtGoal = new THREE.Vector3(this.goalPosition.x - camera.position.x, camera.position.y, this.goalPosition.z - camera.position.z);

		var navTurnRate = Math.atan2(this.cameraLookDirection.z, this.cameraLookDirection.x) - Math.atan2(vectorLookingAtGoal.z, vectorLookingAtGoal.x);
		

		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), this.turnRate * (navTurnRate));
	}

	if (pressed['Q'.charCodeAt(0)])
	{
		var magnitureBasedTurnRate = magnitudes[0] - magnitudes[1];

		if (magnitureBasedTurnRate > 1000)
			magnitureBasedTurnRate = 1000;


		var vectorLookingAtGoal = new THREE.Vector3(this.goalPosition.x - camera.position.x, camera.position.y, this.goalPosition.z - camera.position.z);
		var navTurnRate = Math.atan2(this.cameraLookDirection.z, this.cameraLookDirection.x) - Math.atan2(vectorLookingAtGoal.z, vectorLookingAtGoal.x);

		if (navTurnRate > Math.PI / 2)
			navTurnRate = Math.PI / 2;

		if (navTurnRate < -Math.PI / 2)
			navTurnRate = -Math.PI / 2;

		this.cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), this.turnRate * ((-magnitureBasedTurnRate/500) + navTurnRate * 2));

		moved = true;
	}

	var currentLookDirection = new THREE.Vector3().addVectors(camera.position, this.cameraLookDirection);
	camera.lookAt(currentLookDirection);

	return moved;
}