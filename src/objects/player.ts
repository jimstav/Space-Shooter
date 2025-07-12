import { KeyboardInputComponent } from "../components/input/keyboard-input-component";
import { HorizontalMovementComponent } from "../components/movement/horizontal-movement-component";
import { VerticalMovementComponent } from "../components/movement/vertical-movement-component";
import * as CONFIG from "../config";

export class Player extends Phaser.GameObjects.Container {
  #keyboardInputComponent: KeyboardInputComponent;
  #horizontalMovementComponent: HorizontalMovementComponent;
  #verticalMovementComponent: VerticalMovementComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;
  #shipEngineThrusterSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);

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
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#keyboardInputComponent,
      CONFIG.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY
    );

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
    this.#keyboardInputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#verticalMovementComponent.update();
  }
}
