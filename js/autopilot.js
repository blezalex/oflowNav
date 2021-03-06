'use strict';
//  === Observations: ===
//  1. Alg will hit an obstacles when flow on both sides is equal (may be high), it wont look for path around the obstacles. 
//  	Should it look for expansion point instead? 

//  2. Alg makes decision on the stop, no path planning at all

function constrain(x, min, max)
{
	if (x < min)
		return min;

	if (x > max)
		return max;

	return x;
}

function Autopilot(videoInputElement, debugInfoElement, width, height){

	var targetPosition = new THREE.Vector3(0, 0, 0);
	var fwdSpeed = 0.1;
	var turnRate = 0.02;
	
	var calculator = new oflow.FlowCalculator(6);
	var imgCapturer = new CanvasImageCapturer(videoInputElement, width, height);

	var debugSceneCtx = debugInfoElement.getContext('2d');

	var midPoint = width / 2;

	function renderFlowVectors(zones) {
		debugSceneCtx.clearRect(0, 0, width, height);
		
		for(var i = 0; i < zones.length; ++i) {
			var zone = zones[i];

			debugSceneCtx.strokeStyle = getDirectionalColor(zone.u, zone.v);
			debugSceneCtx.beginPath();
			debugSceneCtx.moveTo(zone.x,zone.y);
			debugSceneCtx.lineTo((zone.x - zone.u), zone.y + zone.v);
			debugSceneCtx.stroke();
		}
	}

	this.setTarget = function(position) {
		targetPosition = position;
	}

	var oldImage;
	this.getNextStep = function(cameraLookDirection, position) {
		
		var positionShift = cameraLookDirection.clone().multiplyScalar(fwdSpeed);
		var newLookDirection = cameraLookDirection.clone();

		var newImage = imgCapturer.getImageData();

		if (!oldImage) {
			oldImage = newImage;
			return [positionShift, newLookDirection];
		}

		var zones = calculator.calculate(oldImage.data, newImage.data, width, height).zones;

		var magnitudes = [0,0];
		for(var i = 0; i < zones.length; ++i) {
			var zone = zones[i];
			magnitudes[zone.x > midPoint ? 1 : 0] += Math.abs(zone.u) + Math.abs(zone.v);
		}	

		if (magnitudes[0] > 0 || magnitudes[1] > 0) // render vectos only when there is motion, othewise keep old image
			renderFlowVectors(zones);
			
		oldImage = newImage;

		var magnitureBasedTurnRate = 0;

		var magnWeight = (magnitudes[0] + magnitudes[1]) / 500;
		if (magnWeight > 10)
			magnWeight = 10;

		if (magnitudes[0] > 0 || magnitudes[1] > 0)
		{
			magnitureBasedTurnRate = (magnitudes[0] - magnitudes[1]) / (magnitudes[0] + magnitudes[1]);
		}

	//	magnitureBasedTurnRate = constrain(magnitureBasedTurnRate, -2000, 2000);

		var vectorLookingAtGoal = new THREE.Vector3(targetPosition.x - position.x, position.y, targetPosition.z - position.z);
		var navTurnRate = Math.atan2(cameraLookDirection.z, cameraLookDirection.x) - Math.atan2(vectorLookingAtGoal.z, vectorLookingAtGoal.x);

		navTurnRate = constrain(navTurnRate, -Math.PI / 2, Math.PI / 2);

		var newLookDirection = newLookDirection.applyAxisAngle(new THREE.Vector3( 0, 1, 0 ), turnRate * ((-magnitureBasedTurnRate * magnWeight) + navTurnRate * 2));

		return [positionShift, newLookDirection];
	}
}