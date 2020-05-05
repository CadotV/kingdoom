import EntityBody from './entityBody';

export default class Foot extends Phaser.GameObjects.PathFollower {
  scene: Phaser.Scene;
  type: string;
  entityBody: EntityBody;
  lineCurve: Phaser.Curves.Line;
  path: Phaser.Curves.Path;
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private _currentPositionVector2: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: string, entityBody: EntityBody) {
    const path = new Phaser.Curves.Path(x, y);

    let lineCurve: Phaser.Curves.Line;
    if ('left' === type) {
      lineCurve = new Phaser.Curves.Line(
        entityBody.getBackLeftMiddlePosition(),
        entityBody.getFrontLeftMiddlePosition(),
      );
    } else {
      lineCurve = new Phaser.Curves.Line(
        entityBody.getFrontRightMiddlePosition(),
        entityBody.getBackRightMiddlePosition(),
      );
    }

    path.add(lineCurve);

    super(scene, path, x, y, texture);
    this.scene = scene;
    this.type = type;
    this.entityBody = entityBody;
    this.path = path;

    this.lineCurve = lineCurve;

    if ('right' === this.type) {
      this.setFlipY(true);
    }

    this.attachListener();

    this.startFollow({
      yoyo: true,
      repeat: -1,
      duration: 1000,
      rotateToPath: false,
    });

    // particles
    this.particles = scene.add.particles(texture);
    this.emitter = this.particles.createEmitter({
      lifespan: 1000,
      // angle: this.entityBody.angle,
      alpha: { start: 1, end: 0 },
      quantity: 1,
      blendMode: 'ADD',
    });
    this.emitter.stop();
    this.emitter.startFollow(this);
    // this.emitter.angle = this.angle;

    /** Private initialization */
    this._currentPositionVector2 = new Phaser.Math.Vector2(this.x, this.y);

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

  //#region update
  update(): void {
    this.updatePosition();
    this.updateAngle();
    this.updatePathFollower();
    this.updateCurves();
    this.updatePath();
    /** Particles */
    this.updateParticles();
  }

  updatePosition(): void {
    this._currentPositionVector2 = new Phaser.Math.Vector2(this.x, this.y);
  }

  updateAngle(): void {
    this.angle = this.entityBody.angle;
  }

  updatePathFollower(): void {
    if (this.entityBody.isMoving) {
      this.resumeFollow();
    } else {
      this.pauseFollow();
    }
  }

  updateParticles(): void {
    if (this._currentPositionVector2.fuzzyEquals(this.entityBody.getFrontLeftMiddlePosition(), 7)) {
      this.particles.emitParticleAt(this.x, this.y);
    } else if (this._currentPositionVector2.fuzzyEquals(this.entityBody.getFrontRightMiddlePosition(), 7)) {
      this.particles.emitParticleAt(this.x, this.y);
    }
    // this.emitter.setEmitterAngle(this.entityBody.angle);
  }

  updateCurves(): void {
    if ('left' === this.type) {
      this.lineCurve = new Phaser.Curves.Line(
        this.entityBody.getBackLeftMiddlePosition(),
        this.entityBody.getFrontLeftMiddlePosition(),
      );
    } else {
      this.lineCurve = new Phaser.Curves.Line(
        this.entityBody.getFrontRightMiddlePosition(),
        this.entityBody.getBackRightMiddlePosition(),
      );
    }
  }

  updatePath(): void {
    this.path = new Phaser.Curves.Path(this.x, this.y);
    this.path.add(this.lineCurve);
  }
  //endregion
}
