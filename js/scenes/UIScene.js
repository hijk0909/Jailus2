// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

const FONT_SIZE = 16;

export class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: 'UIScene' });
    }

    create() {
        this.add_text(0,0,"1UP", 0xffff00);
        this.add_text(18,0,"HIGH SCORE", 0xff00ff);
        this.ui_score_val = this.add_text(0,1,0, 0xffffff);
        this.ui_high_score_val = this.add_text(18,1,0, 0xffffff);
    }

    update(){
        const score_text = String(GameState.score).padStart(10, ' ');
        this.ui_score_val.setText(score_text);
        const high_score_text = String(GameState.high_score).padStart(10, ' ');
        this.ui_high_score_val.setText(high_score_text);

        super.update();
    }

    add_text(row, col, text, color){
        const t = this.add.bitmapText(row * FONT_SIZE, col * FONT_SIZE, 'myFont', text, FONT_SIZE).setTint(color);
        t.setName('bitmapText');
        return t;
    }

    destroy(){
        this.children.getAll().forEach(child => {
            if (child.name === 'bitmapText') {
                child.destroy();
            }
        });
    }
}