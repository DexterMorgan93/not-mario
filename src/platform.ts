import { Sprite, Texture } from "pixi.js";

export class Platform extends Sprite {
  id: string;
  constructor({
    id,
    platformTexture,
  }: {
    id: string;
    platformTexture: Texture;
  }) {
    super(platformTexture);

    this.id = id;
  }
}
