import Player from './player';
import Unit from '@components/unit';

export default class Ennemy {
  scene: Phaser.Scene;
  speed: number;
  radius: number;
  health: number;
  aggroCircle: Phaser.Geom.Circle;
  aggroRadius: number;

  player: Player;
  unit: Unit;

  overlapWithBodies: Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
    this.scene = scene;
    this.speed = 100;
    this.radius = 32;
    this.health = 100;

    this.aggroRadius = 64;
    this.aggroCircle = new Phaser.Geom.Circle(x, y, this.aggroRadius);

    this.player = player;
    this.unit = new Unit(scene, x, y, texture, this.radius);
    // this.unit.width = this.unit.height = this.radius * 2;

    this.attachListener();
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
  }
  //#endregion

  // TODO: set move in a component depending on mouse / touch / gamepad
  moveToTarget(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const currentPosClone = currentPos.clone();
    const targetPosClone = targetPos.clone();
    const vector2Direction = targetPosClone.subtract(currentPosClone);
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.unit.body.halfWidth) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.setVelocity(velocity.x, velocity.y);
    } else {
      this.unit.setDamping(true);
    }
  }

  moveToPlayer(currentPos: Phaser.Math.Vector2, targetPos: Phaser.Math.Vector2): void {
    const currentPosClone = currentPos.clone();
    const targetPosClone = targetPos.clone();
    const vector2Direction = targetPosClone.subtract(currentPosClone);
    const magnitude: number = vector2Direction.length();
    if (magnitude > this.unit.body.halfWidth + this.player.unit.body.halfWidth) {
      const normDirection = new Phaser.Math.Vector2(vector2Direction.x, vector2Direction.y).normalize();
      const velocity = normDirection.scale(this.speed);
      this.unit.setVelocity(velocity.x, velocity.y);
    } else {
      this.unit.setDamping(true);
    }
  }

  //#region AI
  detectPlayer(): void {
    //
    if (this.overlapWithBodies.length > 0) {
      this.overlapWithBodies.forEach((body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
        if (this.player.unit.body === body) {
          console.log('player detected');
          this.moveToPlayer(this.player.unit.currentPosition, this.player.unit.targetPosition);
        }
      });
    }
  }

  aggroOverlap(): void {
    this.overlapWithBodies = []; // reset bodies array
    this.overlapWithBodies = this.scene.physics.overlapCirc(
      this.unit.currentPosition.x,
      this.unit.currentPosition.y,
      this.aggroRadius,
    );
  }
  //#endregion

  update(): void {
    this.aggroOverlap();
    this.detectPlayer();
  }
}
