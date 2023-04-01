class Entity {
  constructor(id, tileset, size, isShown = false) {
    this.id = id;
    this.tiles = tileset;
    this.position = {};
    this.spriteAnimations = new Map();
    this.currentAnimation = {
      name: "",
      idx: 0,
      sinceLastFrame: 0,
    };
    this.size = size;
    this.rotation = 0;
    this.isShown = isShown;
    return this;
  }

  preload(initialPosition = { x: 0, y: 0 }) {
    this.tiles.preload();
    this.position = createVector(initialPosition.x, initialPosition.y);
  }

  setPosition(point) {
    this.position.x = point.x;
    this.position.y = point.y;
  }

  setSize(size) {
    this.size = size;
  }

  draw() {
    const currentAnimationList = this.spriteAnimations.get(
      this.currentAnimation.name
    ).cycle;
    const currentSprite = currentAnimationList[this.currentAnimation.idx];
    if (currentAnimationList.length > 1) {
      if (this.currentAnimation.sinceLastFrame <= 0) {
        this.currentAnimation.sinceLastFrame = this.spriteAnimations.get(
          this.currentAnimation.name
        ).time;
        this.currentAnimation.idx =
          (this.currentAnimation.idx + 1) % currentAnimationList.length;
      }
      this.currentAnimation.sinceLastFrame--;
    }

    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);
    this.tiles.drawTile(currentSprite, 0, 0, this.size, CENTER);
    pop();
  }

  addAnimation(name, cycle, time) {
    this.spriteAnimations.set(name, { cycle, time });
  }

  setCurrentAnimation(name) {
    this.currentAnimation.name = name;
    this.currentAnimation.idx = 0;
    this.currentAnimation.sinceLastFrame = 0;
  }
}
