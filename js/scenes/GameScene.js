// GameScene.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Background } from './background.js';
import { BGM } from './bgm.js';
import { Exec } from './game_exec.js';
import { Setup } from './game_setup.js';
import { MyInput } from '../utils/InputUtils.js';
import { Shockwave } from '../utils/DrawUtils.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.stage_state_count = 100;
    }

    create() {

        // キー定義
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        // 入力ユーティリティの生成
        this.my_input = new MyInput(this);
        this.my_input.registerNextAction(() => this.toggle_pause());

        // UIの初期化
        this.scene.launch('UIScene');
        GameState.ui = this.scene.get('UIScene');

        // シェーダー（ポストエフェクト）の初期化
        GameState.shockwave = new Shockwave(this);

        // 設定処理の生成
        this.setup = new Setup(this);

        // BGMの初期化
        GameState.bgm = new BGM(this);

        // ゲームメイン処理の生成
        this.exec = new Exec(this);

        // ステージの初期化
        GameState.stage_state = GLOBALS.STAGE_STATE.START;

        // プレイヤー登場・退出時の加速
        this.player_accel = 0;

    } // End of create

    update(time, delta){

        GameState.ff = delta / GLOBALS.DELTA;
        // console.log("ff", GameState.ff, delta, GLOBALS.DELTA);
        GameState.difficulty = Math.min(GameState.difficulty + GLOBALS.DIFFICULTY.UP_PAR_TIME * GameState.ff, GLOBALS.DIFFICULTY.MAX);

        if (GameState.stage_state === GLOBALS.STAGE_STATE.START){
            // ◆開始
            // console.log("STAGE_STATE.START");
            // 変数の初期化
            this.setup.clean_up();
            this.setup.create();
            this.my_input.clear();
            // 背景の初期化
            if (GameState.bg){
                GameState.bg.destroy();
            }
            GameState.vanish_point = 240;
            // GameState.scroll_x = 0;
            GameState.scroll = true;
            GameState.bg = new Background(this);
            GameState.bg.create();
            // [SOUND] BGM停止
            GameState.bgm.stop();
            // ワイプイン
            this.wipe_in();
            this.player_velocity = 8;
            // 実行
            this.exec.update(time, delta);
            GameState.player.update();
            this.stage_state_count = 45;
            GameState.stage_state = GLOBALS.STAGE_STATE.STARTING;
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.STARTING){
            // ◆開始期間
            this.exec.update(time, delta);
            this.player_velocity = Math.max(this.player_velocity - 0.1 * GameState.ff, 4);
            GameState.player.pos.x += this.player_velocity * GameState.ff;
            GameState.player.update();
            this.stage_state_count -= GameState.ff;
            if (this.stage_state_count < 0){
                GameState.stage_state = GLOBALS.STAGE_STATE.PLAYING;
                // [SOUND] メインBGM
                GameState.bgm.set_by_stage();
                GameState.bgm.play();
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            // ◆プレイ中
            this.my_input.update();
            GameState.player.update();
            this.exec.update(time, delta);
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAIL){
            // ◆失敗
            this.my_input.clear();
            this.my_input.erase();
            this.exec.update(time, delta);
            // ワイプアウト
            this.wipe_out();
            GameState.stage_state = GLOBALS.STAGE_STATE.FAILED;
            this.stage_state_count = 100;
            // BGMフェードアウト
            GameState.bgm.fadeout();
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAILED){
            // ◆失敗期間
            this.exec.update(time, delta);
            this.stage_state_count -= GameState.ff;
            if (this.stage_state_count < 0){
                GameState.lives--;
                if (GameState.lives < 0){
                    GameState.bgm.stop();
                    GameState.ui.destroy();
                    this.my_input.destroy();
                    this.scene.stop('UIScene');
                    this.scene.start('GameOverScene');
                } else {
                    GameState.bg.area_reset();
                    GameState.stage_state = GLOBALS.STAGE_STATE.START;
                    GameState.difficulty = Math.max(GameState.difficulty - GLOBALS.DIFFICULTY.DOWN_PAR_FAIL, GLOBALS.DIFFICULTY.MIN);
                }
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEAR){
            // ◆ステージクリア
            this.my_input.clear();
            this.my_input.erase();
            GameState.bgm.fadeout();
            GameState.player.update();
            this.exec.destroy_all_enemies();
            this.exec.update(time, delta);
            if (GameState.stage === GLOBALS.STAGE_MAX){
                GameState.stage_state = GLOBALS.STAGE_STATE.ALL_CLEARED;
                this.stage_state_count = 400;
            } else {
                GameState.stage_state = GLOBALS.STAGE_STATE.CLEARED;
                this.stage_state_count = 200;
                this.player_accel = 2;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEARED){
            // ◆ステージクリア期間
            this.player_accel = Math.min(this.player_accel + 0.1 * GameState.ff, 12);
            GameState.player.pos.x += this.player_accel * GameState.ff;
            GameState.player.update();
            this.exec.update(time, delta);
            this.stage_state_count -= GameState.ff;
            if (this.stage_state_count < 0){
                GameState.stage++;
                GameState.area = 1;
                GameState.stage_state = GLOBALS.STAGE_STATE.START;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.ALL_CLEARED){
            // ◆全面クリア期間
            GameState.player.update();
            this.exec.update(time, delta);
            this.stage_state_count -= GameState.ff;
            if (this.stage_state_count < 0){
                GameState.stage++; // [ALL]
                GameState.bgm.stop();
                GameState.ui.destroy();
                this.my_input.destroy();
                this.scene.stop('UIScene');
                this.scene.start('GameClearScene');
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.PAUSE){
            // ◆一時停止期間
        }

        // 衝撃波エフェクト（ポストエフェクトシェーダー）
        GameState.shockwave.update();

        // 隠しキー
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            GameState.bgm.stop();
            GameState.ui.destroy();
            this.my_input.destroy();
            this.scene.stop('UIScene');
            this.scene.start('TitleScene');
        }
        // DIFFICULTYのリアルタイム調整
        if (this.keyR.isDown){
            GameState.difficulty = Math.max(GameState.difficulty - 50, GLOBALS.DIFFICULTY.MIN);
        }
        if (this.keyT.isDown){
            GameState.difficulty = Math.min(GameState.difficulty + 50, GLOBALS.DIFFICULTY.MAX);
        }

    } // End of update

    // ワイプイン
    wipe_in(){
        // ワイプアウト用のオーバーレイがあれば削除
        if (this.overlay_out){
            this.overlay_out.destroy();
        }
        // 黒のオーバーレイ
        this.overlay_in = this.add.rectangle(0, 0, GLOBALS.FIELD.WIDTH, GLOBALS.FIELD.HEIGHT, 0x000000, 1)
            .setOrigin(0)
            .setDepth(100);
        let revealMaskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        let mask = revealMaskGraphics.createGeometryMask();
        mask.invertAlpha = true;
        this.overlay_in.setMask(mask);
        let maskData = { radius: 1 };
        // Tweenで半径を増やす
        this.tweens.add({
            targets: maskData,
            radius: 500,
            duration: 2000,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                revealMaskGraphics.clear();
                revealMaskGraphics.fillStyle(0xffffff);
                revealMaskGraphics.beginPath();
                revealMaskGraphics.arc(GLOBALS.FIELD.WIDTH / 2, GLOBALS.FIELD.HEIGHT / 2, maskData.radius, 0, Math.PI * 2);
                revealMaskGraphics.fillPath();
            },
            onComplete: () => {
                if (this.overlay_in){
                    this.overlay_in.destroy();  // 演出後はマスクと覆いを削除
                }
            }
        });
    } // End of wipe_in

    // ワイプ・アウト
    wipe_out(){
        // 黒のオーバーレイ
        this.overlay_out = this.add.rectangle(0, 0, GLOBALS.FIELD.WIDTH, GLOBALS.FIELD.HEIGHT, 0x000000, 1)
            .setOrigin(0)
            .setDepth(900)
            .setAlpha(0);
        let maskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        let mask = maskGraphics.createGeometryMask();
        mask.invertAlpha = true;
        this.overlay_out.setMask(mask);
        let maskData = { radius: 500 };
        // 半径の変更
        this.tweens.add({
            targets: maskData,
            radius: 0,
            duration: 1000,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                maskGraphics.clear();
                maskGraphics.fillStyle(0xffffff);
                maskGraphics.beginPath();
                maskGraphics.arc(GLOBALS.FIELD.WIDTH / 2, GLOBALS.FIELD.HEIGHT / 2, maskData.radius, 0, Math.PI * 2);
                maskGraphics.fillPath();
            }
        });
        // 透明度の変更
        this.tweens.add({
            targets : this.overlay_out,
            alpha: 1,          // 0→1
            duration: 500,
            ease    : 'Linear'
        });
        // 完了時の後処理
        this.time.delayedCall(2000, () => {
            if (this.overlay_out){
                this.overlay_out.destroy();
            }
        });
    }

    // ポーズ処理
    toggle_pause(){
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            GameState.stage_state = GLOBALS.STAGE_STATE.PAUSE;
            GameState.bgm.pause();
            GameState.ui.show_pause(true);
            this.children.each(child => {
                if (child.anims && child.anims.isPlaying) child.anims.pause();
            });
            // GameState.ui.show_pause(true);
        } else if ( GameState.stage_state === GLOBALS.STAGE_STATE.PAUSE){
            GameState.stage_state = GLOBALS.STAGE_STATE.PLAYING;
            GameState.bgm.resume();
            GameState.ui.show_pause(false);
            this.children.each(child => {
                if (child.anims && child.anims.isPaused) child.anims.resume();
            });
            // GameState.ui.show_pause(false);
        }
    }
}