// Jailus2/AssetLoader.js
import { GameState } from './js/GameState.js';
import { ScrollPipeline, RipplePipeline } from './js/utils/DrawUtils.js';

export class AssetLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'AssetLoaderScene' });
    }

    preload(){
        // ローディングバーの簡易表示
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 25, width / 2, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 15, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        // 画像
        // 背景
        this.load.image('bg_tileset_key', 'assets/images/bg_tileset.png');
        this.load.json('stage_data', './assets/data/stage_data.json');
        // STAGE-1
        this.load.image('stage_1_ceiling', 'assets/images/stage_1_ceiling.png');
        this.load.image('stage_1_floor', 'assets/images/stage_1_floor.png');        
        this.load.image('stage_1_layer1', 'assets/images/stage_1_layer1.png');
        this.load.image('stage_1_layer2', 'assets/images/stage_1_layer2.png');
        this.load.image('stage_1_layer4', 'assets/images/stage_1_layer4.png');
        this.load.tilemapTiledJSON('stage_1_map', 'assets/data/stage_1.json');
        // STAGE-2
        this.load.image('stage_2_ceiling', 'assets/images/stage_2_ceiling.png');
        this.load.image('stage_2_floor', 'assets/images/stage_2_floor.png');        
        this.load.image('stage_2_layer1', 'assets/images/stage_2_layer1.png');
        this.load.image('stage_2_layer2', 'assets/images/stage_2_layer2.png');
        this.load.image('stage_2_layer4', 'assets/images/stage_2_layer4.png');
        this.load.tilemapTiledJSON('stage_2_map', 'assets/data/stage_2.json');
        // STAGE-3
        this.load.image('stage_3_ceiling', 'assets/images/stage_3_ceiling.png');
        this.load.image('stage_3_floor', 'assets/images/stage_3_floor.png');        
        this.load.image('stage_3_layer1', 'assets/images/stage_3_layer1.png');
        this.load.image('stage_3_layer2', 'assets/images/stage_3_layer2.png');
        this.load.image('stage_3_layer4', 'assets/images/stage_3_layer4.png');
        this.load.tilemapTiledJSON('stage_3_map', 'assets/data/stage_3.json');

        // オブジェクト
        this.load.spritesheet('ss_player', 'assets/images/ss_player.png', {
            frameWidth: 128,  frameHeight: 128, endFrame : 7 });
        this.load.spritesheet('ss_enemy', 'assets/images/ss_enemy.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 39 });
        this.load.spritesheet('ss_bullet', 'assets/images/ss_bullet.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 7 });
        this.load.spritesheet('ss_effect', 'assets/images/ss_effect.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 15 });

        // フォント
        this.load.bitmapFont('myFont', 'assets/images/atari.png', 'assets/images/atari.fnt');

        // シェーダー
        this.renderer.pipelines.add('ScrollCeil', new ScrollPipeline(this.game));
        this.renderer.pipelines.add('ScrollFloor', new ScrollPipeline(this.game));
        this.renderer.pipelines.add('Ripple', new RipplePipeline(this.game));
    }
    create() {
        this.scene.start('TitleScene');
    }
}