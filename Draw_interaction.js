// ----=  Images  =----
let shovel;
let lighter;
let sakuraImage;


function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
  shovel = loadImage('/images/shovel.png');
  lighter = loadImage('/images/lighter.png');
  sakuraImage = loadImage('/images/sakura.png');
  // Plant images are loaded in sand_simulation.js
}

function drawInteraction(faces, hands) {

  // hands part
  // USING THE GESTURE DETECTORS (check their values in the debug menu)
  // detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    let whatGesture = detectHandGesture(hand)
    let isErasing = false; 

    //==SAND VARIABLES==

    let sandType = 1;

    //GESTURE CHECK

    if (whatGesture == "Open Palm") {
      isErasing = true;
    }
    //FIRE IF PINCHING
    if (whatGesture == "Pinch") {
      sandType = 20;
      isErasing = false;
    }
    
    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    // console.log(hand);

    
    
    // === HAND VARIABLES ===
    // Calculate hand center (using wrist as center point)
    let handCenterX = hand.wrist.x;
    let handCenterY = hand.wrist.y;
    
    // Get all finger tip positions
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;
    let middleFingerTipX = hand.middle_finger_tip.x;
    let middleFingerTipY = hand.middle_finger_tip.y;
    let ringFingerTipX = hand.ring_finger_tip.x;
    let ringFingerTipY = hand.ring_finger_tip.y;
    let pinkyFingerTipX = hand.pinky_finger_tip.x;
    let pinkyFingerTipY = hand.pinky_finger_tip.y;
    
    //  hand size
    let indexDist = Math.sqrt((indexFingerTipX - handCenterX) ** 2 + (indexFingerTipY - handCenterY) ** 2);
    let middleDist = Math.sqrt((middleFingerTipX - handCenterX) ** 2 + (middleFingerTipY - handCenterY) ** 2);
    let ringDist = Math.sqrt((ringFingerTipX - handCenterX) ** 2 + (ringFingerTipY - handCenterY) ** 2);
    let pinkyDist = Math.sqrt((pinkyFingerTipX - handCenterX) ** 2 + (pinkyFingerTipY - handCenterY) ** 2);
    
        let handSize = Math.max(indexDist, middleDist, ringDist, pinkyDist);


    /*
    Start drawing on the hands here

    */


//Pouring sand
    if (isErasing == false) {
      if (sandType == 1) {
        spawnSandAtPosition(indexFingerTipX, indexFingerTipY, Math.floor(random(1, 9)));
      }
      else if (sandType == 20) {
        spawnSandAtPosition(indexFingerTipX, indexFingerTipY, 20);
        push();
        imageMode(CENTER);
        let imageSize = handSize * 0.6; 
        image(lighter, indexFingerTipX, indexFingerTipY, imageSize, imageSize);
        pop();
      }
    }

    //Erasing sand w/ shovel
    if (isErasing == true) {
      
      
      let eraserBrushSize = Math.floor(map(handSize, 1, 150, 2, 5));
                    
      let originalBrushSize = brushSize;
      brushSize = eraserBrushSize;
      
      // Erase by spawning type 0 (empty) at hand center
      spawnSandAtPosition(handCenterX-30, handCenterY-30, 0);

      //reset brush size - stops too much sand being spawned after erasing
      brushSize = originalBrushSize;
      
      // Display shovel image on palm when erasing
      push();
      imageMode(CENTER);
      let imageSize = handSize * 0.6; // Scale image to hand size
      image(shovel, handCenterX-100, handCenterY-100, imageSize, imageSize);
      pop();
    }


    /*
    fill(225, 225, 0);
    ellipse(indexFingerTipX, indexFingerTipY, 30, 30);
    */

    /*
    Stop drawing on the hands here
    */
  }



  //------------------------------------------------------------
  //facePart
  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face
    if (showKeypoints) {
      //drawPoints(face)
    }
    // console.log(face);
    /*
    Once this program has a face, it knows some things about it.
    This includes how to draw a box around the face, and an oval. 
    It also knows where the key points of the following parts are:
     face.leftEye
     face.leftEyebrow
     face.lips
     face.rightEye
     face.rightEyebrow
    */

    /*
    Start drawing on the face here
    */

    checkIfMouthOpen(face);
    if (isMouthOpen) {
      //text("blah blah", face.keypoints[287].x, face.keypoints[287].y)
      spawnWaterAtPosition(face.keypoints[275].x, face.keypoints[287].y);
      colorDriver = 1.0;
    } else { colorDriver = 0.0; }

    // fill(225, 225, 0);
    // ellipse(leftEyeCenterX, leftEyeCenterY, leftEyeWidth, leftEyeHeight);

    /*drawPoints(face.leftEye);
    drawPoints(face.leftEyebrow);
    drawPoints(face.lips);
    drawPoints(face.rightEye);
    drawPoints(face.rightEyebrow);*/
    /*
    Stop drawing on the face here
    */

  }
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
}


function drawConnections(hand) {
  // Draw the skeletal connections
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}

function pinchCircle(hand) { // adapted from https://editor.p5js.org/ml5/sketches/DNbSiIYKB
  // Find the index finger tip and thumb tip
  let finger = hand.index_finger_tip;
  //let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  // Calculate the pinch "distance" between finger and thumb
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);

}


// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {

  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 5);
  }
  pop()

}

function checkIfMouthOpen(face) {

  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]
  // ellipse(lowerLip.x,lowerLip.y,20)
  // ellipse(upperLip.x,upperLip.y,20)

  let d = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
  //console.log(d)
  if (d < 10) {
    isMouthOpen = false;
  } else {
    isMouthOpen = true;
  }

}