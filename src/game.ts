import { Application, Container } from "pixi.js";
import { Player } from "./player";
import { Platform } from "./platform";
import { AssetsLoader } from "./assets-loader";

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
  platforms: Platform[] = [];
  assetsLoader!: AssetsLoader;

  constructor(app: Application) {
    super();
    this.app = app;

    this.player = new Player();
    this.addChild(this.player);
    this.player.setup();
    this.player.position.set(100, 5);

    this.assetsLoader = new AssetsLoader();

    const {
      spritesheet: { textures },
    } = this.assetsLoader.getAssets();

    const platform1 = new Platform(0, 455, textures["Platform.png"]);
    const platform2 = new Platform(578, 455, textures["Platform.png"]);
    const platform3 = new Platform(1156, 455, textures["Platform.png"]);
    const platform4 = new Platform(1734, 455, textures["Platform.png"]);

    this.platforms.push(platform1, platform2, platform3, platform4);

    this.platforms.forEach((platform) => {
      this.addChildAt(platform, 0);
    });

    this.setInputs();
  }

  handleUpdate() {
    this.player.handleUpdate();

    this.platforms.forEach((platform) => {
      if (Input.keys.a.pressed && this.player.position.x > 100) {
        this.player.velocity.x = -5;
      } else if (Input.keys.d.pressed && this.player.position.x < 400) {
        this.player.velocity.x = 5;
      } else {
        this.player.velocity.x = 0;

        if (Input.keys.d.pressed) {
          platform.position.x -= 5;
        } else if (Input.keys.a.pressed) {
          platform.position.x += 5;
        }
      }

      if (
        this.player.position.y + this.player.height <= platform.position.y &&
        this.player.position.y + this.player.height + this.player.velocity.y >=
          platform.position.y &&
        this.player.position.x + this.player.width >= platform.position.x &&
        this.player.position.x <= platform.position.x + platform.width
      ) {
        this.player.velocity.y = 0;
      }
    });
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
