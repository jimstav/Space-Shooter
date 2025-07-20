import { ColliderComponent } from "../../components/collider/ColliderComponent";
import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../../components/events/EventBusComponent";
import { HealthComponent } from "../../components/health/HealthComponent";
import { BotFighterInputComponent } from "../../components/input/BotFighterInputComponent";
import { VerticalMovementComponent } from "../../components/movement/VerticalMovementComponent";
import { WeaponComponent } from "../../components/weapon/WeaponComponent";
import * as CONFIG from "../../config";

export class FighterEnemy extends Phaser.GameObjects.Container {
  #inputComponent: BotFighterInputComponent;
  #weaponComponent: WeaponComponent;
  #verticalMovementComponent: VerticalMovementComponent;
  #healthComponent: HealthComponent;
  #colliderComponent: ColliderComponent;
  #eventBusComponent: EventBusComponent;
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

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  get weaponGameObjectGroup() {
    return this.#weaponComponent.bulletGroup;
  }

  get weaponComponent() {
    return this.#weaponComponent;
  }

  get colliderComponent() {
    return this.#colliderComponent;
  }

  get healthComponent() {
    return this.#healthComponent;
  }

  init(eventBusComponent: EventBusComponent) {
    this.#eventBusComponent = eventBusComponent;
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

    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_FIGHTER_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#verticalMovementComponent.reset();
  }

  update(ts: number, dt: number): void {
    if (!this.active) {
      return;
    }

    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
    }

    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }
}
