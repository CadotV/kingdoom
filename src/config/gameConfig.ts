import Phaser from 'phaser';
import BootScene from '@scenes/bootScene';
import GameScene from '@scenes/gameScene';
// import { MatterWorldConfig } from './matterConfig';
import { ArcadeWorldConfig } from './arcadeConfig';
// import { MatterWorldConfig } from './matterConfig';

export const GAMECONFIG = {
  width: 896,
  height: 504,
};

export const GameConfig: Phaser.Types.Core.GameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAMECONFIG.width,
    height: GAMECONFIG.height,
  },
  type: Phaser.AUTO,
  scene: [BootScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: ArcadeWorldConfig,
    // matter: MatterWorldConfig,
  },
  input: {
    gamepad: true,
  },
};
