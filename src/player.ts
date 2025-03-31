import { AnimatedSprite, Container, Graphics, Texture } from "pixi.js";
import { Game } from "./game";

export interface IPlayerOptions {
  game: Game;
  textures: {
    idleLeftTexture: Texture[];
    idleRightTexture: Texture[];
    runLeftTexture: Texture[];
    runRightTexture: Texture[];
  };
}

export enum PlayerAnimation {
  idleLeft = "idleLeft",
  idleRight = "idleRight",
  runLeft = "runLeft",
  runRight = "runRight",
}

export class Player extends Container {
  static animation = PlayerAnimation;
  velocity = {
    x: 0,
    y: 0,
  };
  gravity = 0.5;
  game: Game;
  moveSpeed = 8;
  jumpSpeed = 13;
  textures: {
    idleLeftTexture: Texture[];
    idleRightTexture: Texture[];
    runLeftTexture: Texture[];
    runRightTexture: Texture[];
  };

  idleAnimation = PlayerAnimation.idleRight;
  idleLeft!: AnimatedSprite;
  idleRight!: AnimatedSprite;
  runLeft!: AnimatedSprite;
  runRight!: AnimatedSprite;

  constructor({ game, textures }: IPlayerOptions) {
    super();
    this.game = game;
    this.textures = textures;
  }

  setup() {
    const animContainerSprite = new Container();

    const idleRight = new AnimatedSprite(this.textures.idleRightTexture);
    idleRight.animationSpeed = 1;
    idleRight.scale.set(0.375);
    animContainerSprite.addChild(idleRight);
    this.idleRight = idleRight;

    const idleLeft = new AnimatedSprite(this.textures.idleLeftTexture);
    idleLeft.animationSpeed = 1;
    idleLeft.scale.set(0.375);
    animContainerSprite.addChild(idleLeft);
    this.idleLeft = idleLeft;

    const idleLeftrun = new AnimatedSprite(this.textures.runLeftTexture);
    idleLeftrun.animationSpeed = 1;
    idleLeftrun.scale.set(0.375);
    animContainerSprite.addChild(idleLeftrun);
    this.runLeft = idleLeftrun;

    const runRight = new AnimatedSprite(this.textures.runRightTexture);
    runRight.animationSpeed = 1;
    runRight.scale.set(0.375);
    animContainerSprite.addChild(runRight);
    this.runRight = runRight;

    this.addChild(animContainerSprite);
  }

  stopAllAnimations(): void {
    [this.idleLeft, this.idleRight, this.runLeft, this.runRight].forEach(
      (spr) => {
        if (spr) spr.stop();
      }
    );
  }

  hideAllAnimations(): void {
    [this.idleLeft, this.idleRight, this.runLeft, this.runRight].forEach(
      (spr) => {
        spr.visible = false;
      }
    );
  }

  switchAnimation(anim: PlayerAnimation) {
    this.stopAllAnimations();
    this.hideAllAnimations();

    switch (anim) {
      case PlayerAnimation.idleLeft:
        this.idleLeft.play();
        this.idleLeft.visible = true;
        break;
      case PlayerAnimation.idleRight:
        this.idleRight.play();
        this.idleRight.visible = true;
        break;
      case PlayerAnimation.runRight:
        this.runRight.play();
        this.runRight.visible = true;
        this.idleAnimation = PlayerAnimation.idleRight;
        break;
      case PlayerAnimation.runLeft:
        this.runLeft.play();
        this.runLeft.visible = true;
        this.idleAnimation = PlayerAnimation.idleLeft;
        break;
    }
  }

  updateAnimation(): void {
    if (this.velocity.x > 0) {
      this.switchAnimation(Player.animation.runRight);
    } else if (this.velocity.x < 0) {
      this.switchAnimation(Player.animation.runLeft);
    } else {
      this.switchAnimation(this.idleAnimation);
    }
  }

  handleUpdate() {
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= 576) {
      this.velocity.y += this.gravity;
    } else {
      this.game.endGame();
    }

    this.updateAnimation();
  }

  reset(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
}
