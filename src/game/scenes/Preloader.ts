import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { AnimationObject } from "../../types/animations";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.pack("asset_pack", "/assets/data/assets.json");
  }

  create() {
    this.#createAnimations();
    this.scene.start("Game");

    EventBus.emit("current-scene-ready", this);
  }

  #createAnimations() {
    const data = this.cache.json.get("animations_json");
    data.forEach((animation: AnimationObject) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }
}
