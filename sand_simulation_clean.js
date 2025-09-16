// ===== STANDALONE SAND SIMULATION =====
// Refactored from music_starter.js - removed all music dependencies
// Ready for integration with hand tracking coordinates
// Sized for 1/10 of webcam space (128x72) within 1280x720 canvas

// ===== GLOBAL VARIABLES =====
let cellSize = 2; // Smaller cells for 1/10 scale
let sandSimWidth = 128; // 1/10 of 1280
let sandSimHeight = 72; // 1/10 of 720
let gridWidth = sandSimWidth / cellSize;   // 64 cells
let gridHeight = sandSimHeight / cellSize; // 36 cells

let sandGrid = [];
let plantColorGrid = [];

// Sand simulation position on screen (top-right corner)
let sandSimX = 1280 - sandSimWidth - 20; // 20px margin from right edge
let sandSimY = 20; // 20px margin from top

// ===== COLOR DEFINITIONS =====
let sandcolor = [194, 178, 128];
let sandcolor2 = [210, 180, 140];
let sandcolor3 = [180, 160, 120];
let sandcolor4 = [160, 140, 100];
let sandcolor5 = [140, 120, 80];
let watercolor = [100, 150, 255];
let firecolor = [255, 100, 0];
let plantcolor = [50, 200, 50];
let buildingcolor = [100, 100, 100];

// ===== SIMULATION PARAMETERS =====
let windIntensity = 0.1;
let plantGrowthRate = 0.001;
let fireSpreadRate = 0.05;
let frameCounter = 0;

// Click interaction variables
let currentSandType = 1; // 1-8 for different sand colors, 10 for water, 20 for fire
let brushSize = 2; // Radius of brush when clicking

// ===== P5.JS INTEGRATION FUNCTIONS =====
function setupSandSimulation() {
  console.log("setupSandSimulation() called");
  setupSandGrid();
  console.log("Sand simulation initialized - Size:", sandSimWidth + "x" + sandSimHeight);
  console.log("Sand simulation position:", sandSimX + ", " + sandSimY);
  console.log("Grid size:", gridWidth + "x" + gridHeight, "Cell size:", cellSize);
}

function drawSandSimulation() {
  // Draw sand simulation in its designated area
  if (frameCount % 60 === 0) { // Log every 60 frames to avoid spam
    console.log("drawSandSimulation() called - frame", frameCount);
  }
  push();
  translate(sandSimX, sandSimY);
  
  // Draw background for sand area
  fill(20, 20, 10);
  rect(0, 0, sandSimWidth, sandSimHeight);
  
  // Update simulation
  fallingSand();
  
  // Render all particles
  drawSand();
  
  // Draw border around sand simulation
  stroke(255, 100);
  strokeWeight(1);
  noFill();
  rect(0, 0, sandSimWidth, sandSimHeight);
  
  pop();
  
  frameCounter++;
}

// ===== CORE SIMULATION FUNCTIONS =====

function setupSandGrid() {
  // Initialize the sand grid
  for (let x = 0; x < gridWidth; x++) {
    sandGrid[x] = [];
    plantColorGrid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      sandGrid[x][y] = 0; // 0 = empty
      plantColorGrid[x][y] = 0;
    }
  }
}

function fallingSand() {
  // Main physics simulation - runs from bottom to top
  for (let y = gridHeight - 2; y >= 0; y--) {
    for (let x = 0; x < gridWidth; x++) {

      // Buildings destroyed by water
      if (sandGrid[y][x] == 18){
        if (y > 0 && sandGrid[y-1][x] == 10){
          sandGrid[y][x] = 10;
        }
        else if (y < gridHeight - 1 && sandGrid[y+1][x] == 10){
          sandGrid[y][x] = 10;
        }
        else if (x > 0 && sandGrid[y][x-1] == 10){
          sandGrid[y][x] = 10;
        } 
        else if (x < gridWidth - 1 && sandGrid[y][x+1] == 10){
          sandGrid[y][x] = 10;
        }
      } 

      // Fire simulation
      if (sandGrid[y][x] == 20){
        // Fire extinguishes in water
        if (y > 0 && sandGrid[y-1][x] == 10){
          sandGrid[y][x] = 10;
        }
        
        // Random chance for fire to spread 
        let spreadChance = random(0, 1);
        if (spreadChance < fireSpreadRate) { 
          // Fire spreads upward to plants 
          if (y > 0 && sandGrid[y-1][x] > 10 && sandGrid[y-1][x] < 18){
            sandGrid[y-1][x] = 20;
          }
          
          // Fire spreads diagonally
          if (random() < 0.3) { 
            if (y > 0 && x > 0 && sandGrid[y-1][x-1] > 10 && sandGrid[y-1][x-1] < 18){
              sandGrid[y-1][x-1] = 20;
            }
            if (y > 0 && x < gridWidth - 1 && sandGrid[y-1][x+1] > 10 && sandGrid[y-1][x+1] < 18){
              sandGrid[y-1][x+1] = 20;
            }
          }

          // Fire spreads horizontally to adjacent cells
          if (random() < 0.2) { 
            if (x > 0 && sandGrid[y][x-1] > 10 && sandGrid[y][x-1] < 18) {
              sandGrid[y][x-1] = 20;
            }
            if (x < gridWidth - 1 && sandGrid[y][x+1] > 10 && sandGrid[y][x+1] < 18) {
              sandGrid[y][x+1] = 20;
            }
          }
        }
        
        // Fire burns out randomly
        if (random() < 0.02) {
          sandGrid[y][x] = 0;
        }
      }

      // Water physics
      if (sandGrid[y][x] == 10) {
        // Water flows down
        if (y < gridHeight - 1 && sandGrid[y+1][x] == 0) {
          sandGrid[y][x] = 0;
          sandGrid[y+1][x] = 10;
        }
        // Water flows left/right if can't go down
        else if (y < gridHeight - 1 && sandGrid[y+1][x] != 0) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && sandGrid[y][x + direction] == 0) {
            sandGrid[y][x] = 0;
            sandGrid[y][x + direction] = 10;
          }
        }
      }

      // Sand physics
      if (sandGrid[y][x] >= 1 && sandGrid[y][x] <= 8) {
        // Sand falls down
        if (y < gridHeight - 1 && sandGrid[y+1][x] == 0) {
          let temp = sandGrid[y][x];
          sandGrid[y][x] = 0;
          sandGrid[y+1][x] = temp;
        }
        // Sand slides diagonally
        else if (y < gridHeight - 1) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && 
              sandGrid[y+1][x + direction] == 0) {
            let temp = sandGrid[y][x];
            sandGrid[y][x] = 0;
            sandGrid[y+1][x + direction] = temp;
          }
        }
      }

      // Plant growth
      if (sandGrid[y][x] >= 11 && sandGrid[y][x] <= 17) {
        // Plants grow upward
        if (y > 0 && sandGrid[y-1][x] == 0 && random() < plantGrowthRate) {
          sandGrid[y-1][x] = sandGrid[y][x];
          plantColorGrid[y-1][x] = plantColorGrid[y][x];
        }
        
        // Plants spread horizontally
        if (random() < plantGrowthRate * 0.5) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && 
              sandGrid[y][x + direction] == 0) {
            sandGrid[y][x + direction] = sandGrid[y][x];
            plantColorGrid[y][x + direction] = plantColorGrid[y][x];
          }
        }
      }
    }
  }
}

function drawSand() {
  let sC = color(sandcolor);
  let sC2 = color(sandcolor2);
  let sC3 = color(sandcolor3);
  let sC4 = color(sandcolor4);
  let sC5 = color(sandcolor5);
  let wC = color(watercolor);
  let fC = color(firecolor);
  let pC = color(plantcolor);
  let bC = color(buildingcolor);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (sandGrid[x][y] != 0) {
        let pixelX = x * cellSize;
        let pixelY = y * cellSize;
        
        // Draw different particle types
        if (sandGrid[x][y] >= 1 && sandGrid[x][y] <= 8) {
          // Sand particles with different colors
          switch(sandGrid[x][y]) {
            case 1: fill(sC); break;
            case 2: fill(sC2); break;
            case 3: fill(sC3); break;
            case 4: fill(sC4); break;
            case 5: fill(sC5); break;
            case 6: fill(lerpColor(sC, sC2, 0.5)); break;
            case 7: fill(lerpColor(sC2, sC3, 0.5)); break;
            case 8: fill(lerpColor(sC3, sC4, 0.5)); break;
          }
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 10) {
          // Water
          fill(wC);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 20) {
          // Fire
          fill(fC);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] >= 11 && sandGrid[x][y] <= 17) {
          // Plants
          fill(plantColorGrid[x][y]);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 18) {
          // Buildings
          fill(bC);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
      }
    }
  }
}

// ===== SPAWNING FUNCTIONS =====

function spawnSandAtPosition(x, y, type = 1) {
  // Convert screen coordinates to grid coordinates
  let gridX = Math.floor(x / cellSize);
  let gridY = Math.floor(y / cellSize);
  
  // Check bounds
  if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) {
    return;
  }
  
  // Spawn sand in a small radius
  let brushRadius = brushSize;
  for (let dy = -brushRadius; dy <= brushRadius; dy++) {
    for (let dx = -brushRadius; dx <= brushRadius; dx++) {
      let newX = gridX + dx;
      let newY = gridY + dy;
      
      if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= brushRadius) {
          sandGrid[newY][newX] = type;
        }
      }
    }
  }
}

function spawnWaterAtPosition(x, y) {
  spawnSandAtPosition(x, y, 10);
}

function spawnFireAtPosition(x, y) {
  spawnSandAtPosition(x, y, 20);
}

function spawnPlantAtPosition(x, y) {
  let gridX = Math.floor(x / cellSize);
  let gridY = Math.floor(y / cellSize);
  
  if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
    let plantType = Math.floor(random(11, 18));
    sandGrid[gridY][gridX] = plantType;
    plantColorGrid[gridY][gridX] = color(
      random(50, 150), 
      random(150, 255), 
      random(50, 150)
    );
  }
}

function spawnBuildingAtPosition(x, y) {
  spawnSandAtPosition(x, y, 18);
}

// ===== HAND TRACKING INTEGRATION =====

function spawnSandFromHandPosition(handX, handY, sandType = 1) {
  // Convert hand coordinates to sand simulation coordinates
  let sandX = handX - sandSimX;
  let sandY = handY - sandSimY;
  
  // Check if hand is within sand simulation area
  if (sandX >= 0 && sandX <= sandSimWidth && sandY >= 0 && sandY <= sandSimHeight) {
    spawnSandAtPosition(sandX, sandY, sandType);
  }
}

function spawnWaterFromHandPosition(handX, handY) {
  spawnSandFromHandPosition(handX, handY, 10);
}

function spawnFireFromHandPosition(handX, handY) {
  spawnSandFromHandPosition(handX, handY, 20);
}

// ===== CLICK INTERACTION =====

function handleSandSimulationClick(mouseX, mouseY) {
  console.log("Sand click at:", mouseX + "," + mouseY, "Sand area:", sandSimX + "," + sandSimY, "to", (sandSimX + sandSimWidth) + "," + (sandSimY + sandSimHeight));
  
  // Check if click is within sand simulation area
  if (mouseX >= sandSimX && mouseX <= sandSimX + sandSimWidth && 
      mouseY >= sandSimY && mouseY <= sandSimY + sandSimHeight) {
    
    // Convert to sand simulation coordinates
    let sandX = mouseX - sandSimX;
    let sandY = mouseY - sandSimY;
    console.log("Click inside sand area! Converting to sand coords:", sandX + "," + sandY);
    
    // Spawn sand at clicked position
    spawnSandAtPosition(sandX, sandY, currentSandType);
    
    console.log("Sand spawned at:", sandX, sandY, "Type:", currentSandType);
  }
}

// ===== CONTROL FUNCTIONS =====

function setWindIntensity(intensity) {
  windIntensity = Math.max(0, Math.min(intensity, 1));
}

function setPlantGrowthRate(rate) {
  plantGrowthRate = Math.max(0, Math.min(rate, 0.01));
}

function setFireSpreadRate(rate) {
  fireSpreadRate = Math.max(0, Math.min(rate, 0.1));
}

function setSandType(type) {
  currentSandType = type;
}

function setBrushSize(size) {
  brushSize = Math.max(1, Math.min(size, 5));
}

function clearAllSand() {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      sandGrid[x][y] = 0;
      plantColorGrid[x][y] = 0;
    }
  }
}

// ===== KEYBOARD CONTROLS =====
function handleSandSimulationKeyPress(key) {
  switch(key) {
    case '1': currentSandType = 1; console.log("Sand Type: 1"); break;
    case '2': currentSandType = 2; console.log("Sand Type: 2"); break;
    case '3': currentSandType = 3; console.log("Sand Type: 3"); break;
    case '4': currentSandType = 4; console.log("Sand Type: 4"); break;
    case '5': currentSandType = 5; console.log("Sand Type: 5"); break;
    case '6': currentSandType = 6; console.log("Sand Type: 6"); break;
    case '7': currentSandType = 7; console.log("Sand Type: 7"); break;
    case '8': currentSandType = 8; console.log("Sand Type: 8"); break;
    case 'w': currentSandType = 10; console.log("Sand Type: Water"); break;
    case 'f': currentSandType = 20; console.log("Sand Type: Fire"); break;
    case 'c': clearAllSand(); console.log("Sand Cleared"); break;
    case '+': brushSize = Math.min(brushSize + 1, 5); console.log("Brush Size:", brushSize); break;
    case '-': brushSize = Math.max(brushSize - 1, 1); console.log("Brush Size:", brushSize); break;
  }
}