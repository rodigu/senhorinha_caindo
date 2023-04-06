class GameManager {
  constructor(unitSize) {
    this.unitSize = unitSize;
    this.entities = new Map();
    this.shownEntities = new Map();
    this.rotation = 0;
    this.states = new Map();
    this.currentState = "game";
  }

  addState(stateName, stateFunction) {
    this.states.set(stateName, stateFunction);
  }

  setCurrentState(stateName) {
    this.currentState = stateName;
  }

  get mouseX() {
    return mouseX - this.position.x;
  }

  get mouseY() {
    return mouseY - this.position.y;
  }

  get mouseVector() {
    const mv = createVector(this.mouseX, this.mouseY);
    mv.rotate(this.rotation);
    return mv;
  }

  preload() {
    for (const entity of this.entities.values()) {
      entity.preload();
    }
    this.states.set("game", GameManager.drawEntities);
  }

  setPosition(pos) {
    this.position = createVector(pos.x, pos.y);
  }

  addEntity(entity, id, layer = 0) {
    this.entities.set(id, entity);
    if (entity.isShown) {
      this.shownEntities.set(id, entity);
    }
    entity.setManager(this);
  }

  draw() {
    this.states.get(this.currentState)(this);
  }

  static drawEntities(manager) {
    push();
    translate(manager.position.x, manager.position.y);
    rotate(manager.rotation);
    for (const entity of manager.shownEntities.values()) {
      entity.draw();
    }
    pop();
  }
}
