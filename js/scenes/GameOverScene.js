// GameOverScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;
        this.add.text(this.cx, this.cy, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' , stroke: GLOBALS.COLOR.RED, strokeThickness: 2}).setOrigin(0.5,0.5);
    
        this.time.addEvent({
        delay: 3000,
        callback: () => {
            this.goto_next();
        },
        callbackScope: this
        });
    }

    goto_next(){
        this.scene.start('TitleScene');
    }
}