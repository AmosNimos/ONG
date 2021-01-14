let nodeX=0,nodeY=0,w,gridSize=40;
let grid = [];
let canPress = true,delay=0,gameOver=false;
let go=false; // is game over
let GS = 10;//=8x8
let score =0;
//0=empty
//1=node
//2=wall

function preload(){
  sound = loadSound("pop.wav");
  sound2 = loadSound("loose2.wav");
  sound3 = loadSound("HomeMade.wav");
  sound4 = loadSound("loose.wav");
}

function setup() {
  //pixelDensity(2);
  if(displayWidth>displayHeight){
    gridSize=displayHeight/GS;
  } else {
    gridSize=displayWidth/GS;
  }
  let cv = createCanvas(gridSize*GS, gridSize*GS);
  if(displayWidth<displayHeight){
    cv.position(0,displayHeight/5);
  }
  w=round(gridSize/2);
  ///Center axis
  centerX = round(width/2);
  centerY = round(height/2);
  tilesX=round(width/gridSize);
  tilesY=round(height/gridSize);
  tilesCenterX=round(round(width/gridSize)/2);
  tilesCenterY=round(round(height/gridSize)/2);
  nodeX = tilesCenterX;
  nodeY = tilesCenterY;
  
  generateGrid();
  
  ///Center main node 
  ellipseMode(CENTER);
  rectMode(CENTER);
  stroke(255);
  strokeWeight(gridSize/10);
  noFill();
  background(0);
  textFont("Anton");
  
  ///initiate game
  if(gameOver==false){
    gameLoop();
  }
}

function draw() {
  if(delay>0){
    delay-=1;
  }
}

function generateGrid(){
  ///Generate grid
  for (let x = 0; x < tilesX; x++) {
    grid[x] = []; // create nested array
    for (let y = 0; y < tilesY; y++) {
      grid[x][y] = 0;
      let dice = round(random(10));
      if(dice==1){
        grid[x][y] = 1;
      } else if(dice==2){
        grid[x][y] = 2;
      } else if(dice==3){
        grid[x][y] = 3;
      }
      if(x==nodeX && y==nodeY){
        grid[x][y] = 1;
      }
      //add border
      if(x==0 || y==0 || x==tilesX-1 || y==tilesY-1){
        grid[x][y] = 2;
      }
    }
  } 
  grid[tilesCenterX][tilesCenterY+1]=0;
  grid[tilesCenterX][tilesCenterY-1]=0;
  grid[tilesCenterX+1][tilesCenterY]=0;
  grid[tilesCenterX-1][tilesCenterY]=0;
  grid[tilesCenterX][tilesCenterY]=1;
}

function gameLoop(){
  //draw border
  background(0);
  
  stroke(255);
  noFill();
  rect(centerX,centerY,width-gridSize*1.5,height-gridSize*1.5);
  translate(gridSize/2, gridSize/2);
  
  textSize((gridSize/2));
  fill(255);
  noStroke();
  textAlign(LEFT,CENTER);
  text("SCORE:"+score,40,0);
  


  let pointer=0;
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      //if wall
      //not draw corner  && (x!=0 && y!=0 && x!=tilesX-1 && y!=tilesY-1)
      if(grid[x][y]==2 && (x!=0 && y!=0 && x!=tilesX-1 && y!=tilesY-1)){
        stroke(255);
        noFill();
        rect(x*gridSize,y*gridSize,w,w);
      }
      if(grid[x][y]==3){
        pointer+=1;
        noStroke();
        fill(255);
        rect(x*gridSize,y*gridSize,w,w);
        if(grid[x-1][y]!=0 && grid[x+1][y]!=0 && grid[x][y-1]!=0 && grid[x][y+1]!=0){
          if(grid[x][y]==3){
            score+=20;
          }
          grid[x][y]=2;
          gameLoop();
        }
      }
      //if node
      if(grid[x][y]==1){
        if(x==nodeX && y==nodeY){
          fill(255);
        } else {
          noFill();
        }
        stroke(255);
        ellipse(x*gridSize,y*gridSize,w,w);
        ///check for neighbor to connect to
        ///thats a dumb way of doing this but it should work
        if(grid[x+1][y]==1){
          line(x*gridSize+w/2,y*gridSize,(x+1)*gridSize-w/2,y*gridSize);
        }
        if(grid[x][y+1]==1){
          line(x*gridSize,y*gridSize+w/2,x*gridSize,(y+1)*gridSize-w/2);
        }
        if(grid[x-1][y]!=0 && grid[x+1][y]!=0 && grid[x][y-1]!=0 && grid[x][y+1]!=0){
          if(x==nodeX && y==nodeY && gameOver==false){
            ///Death
            gameOver=true;
            sound2.play();
            delay=50;
          }
          grid[x][y]=2;
        }
      }
    }
  } 
  if(pointer==0){
    Reseting();
  }
}

function mouseReleased() { 
  canPress=true;
  if(delay<=0){
    delay=5;
  }
}

function Reseting(){
  gameOver=false;
  go=false;
  nodeX = tilesCenterX;
  nodeY = tilesCenterY;
  generateGrid();
  gameLoop();
}

function keyPressed() { 
    if(gameOver==false){
      if (keyIsDown(LEFT_ARROW)) { 
        //score
        if(grid[nodeX-1][nodeY]==0){
          score-=1;
        }
        if(grid[nodeX-1][nodeY]==3){
          score+=10;
          grid[nodeX-1][nodeY]=1;
        }
        if(grid[nodeX-1][nodeY]!=2){
          nodeX-=1;
          sound.play();
        } else {
          sound3.play();
        }
      } else if (keyIsDown(RIGHT_ARROW)) { 
        //score
        if(grid[nodeX+1][nodeY]==0){
          score-=1;
        }
        if(grid[nodeX+1][nodeY]==3){
          score+=10;
          grid[nodeX+1][nodeY]=1;
        }
        if(grid[nodeX+1][nodeY]!=2){
          nodeX+=1; 
          sound.play();
        } else {
          sound3.play();
        }
      } 

      if (keyIsDown(UP_ARROW)) {
        //score
        if(grid[nodeX][nodeY-1]==0){
          score-=1;
        }
        if(grid[nodeX][nodeY-1]==3){
          score+=10;
          grid[nodeX][nodeY-1]=1;
        }
        if(grid[nodeX][nodeY-1]!=2){
          nodeY-=1; 
          sound.play();
        } else {
          sound3.play();
        }
      } else if (keyIsDown(DOWN_ARROW)) {
        //score
        if(grid[nodeX][nodeY+1]==0){
          score-=1;
        }
        if(grid[nodeX][nodeY+1]==3){
          score+=10;
          grid[nodeX][nodeY+1]=1;
        }
        if(grid[nodeX][nodeY+1]!=2){
          nodeY+=1;
          sound.play();
        } else {
          sound3.play();
        }
      }

      ///Add node if place is empty
      if(grid[nodeX][nodeY]==0){
        grid[nodeX][nodeY]=1;
      }
      gameLoop();
    } else {
      //Reset
      if(keyIsDown(ENTER) && delay<=0){
        Reseting();
      }
    }
}

function GameOver(){
  score=0;
  textAlign(CENTER,CENTER);
  background(0);
  noStroke();
  fill(255);
  if(go==false){
    sound4.play();
    go=true;
  }

  if(delay<=0){
    textSize(width/10);
    text("[GAME]",centerX,centerY);
    textSize(width/20);
    //text("スタート",centerX,centerY+width/10);
    text("~START~",centerX,centerY+width/10);
    //Reset
    if(keyIsDown(ENTER) && delay<=0){
      Reseting();
    }
  } else {
    textSize(width/10);
    text("GAME OVER",centerX,centerY);
    textSize(width/20);
    //text("スタート",centerX,centerY+width/10);
    text("~"+score+"~",centerX,centerY+width/10);
  }
}

function mousePressed() { 
  fullscreen(true);
  if(delay<=0){
    //Reset
    if(gameOver==true){
      GameOver();
    }
  }
  if(gameOver==false){
    if(canPress==true && delay<=0){
      canPress=false;
      ///Mesure mouse axis distance from the node 
      nodeRealX=(nodeX*gridSize);
      nodeRealY=(nodeY*gridSize);
      let Hdist = mouseX-nodeRealX;
      if(Hdist<0){
        Hdist=-Hdist;
      }
      let Vdist = mouseY-nodeRealY;
      if(Vdist<0){
        Vdist=-Vdist;
      }

      ///Check if one axis as priotity over the other.
      if(Hdist>Vdist){
        if(mouseX>nodeRealX){
          //score
          if(grid[nodeX+1][nodeY]==0){
            score-=1;
          }
          if(grid[nodeX+1][nodeY]==3){
            score+=10;
            grid[nodeX+1][nodeY]=1;
          }
          if(grid[nodeX+1][nodeY]!=2){
            nodeX+=1;
            sound.play();
          } else {
            sound3.play();
          }
        } else {
          ///Move left if place empty
            if(grid[nodeX-1][nodeY]!=2){
              nodeX-=1;
              sound.play();
            } else {
              sound3.play();
            }
        }
      } else {
        if(mouseY>nodeRealY){
          ///Move down if place empty
          if(grid[nodeX][nodeY+1]!=2){
            nodeY+=1;
            sound.play();
          } else {
            sound3.play();
          }
        } else {
          ///Move up if place empty
          if(grid[nodeX][nodeY-1]!=2){
            nodeY-=1;
            sound.play();
          } else {
            sound3.play();
          }
        }
      }
      ///Add node if place is empty
      if(grid[nodeX][nodeY]==0){
        grid[nodeX][nodeY]=1;
      }
    }
    gameLoop();
  }
} 