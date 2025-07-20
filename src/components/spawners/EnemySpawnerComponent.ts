import { FighterEnemy } from "../../objects/enemies/FighterEnemy";
import { ScoutEnemy } from "../../objects/enemies/ScoutEnemy";
import { EventBusComponent } from "../events/EventBusComponent";

interface SpawnConfig {
  interval: number;
  spawnAt: number;
}

export class EnemySpawnerComponent {
  #scene: Phaser.Scene;
  #spawnInterval: number;
  #spawnAt: number;
  #group: Phaser.GameObjects.Group;

  constructor(
    scene: Phaser.Scene,
    enemyClass: typeof FighterEnemy | typeof ScoutEnemy,
    spawnConfig: SpawnConfig,
    eventBusComponent: EventBusComponent
  ) {
    this.#scene = scene;

    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: (enemy) => {
        if (!(enemy instanceof FighterEnemy) && !(enemy instanceof ScoutEnemy))
          return;
        enemy.init(eventBusComponent);
      },
    });

    this.#spawnInterval = spawnConfig.interval;
    this.#spawnAt = spawnConfig.spawnAt;

    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.#scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_STEP,
      this.worldStep,
      this
    );
    this.#scene.events.once(
      Phaser.Scenes.Events.DESTROY,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.#scene.physics.world.off(
          Phaser.Physics.Arcade.Events.WORLD_STEP,
          this.worldStep,
          this
        );
      },
      this
    );
  }

  get phaserGroup() {
    return this.#group;
  }

  update(ts: number, dt: number): void {
    this.#spawnAt -= dt;
    if (this.#spawnAt > 0) {
      return;
    }

    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
    const enemy: ScoutEnemy = this.#group.get(x, -20);
    enemy.reset();
    this.#spawnAt = this.#spawnInterval;
  }

  worldStep(delta: number) {}
}
