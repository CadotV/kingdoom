import Camera from '@components/camera';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';
import Phaser from 'phaser';
import Enemy from '@components/enemy';
import Map from '@map/map';

/** Import images */
import PlayerPNG from '@assets/player.png';
import HandPNG from '@assets/hand.png';
import TilesetGround from '@assets/tileset_ground.png';
import TilesetWall from '@assets/tileset_wall.png';
import swordPNG from '@assets/sword.png';

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;
  mainCamera: Camera;
  // tilemap: Tilemap;

  constructor(
    public player: Player,
    public world: Phaser.Physics.Arcade.World,
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
    this.world = this.physics.world;
    //this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
    this.checkControls();
  }

  preload(): void {
    console.log('preload stuff');
    this.load.image('player', PlayerPNG);
    this.load.image('hand', HandPNG);
    this.load.image('tileset_ground', TilesetGround);
    this.load.image('tileset_wall', TilesetWall);
    this.load.image('sword', swordPNG);
  }

  create(): void {
    this.map = new Map(this);
    this.player = new Player(this, 200, 200, 'player');
    this.pointer = new Pointer(this, this.input.manager, 0);
    const enemy = new Enemy(this, 400, 400, 'ennemy', this.player);
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

  update(): void {
    //
    // this.checkControls();
    // if (this.input.gamepad.total === 0) {
    //   return;
    // }
  }
}
