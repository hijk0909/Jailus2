// TitleScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';
import { Ranking } from './ranking.js';

const FONT_SIZE = 16;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.stage_data = null;
        this.start_stage = 1;
        this.start_area = 1;
        this.ranking = null;
    }

    create() {
        this.stage_data = this.cache.json.get('stage_data');

        // 座標変数
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.hy = this.game.canvas.height;

        // 隠しキー
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.keyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        //ランキング取得（インターネット経由）
        if (this.ranking === null){
            this.ranking = new Ranking(this);
        }
        this.ranking.get_net_ranking();

        this.my_input = new MyInput(this);
        this.my_input.registerPadConnect(() => this.show_pad());
        if (this.my_input.pad){this.show_pad();}
        this.my_input.registerNextAction(() => this.start_game());

        this.add.text(this.cx, 50, 'Jailus 2', { fontSize: '64px', fill: '#ffee00' , stroke: '#ff0000', strokeThickness: 2}).setOrigin(0.5,0.5);
        this.start_stage_txt = this.add.text(this.cx, 210, 'START STAGE: ', { fontSize: '24px', fill: '#eee' }).setOrigin(0.5,0.5).setVisible(false);

        this.add.text(this.cx, this.hy - 125, 'PUSH SPACE KEY',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5,0.5);
        this.show_text(`VERSION : ${GLOBALS.VERSION}`);
    }

    update(time, delta){
        if (Phaser.Input.Keyboard.JustDown(this.keyF)){
            this.start_stage = Math.max(1, this.start_stage - 1);
            this.start_area = 1;
            this.show_start_stage();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyG)){
            this.start_stage = Math.min(GLOBALS.STAGE_MAX, this.start_stage + 1);
            this.start_area = 1;
            this.show_start_stage();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyV)){
            this.start_area = Math.max(1, this.start_area - 1);
            this.show_start_stage();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyB)){
            const stage_info = this.stage_data.stages.find(s => s.stage === this.start_stage);
            this.start_area = Math.min(stage_info.areas.length, this.start_area + 1);
            this.show_start_stage();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyA)){
            this.scene.start('AttractScene');
        }
    }
    show_start_stage(){
        this.start_stage_txt.setText(`START STAGE : ${this.start_stage} - ${this.start_area}`).setVisible(true);
    }

    show_pad(){
        this.add.text(this.cx, this.hy - 100, ' or PRESS START BUTTON',{ fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5);
    }

    show_text(text){
        this.clear_text();
        const pos_x = (this.game.canvas.width - text.length * FONT_SIZE) / 2;
        this.add.bitmapText(pos_x, 100, 'myFont', text, FONT_SIZE)
        .setName('titleText');        
    }
    clear_text(){
        this.children.getAll().forEach(child => {
            if (child.name === 'titleText') {
                child.destroy();
            }
        });
    }

    start_game(){
        // 念のため、各シーンを止める
        this.scene.stop('GameScene');
        this.scene.stop('GameOverScene');
        this.scene.stop('GameClearScene');
        this.scene.stop('NameEntryScene');
        this.scene.stop('UI');

        // GameState.sound.se_tap.play();
        GameState.reset();
        GameState.stage = this.start_stage;
        GameState.area = this.start_area;
        this.scene.start('GameScene');
    }
}
