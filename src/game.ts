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
  winOffset = 4500;
  player: Player;
  platforms!: Platforms;
  assetsLoader!: AssetsLoader;
  background: Sprite;
  gameEnded = false;
  moveLevelBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  moveLevelBoundsOptions = {
    left: 100,
    right: 400,
  };

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

    this.moveLevelBounds = {
      x: this.moveLevelBoundsOptions.left,
      y: 0,
      width:
        this.moveLevelBoundsOptions.right - this.moveLevelBoundsOptions.left,
      height: 576,
    };
  }

  handleUpdate() {
    if (this.gameEnded) {
      return;
    }

    const { position, velocity, jumpSpeed, moveSpeed } = this.player;

    const worldPlayer = this.player.position;
    const worldPlayerRight = worldPlayer.x + this.player.width;
    const worldPlayerBottom = worldPlayer.y + this.player.height;

    if (Input.keys.space.pressed) {
      velocity.y = -jumpSpeed;
    }

    if (Input.keys.a.pressed) {
      velocity.x = -moveSpeed;
    } else if (Input.keys.d.pressed) {
      velocity.x = moveSpeed;
    } else {
      velocity.x = 0;
    }

    const { left, right, bottom, width } = this.player.getBounds();

    // ограничение игрока выхода за пределы мира
    if (left + velocity.x < this.background.x) {
      velocity.x = 0;
      position.x = this.background.x;
    } else if (right + velocity.x > this.background.width) {
      velocity.x = 0;
      position.x = this.background.width - width;
    } else {
      position.x += velocity.x;
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

    //скроллинг уровня при движении игрока внутри некоторой "зоны движения" (moveLevelBounds), и использование toGlobal() для получения глобальной позиции игрока.
    const playerGlobal = this.player.toGlobal({ x: 0, y: 0 });

    if (
      playerGlobal.x + width >
        this.moveLevelBounds.x + this.moveLevelBounds.width &&
      velocity.x > 0
    ) {
      this.world.pivot.x += velocity.x;
    } else if (playerGlobal.x < this.moveLevelBounds.x && velocity.x < 0) {
      this.world.pivot.x += velocity.x;
    }

    if (this.world.pivot.x < 0) {
      this.world.pivot.x = 0;
    }

    if (this.world.pivot.x !== 0) {
      this.background.pivot.x = -this.world.pivot.x + this.world.pivot.x * 0.5;
    } else {
      this.background.pivot.x = 0;
    }

    if (bottom > this.background.height) {
      this.endGame();
    } else {
      this.player.handleUpdate();
      if (this.player.x > this.winOffset) {
        this.endGame();
      }
    }
  }

  startGame = (): void => {
    this.gameEnded = false;
    this.world.pivot.x = 0;
    this.background.pivot.x = 0;
    this.player.position.set(0, 0);
  };

  endGame(): void {
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
