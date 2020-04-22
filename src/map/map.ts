import { GAMECONFIG } from '@config/gameConfig';

export default class Map {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const startLevel = [
      [4, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [8, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const endLevel = [
      [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 5],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 6],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11],
    ];

    const blockLevel = [
      [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const level: number[][] = [[]];

    for (let index = 0; index < startLevel.length; index++) {
      level[index] = startLevel[index].concat(blockLevel[index]).concat(endLevel[index]);
    }

    console.log(level);
    // startLevel.forEach((tab, index) => {
    //   tab.concat(blockLevel[index]).concat(endLevel[index]);
    // });

    const mapData = {
      name: 'level',
      data: level,
      width: GAMECONFIG.width,
      height: GAMECONFIG.height,
      tileWidth: 32,
      tileHeight: 32,
    };

    // this.attachListener();

    // Create Tilemap
    const tilemap = this.createTilemap(mapData);
    const tilesetGround = tilemap.addTilesetImage('tileset_ground');
    const tilesetWall = tilemap.addTilesetImage('tileset_wall');
    const layerWall = tilemap.createDynamicLayer(0, tilesetWall, 0, 0);

    // tilemap.createDynamicLayer('layer', [tilesetGround, tilesetWall]);
    // tilemap.setLayer('tileset_wall');

    // tilemap.setCollisionFromCollisionGroup(true);
    tilemap.setCollisionBetween(1, 1000, true, true, layerWall);

    // const debugGraphics = this.scene.add.graphics();
    // tilemap.renderDebug(debugGraphics, { tileColor: 0xff0000 });
    // const layerGround = tilemap.createStaticLayer('ground layer', tilesetGround, 0, 0);
    // const layerWall = tilemap.createStaticLayer('wall layer', tilesetWall, 0, 0);
  }

  preload(): void {
    //
  }

  createTilemap(mapData: Phaser.Types.Tilemaps.TilemapConfig | undefined): Phaser.Tilemaps.Tilemap {
    const tilemap = this.scene.make.tilemap(mapData);
    return tilemap;
  }

  // attachListener(): void {
  //   console.log(this.scene);
  //   this.scene.events.on('preload', this.preload, this.scene);
  // }

  // preload(): void {
  //   this.scene.load.image('tileset_1', Tileset1);
  // }
}
