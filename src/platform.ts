import { Container, Sprite, Texture } from "pixi.js";

export class Platform extends Container {
  constructor(positionX: number, positionY: number, platformTexture: Texture) {
    super();

    const platformprite = new Sprite(platformTexture);

    this.addChild(platformprite);
    this.position.set(positionX, positionY);
  }
}
