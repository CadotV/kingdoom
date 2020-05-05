import Hand from './entity_parts/hand';
import EntityBody from './entity_parts/entityBody';

export default class Weapon extends Phaser.Physics.Matter.Sprite {
  hand: Hand;
  offsetHoldX: number;
  offsetHoldY: number;
  currentCurve: Phaser.Curves.Curve;

  private _offsetWeaponOrigin: Phaser.Math.Vector2;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    defaultHand: Hand,
    entityBody: EntityBody,
    curve?: Phaser.Curves.Curve,
  ) {
    super(scene.matter.world, x, y, texture, undefined, { label: 'weapon' });

    this.scene = scene;
    this.hand = defaultHand;

    this.offsetHoldX = this.width / 2;
    this.offsetHoldY = this.height / 2;

    this._offsetWeaponOrigin = new Phaser.Math.Vector2(this.hand.x, this.hand.y);

    const defaultStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultCurve = new Phaser.Curves.Ellipse(
      entityBody.x,
      entityBody.y,
      entityBody.radius,
      entityBody.radius,
      defaultStartAngleCurve,
      defaultEndAngleCurve,
      true,
      entityBody.rotation,
    );

    if (curve) {
      this.currentCurve = curve;
    } else {
      this.currentCurve = defaultCurve;
    }

    this.init();
    // this.setOrigin(0, 0.5);
    this.attachListener();
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

  attachHand(hand: Hand): void {
    this.hand = hand;
  }

  //#region getter & setter
  // TODO: see if the position is good with different weapon types
  get offsetWeaponOrigin(): Phaser.Math.Vector2 {
    const x = this.hand.width * Math.cos(this.rotation) + this.hand.x;
    const y = this.hand.height * Math.sin(this.rotation) + this.hand.y;
    return this._offsetWeaponOrigin.set(x, y);
  }

  //#endregion
  update(): void {
    this.x = this.offsetWeaponOrigin.x;
    this.y = this.offsetWeaponOrigin.y;
    this.angle = this.hand.angle;

    // this.body.center.x = this.hand.x;
    // this.body.center.y = this.hand.y;
  }
}
