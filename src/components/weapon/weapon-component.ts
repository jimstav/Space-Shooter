import { InputComponent } from "../input/input-component";

interface BulletConfig {
  interval: number;
  maxCount: number;
  yOffset: number;
}

export class WeaponComponent {
  #gameObject: Phaser.GameObjects.Container;
  #inputComponent: InputComponent;
  #bulletGroup: Phaser.Physics.Arcade.Group;
  #fireBulletInterval: number;
  #bulletConfig: BulletConfig;

  constructor(
    gameObject: Phaser.GameObjects.Container,
    inputComponent: InputComponent,
    bulletConfig: BulletConfig
  ) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#bulletConfig = bulletConfig;
    this.#fireBulletInterval = 0;

    this.#bulletGroup = this.#gameObject.scene.physics.add.group({
      name: `bullets-${Phaser.Math.RND.uuid()}`,
      enable: false,
    });
    this.#bulletGroup.createMultiple({
      key: "bullet",
      quantity: this.#bulletConfig.maxCount,
      active: false,
      visible: false,
    });
  }

  update(dt: number) {
    this.#fireBulletInterval -= dt;
    if (this.#fireBulletInterval > 0) {
      return;
    }

    if (this.#inputComponent.shootIsDown) {
      const bullet: Phaser.Physics.Arcade.Sprite =
        this.#bulletGroup.getFirstDead();
      if (!bullet) {
        return;
      }
      const x = this.#gameObject.x;
      const y = this.#gameObject.y + this.#bulletConfig.yOffset;
      bullet.enableBody(true, x, y, true, true);

      this.#fireBulletInterval = this.#bulletConfig.interval;
    }
  }
}
