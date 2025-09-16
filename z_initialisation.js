
// ----=  SYSTEM INIT CODE:  =----

// do not meddle!
// ..seriously.

// GESTURE/ EXPRESSION DETECTOR INFO (defined here but a useful tool for you to use elsewhere.):
// detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"
// detectFaceExpression(face) returns "Surprised", "Neutral", or "Smiling"


// UI styling
const UI_PADDING = 20;
const BUTTON_HEIGHT = 40;
const BUTTON_SPACING = 10;


// ----=  technical  =----
let skipFrames, targetFPS;
let detectionFrame = 0;

const performancePresets = {
  low: { skipFrames: 3, targetFPS: 24},
  balanced: { skipFrames: 2, targetFPS: 30},
  high: { skipFrames: 1, targetFPS: 60}
};

// Use default performance mode if not yet defined
let currentPerformanceMode = typeof performanceMode !== 'undefined' ? performanceMode : 'high';
skipFrames = performancePresets[currentPerformanceMode].skipFrames;
targetFPS = performancePresets[currentPerformanceMode].targetFPS;



// ----=  INITIALISATION  =----

console.log("initialisation.js is loading");

// Status tracking variables
let modelsReady = false;
let videoReady = false;
let firstDetection = false;

console.log("Variables initialized");

// ----=  Global functions  =----
console.log("About to define loadingScreen function");

// Loading screen display
function loadingScreen() {
  console.log("loadingScreen called");
  if (typeof push === 'function' && typeof width !== 'undefined' && typeof height !== 'undefined') {
    push();
    background(30);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Initialising...", width/2, height/2);
    pop();
  } else {
    console.log("p5.js functions or canvas not available yet");
  }
}

console.log("loadingScreen function defined");

// Loading animation for draw loop
function showLoadingAnimation() {
  console.log("showLoadingAnimation called");
  if (typeof background === 'function' && typeof width !== 'undefined' && typeof height !== 'undefined') {
    background(30);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont('Verdana');
    
    if (!videoReady) {
      text("Loading camera...", width/2, height/2);
    } else {
      text("Loading ML5 models...", width/2, height/2);
      textSize(14);
      text("Move your hand or face in front of camera", width/2, height/2 + 30);
    }
    
    // Simple animated dots
    let dots = "";
    let numDots = floor(millis() / 500) % 4;
    for (let i = 0; i < numDots; i++) {
      dots += ".";
    }
    textSize(20);
    text(dots, width/2 + 100, height/2);
  } else {
    console.log("p5.js functions or canvas not available in showLoadingAnimation");
  }
}

console.log("showLoadingAnimation function defined");

// Detect which mode we're in
function detectMode() {
  console.log("detectMode called");
  let path = window.location.pathname;

  if (path.includes('HandTracker')) {
    return 'hands';
  } else if (path.includes('FaceTracker')) {
    return 'face';
  } else if (path.includes('both')) {
    return 'both';
  }
  else{
     return currentMode; 
  }

}

console.log("detectMode function defined");

// Video loaded callback
console.log("About to define videoLoaded function");
function videoLoaded() {
  console.log("Video loaded!");
  videoReady = true;
  
  console.log("Detecting mode...");
  let mode = detectMode();
  console.log("Mode detected:", mode);
  
  if (mode === 'hands' || mode === 'both') {
    console.log("Setting up hand detection...");
    if (typeof handPose !== 'undefined') {
      handPose.detectStart(video, (results) => {
        // Use the shared detectionFrame variable
        if (detectionFrame % skipFrames === 0) {
          gotHands(results);
        }
      });
      connections = handPose.getConnections();
      console.log("Hand detection setup complete");
    } else {
      console.log("handPose not available");
    }
  }
  
  if (mode === 'face' || mode === 'both') {
    console.log("Setting up face detection...");
    if (typeof faceMesh !== 'undefined') {
      faceMesh.detectStart(video, (results) => {
        // Use the shared detectionFrame variable
        if (detectionFrame % skipFrames === 0) {
          gotFaces(results);
        }
      });
      console.log("Face detection setup complete");
    } else {
      console.log("faceMesh not available");
    }
  }

  console.log("Creating painting buffer...");
  // Create painting buffer
  let canvasWidth = typeof CaptureWidth !== 'undefined' ? CaptureWidth : 1280;
  let canvasHeight = typeof CaptureHeight !== 'undefined' ? CaptureHeight : 720;
  painting = createGraphics(canvasWidth, canvasHeight);
  painting.colorMode(HSB);
  painting.clear();
  console.log("Painting buffer created");
}

console.log("videoLoaded function defined");

// Reset frame counter when switching modes
console.log("About to define resetDetectionFrame function");
function resetDetectionFrame() {
  detectionFrame = 0;
}
console.log("resetDetectionFrame function defined");

console.log("About to define gotFaces function");
// Callback functions with safety checks
function gotFaces(results) {
  if (typeof faces !== 'undefined') {
    faces = results;
    if (results.length > 0 && !firstDetection) {
      firstDetection = true;
      console.log("First face detected!");
    }
  }
}
console.log("gotFaces function defined");

console.log("About to define gotHands function");
function gotHands(results) {
  if (typeof hands !== 'undefined') {
    hands = results;
    if (results.length > 0 && !firstDetection) {
      firstDetection = true;
      console.log("First hand detected!");
    }
  }
}
console.log("gotHands function defined");

console.log("About to define isSystemReady function");
// Check if system is ready
function isSystemReady() {
  return videoReady && firstDetection;
}
console.log("isSystemReady function defined");

console.log("About to define initializeVideo function");
// Initialize video capture
function initializeVideo() {
  let useWebCam = typeof webCam !== 'undefined' ? webCam : true;
  let flipVideoSetting = typeof flipVideo !== 'undefined' ? flipVideo : true;
  let canvasWidth = typeof CaptureWidth !== 'undefined' ? CaptureWidth : 1280;
  let canvasHeight = typeof CaptureHeight !== 'undefined' ? CaptureHeight : 720;
  let videoFileToUse = typeof videoFile !== 'undefined' ? videoFile : "hands1.mov";
  
  if (useWebCam) {
    // Create the webcam video and hide it
    video = createCapture(VIDEO, {flipped: flipVideoSetting}, videoLoaded);
    video.size(canvasWidth, canvasHeight);
    video.hide();
  } else {
    video = createVideo(videoFileToUse, videoLoaded);
    video.volume(0);
    video.loop();
    video.play();
    video.size(canvasWidth, canvasHeight);
    video.hide();
  }
}
console.log("initializeVideo function defined");

console.log("About to define gesture detection functions");
// ----=  GESTURE / EXPRESSION DETECTION  =----

// detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"
// detectFaceExpression(face) returns "Surprised", "Neutral", or "Smiling"

// Add gesture detection function
console.log("About to define detectHandGesture function");
function detectHandGesture(hand) {
  if (!hand || hand.confidence < 0.7) return null;
  
  // Pinch detection
  let thumbTip = hand.thumb_tip;
  let indexTip = hand.index_finger_tip;
  let pinchDist = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
  
  if (pinchDist < 30) {
    return "Pinch";
  }
  
  // Peace sign detection
  let indexUp = hand.index_finger_tip.y < hand.index_finger_pip.y - 20;
  let middleUp = hand.middle_finger_tip.y < hand.middle_finger_pip.y - 20;
  let ringDown = hand.ring_finger_tip.y > hand.ring_finger_pip.y;
  let pinkyDown = hand.pinky_finger_tip.y > hand.pinky_finger_pip.y;
  
  if (indexUp && middleUp && ringDown && pinkyDown) {
    return "Peace";
  }
  
  // Thumbs up detection
  let thumbUp = hand.thumb_tip.y < hand.thumb_ip.y - 20;
  let fingersDown = 
    hand.index_finger_tip.y > hand.index_finger_mcp.y &&
    hand.middle_finger_tip.y > hand.middle_finger_mcp.y &&
    hand.ring_finger_tip.y > hand.ring_finger_mcp.y &&
    hand.pinky_finger_tip.y > hand.pinky_finger_mcp.y;
  
  if (thumbUp && fingersDown) {
    return "Thumbs Up";
  }
  
  // Pointing detection
  let indexExtended = hand.index_finger_tip.y < hand.index_finger_mcp.y - 20;
  let othersClosed = 
    hand.middle_finger_tip.y > hand.middle_finger_pip.y &&
    hand.ring_finger_tip.y > hand.ring_finger_pip.y &&
    hand.pinky_finger_tip.y > hand.pinky_finger_pip.y;
  
  if (indexExtended && othersClosed) {
    return "Pointing";
  }
  
  // Open palm
  let allExtended = 
    hand.index_finger_tip.y < hand.index_finger_mcp.y &&
    hand.middle_finger_tip.y < hand.middle_finger_mcp.y &&
    hand.ring_finger_tip.y < hand.ring_finger_mcp.y &&
    hand.pinky_finger_tip.y < hand.pinky_finger_mcp.y;
  
  if (allExtended) {
    return "Open Palm";
  }
  
  // Fist
  let allClosed = 
    hand.index_finger_tip.y > hand.index_finger_mcp.y &&
    hand.middle_finger_tip.y > hand.middle_finger_mcp.y &&
    hand.ring_finger_tip.y > hand.ring_finger_mcp.y &&
    hand.pinky_finger_tip.y > hand.pinky_finger_mcp.y;
  
  if (allClosed) {
    return "Fist";
  }
  
  return null;
}
console.log("detectHandGesture function defined");

console.log("About to define detectFaceExpression function");
// Simple face expression detection
function detectFaceExpression(face) {
  if (!face) return null;
  
  // Simple expression detection based on mouth
  let mouthHeight = face.lips.height;
  let mouthWidth = face.lips.width;
  let ratio = mouthHeight / mouthWidth;
  
  if (ratio > 0.5) {
    return "Surprised";
  } else if (ratio < 0.2) {
    return "Neutral";
  } else {
    return "Smiling";
  }
}
console.log("detectFaceExpression function defined");

console.log("About to define UI system functions");
// ----= UI SYSTEM FUNCTIONS =----

console.log("About to define setupUI function");
function setupUI() {
  console.log("UI initialized");
  // Detect which page we're on based on the URL
  let path = window.location.pathname;

  if (path.includes('HandTracker.html')) {
    currentMode = 'hands';
  } else if (path.includes('FaceTracker.html')) {
    currentMode = 'face';
  } else if (path.includes('BothTracker.html') || path.includes('index.html')) {
    currentMode = 'both';
  }

}
console.log("setupUI function defined");

console.log("About to define drawUI function");
function drawUI() {
  if (!uiVisible) return;
  
  push();
  
  // Semi-transparent background panel
  fill(0, 0, 0, 180);
  noStroke();
  rect(UI_PADDING, UI_PADDING, 200, 300, 10);
  
  // Title
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("\"React\" ML5.js Puppet", UI_PADDING + 15, UI_PADDING + 15);
  
  // Mode buttons
  let buttonY = UI_PADDING + 50;
  
  // Hands button - now navigates to HandTracker.html
  drawButton("Hands", UI_PADDING + 15, buttonY, 170, BUTTON_HEIGHT, 
    currentMode === 'hands', () => navigateToPage('HandTracker.html'));
  
  // Face button - now navigates to FaceTracker.html
  buttonY += BUTTON_HEIGHT + BUTTON_SPACING;
  drawButton("Face", UI_PADDING + 15, buttonY, 170, BUTTON_HEIGHT,
    currentMode === 'face', () => navigateToPage('FaceTracker.html'));
  
  // Both button - now navigates to BothTracker.html
  buttonY += BUTTON_HEIGHT + BUTTON_SPACING;
  drawButton("Both", UI_PADDING + 15, buttonY, 170, BUTTON_HEIGHT,
    currentMode === 'both', () => navigateToPage('BothTracker.html'));
  
  // Separator line
  buttonY += BUTTON_HEIGHT + BUTTON_SPACING * 2;
  stroke(255, 100);
  line(UI_PADDING + 15, buttonY, UI_PADDING + 185, buttonY);
  
  // Toggle buttons
  buttonY += BUTTON_SPACING * 2;
  
  // Debug info toggle
  drawToggle("Show Debug", UI_PADDING + 15, buttonY, showDebugInfo,
    () => showDebugInfo = !showDebugInfo);
  
  // Keypoints toggle
  buttonY += 30;
  drawToggle("Show Points", UI_PADDING + 15, buttonY, showKeypoints,
    () => showKeypoints = !showKeypoints);
  
  // Clear canvas button (if using painting)
  if (typeof painting !== 'undefined') {
    buttonY += 40;
    drawButton("Clear Drawing", UI_PADDING + 15, buttonY, 170, 35,
      false, clearPainting);
  }
  
  pop();
  
  // Draw debug info if enabled
  if (showDebugInfo) {
    drawDebugInfo();
  }
  
  // Hide/Show UI hint
  push();
  fill(255, 200);
  textAlign(RIGHT, TOP);
  textSize(16);
  text("Press 'H' to hide/show controls", width - 10, height - 40);
  text("Press 'S' to save a screenshot", width - 10, height - 20);
  pop();
}
console.log("drawUI function defined");

console.log("About to define navigation functions");
// Navigation function
function navigateToPage(page) {
  // Don't navigate if already on selected page
  if ((page === 'HandTracker.html' && currentMode === 'hands') ||
      (page === 'FaceTracker.html' && currentMode === 'face') ||
      (page === 'BothTracker.html' && currentMode === 'both')) {
    return;
  }
  
  console.log("Navigating to:", page);
  resetDetectionFrame();
  window.location.href = page;
}
console.log("navigateToPage function defined");

console.log("About to define button functions");
// Button drawing function 
function drawButton(label, x, y, w, h, isActive, onClick) {
  push();
  
  // Check if mouse is over button
  let isHover = mouseX > x && mouseX < x + w && 
                mouseY > y && mouseY < y + h;
  
  // Button background
  if (isActive) {
    fill(0, 150, 255);
  } else if (isHover) {
    fill(100, 100, 100);
  } else {
    fill(60, 60, 60);
  }
  
  stroke(255, isHover ? 255 : 100);
  strokeWeight(1);
  rect(x, y, w, h, 5);
  
  // Button text
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(label, x + w/2, y + h/2);
  
  // Store button info for click detection
  if (!window.uiButtons) window.uiButtons = [];
  window.uiButtons.push({x, y, w, h, onClick});
  
  pop();
}
console.log("drawButton function defined");

console.log("About to define drawToggle function");
// Toggle switch drawing - unchanged
function drawToggle(label, x, y, isOn, onClick) {
  push();
  
  // Label
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(label, x, y);
  
  // Toggle switch
  let toggleX = x + 120;
  let toggleWidth = 40;
  let toggleHeight = 20;
  
  // Background
  if (isOn){
    fill(0, 200, 0);
  }else{
    fill(100);
  }
  
  noStroke();
  rect(toggleX, y - toggleHeight/2, toggleWidth, toggleHeight, toggleHeight/2);
  
  // Circle
  fill(255);
  let circleX = isOn ? toggleX + toggleWidth - 12 : toggleX + 12;
  circle(circleX, y, 16);
  
  // Click area
  if (!window.uiButtons) window.uiButtons = [];
  window.uiButtons.push({
    x: toggleX - 10, 
    y: y - 15, 
    w: toggleWidth + 20, 
    h: 30, 
    onClick
  });
  
  pop();
}
console.log("drawToggle function defined");

console.log("About to define debug functions");
// ----=  Debug info  =----

function drawDebugInfo() {
  push();
  
  // Collect available debug info
  let debugLines = [];
  
  // Always available
  debugLines.push(`FPS: ${frameRate().toFixed(1)}`);
  debugLines.push(`Mode: ${currentMode}`);
  debugLines.push(`Canvas: ${width}x${height}`);
  
  // Page-specific info
  switch(currentMode) {
    case 'hands':
      if (typeof hands !== 'undefined') {
        debugLines.push(`Hands detected: ${hands.length}`);
        
        // Show which hands are detected
        let detectedHands = [];
        for (let hand of hands) {
          if (hand.confidence > 0.5) {
            detectedHands.push(hand.handedness);
          }
        }
        if (detectedHands.length > 0) {
          debugLines.push(`Detected: ${detectedHands.join(', ')}`);
        }
        
        // Show confidence for each hand
        for (let i = 0; i < hands.length; i++) {
          if (hands[i].confidence > 0.5) {
            let handType = hands[i].handedness;
            let conf = (hands[i].confidence * 100).toFixed(1);
            debugLines.push(`${handType}: ${conf}%`);
            
            // Check for gestures
            let gesture = detectHandGesture(hands[i]);
            if (gesture) {
              debugLines.push(`Gesture: ${gesture}`);
            }
          }
        }
      }
      break;
      
    case 'face':
      if (typeof faces !== 'undefined') {
        debugLines.push(`Faces detected: ${faces.length}`);
        if (faces.length > 0) {
          debugLines.push(`Face points: ${faces[0].keypoints ? faces[0].keypoints.length : 0}`);
          
          // Detect expression
          let expression = detectFaceExpression(faces[0]);
          if (expression) {
            debugLines.push(`Expression: ${expression}`);
          }
        }
      }
      break;
      
    case 'both':
      // Detailed hand info for both mode
      if (typeof hands !== 'undefined') {
        debugLines.push(`--- HANDS ---`);
        debugLines.push(`Detected: ${hands.length}`);
        
        for (let i = 0; i < hands.length; i++) {
          if (hands[i].confidence > 0.5) {
            let hand = hands[i];
            let handType = hand.handedness;
            let conf = (hand.confidence * 100).toFixed(1);
            debugLines.push(`${handType}: ${conf}%`);
            
            // Check for gestures
            let gesture = detectHandGesture(hand);
            if (gesture) {
              debugLines.push(`${handType} gesture: ${gesture}`);
            }
          }
        }
      }
      
      // Detailed face info for both mode
      if (typeof faces !== 'undefined') {
        debugLines.push(`--- FACES ---`);
        debugLines.push(`Detected: ${faces.length}`);
        
        if (faces.length > 0) {
          for (let i = 0; i < faces.length && i < 2; i++) { // Show max 2 faces
            let face = faces[i];
            if (i > 0) debugLines.push(`Face ${i + 1}:`);
            
            // Face dimensions
            let faceSize = Math.round((face.faceOval.width + face.faceOval.height) / 2);
            debugLines.push(`Size: ${Math.round(faceSize / 10) * 10}px`);
            
            // Detect expression
            let expression = detectFaceExpression(face);
            if (expression) {
              debugLines.push(`Expression: ${expression}`);
            }
          }
        }
      }
      break;
  }
  
  
  // Calculate background size based on number of lines
  let bgHeight = 20 + (debugLines.length * 18);
  
  // Background
  fill(0, 0, 0, 180);
  noStroke();
  rect(width - 220, UI_PADDING, 200, bgHeight, 10);
  
  // Draw all debug lines
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  let infoX = width - 205;
  let infoY = UI_PADDING + 15;
  
  for (let i = 0; i < debugLines.length; i++) {
    // Add some color coding
    if (debugLines[i].includes('---')) {
      fill(100, 200, 255); // Blue for headers
    } else if (debugLines[i].includes('gesture:') || debugLines[i].includes('Expression:')) {
      fill(100, 255, 100); // Green for detected features
    } else {
      fill(255); // White for normal text
    }
    
    text(debugLines[i], infoX, infoY + (i * 18));
  }
  
  pop();
}
console.log("drawDebugInfo function defined");

console.log("About to define clearPainting function");
// Clear painting canvas
function clearPainting() {
  if (painting) {
    painting.clear();
    console.log("Painting cleared");
  }
}
console.log("clearPainting function defined");

console.log("About to define event handlers");
// Mouse click handling
function mousePressed() {
  if (!window.uiButtons) return;
  
  // Check all UI buttons
  for (let button of window.uiButtons) {
    if (mouseX > button.x && mouseX < button.x + button.w &&
        mouseY > button.y && mouseY < button.y + button.h) {
      button.onClick();
      break;
    }
  }
  
  // Handle sand simulation clicks (if available)
  if (typeof handleSandSimulationClick === 'function') {
    handleSandSimulationClick(mouseX, mouseY);
  }
  
  // Clear buttons array for next frame
  window.uiButtons = [];
}
console.log("mousePressed function defined");

console.log("About to define keyPressed function");
// Keyboard shortcuts
function keyPressed() {
  // Hide/show UI
  if (key === 'h' || key === 'H') {
    uiVisible = !uiVisible;
  } 
  
  if (key === 'k' || key === 'K') {
    showKeypoints = !showKeypoints;
  }
  
  // Quick mode switches - now navigate between pages
  if (key === '1') navigateToPage('HandTracker.html');
  if (key === '2') navigateToPage('FaceTracker.html');
  if (key === '3') navigateToPage('BothTracker.html');
  
  // Toggle debug
  if (key === 'd' || key === 'D') {
    showDebugInfo = !showDebugInfo;
  }
  
  // Clear painting
  if (key === 'c' || key === 'C') {
    clearPainting();
  }
  
  // Take screenshot
  if (key === '!') {
    saveCanvas('ml5-capture-' + frameCount, 'png');
  }
  
  // Handle sand simulation keyboard controls (if available)
  if (typeof handleSandSimulationKeyPress === 'function') {
    handleSandSimulationKeyPress(key);
  }
}
console.log("keyPressed function defined");

console.log("About to define checks function");
// start of draw() loop
function checks() {
  // Check if system is ready
  if (!isSystemReady()) {
    showLoadingAnimation();
    return false; // Signal that system is not ready
  }

  // Draw the video
  let flipVideoSetting = typeof flipVideo !== 'undefined' ? flipVideo : true;
  let useWebCam = typeof webCam !== 'undefined' ? webCam : true;
  
  if (flipVideoSetting) {
    if (useWebCam) {
      image(video, 0, 0, width, height);
    } else {
      push();
      translate(width, 0);
      scale(-1, 1);
      image(video, 0, 0, width, height);
      pop();
    }
  } else {
    image(video, 0, 0, width, height);
  }
  
  return true; // Signal that system is ready
}
console.log("checks function defined");

console.log("All functions defined - initialization complete!");