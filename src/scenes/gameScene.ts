import EnemyPNG from '@assets/enemy.png';
import EnemyHandPNG from '@assets/enemy_hand.png';
import HandPNG from '@assets/hand.png';
import PlayerPNG from '@assets/player.png';
import SwordPNG from '@assets/sword.png';
import TilesetGround from '@assets/tileset_ground.png';
import TilesetWall from '@assets/tileset_wall.png';
import Camera from '@components/camera';
import Enemy from '@components/enemy';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';
import Map from '@map/map';
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera: Camera;
  // tilemap: Tilemap;

  constructor(
    public player: Player,
    public matterWorld: Phaser.Physics.Matter.World,
    public pointer: Pointer,
    public map: Map,
  ) {
    super({ key: 'GameScene' });

    this.mainCamera = new Camera(0, 0, GAMECONFIG.width, GAMECONFIG.height);
    // this.cameras.main = this.mainCamera;
  }

  init(): void {
    console.log('init gameScene');

    // init world
    this.matterWorld = this.matter.world;
    //this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
    this.checkControls();
    this.checkCollision();
  }

  preload(): void {
    console.log('preload stuff');
    this.load.image('player', PlayerPNG);
    this.load.image('hand', HandPNG);
    this.load.image('tileset_ground', TilesetGround);
    this.load.image('tileset_wall', TilesetWall);
    this.load.image('sword', SwordPNG);
    this.load.image('enemy', EnemyPNG);
    this.load.image('enemy_hand', EnemyHandPNG);
  }

  create(): void {
    //this.map = new Map(this);
    this.player = new Player(this, 200, 200, 'player');
    this.pointer = new Pointer(this, this.input.manager, 0);
    const enemy = new Enemy(this, 400, 400, 'enemy', this.player);
    const enemy2 = new Enemy(this, 600, 600, 'enemy', this.player);
    // this.mainCamera.followUnit(this.player.unit);
    this.cameras.main.startFollow(this.player.unit);
  }

  checkControls(): void {
    if (this.input.gamepad === undefined) {
      return;
    } else {
      // this.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      //   console.log('gamepad connected');
      //   console.log(pad);
      // });
      // this.input.gamepad.once('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      //   console.log('gamepad disconnected');
      //   console.log(pad);
      // });
    }
  }

  // TODO: set in a separate class
  checkCollision(): void {
    this.matter.world.on(
      'collisionactive',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent, bodyA: MatterJS.BodyType, bodyB: MatterJS.BodyType) => {
        if (
          (bodyA.label === 'weapon' && bodyB.label === 'enemy') ||
          (bodyA.label === 'enemy' && bodyB.label === 'weapon')
        ) {
          if (this.player.leftHand.isAttacking) {
            console.log('colliding');
          }
        }
      },
    );
  }

  update(): void {
    //
  }
}
