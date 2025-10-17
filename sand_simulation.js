// ===== SAND SIMULATION =====
// Refactored from music_starter.js 


//GLOBALS
let cellSize = 12; 
let sandSimWidth = 1280; 
let sandSimHeight = 720; 
let gridWidth = sandSimWidth / cellSize;  
let gridHeight = sandSimHeight / cellSize; 

//arrays
let sandGrid = [];
let plantColorGrid = [];


//Simulation variables
let fireSpreadRate = 0.05;
let plantGrowthRate = 0.002;


//images


// ===== COLOR DEFINITIONS =====
let sandcolor = 'rgb(233, 221, 172)';   // Color 1
let sandcolor2 = 'rgba(238, 223, 207, 0.83)';  // Color 2
let sandcolor3 = 'rgb(212, 178, 143)';   // Color 3
let sandcolor4 = 'rgb(255, 224, 208)';    // Color 4
let sandcolor5 = 'rgb(230, 211, 165)';    // Color 5
let sandcolor6 = 'rgb(255, 236, 183)';    // Color 6
let sandcolor7 = 'rgb(171, 226, 213)';    // Color 7
let sandcolor8 = 'rgb(255, 230, 0)';    // Color 8
let sandcolor9 = 'rgb(194, 230, 235)';    // solid structure
let sandcolor10 = 'rgba(150, 219, 247, 0.74)';    // water
let blockColor = 'rgba(212, 211, 177, 0.27)';  
let blockColor2 = 'rgba(0, 0, 0, 0.12)';    // block
let blockColor3 = 'rgba(228, 230, 213, 0.51)';    // block
let blockColor4 = 'rgba(252, 254, 114, 0.52)';    // block
let fireColor = 'rgba(255, 0, 0, 0.29)';    // fire
let fireColor2 = 'rgba(255, 149, 0, 0.28)';    // fire
let fireColor3 = 'rgba(255, 242, 196, 0.17)';    // fire

// Plant colors
let plantColors = [
  'rgba(68, 49, 22, 0.63)',   //wood, array no. 0, type 11
  'rgba(143, 184, 143, 0.36)',   
  'rgba(121, 212, 113, 0.22)',   
  'rgba(6, 121, 102, 0.45)',  
  'rgba(73, 122, 99, 0.23)',    
  'rgba(121, 202, 151, 0.2)',
  'rgba(236, 255, 154, 0.86)',
  'rgb(255, 162, 0)'
];



//images
let flameImage;
let bareImage;
let stickImage;
let leafImage;
let leaf2Image;

// brush
let currentSandType = 1; // 1-8 sand, 10 for water, 20 for fire
let brushSize = 1; // Radius of sand spawning

// ===== P5.JS INTEGRATION FUNCTIONS =====
function setupSandSimulation() {
 
  setupSandGrid();
  
  // Load images
  flameImage = loadImage('/images/flame.png');
  bareImage = loadImage('/images/bare.png');
  stickImage = loadImage('/images/stick.png');
  leafImage = loadImage('/images/leaf.png');
  leaf2Image = loadImage('/images/leaf2.png');
  
}

function drawSandSimulation() {
  //simulate sand
  fallingSand();
  // draw each particle function
  drawSand();
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

      /*// Buildings destroyed by water
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
      } */

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
        if (sandGrid[x][y] >= 11 && sandGrid[x][y] <= 16) {
        
        
        if (y > 0 && sandGrid[x][y-1] == 0 && random() < plantGrowthRate) {
          let nextType = sandGrid[x][y] + 1; // Spawn next plant type
          if (nextType <= 17) {
            sandGrid[x][y-1] = nextType;
            plantColorGrid[x][y-1] = color(
              random(50, 150), 
              random(150, 255), 
              random(50, 150),
              160
            );
          }
        }
        
        // Plants spread 
        if (random() < plantGrowthRate * 0.5) {
          let direction = random() < 0.5 ? -1 : 1;
          if (x + direction >= 0 && x + direction < gridWidth && 
              sandGrid[x + direction][y] == sandGrid[x][y]-1) {
            sandGrid[x + direction][y] = sandGrid[x][y]+1;
            plantColorGrid[x + direction][y] = plantColorGrid[x][y];
          }
        }

      }
      
     
      //Plants spawn on sand
      if (sandGrid[x][y] < 10 && sandGrid[x][y] > 0 && y > 0 && sandGrid[x][y-1] == 10) {
        let growChance = random(0, 1);
        if (growChance < 0.2) {
          sandGrid[x][y-1] = Math.floor(random(11, 16));
          plantColorGrid[x][y-1] = color(
            random(50, 150), 
            random(150, 255), 
            random(50, 150),
            160
          );
        }
      }

      // Plant end in flower
      if (sandGrid[x][y] > 12 && sandGrid[x][y] < 16) { 
        let endBranch = random();
        if (endBranch < 0.8) {
          sandGrid[x][y] = 11;
        } else {
          sandGrid[x][y] = 17;
          //console.log("sandgrid = 17, flower");
        }
      }

      let growthChance = random(0, 1);
      if (growthChance < 0.1) {
        
      if (sandGrid[x][y] == 13 && y > 0 && y < (gridHeight - 10) && x > 4 && x < gridWidth - 4 && sandGrid[x][y-1] != 17 &&
      sandGrid[x+1][y-1] != 17) {
        sandGrid[x][y-1] = 15;
        sandGrid[x-1][y-1] = 14;  
      }
    } else if (growthChance < 0.2) {

      if (sandGrid[x][y] == 11 && y > 0 && y < (gridHeight - 10) && x > 4 && x < gridWidth - 4 && sandGrid[x][y-1] != 17 &&
      sandGrid[x+1][y-1] != 17) {
        sandGrid[x][y-1] = 12;
        sandGrid[x+1][y-1] = 15; 
      }
      else if (growthChance < 0.3) {
      if (sandGrid[x][y] == 12 && y > 0 && y < (gridHeight - 10) && x > 4 && x < gridWidth - 4 && sandGrid[x][y-1] != 17 &&
      sandGrid[x+1][y-1] != 17) {
        sandGrid[x][y-1] = 16;
        sandGrid[x+1][y-1] = 13; 
      }
      }
    }
  
    if (sandGrid[x][y] == 17) {
      sandGrid[x][y] = 17;
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
  let sC6 = color(sandcolor6);
  let sC7 = color(sandcolor7);
  let sC8 = color(sandcolor8);
  let sC9 = color(sandcolor9);
  let sC10 = color(sandcolor10);
  

  let colorDriver = 0.5; 
  
  noStroke();

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let screenX = x * cellSize;
      let screenY = y * cellSize;
      
      if (sandGrid[x][y] === 1) {
        let sandcolorLerp = lerpColor(sC, sC2, colorDriver);
        fill(sandcolorLerp);  
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[x][y] === 2) {
        let sandcolorLerp2 = lerpColor(sC2, sC3, colorDriver);
        fill(sandcolorLerp2); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor2);
        rect(screenX+(0.2*cellSize), screenY-(0.1*cellSize), 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[x][y] === 3) {
        let sandcolorLerp3 = lerpColor(sC3, sC4, colorDriver);
        fill(sandcolorLerp3); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor3);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[x][y] === 4) {
        let sandcolorLerp4 = lerpColor(sC4, sC5, colorDriver);
        fill(sandcolorLerp4); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor4);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[x][y] === 5) {
        let sandcolorLerp5 = lerpColor(sC5, sC6, colorDriver);
        fill(sandcolorLerp5); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor5);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[x][y] === 6) {
        let sandcolorLerp6 = lerpColor(sC6, sC7, colorDriver);
        fill(sandcolorLerp6); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[x][y] === 7) {
        let sandcolorLerp7 = lerpColor(sC7, sC8, colorDriver);
        fill(sandcolorLerp7); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[x][y] === 8) {
        let sandcolorLerp8 = lerpColor(sC8, sC9, colorDriver);
        fill(sandcolorLerp8); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[x][y] === 9) {
        fill(blockColor3); // Ground!
        rect(screenX, screenY, cellSize, cellSize);
        fill(blockColor);
        rect(screenX+(0.2*cellSize), screenY, 0.5*cellSize, cellSize);
      } else if (sandGrid[x][y] === 10) { //WATER
        fill(sandcolor10); 
        rect(screenX, screenY, cellSize, cellSize);
      } 
      //PLANTS
      else if (sandGrid[x][y] === 11) {
        
        push();
        translate(screenX, screenY);
        // Random rotation
        let rotation = ((x * 7 + y * 13) % 60) - 30;
        rotate(radians(rotation));
        imageMode(CENTER);
        image(bareImage, 0, 0, 5*cellSize, 5*cellSize);
        pop();
      } else if (sandGrid[x][y] == 12) {
        
        push();
        translate(screenX, screenY);
             
        imageMode(CENTER);
        image(leaf2Image, 0, 0, 3*cellSize, 3*cellSize);
        pop();
        
      } else if (sandGrid[x][y] === 13) {
       
        push();
        imageMode(CENTER);
        
        image(leafImage, screenX, screenY, 1.5*cellSize, 2.5*cellSize);
        pop();
        
      } else if (sandGrid[x][y] === 14) {
        
        push();
        imageMode(CENTER);
        
        image(leaf2Image, screenX, screenY, 5*cellSize, 5*cellSize);
        pop();
        
      } else if (sandGrid[x][y] === 15) {
        push();
        imageMode(CENTER);
        
        image(leaf2Image, screenX, screenY, 4*cellSize, 5*cellSize);
        pop();
        
      } else if (sandGrid[x][y] === 16) {
        push();
        imageMode(CENTER);
        
        image(leafImage, screenX, screenY, 7*cellSize, 7*cellSize);
        pop();
      }

      //FLOWERS
      else if (sandGrid[x][y] === 17) {
        //console.log("Drawing flower");

        push();
        imageMode(CENTER);
        
        image(sakuraImage, screenX, screenY, 1.5*cellSize, 1.5*cellSize);
        pop();
        
        /*fill(plantColors[6]);
        ellipse(screenX, screenY, 2.5*cellSize, cellSize);
        ellipse(screenX, screenY, cellSize, 2.5*cellSize);
        fill(plantColors[7]);
        ellipse(screenX, screenY, 0.5*cellSize, 0.5*cellSize);*/
        
        //image(sakuraImage, screenX, screenY, 2.5*cellSize, 2.5*cellSize);
        
      }

      /*//CITY BUILDINGS
      else if (sandGrid[x][y] === 18) {
        fill(blockColor);
        rect(screenX, screenY, 4*cellSize, 3*cellSize);
        fill(2*blockColor);
        rect(screenX, screenY, 5*cellSize, 3*cellSize);
        fill(blockColor2);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
        let randomTwinkle = random(0, 1);
        if (randomTwinkle < 0.1) {
          fill(blockColor4);
          ellipse(screenX, screenY, 0.4*cellSize, 0.4*cellSize);
        }
      }*/

      //FIRE
      else if (sandGrid[x][y] === 20) {
        let fireSize = 1.0; // Fixed fire size
        let randomFireSize = random(0.9, 3);
        push();
        imageMode(CENTER);
        
        image(flameImage, screenX, screenY, 3*fireSize*cellSize, 3*randomFireSize*fireSize*2*cellSize);
        pop();
        
        
        
        fill(fireColor2);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*6*cellSize);
        fill(fireColor);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*4*cellSize);
        fill(fireColor);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*1.5*cellSize);
        fill(fireColor3);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*3*cellSize);
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





// ===== CONTROL FUNCTIONS =====

function clearAllSand() {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      sandGrid[x][y] = 0;
      plantColorGrid[x][y] = 0;
    }
  }
}

