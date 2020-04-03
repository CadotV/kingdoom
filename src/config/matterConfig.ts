import Phaser from 'phaser';

export const MatterConfig: Phaser.Types.Physics.Matter.MatterWorldConfig = {
  enableSleeping: true,
  gravity: {
    x: 0,
    y: 1,
  },
  debug: {
    showBody: true,
    showStaticBody: true,
  },
};
