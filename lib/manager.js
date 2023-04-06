class GameManager {
  constructor(unitSize) {
    this.unitSize = unitSize;
    this.entities = new Map();
    this.shownEntities = new Map();
    this.position = { x: 0, y: 0 };
  }

  preload() {
    for (const entity of this.entities.values()) {
      entity.preload();
    }
  }

  addEntity(entity, id, layer = 0) {
    this.entities.set(id, entity);
    if (entity.isShown) {
      this.shownEntities.set(id, entity);
    }
  }

  drawEntities() {
    push();
    translate(this.position.x, this.position.y);
    for (const entity of this.shownEntities.values()) {
      entity.draw();
    }
    pop();
  }
}
