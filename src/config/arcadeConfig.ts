import Phaser from 'phaser';

export const ArcadeWorldConfig: Phaser.Types.Physics.Arcade.ArcadeWorldConfig = {
  gravity: {
    x: 0,
    y: 0,
  },
  debug: true,
  debugShowBody: true,
  debugShowStaticBody: true,
  debugShowVelocity: true,
};
