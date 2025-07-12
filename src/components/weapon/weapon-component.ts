import { InputComponent } from "../input/input-component";

interface BulletConfig {
  maxCount: number;
}

export class WeaponComponent {
  #gameObject: Phaser.GameObjects.GameObject;
  #inputComponent: InputComponent;
  #bulletGroup: Phaser.Physics.Arcade.Group;
  #bulletConfig: BulletConfig;

  constructor(
    gameObject: Phaser.GameObjects.GameObject,
    inputComponent: InputComponent,
    bulletConfig: BulletConfig
  ) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#bulletConfig = bulletConfig;

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
    console.log(this.#bulletGroup);
  }
}
