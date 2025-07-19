import { EnemySpawnerComponent } from "../../components/spawners/EnemySpawnerComponent";
import { FighterEnemy } from "../../objects/enemies/FighterEnemy";
import { ScoutEnemy } from "../../objects/enemies/ScoutEnemy";
import { Player } from "../../objects/Player";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import * as CONFIG from "../../config";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const player = new Player(this);
    const scoutSpawner = new EnemySpawnerComponent(this, ScoutEnemy, {
      interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
      spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
    });
    // const enemy = new ScoutEnemy(this, this.scale.width / 2 - 20, 0);
    // const enemy = new FighterEnemy(this, this.scale.width / 2 + 20, 0);

    // this.physics.add.overlap(
    //   player,
    //   enemy,
    //   (playerGameObject, enemyGameObject) => {
    //     if (!(playerGameObject instanceof Player)) return;
    //     if (
    //       !(enemyGameObject instanceof FighterEnemy) &&
    //       !(enemyGameObject instanceof ScoutEnemy)
    //     )
    //       return;

    //     playerGameObject.colliderComponent.collideWithEnemyShip();
    //     enemyGameObject.colliderComponent.collideWithEnemyShip();
    //   }
    // );

    // if (enemy instanceof FighterEnemy) {
    //   this.physics.add.overlap(
    //     player,
    //     enemy.weaponGameObjectGroup,
    //     (playerGameObject, projectileGameObject) => {
    //       if (!(playerGameObject instanceof Player)) return;
    //       if (!(projectileGameObject instanceof Phaser.Physics.Arcade.Sprite))
    //         return;

    //       enemy.weaponComponent.destroyBullet(projectileGameObject);
    //       playerGameObject.colliderComponent.collideWithEnemyProjectile();
    //     }
    //   );
    // }

    // this.physics.add.overlap(
    //   enemy,
    //   player.weaponGameObjectGroup,
    //   (enemyGameObject, projectileGameObject) => {
    //     if (
    //       !(enemyGameObject instanceof FighterEnemy) &&
    //       !(enemyGameObject instanceof ScoutEnemy)
    //     )
    //       return;
    //     if (!(projectileGameObject instanceof Phaser.Physics.Arcade.Sprite))
    //       return;

    //     player.weaponComponent.destroyBullet(projectileGameObject);
    //     enemyGameObject.colliderComponent.collideWithEnemyProjectile();
    //   }
    // );

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("Game");
  }
}

