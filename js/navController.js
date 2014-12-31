'use strict';

function NavController(camera, controlElement, stepSize, turnRate, goalPosition, autopilot) 	{
	var pressed={};

	controlElement.onkeydown=function(e){
	     e = e || window.event;
	     pressed[e.keyCode] = true;
	}

	controlElement.onkeyup=function(e){
	     e = e || window.event;
	     delete pressed[e.keyCode];
	}

	this.processInput = function(cameraLookDirection){
		if (pressed['W'.charCodeAt(0)])
		{
			var moveStep = cameraLookDirection.clone().multiplyScalar(stepSize);
			camera.position.add(moveStep);
		}
		if (pressed['S'.charCodeAt(0)])
		{
			var moveStep = cameraLookDirection.clone().multiplyScalar(-stepSize);
			camera.position.add(moveStep);
		}
		if (pressed['D'.charCodeAt(0)])
		{
			cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), -turnRate);
		}
		if (pressed['A'.charCodeAt(0)])
		{
			cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), turnRate);
		}

		if (pressed['T'.charCodeAt(0)])
		{
			var vectorLookingAtGoal = new THREE.Vector3(goalPosition.x - camera.position.x, camera.position.y, goalPosition.z - camera.position.z);

			var navTurnRate = Math.atan2(cameraLookDirection.z, cameraLookDirection.x) - Math.atan2(vectorLookingAtGoal.z, vectorLookingAtGoal.x);
			
			cameraLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), turnRate * (navTurnRate));
		}

		if (pressed['Q'.charCodeAt(0)])
		{
			var nextStep = autopilot.getNextStep(cameraLookDirection, camera.position);

			camera.position.add(nextStep[0]);
			cameraLookDirection.copy(nextStep[1]);
		}

		var currentLookDirection = new THREE.Vector3().addVectors(camera.position, cameraLookDirection);
		camera.lookAt(currentLookDirection);
	}
}
