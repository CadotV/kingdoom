import Phaser from 'phaser';
import BaseComponent from './baseComponent';

export default class Player extends Phaser.Physics.Matter.Sprite {
  pointerX: number;
  pointerY: number;
  currentPosition: Phaser.Math.Vector2;
  targetPosition: Phaser.Math.Vector2;

  baseComponent: BaseComponent;

  constructor(scene: Phaser.Scene, world: Phaser.Physics.Matter.World, x: number, y: number, texture: string) {
    super(world, x, y, texture);
    this.setCircle(16);

    this.scene = scene;

    this.pointerX = 0;
    this.pointerY = 0;

    this.baseComponent = new BaseComponent(this, x, y);

    this.currentPosition = new Phaser.Math.Vector2(x, y);
    this.targetPosition = new Phaser.Math.Vector2(x, y);

    this.attachListener();
  }

  init(): void {
    this.scene.add.existing(this);
    this.setActive(true);
    this.setBounce(0.8);
    this.setName('player');
  }

  attachListener(): void {
    this.scene.events.on(
      'update',
      () => {
        this.update();
        this.baseComponent.update();
      },
      this,
    );
  }

  pointerTargetPosition(x: number, y: number): void {
    this.pointerX = x;
    this.pointerY = y;
    this.targetPosition.set(x, y);
    console.log(this.targetPosition);
  }

  move(x: number, y: number): void {
    this.setVelocity(x, y);
  }

  // vectorToTarget(): number {
  //   const distance = this.currentPosition.distance(this.targetPosition);
  //   return new Phaser.Math.Vector2(distance);
  // }

  // moveToTarget(x: number, y: number): void {}

  update(): void {
    this.currentPosition.set(this.x, this.y); // refresh the current body position
    this.move(this.pointerX, this.pointerY);

    this.baseComponent.followTarget(this.currentPosition);
  }
}
