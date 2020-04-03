import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
  pointerX: number;
  pointerY: number;

  constructor(scene: Phaser.Scene, world: Phaser.Physics.Matter.World, x: number, y: number, texture: string) {
    super(world, x, y, texture);
    this.setCircle(16);

    this.scene = scene;

    this.pointerX = 0;
    this.pointerY = 0;

    this.attachListener();
  }

  init(): void {
    this.scene.add.existing(this);
    this.setActive(true);
    this.setName('player');
  }

  attachListener(): void {
    this.scene.events.on('update', this.update, this);
  }

  pointerTargetPosition(x: number, y: number): void {
    this.pointerX = x;
    this.pointerY = y;
  }

  move(x: number, y: number): void {
    this.setVelocity(x, y);
    this.setX(x);
    this.setY(y);
  }

  update(): void {
    this.move(this.pointerX, this.pointerY);
  }
}
