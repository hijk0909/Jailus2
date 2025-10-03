// UIScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

const FONT_SIZE = 16;
const MARGIN = 8;

export class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: 'UIScene' });
    }

    create() {
        this.add_text(0,0,"1UP", 0xffff00);
        this.add_text(18,0,"HIGH SCORE", 0xff00ff);
        this.add_text(37,0,"DIFFICULTY:", 0xffffff);
        this.add_text(41,35,"LIVES:", 0xffffff);
        this.add_text(0,35,"STAGE:", 0xffffff);
        this.ui_score_val = this.add_text(0,1,0, 0xffffff);
        this.ui_high_score_val = this.add_text(18,1,0, 0xffffff);
        this.ui_difficulty_val = this.add_text(48,0, 0, 0xffffff);
        this.ui_lives_val = this.add_text(47,35, 0, 0x00ffff);
        this.ui_stage_val = this.add_text(6,35, `1-1`);
        this.ui_scroll_val = this.add_text(10,35, 0, 0xffffff);
    }

    update(){
        const score_text = String(GameState.score).padStart(10, ' ');
        this.ui_score_val.setText(score_text);
        const high_score_text = String(GameState.high_score).padStart(10, ' ');
        this.ui_high_score_val.setText(high_score_text);
        const difficulty_text = String(GameState.difficulty).padStart(3, ' ');
        this.ui_difficulty_val.setText(Math.floor(difficulty_text));
        const lives_text = String(GameState.lives).padStart(2, ' ');
        this.ui_lives_val.setText(lives_text);
        const stage_text = `${GameState.stage}-${GameState.area}`;
        this.ui_stage_val.setText(stage_text);
        const scroll_text = String(Math.floor(GameState.scroll_x)).padStart(5, ' ');
        this.ui_scroll_val.setText(scroll_text);
        super.update();
    }

    add_text(row, col, text, color){
        const t = this.add.bitmapText(row * FONT_SIZE + MARGIN, col * FONT_SIZE + MARGIN, 'myFont', text, FONT_SIZE).setTint(color);
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