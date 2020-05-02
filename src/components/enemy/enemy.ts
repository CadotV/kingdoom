import Phaser from 'phaser';
import Unit from '@components/unit';
import Hand from '../hand';
import Player from '../player';
import Weapon from '../weapon';
import HealthBar from '@ui/healthbar';
// import Matter from 'matter-js';

// TODO: shouldd add or not implementation of interface ?
export default class Enemy extends Phaser.GameObjects.GameObject {
  scene: Phaser.Scene;
  speed: number;
  radius: number;
  health: number;

  player!: Player;
  unit: Unit;
  leftHand: Hand;
  rightHand: Hand;
  weapon: Weapon;

  playerDetectDistance: number;
  playerAttackDistance: number;

  //healthBar: HealthBar;

  /** Flags */
  isDead: boolean;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player?: Player) {
    super(scene, 'enemy gameObject');
    this.scene = scene;
    this.speed = 3;
    this.radius = 32;
    this.health = 20;
    this.isDead = false;

    this.playerDetectDistance = 256;
    this.playerAttackDistance = 96;

    if (player) {
      this.player = player;
    }
    this.unit = new Unit(scene, x, y, texture, this.radius, 'enemy', this);
    this.unit.setName('enemy unit');

    this.leftHand = new Hand(
      this.scene,
      this.unit.leftPosition.x,
      this.unit.leftPosition.y,
      'enemy_hand',
      this.unit,
      'left',
    );
    this.rightHand = new Hand(
      this.scene,
      this.unit.rightPosition.x,
      this.unit.rightPosition.y,
      'enemy_hand',
      this.unit,
      'right',
    );
    // this.unit.width = this.unit.height = this.radius * 2;
    this.weapon = new Weapon(this.scene, this.leftHand.x, this.leftHand.y, 'sword', this.leftHand);
    this.weapon.attachHand(this.leftHand);

    //this.healthBar = new HealthBar(this.scene, this.unit, this.health, this.radius);

    this.setState('alive');

    this.attachListener();
    //this.scene.add.existing(this);
  }

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

    /** Collisions */
    // this.unit.setOnCollide(() => {
    //   console.log('colliding');
    // });
    //this.unit.setOnCollide();
  }
  //#endregion

  attack(): void {
    this.setState('attacking');
    if (!this.leftHand.isAttacking) {
      this.leftHand.launchAttackCurve();
      this.rightHand.launchOpposedAttackCurve();
      // reset position to avoid moving after attack
      // TODO: change the logic, player is doing a 180°
      this.unit.currentPosition.set(this.unit.x, this.unit.y);
      this.unit.targetPosition.set(this.unit.currentPosition.x, this.unit.currentPosition.y);
      // weapon collision
      // this.scene.matter.world.once(
      //   'collisionstart',
      //   (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
      //     console.log('Player -> attack -> bodyA', bodyA);
      //     console.log('Player -> attack -> bodyB', bodyB);
      //     console.log('event', event);
      //   },
      // );
    }
  }

  getHit(): void {
    if (0 < this.health) {
      this.health -= 20;
    } else {
      this.isDead = true;
    }
  }

  // TODO: port in respective classes
  // unreference all components
  // player is still referenced
  setActiveState(state: boolean): void {
    this.leftHand.setActive(state);
    this.rightHand.setActive(state);
    this.weapon.setActive(state);
    //this.healthBar.setActive(state);
    this.unit.setActive(state);
    if (state === false) {
      this.weapon.world.remove(this.weapon.body);
      this.unit.world.remove(this.unit.body);
    }
    // this.player.setActive(state);
    this.setActive(state);
  }

  setVisibleState(state: boolean): void {
    this.leftHand.setVisible(state);
    this.rightHand.setVisible(state);
    this.weapon.setVisible(state);
    //this.healthBar.clearDraw();
    this.unit.setVisible(state);
  }

  moveToPlayer(playerPos: Phaser.Math.Vector2): void {
    this.unit.awake();

    const vector2Direction = new Phaser.Math.Vector2(
      playerPos.x - this.unit.currentPosition.x,
      playerPos.y - this.unit.currentPosition.y,
    );
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.unit.radius + this.player.unit.radius) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.setVelocity(velocity.x, velocity.y);
      this.moveAngle(normDirection);
    }
  }

  moveAngle(normDirection: Phaser.Math.Vector2): void {
    this.unit.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
  }

  distanceFromPlayer(): number {
    return new Phaser.Math.Vector2(
      this.player.unit.currentPosition.x - this.unit.currentPosition.x,
      this.player.unit.currentPosition.y - this.unit.currentPosition.y,
    ).length();
  }

  //#region AI
  detectPlayer(): void {
    //
    if (this.playerAttackDistance >= this.distanceFromPlayer()) {
      this.attack();
    } else if (this.playerDetectDistance >= this.distanceFromPlayer()) {
      this.moveToPlayer(this.player.unit.currentPosition);
    }
  }
  //#endregion

  update(): void {
    this.detectPlayer();
    //this.healthBar.setHealth(this.health);
    if (this.isDead) {
      this.setState('dead');
    }
  }

  preUpdate(): void {
    //
  }
}

/** GameObjectFactory */
Phaser.GameObjects.GameObjectFactory.register('kdEnemy', function(
  this: Phaser.GameObjects.GameObjectFactory,
  scene: Phaser.Scene,
  x: number,
  y: number,
  texture: string,
  player: Player,
) {
  // instantiated GameObjects are automatically added to the scene for display and update
  // make a method to instantiate only if need based on criteria
  const enemy = new Enemy(scene, x, y, texture, player);

  return enemy;
});
