// Jailus2/AssetLoader.js
import { GLOBALS } from './js/GameConst.js';
import { GameState } from './js/GameState.js';
import { ScrollPipeline, RipplePipeline, ShockwavePostFX, GlitchPipeline, PalettePipeline } from './js/utils/DrawUtils.js';

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
        // STAGE-4
        this.load.image('stage_4_ceiling', 'assets/images/stage_4_ceiling.png');
        this.load.image('stage_4_floor', 'assets/images/stage_4_floor.png');        
        this.load.image('stage_4_layer1', 'assets/images/stage_4_layer1.png');
        this.load.image('stage_4_layer2', 'assets/images/stage_4_layer2.png');
        this.load.image('stage_4_layer4', 'assets/images/stage_4_layer4.png');
        this.load.tilemapTiledJSON('stage_4_map', 'assets/data/stage_4.json');
        // STAGE-5
        this.load.image('stage_5_ceiling', 'assets/images/stage_5_ceiling.png');
        this.load.image('stage_5_floor', 'assets/images/stage_5_floor.png');        
        this.load.image('stage_5_layer1', 'assets/images/stage_5_layer1.png');
        this.load.image('stage_5_layer2', 'assets/images/stage_5_layer2.png');
        this.load.image('stage_5_layer4', 'assets/images/stage_5_layer4.png');
        this.load.tilemapTiledJSON('stage_5_map', 'assets/data/stage_5.json');
        // STAGE-6
        this.load.image('stage_6_ceiling', 'assets/images/stage_6_ceiling.png');
        this.load.image('stage_6_floor', 'assets/images/stage_6_floor.png');        
        this.load.image('stage_6_layer1', 'assets/images/stage_6_layer1.png');
        this.load.image('stage_6_layer2', 'assets/images/stage_6_layer2.png');
        this.load.image('stage_6_layer4', 'assets/images/stage_6_layer4.png');
        this.load.tilemapTiledJSON('stage_6_map', 'assets/data/stage_6.json');
        // STAGE-7
        this.load.image('stage_7_ceiling', 'assets/images/stage_7_ceiling.png');
        this.load.image('stage_7_floor', 'assets/images/stage_7_floor.png');        
        this.load.image('stage_7_layer1', 'assets/images/stage_7_layer1.png');
        this.load.image('stage_7_layer2', 'assets/images/stage_7_layer2.png');
        this.load.image('stage_7_layer4', 'assets/images/stage_7_layer4.png');
        this.load.tilemapTiledJSON('stage_7_map', 'assets/data/stage_7.json');
        // STAGE-8
        this.load.image('stage_8_ceiling', 'assets/images/stage_8_ceiling.png');
        this.load.image('stage_8_floor', 'assets/images/stage_8_floor.png');        
        this.load.image('stage_8_layer1', 'assets/images/stage_8_layer1.png');
        this.load.image('stage_8_layer2', 'assets/images/stage_8_layer2.png');
        this.load.image('stage_8_layer4', 'assets/images/stage_8_layer4.png');
        this.load.tilemapTiledJSON('stage_8_map', 'assets/data/stage_8.json');

        // オブジェクト
        this.load.spritesheet('ss_player', 'assets/images/ss_player.png', {
            frameWidth: 128,  frameHeight: 128, endFrame : 11 });
        this.load.spritesheet('ss_enemy', 'assets/images/ss_enemy.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 79 });
        this.load.spritesheet('ss_bullet', 'assets/images/ss_bullet.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 19 });
        this.load.spritesheet('ss_effect', 'assets/images/ss_effect.png', {
            frameWidth: 64,  frameHeight: 64, endFrame : 15 });
        this.load.spritesheet('ss_item', 'assets/images/ss_item.png', {
            frameWidth: 48,  frameHeight: 48, endFrame : 15 });
        this.load.spritesheet('ss_boss_1', 'assets/images/ss_boss_1.png', {
            frameWidth: 256, frameHeight: 320, endFrame : 1});
        this.load.spritesheet('ss_boss_2', 'assets/images/ss_boss_2.png', {
            frameWidth: 256, frameHeight: 320, endFrame : 1});
        this.load.spritesheet('ss_boss_3', 'assets/images/ss_boss_3.png', {
            frameWidth: 320, frameHeight: 180, endFrame : 1});
        this.load.spritesheet('ss_boss_4', 'assets/images/ss_boss_4.png', {
            frameWidth: 320, frameHeight: 200, endFrame : 1});
        this.load.spritesheet('ss_boss_5', 'assets/images/ss_boss_5.png', {
            frameWidth: 256, frameHeight: 320, endFrame : 1});
        this.load.spritesheet('ss_boss_6', 'assets/images/ss_boss_6.png', {
            frameWidth: 256, frameHeight: 255, endFrame : 1});
        this.load.spritesheet('ss_boss_7', 'assets/images/ss_boss_7.png', {
            frameWidth: 256, frameHeight: 400, endFrame : 1});
        this.load.spritesheet('ss_boss_8', 'assets/images/ss_boss_8.png', {
            frameWidth: 256, frameHeight: 320, endFrame : 1});

        // UI
        this.load.image('btn_tap', 'assets/images/btn_tap.png');
        this.load.image('op_1', 'assets/images/op_1.png');
        this.load.image('op_2', 'assets/images/op_2.png');
        this.load.image('op_3', 'assets/images/op_3.png');
        // フォント
        this.load.bitmapFont('myFont', 'assets/images/atari.png', 'assets/images/atari.fnt');

        // ネームエントリ
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('keyboard', 'assets/images/keyboard.png');

        // 効果音
        this.load.audio('se_tap', './assets/audio/se/se_tap.mp3');
        this.load.audio('se_extend', './assets/audio/se/se_extend.mp3');
        this.load.audio('se_explosion', './assets/audio/se/se_explosion.mp3');
        this.load.audio('se_bonus', './assets/audio/se/se_bonus.mp3');
        this.load.audio('se_barrier', './assets/audio/se/se_barrier.mp3');
        this.load.audio('se_failed', './assets/audio/se/se_failed.mp3');
        this.load.audio('se_name_type', './assets/audio/se/se_name_type.mp3');
        this.load.audio('se_name_back', './assets/audio/se/se_name_back.mp3');
        this.load.audio('se_name_enter', './assets/audio/se/se_name_enter.mp3');
        // ジングル
        this.load.audio('jingle_game_over', './assets/audio/jingle/jingle_game_over.mp3');
        // BGM
        this.load.audio('bgm_main', './assets/audio/bgm/bgm_main.mp3');
        this.load.audio('bgm_zero_mind', './assets/audio/bgm/bgm_zero_mind.mp3');
        this.load.audio('bgm_name_entry', './assets/audio/bgm/bgm_name_entry.mp3');
        this.load.audio('bgm_game_clear', './assets/audio/bgm/bgm_game_clear.mp3');
        this.load.audio('bgm_stage_1', './assets/audio/bgm/bgm_stage_1.mp3');
        this.load.audio('bgm_stage_2', './assets/audio/bgm/bgm_stage_2.mp3');
        this.load.audio('bgm_stage_3', './assets/audio/bgm/bgm_stage_3.mp3');
        this.load.audio('bgm_stage_4', './assets/audio/bgm/bgm_stage_4.mp3');
        this.load.audio('bgm_stage_5', './assets/audio/bgm/bgm_stage_5.mp3');
        this.load.audio('bgm_stage_6', './assets/audio/bgm/bgm_stage_6.mp3');
        this.load.audio('bgm_stage_7', './assets/audio/bgm/bgm_stage_7.mp3');
        this.load.audio('bgm_stage_8', './assets/audio/bgm/bgm_stage_8.mp3');

        // シェーダー
        this.renderer.pipelines.add('ScrollCeil', new ScrollPipeline(this.game));
        this.renderer.pipelines.add('ScrollFloor', new ScrollPipeline(this.game));
        this.renderer.pipelines.add('Ripple', new RipplePipeline(this.game));
        this.renderer.pipelines.addPostPipeline('Shockwave', ShockwavePostFX);
        this.renderer.pipelines.add('Glitch', new GlitchPipeline(this.game));
        this.renderer.pipelines.add('Glitch2', new GlitchPipeline(this.game));
        this.renderer.pipelines.add('Palette', new PalettePipeline(this.game));
    }

    create() {

        GameState.sound = {
            se_tap             : this.sound.add('se_tap', { volume: 1.0 }),
            se_extend          : this.sound.add('se_extend', { volume: 1.0 }),
            se_explosion       : this.sound.add('se_explosion', { volume: 0.4 }),
            se_bonus           : this.sound.add('se_bonus', { volume: 1.0 }),
            se_barrier         : this.sound.add('se_barrier', { volume: 1.0 }),
            se_failed          : this.sound.add('se_failed', { volume: 1.0 }),
            se_name_type       : this.sound.add('se_name_type', { volume: 1.0 }),
            se_name_back       : this.sound.add('se_name_back', { volume: 1.0 }),
            se_name_enter      : this.sound.add('se_name_enter', { volume: 1.0 }),
            jingle_game_over   : this.sound.add('jingle_game_over', { volume: 0.7 }),
            bgm_main           : this.sound.add('bgm_main', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_1        : this.sound.add('bgm_stage_1', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_2        : this.sound.add('bgm_stage_2', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_3        : this.sound.add('bgm_stage_3', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_4        : this.sound.add('bgm_stage_4', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_5        : this.sound.add('bgm_stage_5', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_6        : this.sound.add('bgm_stage_6', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_7        : this.sound.add('bgm_stage_7', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_stage_8        : this.sound.add('bgm_stage_8', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_zero_mind      : this.sound.add('bgm_zero_mind', { volume: GLOBALS.BGM_VOLUME, loop: true }),
            bgm_name_entry     : this.sound.add('bgm_name_entry', { volume: 0.6, loop: true }),
            bgm_game_clear     : this.sound.add('bgm_game_clear', { volume: 0.6, loop: true })
        };
        this.scene.start('TitleScene');
    }
}