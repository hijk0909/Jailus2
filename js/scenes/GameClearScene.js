// GameClearScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { Sentences } from '../utils/DrawUtils.js';
import { Ranking } from './ranking.js';

const EPILOGUE_SENTENCE = [
    "${0x00ff00}The hero ${0xd0d0d0}defeated ${0xff0000}the informavour.", 
    "The core of existence stabilized,",
    "preventing the collapse of",
    "physical laws, life, consciousness,",
    "and culture, and allowing",
    "existence to continue.",
    "All life in the universe",
    "continued to live",
    "their days as before,",
    "unaware of ${0x00ff00}the hero${0xd0d0d0}'s",
    "lonely battle",
    "left behind in the deepest reaches",
    "of abstract space."];

export class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        this.cx = this.game.canvas.width / 2;
        this.cy = this.game.canvas.height / 2;

        // 背景の描画
        this.add.image(this.cx,this.cy,'epilogue').setOrigin(0.5,0.5).setDepth(-1);

        this.add.text(this.cx, 40, 'EPILOGUE', { fontSize: '64px', fill: '#00ffff' , stroke: '#008080', strokeThickness: 2}).setOrigin(0.5,0.5);
    
        this.time.addEvent({
        delay: 30000,
        callback: () => {
            GameState.sound.bgm_game_clear.stop();
            this.goto_next();
        },
        callbackScope: this
        });

        this.sentenceMgr = new Sentences(this, 
            EPILOGUE_SENTENCE,
            { speed: 1,
                baseColor: 0xd0d0d0,
                posY: 100
            });

            GameState.sound.bgm_game_clear.play();
    }

    update(){
        this.sentenceMgr.update();        
    }

    goto_next(){
        if (Ranking.get_new_rank(GameState.ranking.session, GameState.score) === -1){
            this.scene.start('TitleScene');
        } else {
            // this.scene.stop('GameScene');
            this.scene.start('NameEntryScene');
        }
    }
}