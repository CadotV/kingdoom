/**
 * @author       Valentin Cadot <valentin.cadot@gmail.com>
 * @copyright    2020 KingDoom
 */

import Character from '@entities/character';
import Player from '@entities/player/player';
import Phaser from 'phaser';

// TODO: shouldd add or not implementation of interface ?
export default class Enemy extends Character {
  scene: Phaser.Scene;
  speed: number;
  radius: number;
  health: number;

  player!: Player;

  playerDetectDistance: number;
  playerAttackDistance: number;

  //healthBar: HealthBar;

  /** Flags */
  isDead: boolean;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speed: number, player?: Player) {
    super(scene, 'enemy', x, y, texture, 32, 20, speed);
    this.scene = scene;
    this.speed = 3;
    this.radius = 32;
    this.health = 20;
    this.isDead = false;

    this.playerDetectDistance = 256;
    this.playerAttackDistance = 96;

    if (player) {
      this.player = player;
    }

    this.attachListener();
  }

  // TODO: port in respective classes
  // unreference all components
  // player is still referenced

  distanceFromPlayer(): number {
    return new Phaser.Math.Vector2(
      this.player.characterBody.currentPosition.x - this.characterBody.currentPosition.x,
      this.player.characterBody.currentPosition.y - this.characterBody.currentPosition.y,
    ).length();
  }

  //#region AI
  detectTarget(): void {
    //
    if (this.playerAttackDistance >= this.distanceFromPlayer()) {
      this.attack();
    } else if (this.playerDetectDistance >= this.distanceFromPlayer()) {
      this.moveToTarget(this.player.characterBody.currentPosition);
    } else {
      this.moveRandom();
    }
  }
  //#endregion

  update(): void {
    super.update();
    this.detectTarget();
    if (this.isDead) {
      this.setState('dead');
    }
  }
}

/** GameObjectFactory */
Phaser.GameObjects.GameObjectFactory.register('kdEnemy', function(
  this: Phaser.GameObjects.GameObjectFactory,
  scene: Phaser.Scene,
  x: number,
  y: number,
  texture: string,
  speed: number,
  player: Player,
) {
  // instantiated GameObjects are automatically added to the scene for display and update
  // make a method to instantiate only if need based on criteria
  const enemy = new Enemy(scene, x, y, texture, speed, player);

  return enemy;
});
