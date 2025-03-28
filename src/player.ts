import { Container, Graphics } from "pixi.js";
import { Game } from "./game";

export class Player extends Container {
  velocity = {
    x: 0,
    y: 0,
  };
  gravity = 0.5;
  game: Game;
  public moveSpeed = 8;
  public jumpSpeed = 20;

  constructor(game: Game) {
    super();
    this.game = game;
  }

  setup() {
    const view = new Graphics();
    view.rect(0, 0, 30, 30);
    view.fill({ color: "red" });
    this.addChild(view);
  }

  handleUpdate() {
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= 576) {
      this.velocity.y += this.gravity;
    } else {
      this.game.endGame();
    }
  }

  reset(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
}
