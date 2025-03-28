import * as Pixi from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Game } from "./game";
import { AssetsLoader } from "./assets-loader";

const app = new Pixi.Application();

async function setup() {
  await app.init({
    width: 1024,
    height: 576,
  });
  document.body.appendChild(app.canvas);
}

async function initAssets() {
  const assetsLoader = new AssetsLoader();
  await assetsLoader.initializeLoader();
}

(async () => {
  await setup();
  await initAssets();

  const game = new Game(app);
  app.stage.addChild(game);
  app.ticker.add(game.handleUpdate, game);
})();

initDevtools({
  app,
});
