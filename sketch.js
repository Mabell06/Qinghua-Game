//personaje
var qinghua, qinghuaRunImg, qinghuaDie;
var fondo, fondoImg;

//sonidos
var jumpSound, collidedSound;

//nose
var score=0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//extras
var roca, rocaImg, rocaGroup; 
var pergaminos, pergaminosImg, pergaminosGroup; 

// suelo falso 
var ground; 

function preload(){
  fondoImg = loadImage("paisaje.png"); 
  rocaImg = loadImage("rock.png");
  qinghuaRunImg = loadAnimation("img1.png", "img2.png", "Img3.png");
  // crear la animación 
  qinghuaDie = loadAnimation("qinghuadie.png"); 
  pergaminosImg = loadImage("pergaminos.png");

  jumpSound = loadSound("sonidodesalto.mp3")
  collidedSound = loadSound("sonidodemuerte.mp3")
}

function setup(){
  createCanvas(600,400);  

  fondo = createSprite(0, 0, 600, 600); 
  fondo.addImage(fondoImg);  
  fondo.x = fondo.width /2;

  qinghua = createSprite(90,220,50,50);
  // Agregar las animaciones 
  qinghua.addAnimation("running", qinghuaRunImg);
  qinghua.addAnimation("muere", qinghuaDie); 
  qinghua.scale = 0.10;  
  qinghua.setCollider("circle",100,100,450);
 

  // Necesitas crear suelo para que el personaje colisione y podamos darle el efecto de gravedad
  ground = createSprite(0, 280, 500, 20); 
  // hacerlo invisible 
  ground.visible = false; 
  
  // crear los grupos
  pergaminosGroup = new Group(); 
  rocaGroup = new Group(); 
 
}

function draw() {
  background("white");
  // agregar el la colision contra el suelo 
  qinghua.collide(ground);    
  fondo.velocityX = -3; 

  if (gameState===PLAY){
    var speed = Math.round(getFrameRate()/60);
    fondo.velocityX = -(6 + 3*speed/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && qinghua.y >= 100){
      jumpSound.play( )
      qinghua.velocityY = -10;
      touches = [];
    }
    
    qinghua.velocityY = qinghua.velocityY + 0.8
  
    if (fondo.x < 0){
      fondo.x = fondo.width/2;
    }
  
    if (pergaminosGroup.isTouching(qinghua)) {
      pergaminosGroup.destroyEach()
      score = score + 50;
    }
  
  
    if(rocaGroup.isTouching(qinghua)){
        collidedSound.play()           
        gameState = END;
    }

    createPerg(); 
    createRoca(); 

  } else if (gameState === END) {
    
    //establecer la velocidad de cada objeto del juego como 0
    fondo.velocityX = 0;
    qinghua.velocityY = 0
     
    //cambiar la animación 
    qinghua.changeAnimation("muere", qinghuaDie); 
    qinghua.scale = 0.1; 
    //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    rocaGroup.setLifetimeEach(-1);
    pergaminosGroup.setLifetimeEach(-1);
     
    rocaGroup.setVelocityXEach(0);
    pergaminosGroup.setVelocityXEach(0);

  }  
  
  drawSprites();
  textSize(20);
  fill("black")
  text("Puntuación insana: "+ score,10,20);

}


// creación aleatoria de pergaminos 
function createPerg() {
  if (frameCount % 200 == 0) {
    var posicionPerg = Math.round(random(50, 200));   
    pergaminos = createSprite(600, posicionPerg, 50, 50);
    pergaminos.addImage(pergaminosImg);
    pergaminos.setCollider("circle", 0, 0, 60); 
    pergaminos.scale = 0.25;  
    pergaminos.velocityX = -5;
    pergaminos.lifetime = 200;
    pergaminosGroup.add(pergaminos);
  }
}

// creación aleatoria de rocas
function createRoca(){
  if(frameCount % 120 === 0){
    var posicionRoca = Math.round(random(50, 200));  
    roca = createSprite(600, posicionRoca, 50, 50);    
    roca.addImage(rocaImg); 
    roca.setCollider("circle", 0, 0, 30); 
    var resize = Math.round(random(0.5, 1.5));
    roca.scale = 0.2;
    roca.velocityX = -5; 
    roca.lifetime = 300;   
    rocaGroup.add(roca); 
   
  }
}
