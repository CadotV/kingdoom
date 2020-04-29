export default class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  // followComponent(baseComponent: BaseComponent): void {
  //   console.log('following component', baseComponent);
  //   this.startFollow(baseComponent);
  // }

  stopFollowComponent(): void {
    this.stopFollow();
  }

  center(x: number, y: number): void {
    this.stopFollow();
    this.setPosition(x, y);
  }
}
