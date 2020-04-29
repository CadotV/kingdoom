/**
 * Player class
 * TODO: lots of stuff in common with Ennemy. Use a Component Pattern for compositing (vs inheritence).
 * Take into account SOLID, SRP, high cohesion / low coupling
 */

import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  // pointerX: number;
  // pointerY: number;
  speed: number;
  radius: number;
  health: number;

  private _currentPosition: Phaser.Math.Vector2;
  private _targetPosition: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.scene = scene;

    this.speed = 300;
    this.radius = 64;
    this.health = 100;

    this.width = this.height = this.radius * 2;

    this._currentPosition = new Phaser.Math.Vector2(x, y);
    this._targetPosition = new Phaser.Math.Vector2(x, y);

    this.init();
    this.attachListener();
  }

  //#region init
  init(): void {
    this.initArcadeSpriteProps();
    this.initArcadeSpriteMethod();
    // TODO: see which need to be added
    //this.scene.add.existing(this);
    this.scene.physics.world.add(this.body);
  }

  initArcadeSpriteProps(): void {
    this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
  }

  initArcadeSpriteMethod(): void {
    this.setName('player')
      .setCircle(this.radius)
      .setFriction(0, 0)
      .setMass(10)
      .setAcceleration(0)
      .setDrag(0.9)
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

    // Pointer
    // TODO: put inputs in a class (Pointer)
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.targetPosition.set(pointer.x, pointer.y);
    });
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.targetPosition.set(pointer.x, pointer.y);
      }
    });
  }
  //#endregion

  // TODO: set move in a component depending on mouse / touch / gamepad
  moveToTarget(): void {
    const currentPosClone = this.currentPosition.clone();
    const targetPosClone = this.targetPosition.clone();
    const vector2Direction = targetPosClone.subtract(currentPosClone);
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.body.halfWidth) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.setVelocity(velocity.x, velocity.y);
    } else {
      this.setDamping(true);
    }
  }

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
  //#endregion

  update(): void {
    this.currentPosition.set(this.body.center.x, this.body.center.y);
    this.moveToTarget();
  }
}
