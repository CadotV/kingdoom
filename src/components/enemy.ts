import Unit from '@components/unit';
import Hand from './hand';
import Player from './player';
// import Matter from 'matter-js';

export default class Ennemy {
  scene: Phaser.Scene;
  speed: number;
  radius: number;
  health: number;

  player: Player;
  unit: Unit;
  leftHand: Hand;
  rightHand: Hand;

  playerDetectDistance: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
    this.scene = scene;
    this.speed = 3;
    this.radius = 32;
    this.health = 100;

    this.playerDetectDistance = 128;

    this.player = player;
    this.unit = new Unit(scene, x, y, texture, this.radius, 'enemy');
    this.unit.setName('enemy unit');

    this.leftHand = new Hand(
      this.scene,
      this.unit.leftPosition.x,
      this.unit.leftPosition.y,
      'enemy_hand',
      this.unit,
      'left',
    );
    this.rightHand = new Hand(
      this.scene,
      this.unit.rightPosition.x,
      this.unit.rightPosition.y,
      'enemy_hand',
      this.unit,
      'right',
    );
    // this.unit.width = this.unit.height = this.radius * 2;

    this.attachListener();
  }

  //#region listener
  attachListener(): void {
    // Scene update()
    this.scene.events.on(
      'update',
      () => {
        this.update();
      },
      this,
    );

    /** Collisions */
    // this.unit.setOnCollide(() => {
    //   console.log('colliding');
    // });
  }
  //#endregion
  moveToPlayer(playerPos: Phaser.Math.Vector2): void {
    this.unit.awake();

    const vector2Direction = new Phaser.Math.Vector2(
      playerPos.x - this.unit.currentPosition.x,
      playerPos.y - this.unit.currentPosition.y,
    );
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.unit.radius + this.player.unit.radius) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.setVelocity(velocity.x, velocity.y);
      this.moveAngle(normDirection);
    }
  }

  moveAngle(normDirection: Phaser.Math.Vector2): void {
    this.unit.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
  }

  distanceFromPlayer(): number {
    return new Phaser.Math.Vector2(
      this.player.unit.currentPosition.x - this.unit.currentPosition.x,
      this.player.unit.currentPosition.y - this.unit.currentPosition.y,
    ).length();
  }

  //#region AI
  detectPlayer(): void {
    //
    if (this.playerDetectDistance >= this.distanceFromPlayer()) {
      this.moveToPlayer(this.player.unit.currentPosition);
    }
  }

  // aggroOverlap(): void {
  //   this.scene.matter.overlap(this.player.unit, this.overlapWithBodies, () => {
  //     this.detectPlayer();
  //   });
  // }
  //#endregion

  update(): void {
    this.detectPlayer();
  }
}
