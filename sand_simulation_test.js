// ===== SIMPLE SAND SIMULATION TEST =====
// Minimal version to test integration

let cellSize = 2;
let sandSimWidth = 128;
let sandSimHeight = 72;
let gridWidth = sandSimWidth / cellSize;
let gridHeight = sandSimHeight / cellSize;

let sandGrid = [];
let sandSimX = 1280 - sandSimWidth - 20;
let sandSimY = 20;

function setupSandSimulation() {
  setupSandGrid();
  console.log("Sand simulation initialized - Size:", sandSimWidth + "x" + sandSimHeight);
}

function setupSandGrid() {
  for (let y = 0; y < gridHeight; y++) {
    sandGrid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      sandGrid[y][x] = 0;
    }
  }
  
  // Add solid ground at the bottom
  for (let x = 0; x < gridWidth; x++) {
    sandGrid[gridHeight-1][x] = 9;
  }
}

function drawSandSimulation() {
  push();
  translate(sandSimX, sandSimY);
  
  // Draw background
  fill(20, 20, 10);
  rect(0, 0, sandSimWidth, sandSimHeight);
  
  // Draw sand
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (sandGrid[y][x] === 1) {
        fill(233, 221, 172);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else if (sandGrid[y][x] === 9) {
        fill(100, 100, 100);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
  
  // Draw border
  stroke(255, 100);
  strokeWeight(1);
  noFill();
  rect(0, 0, sandSimWidth, sandSimHeight);
  
  pop();
}

function spawnSandFromHandPosition(handX, handY, sandType = 1) {
  let sandX = handX - sandSimX;
  let sandY = handY - sandSimY;
  
  if (sandX >= 0 && sandX <= sandSimWidth && sandY >= 0 && sandY <= sandSimHeight) {
    let gridX = Math.floor(sandX / cellSize);
    let gridY = Math.floor(sandY / cellSize);
    
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      sandGrid[gridY][gridX] = sandType;
    }
  }
}

function handleSandSimulationClick(mouseX, mouseY) {
  if (mouseX >= sandSimX && mouseX <= sandSimX + sandSimWidth && 
      mouseY >= sandSimY && mouseY <= sandSimY + sandSimHeight) {
    
    let sandX = mouseX - sandSimX;
    let sandY = mouseY - sandSimY;
    
    let gridX = Math.floor(sandX / cellSize);
    let gridY = Math.floor(sandY / cellSize);
    
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      sandGrid[gridY][gridX] = 1;
    }
  }
}

function handleSandSimulationKeyPress(key) {
  if (key === 'c') {
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (sandGrid[y][x] < 9) {
          sandGrid[y][x] = 0;
        }
      }
    }
    console.log("Sand Cleared");
  }
}
