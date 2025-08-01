import { EnemySpawnerComponent } from "../../components/spawners/EnemySpawnerComponent";
import { FighterEnemy } from "../../objects/enemies/FighterEnemy";
import { ScoutEnemy } from "../../objects/enemies/ScoutEnemy";
import { Player } from "../../objects/Player";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import * as CONFIG from "../../config";
import {
  CUSTOM_EVENTS,
  EventBusComponent,
} from "../../components/events/EventBusComponent";
import { EnemyDestroyedComponent } from "../../components/spawners/EnemyDestroyedComponent";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.add
      .sprite(0, 0, "bg1", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg1");
    this.add
      .sprite(0, 0, "bg2", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg2");
    this.add
      .sprite(0, 0, "bg3", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg3");
    const eventBusComponent = new EventBusComponent();
    const player = new Player(this);
    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      {
        interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    new EnemyDestroyedComponent(this, eventBusComponent);

    // collisions for player and enemy groups
    this.physics.add.overlap(
      player,
      scoutSpawner.phaserGroup,
      (playerGameObject, enemyGameObject) => {
        if (!(playerGameObject instanceof Player)) return;
        if (!(enemyGameObject instanceof ScoutEnemy)) return;
        if (!playerGameObject.active || !enemyGameObject.active) return;

        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );
    this.physics.add.overlap(
      player,
      fighterSpawner.phaserGroup,
      (playerGameObject, enemyGameObject) => {
        if (!(playerGameObject instanceof Player)) return;
        if (!(enemyGameObject instanceof FighterEnemy)) return;
        if (!playerGameObject.active || !enemyGameObject.active) return;

        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    eventBusComponent.on(
      CUSTOM_EVENTS.ENEMY_INIT,
      (gameObject: Phaser.GameObjects.GameObject) => {
        if (!(gameObject instanceof FighterEnemy)) return;

        this.physics.add.overlap(
          player,
          gameObject.weaponGameObjectGroup,
          (playerGameObject, projectileGameObject) => {
            if (!(playerGameObject instanceof Player)) return;
            if (!(projectileGameObject instanceof Phaser.Physics.Arcade.Sprite))
              return;
            if (!playerGameObject.active || !projectileGameObject.active)
              return;

            gameObject.weaponComponent.destroyBullet(projectileGameObject);
            playerGameObject.colliderComponent.collideWithEnemyProjectile();
          }
        );
      }
    );

    this.physics.add.overlap(
      scoutSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!(enemyGameObject instanceof ScoutEnemy)) return;
        if (!(projectileGameObject instanceof Phaser.Physics.Arcade.Sprite))
          return;
        if (!enemyGameObject.active || !projectileGameObject.active) return;

        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        if (!(enemyGameObject instanceof FighterEnemy)) return;
        if (!(projectileGameObject instanceof Phaser.Physics.Arcade.Sprite))
          return;
        if (!enemyGameObject.active || !projectileGameObject.active) return;

        player.weaponComponent.destroyBullet(projectileGameObject);
        enemyGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("Game");
  }
}

