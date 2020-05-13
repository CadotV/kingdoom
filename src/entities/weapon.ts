import Hand from './character_parts/hand';
import CharacterBody from './character_parts/characterBody';

export default class Weapon extends Phaser.Physics.Matter.Sprite {
  hand: Hand;
  offsetHoldX: number;
  offsetHoldY: number;
  currentCurve: Phaser.Curves.Curve;

  offsetWeaponOrigin: Phaser.Math.Vector2;

  attackParticleEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  attackParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    defaultHand: Hand,
    characterBody: CharacterBody,
    curve?: Phaser.Curves.Curve,
  ) {
    super(scene.matter.world, x, y, texture, undefined, { label: 'weapon' });

    this.scene = scene;
    this.hand = defaultHand;

    this.offsetHoldX = this.width / 2;
    this.offsetHoldY = this.height / 2;

    this.offsetWeaponOrigin = new Phaser.Math.Vector2(this.hand.x, this.hand.y);

    const defaultStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultCurve = new Phaser.Curves.Ellipse(
      characterBody.x,
      characterBody.y,
      characterBody.radius,
      characterBody.radius,
      defaultStartAngleCurve,
      defaultEndAngleCurve,
      true,
      characterBody.rotation,
    );

    if (curve) {
      this.currentCurve = curve;
    } else {
      this.currentCurve = defaultCurve;
    }

    this.init();
    this.attachListener();

    /** Particles */
    this.attackParticleEmitterManager = this.scene.add.particles(texture);
    this.attackParticleEmitter = this.attackParticleEmitterManager.createEmitter({
      lifespan: 800,
      //blendMode: 'ADD',
      rotate: {
        onEmit: (): number => {
          return this.angle;
        },
      },
      tint: 0xffffff,
    });
    this.attackParticleEmitter.startFollow(this);
    this.attackParticleEmitter.stop();
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

  //#region init
  init(): void {
    this.initMatterSpriteProps();
    this.initMatterSpriteMethod();
    // TODO: see which need to be added
    //this.scene.matter.world.add(this.body);
    this.scene.add.existing(this);
  }

  initMatterSpriteProps(): void {
    //this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
  }

  initMatterSpriteMethod(): void {
    // this.setName(this.name)
    this.setFriction(0, 0);
    this.setActive(false);
    this.setSensor(true);
  }
  //#endregion

  //#region getter & setter
  // TODO: see if the position is good with different weapon types
  getOffsetWeaponOrigin(): Phaser.Math.Vector2 {
    const x = this.hand.width * Math.cos(this.rotation) + this.hand.x;
    const y = this.hand.height * Math.sin(this.rotation) + this.hand.y;
    return this.offsetWeaponOrigin.set(x, y);
  }

  //#endregion
  update(): void {
    this.updatePosition();
    this.updateAngle();
    this.updateAttackParticles();
  }

  updatePosition(): void {
    this.x = this.getOffsetWeaponOrigin().x;
    this.y = this.getOffsetWeaponOrigin().y;
  }

  updateAngle(): void {
    this.angle = this.hand.angle;
  }

  updateAttackParticles(): void {
    if (this.hand.isAttacking) {
      this.attackParticleEmitter.start();
    } else {
      this.attackParticleEmitter.stop();
    }
  }
}
