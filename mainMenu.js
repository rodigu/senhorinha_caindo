function setupMainMenu() {
  gameManager.addState("menu", (manager) => {
    background(0);
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(50);
    stroke(255, 0, 0);
    strokeWeight(2);
    text("MENU", width / 2, height / 2);
    pop();
    if (mouseIsPressed) manager.setCurrentState("game");
  });

  gameManager.addState("lose", (manager) => {
    background(0, 50);
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(50);
    stroke(255, 0, 0);
    strokeWeight(2);
    text("CAIU", width / 2, height / 2);
    pop();
    if (mouseIsPressed) {
      manager.reset();
      manager.setCurrentState("game");
    }
  });
}
