import { ColliderComponent } from "../../components/collider/ColliderComponent";
import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../../components/events/EventBusComponent";
import { HealthComponent } from "../../components/health/HealthComponent";
import { BotScoutInputComponent } from "../../components/input/BotScoutInputComponent";
import { HorizontalMovementComponent } from "../../components/movement/HorizontalMovementComponent";
import { VerticalMovementComponent } from "../../components/movement/VerticalMovementComponent";
import * as CONFIG from "../../config";

export class ScoutEnemy extends Phaser.GameObjects.Container {
  #isInitialized: boolean;
  #inputComponent: BotScoutInputComponent;
  #horizontalMovementComponent: HorizontalMovementComponent;
  #verticalMovementComponent: VerticalMovementComponent;
  #healthComponent: HealthComponent;
  #colliderComponent: ColliderComponent;
  #eventBusComponent: EventBusComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, []);

    this.#isInitialized = false;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 24);
    body.setOffset(-12, -12);

    this.#shipSprite = scene.add.sprite(0, 0, "scout", 0);
    this.#shipEngineSprite = scene.add
      .sprite(0, 0, "scout_engine")
      .setFlipY(true);
    this.#shipEngineSprite.play("scout_engine");
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

  get colliderComponent() {
    return this.#colliderComponent;
  }

  get healthComponent() {
    return this.#healthComponent;
  }

  get shipAssetKey() {
    return "scout";
  }

  get shipDestroyedAnimationKey() {
    return "scout_destroy";
  }

  init(eventBusComponent: EventBusComponent) {
    this.#eventBusComponent = eventBusComponent;
    this.#inputComponent = new BotScoutInputComponent(this);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_HORIZONTAL_VELOCITY
    );
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_VERTICAL_VELOCITY
    );
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_SCOUT_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
    this.#isInitialized = true;
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#inputComponent.startX = this.x;
    this.#verticalMovementComponent.reset();
    this.#horizontalMovementComponent.reset();
  }

  update(ts: number, dt: number): void {
    if (!this.#isInitialized) return;
    if (!this.active) return;

    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
      this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_DESTROYED, this);
    }

    this.#inputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#verticalMovementComponent.update();
  }
}
