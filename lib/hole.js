class Hole extends Road {
  constructor(id, tileset, size, scrollSpeed = 1) {
    super(id, tileset, size, scrollSpeed);
  }

  static randomPosition(hole) {
    hole.manager.entities.get("car").buracosDesviados += 1;
    return {
      x: Animate.random(-Hole.roadWidth, Hole.roadWidth),
      y: Animate.random(-5 * height, -height / 2 - hole.size.height),
    };
  }

  static randomSize() {
    const r = Animate.random(UNIT_SIZE / 2, 1.5 * UNIT_SIZE);
    return {
      width: r,
      height: r,
    };
  }

  static roadWidth = undefined;

  preload() {
    super.preload({ x: 10000, y: 10000 });
  }

  reset() {
    super.reset();
    this.position.y = this.manager.position.y * 3;
  }

  scroll() {
    if (this.stop) return;
    Hole.roadWidth ??= this.manager.entities.get("road0").size.width / 2;
    this.position.y += this.scrollSpeed;
    if (this.position.y - this.size.height / 2 >= height / 2) {
      this.setPosition(Hole.randomPosition(this));
      this.size = Hole.randomSize();
      this.collision.colliders[0].shapeArgs = {
        x: 0,
        y: 0,
        radius: this.size.width,
      };
    }
    if (this.manager.hasEvent(Player.Events.FALL)) this.stop = true;
  }
}
