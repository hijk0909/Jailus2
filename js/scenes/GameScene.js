// GameScene.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Background } from './background.js';
import { Exec } from './game_exec.js';
import { Setup } from './game_setup.js';
import { MyInput } from '../utils/InputUtils.js';
import { Player } from '../objects/player.js';

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

        // 入力ユーティリティの生成
        this.my_input = new MyInput(this);
        this.my_input.registerNextAction(() => this.toggle_pause());

        // UIの初期化
        this.scene.launch('UIScene');
        GameState.ui = this.scene.get('UIScene');

        // 設定処理の生成
        this.setup = new Setup(this);

        // ゲームメイン処理の生成
        this.exec = new Exec(this);

        // ステージの初期化
        GameState.stage_state = GLOBALS.STAGE_STATE.START;

    } // End of create

    update(time, delta){

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
            GameState.scroll_x = 0;
            GameState.scroll = true;
            GameState.bg = new Background(this);
            GameState.bg.create();
            // 実行
            this.exec.update(time, delta);
            GameState.player.update();
            this.stage_state_count = 45;
            GameState.stage_state = GLOBALS.STAGE_STATE.STARTING;
            // [SOUND] メインBGM
            GameState.bgm_set(GameState.sound.bgm_main);
            GameState.bgm_play();
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.STARTING){
            // ◆開始期間
            this.exec.update(time, delta);
            GameState.player.pos.x += 5;
            GameState.player.update();
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                GameState.stage_state = GLOBALS.STAGE_STATE.PLAYING;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            // ◆プレイ中
            this.my_input.update();
            GameState.player.update();
            this.exec.update(time, delta);
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAIL){
            // ◆失敗
            this.exec.update(time, delta);
            GameState.stage_state = GLOBALS.STAGE_STATE.FAILED;
            this.stage_state_count = 100;
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAILED){
            // ◆失敗期間
            this.exec.update(time, delta);
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                GameState.bgm_stop();
                GameState.ui.destroy();
                this.scene.stop('UIScene');
                this.scene.start('GameOverScene');
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEAR){
            // ◆クリア
            this.my_input.clear();
            GameState.player.update();
            this.exec.update(time, delta);
            if (GameState.stage === GLOBALS.STAGE_MAX){
                GameState.stage_state = GLOBALS.STAGE_STATE.ALL_CLEARED;
                this.stage_state_count = 400;
            } else {
                GameState.stage_state = GLOBALS.STAGE_STATE.CLEARED;
                this.stage_state_count = 200;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEARED){
            // ◆ステージクリア期間
            GameState.player.pos.x += 5;
            GameState.player.update();
            this.exec.update(time, delta);
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                GameState.stage++;
                GameState.stage_state = GLOBALS.STAGE_STATE.START;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.ALL_CLEARED){
            // ◆全面クリア期間
            GameState.player.update();
            this.exec.update(time, delta);
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                GameState.bgm_stop();
                GameState.ui.destroy();
                this.scene.stop('UIScene');
                this.scene.start('GameClearScene');
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.PAUSE){
            // ◆一時停止期間
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            GameState.bgm_stop();
            GameState.ui.destroy();
            this.scene.stop('UIScene');
            this.scene.start('TitleScene');
        }

    } // End of update

    // ポーズ処理
    toggle_pause(){
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            GameState.stage_state = GLOBALS.STAGE_STATE.PAUSE;
            GameState.bgm_pause();
            this.children.each(child => {
                if (child.anims && child.anims.isPlaying) child.anims.pause();
            });
            // GameState.ui.show_pause(true);
        } else if ( GameState.stage_state === GLOBALS.STAGE_STATE.PAUSE){
            GameState.stage_state = GLOBALS.STAGE_STATE.PLAYING;
            GameState.bgm_resume();
            this.children.each(child => {
                if (child.anims && child.anims.isPaused) child.anims.resume();
            });
            // GameState.ui.show_pause(false);
        }
    }
}