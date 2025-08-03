import { ColliderComponent } from "../components/collider/ColliderComponent";
import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../components/events/EventBusComponent";
import { HealthComponent } from "../components/health/HealthComponent";
import { KeyboardInputComponent } from "../components/input/KeyboardInputComponent";
import { HorizontalMovementComponent } from "../components/movement/HorizontalMovementComponent";
import { WeaponComponent } from "../components/weapon/WeaponComponent";
import * as CONFIG from "../config";

export class Player extends Phaser.GameObjects.Container {
  #keyboardInputComponent: KeyboardInputComponent;
  #weaponComponent: WeaponComponent;
  #horizontalMovementComponent: HorizontalMovementComponent;
  #healthComponent: HealthComponent;
  #colliderComponent: ColliderComponent;
  #eventBusComponent: EventBusComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;
  #shipEngineThrusterSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);

    this.#eventBusComponent = eventBusComponent;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(-12, -12);
    body.setCollideWorldBounds(true);

    this.setDepth(2);

    this.#shipSprite = scene.add.sprite(0, 0, "ship");
    this.#shipEngineSprite = scene.add.sprite(0, 0, "ship_engine");
    this.#shipEngineThrusterSprite = scene.add.sprite(
      0,
      0,
      "ship_engine_thruster"
    );
    this.#shipEngineThrusterSprite.play("ship_engine_thruster");
    this.add([
      this.#shipEngineThrusterSprite,
      this.#shipEngineSprite,
      this.#shipSprite,
    ]);

    this.#keyboardInputComponent = new KeyboardInputComponent(this.scene);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#keyboardInputComponent,
      CONFIG.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY
    );

    this.#weaponComponent = new WeaponComponent(
      this,
      this.#keyboardInputComponent,
      {
        speed: CONFIG.PLAYER_BULLET_SPEED,
        interval: CONFIG.PLAYER_BULLET_INTERVAL,
        lifespan: CONFIG.PLAYER_BULLET_LIFESPAN,
        maxCount: CONFIG.PLAYER_BULLET_MAX_COUNT,
        yOffset: -20,
        flipY: false,
      }
    );

    this.#healthComponent = new HealthComponent(CONFIG.PLAYER_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent);

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

  update(ts: number, dt: number): void {
    if (!this.active) {
      return;
    }

    if (this.#healthComponent.isDead) {
      this.#hide();
      this.setVisible(true);
      this.#shipSprite.play({ key: "explosion" });
      this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_DESTROYED);
      return;
    }

    this.#shipSprite.setFrame(
      (CONFIG.PLAYER_HEALTH - this.#healthComponent.life).toString(10)
    );
    this.#keyboardInputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }

  #hide() {
    this.setActive(false);
    this.setVisible(false);
    this.#shipEngineSprite.setVisible(false);
    this.#shipEngineThrusterSprite.setVisible(false);
    this.#keyboardInputComponent.lockInput = true;
  }
}
