import { Container, Texture } from "pixi.js";
import { Platform } from "./platform";

interface PlatformOptions {
  smallPlatform: Texture;
  platform: Texture;
  bottom: number;
}

export class Platforms extends Container {
  constructor() {
    super();
  }

  setup({ smallPlatform, platform, bottom }: PlatformOptions) {
    console.log("bottom", bottom);
    console.log("platform.height", platform.height);
    const platform1 = new Platform({ id: "1", platformTexture: platform });
    platform1.position.y = 450;
    console.log("platform1.position.y", platform1.position.y);
    this.addChild(platform1);

    const platform2 = new Platform({ id: "2", platformTexture: platform });
    platform2.position.set(platform1.width - 2, platform1.y);
    this.addChild(platform2);

    const platform3 = new Platform({
      id: "3",
      platformTexture: smallPlatform,
    });
    platform3.position.set(
      platform2.x + platform2.width - 290,
      450 - smallPlatform.height
    );
    this.addChild(platform3);

    const platform4 = new Platform({ id: "4", platformTexture: smallPlatform });
    platform4.position.set(
      platform3.x + platform3.width + 300,
      bottom - smallPlatform.height - 275
    );
    this.addChild(platform4);

    const platform5 = new Platform({ id: "5", platformTexture: platform });
    platform5.position.set(platform4.x + platform4.width + 200, platform1.y);
    this.addChild(platform5);

    const platform6 = new Platform({ id: "6", platformTexture: platform });
    platform6.position.set(platform5.x + platform5.width + 200, platform1.y);
    this.addChild(platform6);

    const platform7 = new Platform({ id: "7", platformTexture: smallPlatform });
    platform7.position.set(
      platform6.x + platform6.width - smallPlatform.width,
      platform6.y - smallPlatform.height
    );
    this.addChild(platform7);

    const platform8 = new Platform({ id: "8", platformTexture: platform });
    platform8.position.set(platform7.x + platform7.width + 500, platform1.y);
    this.addChild(platform8);
  }
}
