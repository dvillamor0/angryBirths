class Redondo{
  constructor(x, y, r, m, img){
    this.body = Matter.Bodies.circle(x, y, r, {restitution: 0.5});
    Matter.Body.setMass(this.body, m);
    Matter.World.add(world, this.body);
    this.img = img;
  }
  
  show() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    fill(255);
    imageMode(CENTER);
    image(this.img, 0, 0, 2*this.body.circleRadius, 2*this.body.circleRadius);
    pop();
  } 
}

class Bird extends Redondo{
  constructor(x, y, r, m, img){
    super(x,y,r,m,img);
    this.body.label = "paloma";
  }
}

class Pig extends Redondo{
  constructor(x, y, r, m, img){
    super(x,y,r,m,img);
    this.body.label = "cerdo";
    this.golpes = 0;
  }
}

class Box {
  constructor(x, y, w, h, img, options={}) {
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    this.body.label = "caja";
    this.w = w;
    this.h = h;
    this.img = img;
    Matter.World.add(world, this.body);
  }
  
  show() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    if (this.img) {
      imageMode(CENTER);
      image(this.img, 0, 0, this.w, this.h);
    }
    pop();
  } 
}

class Ground extends Box {
  
  constructor(x, y, w, h){
    super(x, y, w, h, null, {isStatic: true});
    this.body.label = "piso";
  }
  
}

class SlingShot {
  constructor(body,img){
    const options = {
      pointA: {
        x: body.body.position.x,
        y: body.body.position.y
      },
      bodyB: body.body,
      length: 5,
      stiffness: 0.05
    }
    this.sling = Matter.Constraint.create(options);
    this.img = img;
    Matter.World.add(world, this.sling);
  }
  
  show(){
    if (this.sling.bodyB != null){
      stroke(0);
      strokeWeight(4);
      line(this.sling.pointA.x-5*escala, this.sling.pointA.y,
        this.sling.bodyB.position.x, this.sling.bodyB.position.y);
      line(this.sling.pointA.x+5*escala, this.sling.pointA.y,
        this.sling.bodyB.position.x, this.sling.bodyB.position.y);
    }
    push();
    imageMode(CENTER);
    image(this.img, this.sling.pointA.x, this.sling.pointA.y+(15*escala), 40*escala,40*escala);
    pop();
  }
  
  fly(mConstraint){
    if (this.sling.bodyB != null 
      && mConstraint.mouse.button === -1
      && this.sling.bodyB.position.x > 90*escala) {
        this.sling.bodyB = null;
      }
  }
 
   hasBird(){
     return this.sling.bodyB != null;
   }
   
   attach(bird){
     this.sling.bodyB = bird.body;
   }

}