import Phaser from 'phaser';
import Player from '@components/player';
import { GAMECONFIG } from '@config/gameConfig';
import Pointer from '@controls/pointer';

export default class GameScene extends Phaser.Scene {
  // world: Phaser.Physics.Matter.World;
  // player: Player;

  constructor(public player: Player, public world: Phaser.Physics.Matter.World, public pointer: Pointer) {
    super({ key: 'GameScene' });
  }

  init(): void {
    console.log('init gameScene');

    // init world
    this.world = this.matter.world;
    this.world.setBounds(0, 0, GAMECONFIG.width, GAMECONFIG.height);

    // Gamepad
  }

  preload(): void {
    console.log('preload stuff');
  }

  create(): void {
    this.player = new Player(this, this.world, 200, 200, 'player');
    this.pointer = new Pointer(this, this.input.manager, 1);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.player.pointerTargetPosition(pointer.x, pointer.y);
    });

    this.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log('gamepad connected');
      console.log(pad);
    });

    this.input.gamepad.once('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      console.log('gamepad disconnected');
      console.log(pad);
    });
  }

  update(): void {
    //
  }
}
