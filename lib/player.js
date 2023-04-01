class Player extends Entity {
  constructor(id, tileset, size, isShown = false) {
    super(id, tileset, size, isShown);
    this.movementVector = {};
    this.move = {
      startFrame: 0,
    };
    this.isAccelerating = false;
    this.speed = 0;
    this.maxSpeed = UNIT_SIZE;
    this.animations = new Map();
    this.isFollowingMouse = false;
  }

  preload() {
    super.preload({ x: -100, y: -100 });
    this.movementVector = createVector(0, 0);

    this.animations.set(
      "turn right",
      Animate.getAnimation(this, Animate.turn, {
        func: Animate.linearFunc,
        funcArgs: 1,
      })
    );
    this.animations.set(
      "turn left",
      Animate.getAnimation(this, Animate.turn, {
        func: Animate.linearFunc,
        funcArgs: -1,
      })
    );
  }

  currentSpeed() {
    return (
      (UNIT_SIZE * 0.12) /
      (1 + exp(UNIT_SIZE * 0.02 - (frameCount - this.move.startFrame)))
    );
  }

  draw() {
    super.draw();

    if (this.position.x <= -100 && this.position.y <= -100)
      this.position = createVector(width / 2, UNIT_SIZE * 8);

    const mouseVector = createVector(mouseX, mouseY);
    if (mouseIsPressed) {
      if (this.move.startFrame === 0) this.move.startFrame = frameCount;
      const difference = p5.Vector.sub(this.position, mouseVector);
      difference.normalize();
      difference.rotate(PI);

      difference.mult(this.currentSpeed());

      console.log(this.rotation);

      if (this.position.dist(mouseVector) > UNIT_SIZE / 10) {
        this.position.add(difference);
        this.isFollowingMouse = true;
      } else {
        this.move.startFrame = frameCount;
        this.isFollowingMouse = false;
      }
    } else {
      this.move.startFrame = 0;
      this.isFollowingMouse = false;
    }

    if (this.isFollowingMouse) {
      const angle = mouseVector.angleBetween(this.position);
      this.rotation += angle;
    } else {
      if (this.rotation < -PI / 50) this.rotation += PI / 25;
      else if (this.rotation > PI / 50) this.rotation -= PI / 25;
    }

    if (this.rotation > PI / 6) this.rotation = PI / 6;
    else if (this.rotation < -PI / 6) this.rotation = -PI / 6;
  }
}
