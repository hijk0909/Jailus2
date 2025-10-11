// InputUtils.js
import { GameState } from '../GameState.js';

export class MyInput {
    constructor(scene) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics().setDepth(999);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.pad = null;
        this.current_pointer = null;
        this.last_pointer = null;

        // ゲームパッド接続確認
        if (this.scene.input.gamepad.total > 0) {
            this.pad = this.scene.input.gamepad.getPad(0);
        } else {
            this.scene.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
            });
        }

        // マウス＆タッチ操作
        scene.input.on('pointerdown', this.onPointerDown, this);
        scene.input.on('pointermove', this.onPointerMove, this);
        scene.input.on('pointerup', this.onPointerUp, this);
        const canvas = scene.game.canvas;
        canvas.addEventListener("mouseleave", () => this.onPointerUp());
        canvas.addEventListener("touchcancel", () => this.onPointerUp());

        // 入力フラグのクリア
        this.clear();
    }

    onPointerDown(pointer) {
        GameState.i_pointer = pointer;
        GameState.i_touch = true;
        this.current_pointer = { x: pointer.x, y: pointer.y };
    }

    onPointerMove(pointer) {
        GameState.i_pointer = pointer;
        this.current_pointer = { x: pointer.x, y: pointer.y};
    }

    onPointerUp(pointer) {
        GameState.i_touch = false;
        this.current_pointer = null;
    }

    update() {
        // キーボード
        this.up1 = this.cursors.up.isDown;
        this.down1 = this.cursors.down.isDown;
        this.left1 = this.cursors.left.isDown;
        this.right1 = this.cursors.right.isDown;
        this.button1 = this.keyZ.isDown;

        // パッド（アナログ入力）
        if (this.pad) {
            // アナログ入力
            let axes = this.pad.axes;
            if (axes.length >= 2) {
                // console.log("x,y:",axes[0].getValue(), axes[1].getValue() );
                const x = axes[0].getValue();
                const y = axes[1].getValue();
                this.left2 = x < -0.5;
                this.right2 = x > 0.5;
                this.up2 = y < -0.5;
                this.down2 = y > 0.5;
            }
            // ボタン入力
            this.up3 = this.pad.buttons[12].pressed;
            this.down3 = this.pad.buttons[13].pressed;
            this.left3 = this.pad.buttons[14].pressed;
            this.right3 = this.pad.buttons[15].pressed;
            this.button3 = this.pad.buttons[0].pressed;
        }

        // ポインタ移動量の計算
        if (GameState.i_touch && this.current_pointer && this.last_pointer){
            GameState.i_dx = this.current_pointer.x - this.last_pointer.x;
            GameState.i_dy = this.current_pointer.y - this.last_pointer.y;
        } else {
            GameState.i_dx = GameState.i_dy = 0;
        }
        this.last_pointer = this.current_pointer;
        // タッチ位置の表示
        this.draw();

        // 操作の結合
        GameState.i_up = this.up1 || this.up2 || this.up3;
        GameState.i_down = this.down1 || this.down2 || this.down3;
        GameState.i_left = this.left1 || this.left2 || this.left3;
        GameState.i_right = this.right1 || this.right2 || this.right3;
        GameState.i_button = this.button1 || this.button3 || GameState.i_touch;
    }

    draw(){
        this.graphics.clear();
        if (GameState.i_touch && this.current_pointer){
            this.graphics.fillStyle(0x00ffff, 0.5);
            this.graphics.fillCircle(this.current_pointer.x, this.current_pointer.y, 10).setDepth(999);
        }
    }

    erase(){
        this.graphics.clear();
    }

    clear(){
        this.up1 = this.up2 = this.up3 = false;
        this.down1 = this.down2 = this.down3 = false;
        this.left1 = this.left2 = this.left3 = false;
        this.right1 = this.right2 = this.right3 = false;
        this.button1 = this.button3 = false;

        GameState.i_up = GameState.i_down = GameState.i_left = GameState.i_right = false;
        GameState.i_touch = GameState.i_button = false;
        GameState.i_dx = GameState.i_dy = 0;
    }

    destroy(){
        if (this.graphics){
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    registerPadConnect(callback) {
        this.callback_pad = callback;
        this.scene.input.gamepad.once('connected', (pad) => {
            this.pad = pad;
            callback();
        });
    }

    registerNextAction(callback) {
        this.scene.input.keyboard.on('keydown-SPACE', callback);
        this.scene.input.gamepad.on('down', (pad, button) => {
            this.pad = pad;
            if (button.index === 9) callback(); // STARTボタン
        });
    }
}