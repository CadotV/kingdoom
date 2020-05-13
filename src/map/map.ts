// import { GAMECONFIG } from '@config/gameConfig';
import TilesetDefault from '@assets/tilemaps/tiles/tileset_default-extruded.png';
import TilemapStart from '@assets/tilemaps/maps/tilemapStart.json';
import TilemapEnd from '@assets/tilemaps/maps/tilemapEnd.json';
import TilemapBlock0 from '@assets/tilemaps/maps/tilemapBlock_0.json';
import TilemapBlock1 from '@assets/tilemaps/maps/tilemapBlock_1.json';

export default class Map {
  scene: Phaser.Scene;
  // mapData: Phaser.Types.Tilemaps.TilemapConfig;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload(): void {
    this.scene.load.image('tileset_default', TilesetDefault);
    this.scene.load.tilemapTiledJSON('tilemapStart', TilemapStart);
    this.scene.load.tilemapTiledJSON('tilemapEnd', TilemapEnd);
    this.scene.load.tilemapTiledJSON('tilemapBlock0', TilemapBlock0);
    this.scene.load.tilemapTiledJSON('tilemapBlock1', TilemapBlock1);
  }

  createMultipleTilemap(): void {
    const blocks = 40;
    let widthInPixels = 0;

    const tilemapStart = this.scene.make.tilemap({ key: 'tilemapStart' });
    const tileset = tilemapStart.addTilesetImage('tileset_wall-extruded', 'tileset_default');
    let layerLand = tilemapStart.createStaticLayer('land', tileset);
    let layerWall = tilemapStart.createStaticLayer('wall', tileset);
    layerWall.setCollisionByProperty({ collides: true });
    this.scene.matter.world.convertTilemapLayer(layerWall);
    widthInPixels += tilemapStart.widthInPixels;

    for (let index = 0; index < blocks; index++) {
      const randomBlock = Math.floor(Math.random() * 2);
      const tilemapBlock = this.scene.make.tilemap({ key: 'tilemapBlock' + randomBlock });
      layerLand = tilemapBlock.createStaticLayer('land', tileset).setPosition(widthInPixels, 0);
      layerWall = tilemapBlock.createStaticLayer('wall', tileset).setPosition(widthInPixels, 0);
      layerWall.setCollisionByProperty({ collides: true });
      this.scene.matter.world.convertTilemapLayer(layerWall);
      widthInPixels += tilemapBlock.widthInPixels;
    }

    const tilemapEnd = this.scene.make.tilemap({ key: 'tilemapEnd' });
    layerLand = tilemapEnd.createStaticLayer('land', tileset).setPosition(widthInPixels, 0);
    layerWall = tilemapEnd.createStaticLayer('wall', tileset).setPosition(widthInPixels, 0);
    layerWall.setCollisionByProperty({ collides: true });
    this.scene.matter.world.convertTilemapLayer(layerWall);
  }

  createTilemap(): void {
    const tilemap = this.scene.make.tilemap();
    const tileset = tilemap.addTilesetImage('tileset_wall-extruded', 'tileset_default', 64, 64, 1, 2);
    const layer = tilemap.createBlankDynamicLayer('land', tileset);

    let arrayLand = [];
    // let arrayWall = [];
    const tilemapStart = this.scene.make.tilemap({ key: 'tilemapStart' });
    arrayLand = tilemapStart.getTilesWithin(0, 0, 9, 9, undefined, 'land');
    // arrayWall = tilemapStart.getTilesWithin(0, 0, 9, 9, undefined, 'wall');
    // const array = arrayLand.concat(arrayWall);
    console.log('arrayLand', arrayLand);
    // console.log('arrayWall', arrayWall);
    layer.putTilesAt(arrayLand, 0, 0);
    console.log('layer', layer);
  }
}
