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

        // 入力ユーティリティ
        this.my_input = new MyInput(this);

        // 初期設定
        this.setup = new Setup(this);
        GameState.stage_state = GLOBALS.STAGE_STATE.START;

        // 背景の初期設定
        GameState.vanish_point = 240;
        GameState.scroll_x = 0;
        GameState.bg = new Background(this);
        GameState.bg.create();

        // ゲームメイン処理の初期化
        this.exec = new Exec(this);

    } // End of create

    update(time, delta){

        if (GameState.stage_state === GLOBALS.STAGE_STATE.START){
            this.setup.clean_up();
            this.setup.create();
            GameState.bg.update(time, delta);
            this.exec.update();
            GameState.player.update();
            this.stage_state_count = 60;
            GameState.stage_state = GLOBALS.STAGE_STATE.STARTING;
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.STARTING){
            GameState.bg.update(time, delta);
            this.exec.update();
            GameState.player.pos.x += 5;
            GameState.player.update();
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                GameState.stage_state = GLOBALS.STAGE_STATE.PLAYING;
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
            GameState.bg.update(time, delta);
            this.my_input.update();
            GameState.player.update();
            this.exec.update();
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAIL){
            GameState.bg.update(time, delta);
            this.exec.update();
            GameState.stage_state = GLOBALS.STAGE_STATE.FAILED;
            this.stage_state_count = 100;
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.FAILED){
            GameState.bg.update(time, delta);
            this.exec.update();
            this.stage_state_count--;
            if (this.stage_state_count < 0){
                this.scene.start('TitleScene');
            }
        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEAR){

        } else if (GameState.stage_state === GLOBALS.STAGE_STATE.CLEARED){

        }

        if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
            this.scene.start('TitleScene');
        }

    } // End of update

}