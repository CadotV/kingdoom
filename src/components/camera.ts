import Unit from '@components/unit';

export default class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  followUnit(unit: Unit): void {
    console.log('following component', unit);
    this.startFollow(unit);
  }

  center(x: number, y: number): void {
    this.stopFollow();
    this.setScroll(x, y);
  }
}
