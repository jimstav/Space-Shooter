import { KeyboardInputComponent } from "../components/input/keyboard-input-component";

export class Player extends Phaser.GameObjects.Container {
  #keyboardInputComponent: KeyboardInputComponent;
  #shipSprite: Phaser.GameObjects.Sprite;
  #shipEngineSprite: Phaser.GameObjects.Sprite;
  #shipEngineThrusterSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);

    this.scene.add.existing(this);

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
    // console.log(ts, dt);
    this.#keyboardInputComponent.update();
    // console.log(this.#keyboardInputComponent.downIsDown);
  }
}
