import { Application, Container } from "pixi.js";
import { Player } from "./player";
import { Platform } from "./platform";

export const Input = {
  keys: {
    space: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
  },
};

export class Game extends Container {
  private keydownHandler = this.onKeyDown.bind(this);
  private keyupHandler = this.onKeyUp.bind(this);

  app: Application;
  player: Player;
  platform: Platform;

  constructor(app: Application) {
    super();
    this.app = app;

    this.player = new Player();
    this.addChild(this.player);
    this.player.setup();
    this.player.position.set(100, 5);

    this.platform = new Platform();
    this.addChild(this.platform);
    this.platform.setup();
    this.platform.position.set(200, 200);

    this.setInputs();
  }

  handleUpdate() {
    this.player.handleUpdate();

    if (Input.keys.a.pressed) {
      this.player.velocity.x = -5;
    } else if (Input.keys.d.pressed) {
      this.player.velocity.x = 5;
    } else {
      this.player.velocity.x = 0;
    }

    if (
      this.player.position.y + this.player.height <= this.platform.position.y &&
      this.player.position.y + this.player.height + this.player.velocity.y >=
        this.platform.position.y &&
      this.player.position.x + this.player.width >= this.platform.position.x &&
      this.player.position.x <= this.platform.position.x + this.platform.width
    ) {
      this.player.velocity.y = 0;
    }
  }

  private setInputs() {
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case "Space":
        this.player.velocity.y = -20;
        break;
      case "KeyA":
        Input.keys.a.pressed = true;
        break;
      case "KeyD":
        Input.keys.d.pressed = true;
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "Space":
        Input.keys.space.pressed = false;
        break;
      case "KeyA":
        Input.keys.a.pressed = false;
        break;
      case "KeyD":
        Input.keys.d.pressed = false;
        break;
    }
  }
}
