class GameManager {
  constructor(unitSize) {
    this.unitSize = unitSize;
    this.entities = new Map();
    this.shownEntities = new Map();
    this.rotation = 0;
    this.states = new Map();
    this.currentState = "game";
    this.behaviorFunctions = new Map();
    this.categorizedEntities = new Map();
    this.collisionMapping = new Map();
  }

  addCategory(categoryName) {
    this.categorizedEntities.set(categoryName, []);
  }

  getCategory(categoryName) {
    return this.categorizedEntities.get(categoryName);
  }

  addEntityToCategory(categoryName, entityName) {
    this.categorizedEntities
      .get(categoryName)
      .push(this.entities.get(entityName));
  }

  addBehavior(name, func) {
    this.behaviorFunctions.set(name, func);
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

    if (entity.collision !== undefined) {
      for (const id of entity.collision.collisionIDs.values()) {
        if (this.collisionMapping.get(id) === undefined)
          this.collisionMapping.set(id, []);
        this.collisionMapping.get(id).push(entity.collision);
      }
    }
  }

  draw() {
    for (const bf of this.behaviorFunctions.values()) bf(this);
    this.states.get(this.currentState)(this);
  }

  static drawEntities(manager) {
    push();
    translate(manager.position.x, manager.position.y);
    rotate(manager.rotation);
    for (const entity of manager.shownEntities.values()) {
      entity.draw();
      if (entity.collision !== undefined) {
        for (const collidesWithID of entity.collision.collidesWith.values()) {
          for (const possibleCollision of manager.collisionMapping.get(
            collidesWithID
          )) {
            for (const point of possibleCollision.points()) {
              if (entity.collision.collidesWithPoint(point)) {
                entity.collision.addCollidingEntity(
                  possibleCollision.parent.id,
                  possibleCollision.parent
                );
              } else
                entity.collision.removeCollidingEntity(
                  possibleCollision.parent.id,
                  possibleCollision.parent
                );
            }
          }
        }
      }
    }
    pop();
  }
}
