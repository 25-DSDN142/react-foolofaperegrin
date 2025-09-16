
function draw_one_frame(words, vocal, drum, bass, other, counter) {
 
 
   
  background(20, 20, 10);
 
 let seconds = counter/60;
 console.log(seconds);
  
    fallingSand(drum, counter, seconds);
    if(seconds < bridgeTime){spawnMusicSand(vocal, drum, bass, other, counter, seconds);}
    drawSand(drum, bass, counter);
    if(seconds > verseTime && seconds < bridgeTime){spawnMusicWater(vocal, drum, bass, other, counter, seconds);}
    if(seconds > 195 && seconds < 245){spawnMusicWater(vocal, drum, bass, other, counter, seconds);}
    if(seconds > 285 && seconds < 290){spawnMusicWater(vocal, drum, bass, other, counter, seconds);}
    
    if(seconds > doubletimeTime && seconds < repriseTime){spawnMusicSand(vocal, drum, bass, other, counter, seconds);}
    

    if(seconds > 170 && seconds < 188){spawnMusicWater(vocal, drum, bass, other, counter, seconds);}

 if (seconds == 0){
  if (mouseIsPressed){
   spawnSand(1);
  }
 }


 if (seconds > 0){
  if (mouseIsPressed){
   spawnSand(11);
  }
 }

 if (seconds > verseTime){
  if (mouseIsPressed){
   spawnSand(9);
  }
 }

if (seconds > bridgeTime){
 if (mouseIsPressed){
  spawnSand(10);
 }
}

if (seconds > doubletimeTime && seconds < repriseTime){
  if (mouseIsPressed){
   spawnSand(20);
  }
 }

 if (seconds > 245 && seconds < repriseTime){
  if (mouseIsPressed){
   spawnSand(10);
  }
 }

 if (seconds > repriseTime){
  if (mouseIsPressed){
   spawnSand(11);
  }
 }

 

 if (seconds > bridgeTime && seconds < bridgeTime + 2){
  clearSand();
 }

 if(seconds > verseTime && seconds < verseTime +  3){clearBlock();}

 

 


}





//Falling Sand Setup~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let cellSize = 10; 
let gridWidth = 540/cellSize;   
let gridHeight = 960/cellSize; 


let sandGrid = [];
let plantColorGrid = []; 



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
let sandcolor11 = 'rgb(48, 185, 53)';    // 
let blockColor = 'rgba(212, 211, 177, 0.27)';  
let blockColor2 = 'rgba(0, 0, 0, 0.12)';    // block
let blockColor3 = 'rgba(228, 230, 213, 0.51)';    // block
let blockColor4 = 'rgba(252, 254, 114, 0.52)';    // block
let fireColor = 'rgba(255, 0, 0, 0.29)';    // fire
let fireColor2 = 'rgba(255, 149, 0, 0.28)';    // fire
let fireColor3 = 'rgba(255, 242, 196, 0.17)';    // fire
let wheatColor1 = 'rgba(224, 226, 177, 0.82)';
let wheatColor2 = 'rgba(252, 244, 86, 0.81)';
let wheatColor3 = 'rgb(248, 255, 189)';

// Plant colors
let plantColors = [
  'rgba(68, 49, 22, 0.63)',   //wood, array no. 3
  'rgba(143, 184, 143, 0.36)',   
  'rgba(121, 212, 113, 0.22)',   
  'rgba(6, 121, 102, 0.45)',  
  'rgba(73, 122, 99, 0.23)',    
  'rgba(121, 202, 151, 0.2)',
  'rgba(167, 253, 253, 0.86)',
  'rgb(255, 0, 0)'

];

/*
43 seconds = verse
120 seconds = Bridge
188 seconds = doubletime
265 seconds = Reprise
*/

let verseTime = 43;
let bridgeTime = 122;
let doubletimeTime = 188;
let repriseTime = 255;



//Falling Sand Function
function setupSandGrid() {

  //sets up grid coordinate system using two arrays created for x and y based on pixel dimensions
//0 = empty, 1-8= sand, 10= water, 9= solid, 11-15= different plant colors

  for (let y = 0; y < gridHeight; y++) {
    sandGrid[y] = [];
    plantColorGrid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      sandGrid[y][x] = 0; //each cell empty
      plantColorGrid[y][x] = 0; 
    }
    }

  // Add solid ground at the bottom
  for (let x = 0; x < gridWidth; x++) {
    sandGrid[gridHeight-1][x] = 9;
    }
  
  
  }


function fallingSand(drum, counter, seconds){
  //This function runs from bottom to top along the sandGrid. 
  for (let y = gridHeight - 2; y >= 0; y--) {
    for (let x = 0; x < gridWidth; x++) {

      //Buildings destroyed by water
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

      //Fire

      if (sandGrid[y][x] == 20){
        
        // Fire extinguishes in water
        if (y > 0 && sandGrid[y-1][x] == 10){
          sandGrid[y][x] = 10;
        }
        
        // Random chance for fire to spread 
        let spreadChance = random(0, 1);
        if (spreadChance < 0.09) { 
        
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
        
        // Fire destroy buildings at end
        if (seconds > repriseTime) {
          let blockDestroyChance = random(0, 1);
          if (blockDestroyChance < 0.5) { 

            if (y > 0 && sandGrid[y-1][x] == 18) {
              sandGrid[y-1][x] = 20; // Convert block to fire
            }
            if (y < gridHeight - 1 && sandGrid[y+1][x] == 18) {
              sandGrid[y+1][x] = 20; // Convert block to fire
            }
            if (x > 0 && sandGrid[y][x-1] == 18) {
              sandGrid[y][x-1] = 20; // Convert block to fire
            }
            if (x < gridWidth - 1 && sandGrid[y][x+1] == 18) {
              sandGrid[y][x+1] = 20; // Convert block to fire
            }
          }
        }
        
        // Fire can randomly extinguish
        let extinguishChance = random(0, 1);
        if (extinguishChance < 0.01) { // 1% chance to extinguish
          sandGrid[y][x] = 0;
        }
      }
      
    
  
      
          
        
      //Buildings

      if (sandGrid[y][x] > 0 && sandGrid[y][x] < 9 && y > gridHeight - 12) {
         
        if (y >= 20) { // Make sure we have enough space above
                        
              // Rest of your building logic...
              if (sandGrid[y-10][x] > 0 && sandGrid[y-9][x] > 0 && sandGrid[y-8][x] > 0 && sandGrid[y-7][x] > 0 && sandGrid[y-6][x] > 0 && sandGrid[y-5][x] > 0 && sandGrid[y-4][x] > 0 && sandGrid[y-3][x] > 0 && sandGrid[y-2][x] > 0 && sandGrid[y-1][x] > 0 && sandGrid[y-1][x] != 18 && sandGrid[y-1][x] != 10) {
                if (sandGrid[y-10][x] != 9 && sandGrid[y-9][x] != 9 && sandGrid[y-8][x] != 9 && sandGrid[y-7][x] != 9 && sandGrid[y-6][x] != 9 && sandGrid[y-5][x] != 9 && sandGrid[y-4][x] != 9 && sandGrid[y-3][x] != 9 && sandGrid[y-2][x] != 9 && sandGrid[y-1][x] != 9) {
                  sandGrid[y][x] = 18;
                }
              }
        }
      }
      
              
      

      if (sandGrid[y][x] == 18 && y > 25 && sandGrid[y-5][x] > 0 && sandGrid[y-1][x] != 0) {
        sandGrid[y][x] = 18;
        //sandGrid[y-2][x] = 1;
        sandGrid[y-1][x] = 18;

      if (seconds > bridgeTime && sandGrid[y][x] == 18 && y > 10 && x > 0 && x < gridWidth - 1 && y < gridHeight - 1 && sandGrid[y-1][x] == 0) {
        sandGrid[y-1][x] = 20;
      }

      if (seconds < bridgeTime && sandGrid[y][x] == 18 && y > 10 && x > 0 && x < gridWidth - 1 && y < gridHeight - 1 && sandGrid[y-1][x] == 0) {
        sandGrid[y-1][x] = 9;
      }
      //SPAWN WHEAT
      if (sandGrid[y][x] == 18 && y > gridHeight-5 && x > 0 && y > 0 && sandGrid[y][x-1] !== 19 && sandGrid[y-1][x] !== 19) {
        let wheatChance = random(0, 1);
        if (wheatChance < 0.001) {
          sandGrid[y][x] = 19;
        }
      }

      if (sandGrid[y][x] == 10 && y < gridHeight/2){
        if (y < gridHeight - 1 && sandGrid[y+1][x] === 9){
          sandGrid[y+1][x] = 10;
          sandGrid[y][x] = 0;
        }

      }


      }
      
      // Sand wind
      let windIntensity = map(drum, 0, 100, 0.01, 3);
      if (sandGrid[y][x] >= 1 && sandGrid[y][x] < 11 && sandGrid[y][x] !== 9 && sandGrid[y][x] !== 10 ) {
        let driftThreshold = map(drum, 0, 100, 0.1, 0.2);
        if (random() < driftThreshold && sandGrid[y+1][x] < 1) {
          // Add random horizontal drift
          let drift = (Math.floor(random(1, 2))) * Math.floor(windIntensity);
          let newX = x + drift;
          let newX2 = x - drift;
          let verticalTumble = Math.floor(random(1, 3));
          
          
          // Check if can fall with drift
          let randomDirection = random(0, 1);
          if (randomDirection < 0.5) {
            if (newX >= 0 && newX < gridWidth && sandGrid[y+1][newX] === 0) {
              sandGrid[y+verticalTumble][newX] = sandGrid[y][x];
              sandGrid[y][x] = 0;
            }
          } else {
            if (newX2 >= 0 && newX2 < gridWidth && sandGrid[y+1][newX2] === 0) {
              sandGrid[y+verticalTumble][newX2] = sandGrid[y][x];
              sandGrid[y][x] = 0;}
          }
        }

        if (sandGrid[y][x] == 10 && seconds == bridgeTime) {
          sandGrid[y][x] = 20;
        }
        
        //  sand falling 
        if (sandGrid[y+1][x] == 0) {
          sandGrid[y+1][x] = sandGrid[y][x];
          sandGrid[y][x] = 0;
        }
        let randomDirection = random(0, 1);
        if (randomDirection < 0.5) {
        //If there is sand below it, check if it can move diagonally.
         if (x > 0 && sandGrid[y + 1][x - 1] === 0) {
            sandGrid[y + 1][x - 1] = sandGrid[y][x]; // Keep the same color
            sandGrid[y][x] = 0;
          }//LEFT ^
        } else if (randomDirection >= 0.5) {
          if (x < gridWidth - 1 && sandGrid[y + 1][x + 1] === 0) {
            sandGrid[y + 1][x + 1] = sandGrid[y][x]; // Keep the same color
          sandGrid[y][x] = 0;
          }//RIGHT ^
        }
          if (sandGrid[y+1][x] === 10) {
            sandGrid[y+1][x] = sandGrid[y][x]; // Keep the same color
            sandGrid[y][x] = 10;
          }//Sink in water ^
          else if (x > 0 && sandGrid[y + 1][x - 1] === 10) {
            sandGrid[y + 1][x - 1] = sandGrid[y][x]; // Keep the same color
            sandGrid[y][x] = 0;
          }//LEFT ^ 0 = replace water
          else if (x < gridWidth - 1 && sandGrid[y + 1][x + 1] === 10) {
            sandGrid[y + 1][x + 1] = sandGrid[y][x]; // Keep the same color
          sandGrid[y][x] = 0;
          }//RIGHT ^ 0 = replace water
          else if (sandGrid[y+1][x] == 18) {
            sandGrid[y+1][x] = 18; 
            sandGrid[y][x] = 9;
            
          }
          else if (sandGrid[y+1][x] > 10 && sandGrid[y+1][x] != 18) {
            // Sand hits a plant - find first available cell from bottom
            for (let searchY = gridHeight - 1; searchY >= 0; searchY--) {
              if (sandGrid[searchY][x] === 0 || (sandGrid[searchY][x] >= 11 && sandGrid[searchY][x] <= 16)) {
                sandGrid[searchY][x] = sandGrid[y][x];
                sandGrid[y][x] = 0;
                break;
              }
            }
          }
        }

        
          
        
    
        

        

        
      

    //WATER LOGIC
    if (sandGrid[y][x] == 10) {
      
      //fall down
      if (sandGrid[y+1][x] === 0) {
        sandGrid[y+1][x] = 10;
        sandGrid[y][x] = 0;
      }
      //If can't fall down, try diagonal
      else if (x > 0 && sandGrid[y + 1][x - 1] === 0) {
        sandGrid[y + 1][x - 1] = 10;
        sandGrid[y][x] = 0;
      }
      else if (x < gridWidth - 1 && sandGrid[y + 1][x + 1] === 0) {
        sandGrid[y + 1][x + 1] = 10;
        sandGrid[y][x] = 0;
      } 
      // Water destroys blocks
      else if (sandGrid[y+1][x] === 18) {
        sandGrid[y+1][x] = 10; // Replace block with water
        sandGrid[y][x] = 0;
      }
      else if (x > 0 && sandGrid[y + 1][x - 1] === 18) {
        sandGrid[y + 1][x - 1] = 10; // Replace block with water
        sandGrid[y][x] = 0;
      }
      else if (x < gridWidth - 1 && sandGrid[y + 1][x + 1] === 18) {
        sandGrid[y + 1][x + 1] = 10; // Replace block with water
        sandGrid[y][x] = 0;
      }
      // water flowing through plants
      else if (sandGrid[y+1][x] > 12 && sandGrid[y+1][x] < 17) {
        let breakChance = random(0, 1);
        if (breakChance < 0.1) { 
          sandGrid[y+1][x] = 10; 
          sandGrid[y][x] = 0;
        }
      }
      else if (x > 0 && sandGrid[y + 1][x - 1] > 10 && sandGrid[y + 1][x - 1] < 18) {
        let breakChance = random(0, 1);
        if (breakChance < 0.1) { 
          sandGrid[y + 1][x - 1] = 10; 
          sandGrid[y][x] = 0;
        }
      }
      else if (x < gridWidth - 1 && sandGrid[y + 1][x + 1] > 10 && sandGrid[y + 1][x + 1] < 18) {
        let breakChance = random(0, 1);
        if (breakChance < 0.1) { 
          sandGrid[y + 1][x + 1] = 10; 
          sandGrid[y][x] = 0;
        }
      }
      // If can't fall, try horizontal flow
      else {
        //choose random water flow direction
        let direction = (random() < 0.5) ? -1 : 1;
        let newX = x + direction;
        
        // Check boundaries and empty space or blocks
        if (newX >= 0 && newX < gridWidth && (sandGrid[y][newX] == 0 || sandGrid[y][newX] == 18)) {
          sandGrid[y][newX] = 10;
          sandGrid[y][x] = 0;
        }
        // Water occasionally breaks through plants horizontally too
        if (y > gridHeight-20){
          sandGrid[y][x] = 0;
        }
      }
    }

    

    
    
    //Plant logic 
    if(counter % 1 == 0){
//random plant spawns on sand
if (sandGrid[y][x] < 9 && sandGrid[y][x] > 0) {
        
  let growChance = random(1, 10000);
  if (growChance < 6) {
  if (y > 0) {
      sandGrid[y-1][x] = 11;
      sandGrid[y][x] = 11;
    }

    if (seconds > doubletimeTime){
      growChance = growChance * 3;
      }
  }
  } 

      if (sandGrid[y][x] > 10 && sandGrid[y][x] < 16) {
        //grow 
        let growChance = map(drum, 0, 100, 0, 1);
        growChance = growChance * random(0, 1);
        if (growChance > 0.60) {
          let growdirection = random(0, 9);
          
          // Pick a plant color
          let randomPlantType = Math.floor(random(12, 16)); 
          



          if (sandGrid[y][x] == 11 && y > 780 && x > 4 && x < gridWidth - 4) {
            //sandGrid[y-1][x] = 12;
           // sandGrid[y-2][x] = 12;
            ////sandGrid[y-3][x] = 12;
            //sandGrid[y][x-1] = 14;
            //sandGrid[y][x+1] = 13;
           // sandGrid[y-1][x+2] = 11;
            //sandGrid[y-1][x-2] = 11;
          }

          if (sandGrid[y][x] == 12 && y > 780 &&  y < (gridHeight - 10) && x > 4 && x < gridWidth - 4) {
            sandGrid[y-1][x] = 15;
            sandGrid[y][x] = 15;
            sandGrid[y-1][x-1] = 15;  
            
            
          }

          

          if (sandGrid[y][x] > 12 && sandGrid[y][x] < 16) { 
            let endBranch = random();
            if (endBranch < 0.9) {
              sandGrid[y][x] = 2;
            } else {
              sandGrid[y][x] = 17;
            }

            
          }
          if (growdirection < 3 && y > 1 && sandGrid[y-1][x+1] == 0) {
            sandGrid[y-1][x+1] = 13; 
            sandGrid[y][x] = 12;
          } else if (growdirection < 6 && growdirection > 2 && x > 0 && y > 1 && sandGrid[y-1][x-1] == 0) {
            sandGrid[y-1][x-1] = 16; 
            sandGrid[y][x] = 13;
            


          } else if (growdirection < 10 && growdirection > 7 && x < gridWidth - 1 && y > 1 &&sandGrid[y-1][x] == 0) {
            sandGrid[y-1][x] = 14; 
            sandGrid[y][x] = 15; 
            let RandomGreen = Math.floor(random(0, 1));
            {if(RandomGreen == 0){sandGrid[y][x] = 16;} else {sandGrid[y][x] = 12;}}
            sandGrid[y][x] = 13;
          }

          if (sandGrid[y][x] == 13 && y > 0 &&  y < (gridHeight - 10) && x > 4 && x < gridWidth - 4) {
            sandGrid[y-1][x] = 13;
            
            sandGrid[y-1][x-1] = 12;  
            
            
          }

          if (sandGrid[y][x] == 11 && y > 0 &&  y < (gridHeight - 10) && x > 4 && x < gridWidth - 4) {
            sandGrid[y-1][x] = 13;
            
            sandGrid[y-1][x+1] = 13;  
            
            
          }
        }
      }
      
      // Plant death logic
      if (sandGrid[y][x] > 10 && sandGrid[y][x] < 18 && y < gridHeight/3 && x < gridWidth/44 && x > gridWidth/8) {
        let deathChance = random(0, 1);
        let baseDeathRate = 0.00; 
        if (seconds >= 76 && seconds < 80) {
          baseDeathRate = 0.9; }
        
        if (deathChance < baseDeathRate) {
          sandGrid[y][x] = 0; // Plant dies
        }
      }

      //ignite flowers
      if (seconds > doubletimeTime && seconds < repriseTime){
        if (sandGrid[y][x] == 17){
          sandGrid[y][x] = 20;
        }
      }

        if (seconds > repriseTime && seconds < repriseTime + 2){
          if (sandGrid[y][x] == 11){
            sandGrid[y][x] = 20;
          }
          if (sandGrid[y][x] < 10 && sandGrid[y][x] > 0 & y > gridHeight - 40){
            sandGrid[y][x] = 20;
          }
      }
    }
      
    }
  }
}




function drawSand(drum, bass, counter) {

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
let sC11 = color(sandcolor11);


let colorDriver = map(drum, 0, 100, 0, 1);


  noStroke();
  let MusicParticleSize = map(drum, 0, 100, 0.9, 2);

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let screenX = x * cellSize;
      let screenY = y * cellSize;
      
      if (sandGrid[y][x] === 1) {
        let sandcolorLerp = lerpColor(sC, sC2, colorDriver);
        fill(sandcolorLerp);  
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 2) {
        let sandcolorLerp2 = lerpColor(sC2, sC3, colorDriver);
        fill(sandcolorLerp2); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor2);
        rect(screenX+(0.2*cellSize), screenY-(0.1*cellSize), 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 3) {
        let sandcolorLerp3 = lerpColor(sC3, sC4, colorDriver);
        fill(sandcolorLerp3); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor3);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 4) {
        let sandcolorLerp4 = lerpColor(sC4, sC5, colorDriver);
        fill(sandcolorLerp4); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor4);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 5) {
        let sandcolorLerp5 = lerpColor(sC5, sC6, colorDriver);
        fill(sandcolorLerp5); 
        rect(screenX, screenY, cellSize, cellSize);
        fill (sandcolor5);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 6) {
        let sandcolorLerp6 = lerpColor(sC6, sC7, colorDriver);
        fill(sandcolorLerp6); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[y][x] === 7) {
        let sandcolorLerp7 = lerpColor(sC7, sC8, colorDriver);
        fill(sandcolorLerp7); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[y][x] === 8) {
        let sandcolorLerp8 = lerpColor(sC8, sC9, colorDriver);
        fill(sandcolorLerp8); 
        rect(screenX, screenY, cellSize, cellSize);
      } else if (sandGrid[y][x] === 9) {
        fill(blockColor3); // Ground!
        rect(screenX, screenY, cellSize, cellSize);
        fill(blockColor);
        rect(screenX+(0.2*cellSize), screenY, 0.5*cellSize, cellSize);
      } else if (sandGrid[y][x] === 10) {
        fill(sandcolor10); 
        ellipse(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
      } 
      //PLANTS
      else if (sandGrid[y][x] === 11) {
        fill(plantColors[0]); // wood
        rect(screenX, screenY, cellSize, 3*cellSize);
       // ellipse(screenX-MusicParticleSize*cellSize, screenY, 2*cellSize, 1*cellSize);
      } else if (sandGrid[y][x] == 12) {
        fill(plantColors[1]);
        rect(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
        ellipse(screenX-cellSize, screenY, 0.5*cellSize, 0.5*cellSize);
        fill(plantColors[0]);
        rect(screenX, screenY, 0.5*cellSize, 1*cellSize);
        fill(plantColors[1]);
        ellipse(screenX, screenY-cellSize, cellSize, 0.5*cellSize);
      } else if (sandGrid[y][x] === 13) {
        fill(plantColors[2]);
        ellipse(screenX, screenY, 1.5*cellSize, 2.5*cellSize);
      } else if (sandGrid[y][x] === 14) {
        fill(plantColors[3]);
        ellipse(screenX, screenY, 3*cellSize, 5*cellSize);
      } else if (sandGrid[y][x] === 15) {
        fill(plantColors[4]);
        ellipse(screenX, screenY, 1.6*cellSize, 2.3*cellSize);
      } else if (sandGrid[y][x] === 16) {
        fill(plantColors[5]);
        ellipse(screenX+cellSize, screenY-cellSize, MusicParticleSize*1.2*cellSize, MusicParticleSize*cellSize);
        fill(plantColors[4]);
        ellipse(screenX-cellSize, screenY+cellSize, MusicParticleSize*0.5*cellSize, MusicParticleSize*0.5*cellSize);
        fill(plantColors[3]);
        ellipse(screenX-cellSize, screenY-cellSize, MusicParticleSize*0.7*cellSize, MusicParticleSize*0.5*cellSize);
        ellipse(screenX, screenY, 0.5*cellSize, 0.5*cellSize);
        fill(plantColors[4]);
      }

      //FLOWERS
      else if (sandGrid[y][x] === 17) {
        
            
        push();
        translate(screenX, screenY);
        rotate(counter * 0.2);
        fill(plantColors[7]);
        ellipse(0, 0, 1.1*cellSize, 1.1*cellSize);
        fill(plantColors[6]);
        ellipse(0, 0, 0.5*cellSize, (MusicParticleSize)*cellSize);
        ellipse(0, 0, (MusicParticleSize)*cellSize, 0.5*cellSize);
        fill(plantColors[7]);
        ellipse(0, 0, 0.5*cellSize, 0.5*cellSize);
        pop();
      }

      //CITY BUILDINGS
      else if (sandGrid[y][x] === 18) {
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
      }

      //FIRE
      else if (sandGrid[y][x] === 20) {
        let fireSize = map(drum, 0, 100, 0.5, 1.5);
        let randomFireSize = random(0.9, 3);
        fill(fireColor2);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*6*cellSize);
        fill(fireColor);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*4*cellSize);
        fill(fireColor);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*1.5*cellSize);
        fill(fireColor3);
        ellipse(screenX, screenY, fireSize*cellSize, randomFireSize*fireSize*3*cellSize);
      }
      

      
        //wheat cap
      /*beginShape();
      fill(wheatColor3);
      translate(0, -3*cellSize);
      push();
        vertex(screenX, screenY-3*cellSize); //mid
        vertex(screenX - 1*cellSize, screenY-cellSize); //top right
        vertex(screenX- 1*cellSize, screenY-cellSize); //top left
        vertex(screenX- 1*cellSize, screenY-0.5*cellSize);
        vertex(screenX, screenY+0.1*cellSize); //mid
        vertex(screenX+ 1.2*cellSize, screenY-0.5*cellSize);
        vertex(screenX+ 1.2*cellSize, screenY-cellSize);
        vertex(screenX+ 1*cellSize, screenY-cellSize);
        vertex(screenX, screenY-3*cellSize);
          pop();
      endShape(CLOSE);*/

      
        

        
        
        
    }
  }
}

function spawnSand(type) {
  console.log("spawnSand");
  // mouse pos to grid

  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) {
    return; // Exit early if mouse is out of bounds
  }

  let gridX = Math.floor(mouseX / cellSize);
  let gridY = Math.floor(mouseY / cellSize);
  
  let brushRadius = 0;
  
  // Spawn sand in radius
  for (let y = gridY - brushRadius; y <= gridY + brushRadius; y++) {
    for (let x = gridX - brushRadius; x <= gridX + brushRadius; x++) {
      // Check if this position is within the brush radius
      let distance = Math.sqrt((x - gridX) * (x - gridX) + (y - gridY) * (y - gridY));
      
      if (distance <= brushRadius && 
          x >= 0 && x < gridWidth && 
          y >= 0 && y < gridHeight)
          
          sandGrid[y][x] = type; if(sandGrid[y][x] === 1){sandGrid[y][x] = 1;} 
          
      

  }

  
}

}

function spawnMusicSand(drum, bass, other, counter, seconds ) {
  // Mappings
  let spawnRate = map(other, 0, 100, 0, 0.5);       
  let spawnRadius = map(bass, 0, 100, 0.01, 3);       // Bigger spawn areas
  let spawnIntensity = map(other, 0, 100, 0, 0.5); // Always some spawning
  let musicSandColor = map(drum, 0, 100, 0, 9);

  // Only spawn if intensity is high enough
  if (random() < spawnIntensity) {
    
    // Spawn multiple particles based on spawn rate
    for (let i = 0; i < spawnRate; i++) {
      
      // position in upper  of screen
      let spawnX = random(1, (width));
      let spawnY = random(0, 2);  // upper 
      
      // Convert to grid coordinates
      let gridX = Math.floor(spawnX / cellSize);
      let gridY = Math.floor(spawnY / cellSize);
      
      // Create sand in a small area around the spawn point
      for (let y = gridY - spawnRadius; y <= gridY + spawnRadius; y++) {
        for (let x = gridX - spawnRadius; x <= gridX + spawnRadius; x++) {
          let distance = Math.sqrt((x - gridX) * (x - gridX) + (y - gridY) * (y - gridY));
          
          if (distance <= spawnRadius && 
              x >= 0 && x < gridWidth && 
              y >= 0 && y < gridHeight &&
              sandGrid[Math.floor(y)][Math.floor(x)] === 0) { // Only if cell is empty
            
            // Random color
            //let randomSandColor = Math.floor(random(1, 5));
            sandGrid[Math.floor(y)][Math.floor(x)] = Math.floor(musicSandColor);
          }
        }
      }
    }
  }
}

function spawnMusicWater(vocal, drum, bass, other, counter, seconds ) {
  // Mappings
  let spawnRate = map(other, 0, 100, 0, 0.6);       
  let spawnRadius = 1;      
  let spawnIntensity = map(other, 0, 100, 0, 0.5); // Always some spawning
  //let musicSandColor = map(drum, 0, 100, 0, 9);

  // Only spawn if intensity is high enough
  if (random() < spawnIntensity) {
    
    // Spawn multiple particles based on spawn rate
    for (let i = 0; i < spawnRate; i++) {
      
      // position in upper  of screen
      let spawnX = random(width-1, (0));
      let spawnY = random(0, 2);  // upper 
      
      // Convert to grid coordinates
      let gridX = Math.floor(spawnX / cellSize);
      let gridY = Math.floor(spawnY / cellSize);
      
      // Create sand in a small area around the spawn point
      for (let y = gridY; y <= gridY + spawnRadius; y++) {
        for (let x = gridX; x <= gridX + spawnRadius; x++) {
          let distance = Math.sqrt((x - gridX) * (x - gridX) + (y - gridY) * (y - gridY));
          
          if (distance <= spawnRadius && 
              x >= 0 && x < gridWidth && 
              y >= 0 && y < gridHeight &&
              sandGrid[Math.floor(y)][Math.floor(x)] === 0) { // Only if cell is empty
            
            
            sandGrid[Math.floor(y)][Math.floor(x)] = Math.floor(10);
          }
        }
      }
    }
  }
}

  function removeBassSand(drum, counter, seconds) {
  // Declare removalIntensity outside the if blocks
  let removalIntensity;
  
  removalIntensity = map(drum, 0, 100, 0, 0.25);
  
  
  
  // Map bass to removal radius (how many particles to remove per frame)
  let removalRadius = map(drum, 0, 100, 1, 25);
  
if (seconds < 43) {
    removalRadius = map(drum, 0, 100, 0, 25);
  }
  if (seconds >= 43) {
    removalRadius = map(drum, 0, 100, 0, 50);
  }


  // Only remove if bass is strong enough
  if (random() < removalIntensity) {
    
    // Remove multiple particles based on bass intensity
    for (let i = 0; i < removalRadius; i++) {
      
      // Random position in bottom half of screen
      let removeX = random(0, width);
      let removeY = random(height / 2, height); // Only bottom half
      
      // Convert to grid coordinates
      let gridX = Math.floor(removeX / cellSize);
      let gridY = Math.floor(removeY / cellSize);
      
      // Remove sand in a small area around the removal point
      for (let y = gridY - 2; y <= gridY + 2; y++) {
        for (let x = gridX - 2; x <= gridX + 2; x++) {
          let distance = Math.sqrt((x - gridX) * (x - gridX) + (y - gridY) * (y - gridY));
          
          if (distance <= 2 && 
              x >= 0 && x < gridWidth && 
              y >= 0 && y < gridHeight &&
              sandGrid[y][x] >= 1 && sandGrid[y][x] < 9) { // Only remove sand
            
            sandGrid[y][x] = 0; 
          }
        }
      }
    }
  }
}

function clearSand(){
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      
     /* if (sandGrid[y][x] > 10 && sandGrid[y][x] < 18) {
      sandGrid[y][x] = 0;
    }*/

    if (sandGrid[y][x] == 10) {
      sandGrid[y][x] = 20;
    }
  }
}
}

function clearBlock(){
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      
     /* if (sandGrid[y][x] > 10 && sandGrid[y][x] < 18) {
      sandGrid[y][x] = 0;
    }*/

    if (sandGrid[y][x] < 10 && sandGrid[y][x] > 0) {
      sandGrid[y][x] = 10;
    }
  }
}
}






