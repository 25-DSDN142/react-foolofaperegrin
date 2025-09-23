// ===== STANDALONE SAND SIMULATION =====
// Refactored from music_starter.js - removed all music dependencies
// Ready for integration with hand tracking coordinates
// Full screen overlay (1280x720) with 4px cells for hand tracking integration

// ===== GLOBAL VARIABLES =====
let cellSize = 8; // Larger cells for better visibility
let sandSimWidth = 1280; // Full webcam width
let sandSimHeight = 720; // Full webcam height
let gridWidth = sandSimWidth / cellSize;   // 320 cells
let gridHeight = sandSimHeight / cellSize; // 180 cells

let sandGrid = [];
let plantColorGrid = [];

// Sand simulation position on screen (full screen overlay)
let sandSimX = 0; // Full width overlay
let sandSimY = 0; // Full height overlay

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
let windIntensity = 1.1;
let plantGrowthRate = 0.01;
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
  // Draw sand simulation as full screen overlay
  if (frameCount % 60 === 0) { // Log every 60 frames to avoid spam
    console.log("drawSandSimulation() called - frame", frameCount);
  }
  push();
  translate(sandSimX, sandSimY);
  
  // Update simulation
  fallingSand();
  
  // Render all particles with transparency
  drawSand();
  
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
  // Safety check - ensure grid is initialized
  if (!sandGrid || sandGrid.length === 0 || !sandGrid[0]) {
    return;
  }
  
  // Main physics simulation - runs from bottom to top
  for (let y = gridHeight - 2; y >= 0; y--) {
    for (let x = 0; x < gridWidth; x++) {

      // Buildings destroyed by water
      if (sandGrid[x][y] == 18){
        if (y > 0 && sandGrid[x][y-1] == 10){
          sandGrid[x][y] = 10;
        }
        else if (y < gridHeight - 1 && sandGrid[x][y+1] == 10){
          sandGrid[x][y] = 10;
        }
        else if (x > 0 && sandGrid[x-1][y] == 10){
          sandGrid[x][y] = 10;
        } 
        else if (x < gridWidth - 1 && sandGrid[x+1][y] == 10){
          sandGrid[x][y] = 10;
        }
      } 

      // Fire simulation
      if (sandGrid[x][y] == 20){
        // Fire extinguishes in water
        if (y > 0 && sandGrid[x][y-1] == 10){
          sandGrid[x][y] = 10;
        }
        
        // Random chance for fire to spread 
        let spreadChance = random(0, 1);
        if (spreadChance < fireSpreadRate) { 
          // Fire spreads upward to plants 
          if (y > 0 && sandGrid[x][y-1] > 10 && sandGrid[x][y-1] < 18){
            sandGrid[x][y-1] = 20;
          }
          
          // Fire spreads diagonally
          if (random() < 0.3) { 
            if (y > 0 && x > 0 && sandGrid[x-1][y-1] > 10 && sandGrid[x-1][y-1] < 18){
              sandGrid[x-1][y-1] = 20;
            }
            if (y > 0 && x < gridWidth - 1 && sandGrid[x+1][y-1] > 10 && sandGrid[x+1][y-1] < 18){
              sandGrid[x+1][y-1] = 20;
            }
          }

          // Fire spreads horizontally to adjacent cells
          if (random() < 0.2) { 
            if (x > 0 && sandGrid[x-1][y] > 10 && sandGrid[x-1][y] < 18) {
              sandGrid[x-1][y] = 20;
            }
            if (x < gridWidth - 1 && sandGrid[x+1][y] > 10 && sandGrid[x+1][y] < 18) {
              sandGrid[x+1][y] = 20;
            }
          }
        }
        
        // Fire burns out randomly
        if (random() < 0.02) {
          sandGrid[x][y] = 0;
        }
      }

      // Water physics
      if (sandGrid[x][y] == 10) {
        // Water flows down
        if (y < gridHeight - 1 && sandGrid[x][y+1] == 0) {
          sandGrid[x][y] = 0;
          sandGrid[x][y+1] = 10;
        }
        // Water flows left/right if can't go down
        else if (y < gridHeight - 1 && sandGrid[x][y+1] != 0) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && sandGrid[x + direction][y] == 0) {
            sandGrid[x][y] = 0;
            sandGrid[x + direction][y] = 10;
          }
        }
      }

      // Sand physics
      if (sandGrid[x][y] >= 1 && sandGrid[x][y] <= 8) {
        // Sand falls down
        if (y < gridHeight - 1 && sandGrid[x][y+1] == 0) {
          let temp = sandGrid[x][y];
          sandGrid[x][y] = 0;
          sandGrid[x][y+1] = temp;
        }
        // Sand slides diagonally
        else if (y < gridHeight - 1) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && 
              sandGrid[x + direction][y+1] == 0) {
            let temp = sandGrid[x][y];
            sandGrid[x][y] = 0;
            sandGrid[x + direction][y+1] = temp;
          }
          //Sand sinks in water
          else if (y < gridHeight - 1 && sandGrid[x][y+1] == 10) {
            
            
            sandGrid[x][y+1] = sandGrid[x][y];;
            sandGrid[x][y] = 10;
          } else if (y < gridHeight - 1 && x > 0 && sandGrid[x-1][y+1] == 10) {
            
            sandGrid[x-1][y+1] = sandGrid[x][y];;
            sandGrid[x][y] = 10;
          } else if (y < gridHeight - 1 && x < gridWidth - 1 && sandGrid[x+1][y+1] == 10) {
            
            sandGrid[x+1][y+1] = sandGrid[x][y];;
            sandGrid[x][y] = 10;
          }
        }
      }

      // Plant growth
      if (sandGrid[x][y] >= 11 && sandGrid[x][y] <= 17) {
        // Plants grow upward
        if (y > 0 && sandGrid[x][y-1] == 0 && random() < plantGrowthRate) {
          sandGrid[x][y-1] = sandGrid[x][y];
          plantColorGrid[x][y-1] = plantColorGrid[x][y];
        }
        
        // Plants spread horizontally
        if (random() < plantGrowthRate * 0.5) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && 
              sandGrid[x + direction][y] == 0) {
            sandGrid[x + direction][y] = sandGrid[x][y];
            plantColorGrid[x + direction][y] = plantColorGrid[x][y];
          }

          
        }

      }
      //Plants spawn on sand
      if (sandGrid[x][y] < 10 && sandGrid[x][y] > 0 && y > 0 && sandGrid[x][y-1] == 10) {
        let growChance = random(0, 1);
        if (growChance < 0.5) {
        sandGrid[x][y-1] = Math.floor(random(11, 18));
        plantColorGrid[x][y-1] = color(
          random(50, 150), 
          random(150, 255), 
          random(50, 150),
          160
        );
        }
      }
    }
  }
}

function drawSand() {
  noStroke();

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (sandGrid[x][y] != 0) {
        let pixelX = x * cellSize;
        let pixelY = y * cellSize;
        
        // Draw different particle types
        if (sandGrid[x][y] >= 1 && sandGrid[x][y] <= 8) {
          // Sand particles with different colors
          switch(sandGrid[x][y]) {
            case 1: fill(sandcolor[0], sandcolor[1], sandcolor[2], 180); break;
            case 2: fill(sandcolor2[0], sandcolor2[1], sandcolor2[2], 180); break;
            case 3: fill(sandcolor3[0], sandcolor3[1], sandcolor3[2], 180); break;
            case 4: fill(sandcolor4[0], sandcolor4[1], sandcolor4[2], 180); break;
            case 5: fill(sandcolor5[0], sandcolor5[1], sandcolor5[2], 180); break;
            case 6: fill(lerpColor(color(sandcolor[0], sandcolor[1], sandcolor[2]), color(sandcolor2[0], sandcolor2[1], sandcolor2[2]), 0.5)); break;
            case 7: fill(lerpColor(color(sandcolor2[0], sandcolor2[1], sandcolor2[2]), color(sandcolor3[0], sandcolor3[1], sandcolor3[2]), 0.5)); break;
            case 8: fill(lerpColor(color(sandcolor3[0], sandcolor3[1], sandcolor3[2]), color(sandcolor4[0], sandcolor4[1], sandcolor4[2]), 0.5)); break;
          }
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 10) {
          // Water
          fill(watercolor[0], watercolor[1], watercolor[2], 200);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 20) {
          // Fire
          fill(firecolor[0], firecolor[1], firecolor[2], 220);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] >= 11 && sandGrid[x][y] <= 17) {
          // Plants
          fill(plantColorGrid[x][y]);
          rect(pixelX, pixelY, cellSize, cellSize);
        }
        else if (sandGrid[x][y] == 18) {
          // Buildings
          fill(buildingcolor[0], buildingcolor[1], buildingcolor[2], 200);
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
          sandGrid[newX][newY] = type;
          
          // Set plant color for plant types (11-17)
          if (type >= 11 && type <= 17) {
            plantColorGrid[newX][newY] = color(
              random(50, 150), 
              random(150, 255), 
              random(50, 150),
              160
            );
          }
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
    sandGrid[gridX][gridY] = plantType;
    plantColorGrid[gridX][gridY] = color(
      random(50, 150), 
      random(150, 255), 
      random(50, 150)
    );
  }
}

function spawnBuildingAtPosition(x, y) {
  spawnSandAtPosition(x, y, 18);
}

// ===== CLICK INTERACTION =====

function handleSandSimulationClick(mouseX, mouseY) {
  console.log("Sand click at:", mouseX + "," + mouseY, "Full screen area: 0,0 to", sandSimWidth + "," + sandSimHeight);
  
  // Check if click is within sand simulation area (now full screen)
  if (mouseX >= 0 && mouseX <= sandSimWidth && mouseY >= 0 && mouseY <= sandSimHeight) {
    console.log("Click inside sand area! Direct coordinates:", mouseX + "," + mouseY);
    
    // Spawn sand at clicked position (no coordinate conversion needed)
    spawnSandAtPosition(mouseX, mouseY, currentSandType);
    
    console.log("Sand spawned at:", mouseX, mouseY, "Type:", currentSandType);
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
