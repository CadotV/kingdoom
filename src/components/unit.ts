import Player from './player';
import Enemy from './enemy';

//import Matter from 'matter-js';

export default class Unit extends Phaser.Physics.Matter.Sprite {
  name: string;
  radius: number;

  label: string;

  isMoving: boolean;

  parentRef: Player | Enemy;

  private _currentPosition: Phaser.Math.Vector2;
  private _targetPosition: Phaser.Math.Vector2;

  private _FRONT: Phaser.Math.Vector2;
  private _BACK: Phaser.Math.Vector2;
  private _LEFT: Phaser.Math.Vector2;
  private _RIGHT: Phaser.Math.Vector2;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    radius: number,
    label: string,
    parentRef: Player | Enemy,
  ) {
    super(scene.matter.world, x, y, texture);

    this.parentRef = parentRef;

    this.name = texture;
    this.radius = radius;

    this.label = label;

    this.rotation = 0;

    this.isMoving = false;

    this._currentPosition = new Phaser.Math.Vector2(x, y);
    this._targetPosition = new Phaser.Math.Vector2(x, y);

    this._FRONT = new Phaser.Math.Vector2(0, 0);
    this._BACK = new Phaser.Math.Vector2(0, 0);
    this._LEFT = new Phaser.Math.Vector2(0, 0);
    this._RIGHT = new Phaser.Math.Vector2(0, 0);

    this.init();
    this.attachListener();
  }

  //#region init
  init(): void {
    this.initArcadeSpriteProps();
    this.initArcadeSpriteMethod();
    // TODO: see which need to be added
    //this.scene.matter.world.add(this.body);
    this.scene.add.existing(this);
  }

  initArcadeSpriteProps(): void {
    // this.body = this.scene.matter.bodies.circle(this.x, this.y, this.radius);
  }

  initArcadeSpriteMethod(): void {
    //this.setName(this.name);
    //this.setActive(true);
    this.setCircle(this.radius, { label: this.label });
    this.setFriction(0.9, 0.2);
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
    if (!this.currentPosition.equals(new Phaser.Math.Vector2(this.x, this.y))) {
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  }

  awake(): void {
    if (false === this.isMoving) {
      this.setAwake();
    }
  }

  update(): void {
    this.moving();
    this.currentPosition.set(this.x, this.y);
  }
}
