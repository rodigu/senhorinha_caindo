class Road extends Entity {
  constructor(id, tileset, size, scrollSpeed = 1) {
    super(id, tileset, size);
    this.scrollSpeed = scrollSpeed;
    this.stop = false;
  }

  reset() {
    this.stop = false;
  }

  scroll() {
    if (this.stop) return;
    this.position.y += this.scrollSpeed;
    if (this.position.y >= height) this.position.y = this.scrollSpeed - height;
    if (this.manager.hasEvent(Player.Events.FALL)) this.stop = true;
  }

  draw() {
    super.draw();
    this.scroll();
  }
}
