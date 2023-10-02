const { Engine,World,Mouse,MouseConstraint,Events,Body} = Matter;

let ground,boxes = [],slingShot,alto,ancho,escala;

function setup() {
  const cambas = createCanvas(window.innerWidth, window.innerHeight);
  windowResized();

  engine = Engine.create();
  world = engine.world;

  const mouse = Mouse.create(cambas.elt);
  mouse.pixelRatio = pixelDensity();

  mouseConstraint = MouseConstraint.create(engine,{mouse:mouse});

  birds = [
    new Bird((ancho - (4*ancho/5))*escala,(alto/2)*escala,5*escala,5,redImg),
    new Bird((ancho - (4*ancho/5) - 10)*escala,(alto/2)*escala,5*escala,5,redImg),
    new Bird((ancho - (4*ancho/5) - 20)*escala,(alto/2)*escala,5*escala,5,redImg)
  ];

  ground = new Ground(ancho/2 * escala,(alto/2 + 45)*escala,ancho*escala,10*escala);
  slingShot = new SlingShot(birds[0],slingShotImg);
  Events.on(engine,"afterUpdate",()=>{
    slingShot.fly(mouseConstraint);
  });

  Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
  
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      //console.log('Colisión detectada:', pair.bodyA.label, pair.bodyB.label);

      if (pair.bodyA.label == "paloma") {
        //console.log("paloma");
        if (["cerdo","caja"].includes(pair.bodyB.label)) {
          //console.log("la desaparicion");
          let palomaExplotar = null;
          let cosaExplotar = null;
          birds.forEach(bird => {
            if (bird.body.id == pair.bodyA.id) {
              //console.log("pair id",pair.bodyA.id);
              //console.log("bird id",bird.body.id);
              palomaExplotar = bird;
            }
          cerdos.forEach(cerdo => {
            if (cerdo.body.id == pair.bodyB.id) {
              cosaExplotar = cerdo;
            }
          });
            setTimeout(() => {
              palomaExplotar.img = pufImg;
              cosaExplotar.img = pufImg;
              World.remove(world,pair.bodyA);
              World.remove(world,pair.bodyB);
            }, 5000);
            
          });
        }
      }

      if (pair.bodyA.label == "caja") {
        //console.log("caja");
        let cosaExplotar = null;
        //console.log("contra",pair.bodyB.label)
        if (pair.bodyB.label == "cerdo") {
          //console.log("cerdo");
          cerdos.forEach(cerdo => {
            if (cerdo.body.id == pair.bodyB.id) {
              cosaExplotar = cerdo;
            }
          });
        }
        if (cosaExplotar) {
          setTimeout(() => {
            if (cosaExplotar.golpes <= 1) {
              cosaExplotar.golpes += 1;
              cosaExplotar.img = pigDolorImg;
            }else{
              cosaExplotar.img = pufImg;
              World.remove(world,pair.bodyB);
            }
          }, 500);  
        }
        
      }

    }
  });

  World.add(world,mouseConstraint);

  intento = 0;

  for (let i=0; i<3; i++){
    const box = new Box((ancho * 3/4)* escala, ((alto/2 + 45)*(-i-1))*escala, 20*escala, 20*escala, boxImg);
    boxes.push(box);
  }

  for (let i=0; i<3; i++){
    const box = new Box((ancho * 0.5)* escala, ((alto/2 + 45)*(-i-1))*escala, 20*escala, 20*escala, boxImg);
    boxes.push(box);
  }

  boxes.push(new Box(((ancho * 0.5)+55)* escala, ((alto/2 + 45)*-3)*escala, (ancho * 0.3)*escala, 10*escala, box2Img));

  cerdos =[
    new Pig((ancho * 3/4 - 30) * escala, 6*escala, 6*escala, 10, pigImg),
    new Pig((ancho * 3/4 - 60) * escala, 6*escala, 6*escala, 10, pigImg)
  ] 
}

function windowResized() {
  const pxRatio = ancho/alto;
  let newWidth = windowWidth;
  let newHeight = windowWidth / pxRatio;
  if (newHeight > windowHeight) {
    newHeight = windowHeight;
    newWidth = newHeight * pxRatio;
  }
  escala = newWidth/ancho;
  resizeCanvas(ancho*escala, alto*escala);
}

function preload(){
  redImg = loadImage("./assets/red.png");
  boxImg = loadImage("./assets/box.png");
  box2Img = loadImage("./assets/box2.png");
  pigImg = loadImage("./assets/marrano.png");
  pigDolorImg = loadImage("./assets/marranoAdolorido.png");
  pufImg = loadImage("./assets/puf.png");
  slingShotImg = loadImage("./assets/resortera.png");
  bg = loadImage("./assets/fondo.jpg",()=>{
    ancho = bg.width;
    alto = bg.height;
  });
  groundImg = loadImage("./assets/ground.png");
}

function draw() {
  background(0);
  image(bg,0,0,ancho*escala,alto*escala);
  Engine.update(engine);
  slingShot.show();
  birds.forEach(bird => {
    bird.show();
  });
  ground.show();

  for (const pig of cerdos) {
    pig.show();
  }
  
  for (const box of boxes) {
    box.show();
  }
}

function keyPressed(){
  if (key == ' ' && !slingShot.hasBird()) {
    intento += 1;
    if(intento >= birds.leight){
      window.alert("fin");
    }else{
      bird = birds[intento];
      Body.setPosition(bird.body,{x: slingShot.sling.pointA.x, y: slingShot.sling.pointA.y});
      Body.setVelocity(bird.body,{x: 0, y: 0});
      slingShot.attach(bird);
    }
  }
  
}