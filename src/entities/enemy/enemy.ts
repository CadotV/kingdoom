import Phaser from 'phaser';
import EntityBody from '@entities/entity_parts/entityBody';
import Hand from '@entities/entity_parts/hand';
import Player from '@entities/player/player';
import Weapon from '@entities/weapon';
import HealthBar from '@ui/healthbar';
import Movable from '../components/movable';
import Head from '@entities/entity_parts/head';
// import Matter from 'matter-js';

// TODO: shouldd add or not implementation of interface ?
export default class Enemy extends Phaser.GameObjects.GameObject {
  scene: Phaser.Scene;
  speed: number;
  radius: number;
  health: number;

  player!: Player;
  entityBody: EntityBody;
  leftHand: Hand;
  rightHand: Hand;
  weapon: Weapon;
  head: Head;

  movable: Movable;

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
    this.entityBody = new EntityBody(scene, x, y, texture, this.radius, 'enemy', this);
    this.entityBody.setName('enemy entityBody');

    this.leftHand = new Hand(
      this.scene,
      this.entityBody.getLeftPosition().x,
      this.entityBody.getLeftPosition().y,
      'enemy_hand',
      this.entityBody,
      'left',
    );
    this.rightHand = new Hand(
      this.scene,
      this.entityBody.getRightPosition().x,
      this.entityBody.getRightPosition().y,
      'enemy_hand',
      this.entityBody,
      'right',
    );
    // this.entityBody.width = this.entityBody.height = this.radius * 2;
    const defaultStartAngleCurve = (Math.PI / 4) * Phaser.Math.RAD_TO_DEG;
    const defaultEndAngleCurve = ((Math.PI * 7) / 4) * Phaser.Math.RAD_TO_DEG;
    const attackCurve = new Phaser.Curves.Ellipse(
      this.entityBody.x,
      this.entityBody.y,
      this.entityBody.radius,
      this.entityBody.radius,
      defaultStartAngleCurve,
      defaultEndAngleCurve,
      true,
      this.entityBody.rotation,
    );
    this.weapon = new Weapon(
      this.scene,
      this.leftHand.x,
      this.leftHand.y,
      'sword',
      this.leftHand,
      this.entityBody,
      attackCurve,
    );
    this.weapon.attachHand(this.leftHand);
    this.leftHand.attachAttackCurve(this.weapon.currentCurve);

    this.head = new Head(this.scene, this.entityBody.x, this.entityBody.y, 'head', this.entityBody);

    //this.healthBar = new HealthBar(this.scene, this.entityBody, this.health, this.radius);

    this.setState('alive');

    this.movable = new Movable(this.entityBody, this.speed);

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
    // this.entityBody.setOnCollide(() => {
    //   console.log('colliding');
    // });
    //this.entityBody.setOnCollide();
  }
  //#endregion

  attack(): void {
    this.setState('attacking');
    if (!this.leftHand.isAttacking) {
      this.leftHand.launchAttackCurve();
      this.rightHand.launchOpposedAttackCurve();
      // reset position to avoid moving after attack
      // TODO: change the logic, player is doing a 180°
      this.entityBody.currentPosition.set(this.entityBody.x, this.entityBody.y);
      this.entityBody.targetPosition.set(this.entityBody.currentPosition.x, this.entityBody.currentPosition.y);
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
    this.head.setActive(state);
    //this.healthBar.setActive(state);
    this.entityBody.setActive(state);
    if (state === false) {
      this.weapon.world.remove(this.weapon.body);
      this.entityBody.world.remove(this.entityBody.body);
    }
    // this.player.setActive(state);
    this.setActive(state);
  }

  setVisibleState(state: boolean): void {
    this.leftHand.setVisible(state);
    this.rightHand.setVisible(state);
    this.weapon.setVisible(state);
    this.head.setVisible(state);
    //this.healthBar.clearDraw();
    this.entityBody.setVisible(state);
  }

  distanceFromPlayer(): number {
    return new Phaser.Math.Vector2(
      this.player.entityBody.currentPosition.x - this.entityBody.currentPosition.x,
      this.player.entityBody.currentPosition.y - this.entityBody.currentPosition.y,
    ).length();
  }

  moveToPlayer(): void {
    this.movable.moveToTarget(this.entityBody.currentPosition, this.player.entityBody.currentPosition);
    this.movable.rotateToTarget(this.entityBody.currentPosition, this.player.entityBody.currentPosition);
  }

  moveRandom(): void {
    this.movable.moveRandom(this.entityBody.currentPosition, 128);
    // this.movable.rotateToTarget(this.entityBody.currentPosition, this.player.entityBody.currentPosition);
  }

  //#region AI
  detectPlayer(): void {
    //
    if (this.playerAttackDistance >= this.distanceFromPlayer()) {
      this.attack();
    } else if (this.playerDetectDistance >= this.distanceFromPlayer()) {
      this.moveToPlayer();
    } else {
      this.moveRandom();
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
