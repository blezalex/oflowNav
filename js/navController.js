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
		var autoPilotNextStep = autopilot.getNextStep(cameraLookDirection, camera.position);

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

		if (pressed['Q'.charCodeAt(0)])
		{
			camera.position.add(autoPilotNextStep[0]);
			cameraLookDirection.copy(autoPilotNextStep[1]);
		}

		return new THREE.Vector3().addVectors(camera.position, cameraLookDirection);
	}
}
