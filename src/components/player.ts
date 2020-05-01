/**
 * Player class
 * TODO: lots of stuff in common with Ennemy. Use a Component Pattern for compositing (vs inheritence).
 * Take into account SOLID, SRP, high cohesion / low coupling
 */

//TODO: make this class Abstract and instantiate barbarian, sorceress, necromancer, etc... as player / same for enemy

import Unit from '@components/unit';
import Hand from './hand';
import Weapon from './weapon';

export default class Player extends Phaser.GameObjects.GameObject {
  scene: Phaser.Scene;
  speed: number;
  acceleration: number;
  radius: number;
  health: number;

  /** Flags */
  isDead: boolean;
  //healthBar: HealthBar;

  // component
  unit: Unit;
  leftHand: Hand;
  rightHand: Hand;
  weapon: Weapon;

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

    this.unit = new Unit(scene, x, y, texture, this.radius, 'player', this);
    this.unit.angle = 0;
    //this.healthBar = new HealthBar(this.scene, this.unit, this.health, this.radius);
    this.unit.setName('player unit');

    this.leftHand = new Hand(this.scene, this.unit.leftPosition.x, this.unit.leftPosition.y, 'hand', this.unit, 'left');
    this.rightHand = new Hand(
      this.scene,
      this.unit.rightPosition.x,
      this.unit.rightPosition.y,
      'hand',
      this.unit,
      'right',
    );

    this.weapon = new Weapon(this.scene, this.leftHand.x, this.leftHand.y, 'sword', this.leftHand);
    this.weapon.attachHand(this.leftHand);

    // controls
    this.isPadConnected = false;
    this.pad = this.scene.input.gamepad.getPad(0);
    this.padAxisH = 0;
    this.padAxisV = 0;
    if (this.pad) {
      this.isPadConnected = true;
    }

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
    // See if x,y coordinates or world coordinates
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.unit.targetPosition.set(pointer.worldX, pointer.worldY);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.unit.targetPosition.set(pointer.worldX, pointer.worldY);
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
  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    this.unit.awake();

    const vector2Direction = new Phaser.Math.Vector2(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
    const magnitude: number = vector2Direction.length();

    if (magnitude > this.unit.radius) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.setVelocity(velocity.x, velocity.y);
    }
  }

  moveGamePad(leftStickVector2: Phaser.Math.Vector2): void {
    // TODO: better solution ?
    const vector2Direction = new Phaser.Math.Vector2(leftStickVector2.x, -leftStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
      this.unit.setVelocity(velocity.x, velocity.y);
    } else {
      //this.unit.setDamping(true);
    }
  }

  // Angle controled by rightStick
  rotateGamePad(rightStickVector2: Phaser.Math.Vector2): void {
    const vector2Direction = new Phaser.Math.Vector2(rightStickVector2.x, -rightStickVector2.y);
    const magnitude: number = vector2Direction.length();
    // console.log(magnitude);

    if (magnitude != 0) {
      const normDirection = vector2Direction.normalize();
      this.unit.angle = normDirection.angle() * Phaser.Math.RAD_TO_DEG;
    }
  }

  rotateToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const angleBetweenVector2 = Phaser.Math.Angle.Between(currentPos.x, currentPos.y, targetPos.x, targetPos.y);
    this.unit.setRotation(angleBetweenVector2);
  }

  attack(e: Event): void {
    e.preventDefault();
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

  hit(): void {
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
      //this.unit.setVelocity(1, 1);
      this.moveToTarget(this.unit.currentPosition, this.unit.targetPosition);
      this.rotateToTarget(this.unit.currentPosition, this.unit.targetPosition);
    }

    // component
    this.updateComponent();
    //this.healthBar.update(this.unit.currentPosition, this.health);
    this.updateGamePad();
    this.scene.input.gamepad.on('down', () => {
      console.log('ki');
    });
  }

  updateComponent(): void {
    //
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
