<<<<<<< HEAD
=======
import Unit from '@components/unit';

>>>>>>> 7663e13c07edc87f6b14a4fb5ba869c4a942a77c
export default class Camera extends Phaser.Cameras.Scene2D.Camera {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

<<<<<<< HEAD
  // followComponent(baseComponent: BaseComponent): void {
  //   console.log('following component', baseComponent);
  //   this.startFollow(baseComponent);
  // }

  stopFollowComponent(): void {
    this.stopFollow();
=======
  followUnit(unit: Unit): void {
    console.log('following component', unit);
    this.startFollow(unit);
>>>>>>> 7663e13c07edc87f6b14a4fb5ba869c4a942a77c
  }

  center(x: number, y: number): void {
    this.stopFollow();
<<<<<<< HEAD
    this.setPosition(x, y);
=======
    this.setScroll(x, y);
>>>>>>> 7663e13c07edc87f6b14a4fb5ba869c4a942a77c
  }
}
