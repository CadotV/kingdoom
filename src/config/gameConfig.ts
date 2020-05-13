import BootScene from '@scenes/bootScene';
import MainMenuScene from '@scenes/mainMenuScene';
import GameScene from '@scenes/gameScene';
import Phaser from 'phaser';
import { MatterWorldConfig } from './matterConfig';

const DEFAULTS_SCALE_SIZE = {
  width: 640,
  height: 360,
};

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scene: [BootScene, MainMenuScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    // width: DEFAULTS_SCALE_SIZE.width,
    // height: DEFAULTS_SCALE_SIZE.height,
  },
  parent: 'phaser',
  dom: {
    createContainer: true,
  },
  input: {
    keyboard: true,
    mouse: true,
    gamepad: true,
  },
  // TODO: don't put matter engine in every scene, some don't need physics simulation
  physics: {
    default: 'matter',
    matter: MatterWorldConfig,
  },
};
