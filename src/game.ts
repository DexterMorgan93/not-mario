import { Application, Container, Sprite } from "pixi.js";
import { Player } from "./player";
import { AssetsLoader } from "./assets-loader";
import { Platforms } from "./platforms";

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
  world: Container;
  player: Player;
  platforms!: Platforms;
  assetsLoader!: AssetsLoader;
  background: Sprite;
  gameEnded = false;

  constructor(app: Application) {
    super();
    this.app = app;
    this.setInputs();

    this.assetsLoader = new AssetsLoader();
    const {
      spritesheet: { textures },
      backgroundTexture,
      hillsTexture,
    } = this.assetsLoader.getAssets();

    const world = new Container();

    const background = new Sprite(backgroundTexture);
    world.addChild(background);
    this.background = background;

    const hills = new Sprite(hillsTexture);
    background.addChild(hills);

    this.player = new Player(this);
    world.addChild(this.player);
    this.player.setup();
    this.player.position.set(100, 5);

    this.platforms = new Platforms();
    this.platforms.setup({
      smallPlatform: textures["PlatformSmallTall.png"],
      platform: textures["Platform.png"],
      bottom: background.height,
    });
    world.addChild(this.platforms);

    this.world = world;
    this.addChild(world);
  }

  handleUpdate() {
    if (this.gameEnded) {
      return;
    }

    const { position, velocity, jumpSpeed, moveSpeed } = this.player;

    const worldPlayer = this.player.position;
    const worldPlayerRight = worldPlayer.x + this.player.width;
    const worldPlayerBottom = worldPlayer.y + this.player.height;

    this.player.handleUpdate();

    if (Input.keys.space.pressed) {
      velocity.y = -jumpSpeed;
    }

    if (Input.keys.a.pressed) {
      velocity.x = -moveSpeed;
    } else if (Input.keys.d.pressed) {
      velocity.x = moveSpeed;
    } else {
      velocity.x = 0;

      if (Input.keys.d.pressed) {
        // platform.position.x -= 5;
        this.background.position.x -= 2;
      } else if (Input.keys.a.pressed) {
        // platform.position.x += 5;
        this.background.position.x += 2;
      }
    }

    // взаимодействие с платформами
    this.platforms.children.forEach((platform) => {
      const worldPlatform = platform.position;
      const worldPlatformRight = worldPlatform.x + platform.width;
      if (
        worldPlayerRight >= worldPlatform.x &&
        worldPlayer.x <= worldPlatformRight &&
        worldPlayerBottom + velocity.y >= worldPlatform.y &&
        worldPlayerBottom <= worldPlatform.y
      ) {
        velocity.y = 0;
        position.y = worldPlatform.y - this.player.height;
        return true;
      }
    });
  }

  startGame = (): void => {
    this.gameEnded = false;
    this.world.position.x = 0;
    this.background.position.x = 0;
    this.player.position.set(0, 0);
  };

  endGame() {
    this.gameEnded = true;
    this.player.reset();
    setTimeout(() => {
      this.startGame();
    }, 300);
  }

  private setInputs() {
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case "Space":
        Input.keys.space.pressed = true;
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
