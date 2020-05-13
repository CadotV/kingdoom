//import Matter from 'matter-js';

export default class CharacterBody extends Phaser.Physics.Matter.Sprite {
  name: string;
  radius: number;

  label: string;

  isMoving: boolean;

  currentPosition: Phaser.Math.Vector2;
  targetPosition: Phaser.Math.Vector2;

  front: Phaser.Math.Vector2;
  frontLeftMiddle: Phaser.Math.Vector2;
  frontRightMiddle: Phaser.Math.Vector2;
  back: Phaser.Math.Vector2;
  backLeftMiddle: Phaser.Math.Vector2;
  backRightMiddle: Phaser.Math.Vector2;
  left: Phaser.Math.Vector2;
  leftMiddle: Phaser.Math.Vector2;
  right: Phaser.Math.Vector2;
  rightMiddle: Phaser.Math.Vector2;

  /** Matter */
  valueFriction!: number;
  airFriction!: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    radius: number,
    label: string,
    // parentRef: Player | Enemy,
  ) {
    super(scene.matter.world, x, y, texture);

    // this.parentRef = parentRef;

    this.name = texture;
    this.radius = radius;

    this.label = label;

    this.rotation = 0;

    this.isMoving = false;

    this.currentPosition = new Phaser.Math.Vector2(x, y);
    this.targetPosition = new Phaser.Math.Vector2(x, y);

    this.front = new Phaser.Math.Vector2(0, 0);
    this.frontLeftMiddle = new Phaser.Math.Vector2(0, 0);
    this.frontRightMiddle = new Phaser.Math.Vector2(0, 0);
    this.back = new Phaser.Math.Vector2(0, 0);
    this.backLeftMiddle = new Phaser.Math.Vector2(0, 0);
    this.backRightMiddle = new Phaser.Math.Vector2(0, 0);
    this.left = new Phaser.Math.Vector2(0, 0);
    this.leftMiddle = new Phaser.Math.Vector2(0, 0);
    this.right = new Phaser.Math.Vector2(0, 0);
    this.rightMiddle = new Phaser.Math.Vector2(0, 0);

    this.init();
    this.attachListener();
  }

  //#region init
  init(): void {
    this.initMatterSpriteProps();
    this.initMatterSpriteMethod();
    this.scene.add.existing(this);
  }

  initMatterSpriteProps(): void {
    this.valueFriction = 0.9;
    this.airFriction = 0.2;
    // this.body = this.scene.matter.bodies.circle(this.x, this.y, this.radius);
  }

  initMatterSpriteMethod(): void {
    //this.setName(this.name);
    //this.setActive(true);
    this.setCircle(this.radius, { label: this.label });
    this.setFriction(this.valueFriction, this.airFriction);
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
  // TODO: refactore by simplifying
  getCurrentPosition(): Phaser.Math.Vector2 {
    return this.currentPosition;
  }

  setCurrentPosition(vector2: Phaser.Math.Vector2): void {
    this.currentPosition = vector2;
  }

  getTargetPosition(): Phaser.Math.Vector2 {
    return this.targetPosition;
  }

  setTargetPosition(vector2: Phaser.Math.Vector2): void {
    this.targetPosition = vector2;
  }

  getPositionWithAngle(radius: number, radians: number): Phaser.Math.Vector2 {
    const x = radius * Math.cos(this.rotation + radians) + this.currentPosition.x;
    const y = radius * Math.sin(this.rotation + radians) + this.currentPosition.y;
    return new Phaser.Math.Vector2(x, y);
  }

  // WARNING: atan2 use range [-PI, PI] from Math
  // Use Phaser clockwise rotation system
  getAngleWithPosition(vector2: Phaser.Math.Vector2): number {
    // Change the range from [-PI,PI] to [0, 2PI]
    // WARNING: angle is calculated from origin of canvas
    const angle = Math.atan2(vector2.y - this.y, vector2.x - this.x) * Phaser.Math.RAD_TO_DEG;
    const wrappedAngle = Phaser.Math.Angle.WrapDegrees(angle);
    return wrappedAngle;
  }

  getFrontPosition(): Phaser.Math.Vector2 {
    return this.front.setFromObject(this.getPositionWithAngle(this.radius, 0));
  }

  getBackPosition(): Phaser.Math.Vector2 {
    return this.back.setFromObject(this.getPositionWithAngle(-this.radius, 0));
  }

  getLeftPosition(): Phaser.Math.Vector2 {
    return this.left.setFromObject(this.getPositionWithAngle(this.radius, -Math.PI / 2));
  }

  getRightPosition(): Phaser.Math.Vector2 {
    return this.right.setFromObject(this.getPositionWithAngle(this.radius, Math.PI / 2));
  }

  getLeftMiddlePosition(): Phaser.Math.Vector2 {
    return this.leftMiddle.setFromObject(this.getPositionWithAngle(this.radius / 2, -Math.PI / 2));
  }

  getRightMiddlePosition(): Phaser.Math.Vector2 {
    return this.rightMiddle.setFromObject(this.getPositionWithAngle(this.radius / 2, Math.PI / 2));
  }

  getFrontLeftMiddlePosition(): Phaser.Math.Vector2 {
    return this.frontLeftMiddle.setFromObject(this.getPositionWithAngle(this.radius, -Math.PI / 6));
  }

  getFrontRightMiddlePosition(): Phaser.Math.Vector2 {
    return this.frontRightMiddle.setFromObject(this.getPositionWithAngle(this.radius, Math.PI / 6));
  }

  getBackLeftMiddlePosition(): Phaser.Math.Vector2 {
    return this.backLeftMiddle.setFromObject(this.getPositionWithAngle(this.radius, -(5 * Math.PI) / 6));
  }

  getBackRightMiddlePosition(): Phaser.Math.Vector2 {
    return this.backRightMiddle.setFromObject(this.getPositionWithAngle(this.radius, (5 * Math.PI) / 6));
  }
  //#endregion

  moving(): void {
    if (!this.currentPosition.fuzzyEquals(new Phaser.Math.Vector2(this.x, this.y), 1)) {
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
    this.updateCurrentPosition();
  }

  updateCurrentPosition(): void {
    this.setCurrentPosition(new Phaser.Math.Vector2(this.x, this.y));
  }
}
