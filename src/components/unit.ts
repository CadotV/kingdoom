export default class Unit extends Phaser.Physics.Arcade.Sprite {
  name: string;
  radius: number;

  isMoving: boolean;

  private _currentPosition: Phaser.Math.Vector2;
  private _targetPosition: Phaser.Math.Vector2;

  private _FRONT: Phaser.Math.Vector2;
  private _BACK: Phaser.Math.Vector2;
  private _LEFT: Phaser.Math.Vector2;
  private _RIGHT: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, radius: number) {
    super(scene, x, y, texture);

    this.name = texture;
    this.radius = radius;

    this.rotation = 0;

    this.isMoving = false;

    this._currentPosition = new Phaser.Math.Vector2(x, y);
    this._targetPosition = new Phaser.Math.Vector2(x, y);

    this._FRONT = new Phaser.Math.Vector2(0, 0);
    this._BACK = new Phaser.Math.Vector2(0, 0);
    this._LEFT = new Phaser.Math.Vector2(0, 0);
    this._RIGHT = new Phaser.Math.Vector2(0, 0);

    //this.setScale(0.5, 0.5);

    this.init();
    this.attachListener();
  }

  //#region init
  init(): void {
    this.initArcadeSpriteProps();
    this.initArcadeSpriteMethod();
    // TODO: see which need to be added
    this.scene.physics.world.add(this.body);
    this.scene.add.existing(this);
  }

  initArcadeSpriteProps(): void {
    this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
  }

  initArcadeSpriteMethod(): void {
    this.setName(this.name)
      .setCircle(this.radius)
      .setFriction(0, 0)
      .setMass(0)
      .setAcceleration(0)
      .setDrag(0.8)
      .setCollideWorldBounds(true)
      .setActive(true);
  }
  //#endregion

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
  }
  //#endregion

  //#region Getter and Setter
  get currentPosition(): Phaser.Math.Vector2 {
    return this._currentPosition;
  }
  set currentPosition(vector2: Phaser.Math.Vector2) {
    this._currentPosition = vector2;
  }

  get targetPosition(): Phaser.Math.Vector2 {
    return this._targetPosition;
  }

  set targetPosition(vector2: Phaser.Math.Vector2) {
    this._targetPosition = vector2;
  }

  get frontPosition(): Phaser.Math.Vector2 {
    const x = this.radius * Math.cos(this.rotation) + this.currentPosition.x;
    const y = this.radius * Math.sin(this.rotation) + this.currentPosition.y;
    this._FRONT.set(x, y);
    return this._FRONT;
  }

  get backPosition(): Phaser.Math.Vector2 {
    const x = -this.radius * Math.cos(this.rotation) + this.currentPosition.x;
    const y = -this.radius * Math.sin(this.rotation) + this.currentPosition.y;
    this._BACK.set(x, y);
    return this._BACK;
  }

  get leftPosition(): Phaser.Math.Vector2 {
    const x = this.radius * Math.cos(this.rotation - Math.PI / 2) + this.currentPosition.x;
    const y = this.radius * Math.sin(this.rotation - Math.PI / 2) + this.currentPosition.y;
    this._LEFT.set(x, y);
    return this._LEFT;
  }

  get rightPosition(): Phaser.Math.Vector2 {
    const x = this.radius * Math.cos(this.rotation + Math.PI / 2) + this.currentPosition.x;
    const y = this.radius * Math.sin(this.rotation + Math.PI / 2) + this.currentPosition.y;
    this._RIGHT.set(x, y);
    return this._RIGHT;
  }
  //#endregion

  moving(): void {
    if (!this.currentPosition.equals(new Phaser.Math.Vector2(this.body.center.x, this.body.center.y))) {
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  }

  update(): void {
    this.moving();
    this.currentPosition.set(this.body.center.x, this.body.center.y);
  }
}
