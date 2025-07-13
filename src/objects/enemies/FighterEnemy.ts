import { BotFighterInputComponent } from "../../components/input/BotFighterInputComponent";
import { VerticalMovementComponent } from "../../components/movement/VerticalMovementComponent";
import { WeaponComponent } from "../../components/weapon/WeaponComponent";
import * as CONFIG from "../../config";

export class FighterEnemy extends Phaser.GameObjects.Container {
  #inputComponent: BotFighterInputComponent;
  #weaponComponent: WeaponComponent;
  #verticalMovementComponent: VerticalMovementComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, []);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(-12, -12);

    this.#shipSprite = scene.add.sprite(0, 0, "fighter", 0);
    this.#shipEngineSprite = scene.add
      .sprite(0, 0, "fighter_engine")
      .setFlipY(true);
    this.#shipEngineSprite.play("fighter_engine");
    this.add([this.#shipEngineSprite, this.#shipSprite]);

    this.#inputComponent = new BotFighterInputComponent();
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_FIGHTER_MOVEMENT_VERTICAL_VELOCITY
    );

    this.#weaponComponent = new WeaponComponent(this, this.#inputComponent, {
      speed: CONFIG.ENEMY_FIGHTER_BULLET_SPEED,
      interval: CONFIG.ENEMY_FIGHTER_BULLET_INTERVAL,
      lifespan: CONFIG.ENEMY_FIGHTER_BULLET_LIFESPAN,
      maxCount: CONFIG.ENEMY_FIGHTER_BULLET_MAX_COUNT,
      yOffset: 10,
      flipY: true,
    });

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  update(ts: number, dt: number): void {
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }
}
