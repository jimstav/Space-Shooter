import { InputComponent } from "../input/input-component";

interface BulletConfig {
  speed: number;
  interval: number;
  lifespan: number;
  maxCount: number;
  yOffset: number;
  flipY: boolean;
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

    this.#gameObject.scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_STEP,
      this.worldStep,
      this
    );
    this.#gameObject.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.#gameObject.scene.physics.world.off(
          Phaser.Physics.Arcade.Events.WORLD_STEP,
          this.worldStep,
          this
        );
      },
      this
    );
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
      bullet.body!.velocity.y -= this.#bulletConfig.speed;
      bullet.setState(this.#bulletConfig.lifespan);

      this.#fireBulletInterval = this.#bulletConfig.interval;
    }
  }

  worldStep(delta: number) {
    this.#bulletGroup
      .getChildren()
      .forEach((bullet: Phaser.GameObjects.GameObject) => {
        if (
          !bullet.active ||
          !(bullet instanceof Phaser.Physics.Arcade.Sprite)
        ) {
          return;
        }

        if (typeof bullet.state !== "number") return;
        bullet.state -= delta;
        if (bullet.state <= 0) {
          bullet.disableBody(true, true);
        }
      });
  }
}
