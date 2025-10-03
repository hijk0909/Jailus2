// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

export class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.add.text(this.cx, this.cy, 'GAME CLEAR', { fontSize: '64px', fill: '#ff0000' , stroke: '#800000', strokeThickness: 2}).setOrigin(0.5,0.5);
    
        this.time.addEvent({
        delay: 3000,
        callback: () => {
            this.goto_next();
        },
        callbackScope: this
        });
    }

    goto_next(){
        if (Ranking.get_new_rank(GameState.ranking.session, GameState.score) === -1){
            this.scene.start('TitleScene');
        } else {
            this.scene.stop('GameScene');
            this.scene.start('NameEntryScene');
        }
    }
}