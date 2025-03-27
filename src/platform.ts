import { Container, Graphics } from "pixi.js";

export class Platform extends Container {
  constructor() {
    super();
  }

  setup() {
    const view = new Graphics();
    view.rect(0, 0, 200, 20);
    view.fill({ color: "blue" });
    this.addChild(view);
  }
}
