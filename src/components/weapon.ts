import Hand from './hand';
import Unit from './unit';

export default class Weapon extends Phaser.GameObjects.Sprite {
  hand: Hand;
  offsetHoldX: number;
  offsetHoldY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, defaultHand: Hand) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.hand = defaultHand;

    this.offsetHoldX = this.width / 2;
    this.offsetHoldY = this.height / 2;

    this.attachListener();
    this.scene.add.existing(this);
  }

  attachListener(): void {
    this.scene.events.on(
      'update',
      () => {
        this.update();
      },
      this,
    );
  }

  attachHand(hand: Hand): void {
    this.hand = hand;
  }

  update(): void {
    this.x = this.hand.x + this.offsetHoldX;
    this.y = this.hand.y;
    this.angle = this.hand.angle;
  }
}
