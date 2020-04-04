export default class BaseComponent {
  x: number;
  y: number;
  gameObject: Phaser.GameObjects.GameObject;

  constructor(gameObject: Phaser.GameObjects.GameObject, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.gameObject = gameObject;

    // this.attachListener();
  }

  followTarget(vector2: Phaser.Math.Vector2): void {
    this.x = vector2.x;
    this.y = vector2.y;
  }

  // attachListener(): void {
  //   this.gameObject.on('update', this.update, this);
  // }

  update(): void {
    //
  }
}
