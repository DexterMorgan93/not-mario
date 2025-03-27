import { Container, Graphics } from "pixi.js";

export class Player extends Container {
  velocity = {
    x: 0,
    y: 0,
  };
  gravity = 0.5;

  constructor() {
    super();
  }

  setup() {
    const view = new Graphics();
    view.rect(0, 0, 30, 30);
    view.fill({ color: "red" });
    this.addChild(view);
  }

  handleUpdate() {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= 768) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
