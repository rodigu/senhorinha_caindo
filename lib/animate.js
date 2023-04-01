class Animate {
  /**
   * Returns an animation caller function.
   * Animations are functions that are applied to the given Entity instance.
   *
   * Animation configuration contains what mathematical function will be used to change the properties of the entity, as well as
   * the parameters for that change function.
   *
   * @date 4/1/2023 - 6:22:02 PM
   *
   * @static
   * @param {Entity} entity
   * @param {Function} animation
   * @param {{ func: () => void; funcArgs: {}; }} [animationConfig={ func: () => {}, funcArgs: {} }]
   * @returns {void; funcArgs: {}; }) => () => void}
   */
  static getAnimation(
    entity,
    animation,
    animationConfig = { func: () => {}, funcArgs: {} }
  ) {
    let currentFrame = 0;

    return () => {
      currentFrame++;
      animation({
        entity,
        currentFrame,
        animationConfig,
      });
    };
  }

  static linearFunc(x, args) {
    return x * args.a;
  }

  static quadratic(x, args) {
    const { a, b, c } = args;
    return a * x * x + b * x + c;
  }

  static turn(entityAnimation) {
    const { func, funcArgs } = entityAnimation.animationConfig;
    const { entity, currentFrame } = entityAnimation;

    entity.rotation = func(currentFrame, funcArgs);
  }
}
