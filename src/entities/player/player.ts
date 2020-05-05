/**
 * Player class
 * TODO: lots of stuff in common with Ennemy. Use a Component Pattern for compositing (vs inheritence).
 * Take into account SOLID, SRP, high cohesion / low coupling
 */

//TODO: make this class Abstract and instantiate barbarian, sorceress, necromancer, etc... as player / same for enemy

import EntityBody from '@entities/entity_parts/entityBody';
import Hand from '@entities/entity_parts/hand';
import Weapon from '../weapon';
import Movable from '@entities/components/movable';
import Head from '@entities/entity_parts/head';
import Foot from '@entities/entity_parts/foot';

export default class Player extends Phaser.GameObjects.GameObject {
  scene: Phaser.Scene;
  speed: number;
  acceleration: number;
  radius: number;
  health: number;

  movable: Movable;

  /** Flags */
  isDead: boolean;
  //healthBar: HealthBar;

  // component
  entityBody: EntityBody;
  leftHand: Hand;
  rightHand: Hand;
  head: Head;
  weapon: Weapon;
  leftFoot: Foot;
  rightFoot: Foot;

  pad: Phaser.Input.Gamepad.Gamepad;
  padAxisH: number;
  padAxisV: number;
  isPadConnected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, 'player GameObject');
    this.scene = scene;

    this.speed = 8;
    this.acceleration = 0;

    this.radius = 32;
    this.health = 100;
    this.isDead = false;

    //region components
    // TODO: use a builder pattern to produce different building process for components
    this.entityBody = new EntityBody(scene, x, y, texture, this.radius, 'entityBody', this);
    this.entityBody.angle = 0;
    //this.healthBar = new HealthBar(this.scene, this.entityBody, this.health, this.radius);
    this.entityBody.setName('player entityBody');

    this.leftHand = new Hand(
      this.scene,
      this.entityBody.getLeftPosition().x,
      this.entityBody.getLeftPosition().y,
      'hand',
      this.entityBody,
      'left',
    );
    this.rightHand = new Hand(
      this.scene,
      this.entityBody.getRightPosition().x,
      this.entityBody.getRightPosition().y,
      'hand',
      this.entityBody,
      'right',
    );

    this.head = new Head(this.scene, this.entityBody.x, this.entityBody.y, 'head', this.entityBody);
    this.leftFoot = new Foot(this.scene, this.entityBody.x, this.entityBody.y, 'foot', 'left', this.entityBody);
    this.rightFoot = new Foot(this.scene, this.entityBody.x, this.entityBody.y, 'foot', 'right', this.entityBody);

    const attackCurve = new Phaser.Curves.Line(this.entityBody.getLeftPosition(), this.entityBody.getRightPosition());

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
    console.log('Player -> constructor -> this.leftHand.currentCurve', this.leftHand.currentCurve);
    //#endregion
    // controls
    this.isPadConnected = false;
    this.pad = this.scene.input.gamepad.getPad(0);
    this.padAxisH = 0;
    this.padAxisV = 0;
    if (this.pad) {
      this.isPadConnected = true;
    }

    this.movable = new Movable(this.entityBody, this.speed);

    this.attachComponent();
    this.addToScene();
    this.attachListener();

    this.setState('alive');
  }

  addToScene(): void {
    //this.scene.add.existing(this.leftHand);
    //this.scene.add.existing(this.rightHand);
  }

  //#region component
  attachComponent(): void {
    //
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

    /** Pointer */
    // TODO: put inputs in a class (Pointer)
    // Allow movement when pointer is down but not moving
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.entityBody.targetPosition.set(pointer.worldX, pointer.worldY);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.entityBody.targetPosition.set(pointer.worldX, pointer.worldY);
      }
    });

    /** Keyboard */
    this.scene.input.keyboard.on('keydown-SPACE', this.attack, this);

    /** GamePad */
    this.scene.input.gamepad.once('connected', () => {
      console.log('Gamepad connected');
      this.isPadConnected = true;
      this.pad = this.scene.input.gamepad.getPad(0);
    });

    this.scene.input.gamepad.once('disconnected', () => {
      this.isPadConnected = false;
      this.pad.destroy();
    });

    this.scene.input.gamepad.on('down', () => {
      console.log('down');
    });
  }
  //#endregion

  // TODO: set move in a component depending on mouse / touch / gamepad
  moveToTarget(): void {
    // this.movable.moveToTarget(this.entityBody.currentPosition, this.entityBody.targetPosition);
    this.movable.moveToTarget(this.entityBody.currentPosition, this.entityBody.targetPosition);
  }

  moveGamePad(leftStickVector2: Phaser.Math.Vector2): void {
    // TODO: better solution ?
    const vector2Direction = new Phaser.Math.Vector2(leftStickVector2.x, -leftStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      const velocity = normDirection.scale(this.speed);
      this.entityBody.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
      this.entityBody.setVelocity(velocity.x, velocity.y);
    } else {
      //this.entityBody.setDamping(true);
    }
  }

  // Angle controled by rightStick
  rotateGamePad(rightStickVector2: Phaser.Math.Vector2): void {
    const vector2Direction = new Phaser.Math.Vector2(rightStickVector2.x, -rightStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      this.entityBody.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
    }
  }

  attack(e: Event): void {
    e.preventDefault();
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

  getHit(): void {
    if (0 < this.health) {
      this.health -= 20;
    } else {
      this.isDead = true;
    }
  }

  //#region update
  update(): void {
    // TODO: move and rotate in update or listener ?
    // for prototype
    // Coupling to hand.isAttacking is bad, decouple
    if (!this.isPadConnected && !this.leftHand.isAttacking && !this.rightHand.isAttacking) {
      this.moveToTarget();
    }

    //this.healthBar.update(this.entityBody.currentPosition, this.health);
    this.updateGamePad();
    this.scene.input.gamepad.on('down', () => {
      console.log('ki');
    });
  }

  updateGamePad(): void {
    if (this.isPadConnected) {
      if (this.pad.axes.length) {
        // this.padAxisH = this.pad.axes[0].getValue();
        // this.padAxisV = this.pad.axes[1].getValue();
        this.moveGamePad(this.pad.leftStick);
        this.rotateGamePad(this.pad.rightStick);
      }
      // if (this.pad.rightStick) {

      // }
    }
  }
  //#endregion
}
