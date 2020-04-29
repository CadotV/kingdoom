import Player from './player';

export default class Ennemy extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  bodyRadius: number;
  health: number;
  player: Player;

  aggroCircle: Phaser.Geom.Circle;
  aggroRadius: number;

  overlapWithBodies: Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[] = [];

  private _currentPosition: Phaser.Math.Vector2;
  private _targetPosition: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
    super(scene, x, y, texture);

    this.speed = 100;
    this.bodyRadius = 32;
    this.health = 100;
    this.width = this.height = this.bodyRadius * 2;

    this.aggroRadius = 64;
    this.aggroCircle = new Phaser.Geom.Circle(x, y, this.aggroRadius);

    this.player = player;

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
    this.setName('enemy')
      .setCircle(this.bodyRadius)
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

  moveToPlayer(): void {
    const currentPosClone = this.currentPosition.clone();
    const targetPosClone = this.targetPosition.clone();
    const vector2Direction = targetPosClone.subtract(currentPosClone);
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.body.halfWidth + this.player.body.halfWidth) {
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

  //#region AI
  detectPlayer(player: Player): void {
    //
    this.overlapWithBodies.forEach((body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
      if (this.player.body === body) {
        console.log('player detected');
        this.moveToPlayer();
      }
    });
  }

  aggroOverlap(): void {
    this.overlapWithBodies = []; // reset bodies array
    this.overlapWithBodies = this.scene.physics.overlapCirc(
      this.currentPosition.x,
      this.currentPosition.y,
      this.aggroRadius,
    );
  }
  //#endregion

  update(): void {
    this.currentPosition.set(this.body.center.x, this.body.center.y);
    this.aggroOverlap();
    this.detectPlayer(this.player);
    //this.moveToTarget();
  }
}
