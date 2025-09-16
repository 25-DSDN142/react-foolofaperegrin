/*This code is adapted from, and highly derivative from the tutorial found on the ml5.js website. 
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates face tracking on live video through ml5.faceMesh.
 */

let handPose, faceMesh;
let video, painting, connections;
let hands = [];
let faces = [];
let options = {
  maxFaces: numberOfFaces,
  refineLandmarks: false,
  flipHorizontal: flipVideo
};
let fern;


function preload() {
  // Load the ML5 models
  faceMesh = ml5.faceMesh(options);
  handPose = ml5.handPose({
    maxHands: numberOfHands,
    flipped: flipVideo
  });
  if (typeof prepareInteraction === 'function') {
    // prepareInteraction exists and is a function
    prepareInteraction(); // You can safely call the function here
  }
}

function setup() {
  createCanvas(CaptureWidth, CaptureHeight);
  frameRate(performancePresets[performanceMode].targetFPS);

  // Show initial loading screen
  loadingScreen();
  // Initialize video capture and UI
  initializeVideo();
  setupUI();

  // Initialize sand simulation (if available)
  if (typeof setupSandSimulation === 'function') {
    console.log("Setting up sand simulation...");
    setupSandSimulation();
    console.log("Sand simulation setup complete!");
  } else {
    console.log("setupSandSimulation function not available");
  }
}

function draw() {

  if (!checks()) {
    return;
  }
  detectionFrame++;
  let confidentlyHands = []
  for (let i = 0; i < hands.length; i++) {
    if (hands[i].confidence > threshold) {
      confidentlyHands.push(hands[i])
    }
  }
  // Draw interaction between faces and hands

  drawInteraction(faces, confidentlyHands);

  // Draw sand simulation (if available)
  if (typeof drawSandSimulation === 'function') {
    drawSandSimulation();
  }

  // Draw painting overlay
  image(painting, 0, 0);

  drawUI();
}