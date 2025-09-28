// AttractScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { MyInput } from '../utils/InputUtils.js';
import { Sentences } from '../utils/DrawUtils.js';
import { Ranking } from './ranking.js';

const STATE = {
    STORY : 0,
    RANKING_SESSION : 1,
    RANKING_DAILY : 2,
    RANKING_MONTHLY : 3,
    RANKING_ALLTIME : 4,
    HOW_TO_PLAY : 5,
    END : 6
}
const FONT_SIZE = 16;
const STORY_SENTENCE = [
    "In the year 2055,", 
    "the transcendent AI",
    "uncovers the true essence of",
    "physical laws and mathematics,",
    "revealing the possibility that",
    "the universe could collapse.",
    "The only solution is to dive",
    "into the mathematical space and",
    "destroy the causes of the problem.",
    "The hero, selected from humanity",
    "boards a fighter jet capable of",
    "accessing abstract information,",
    "carrying the hopes of",
    "the entire universe,",
    "dives into abstract space to",
    "destroy the root cause of",
    "the universe's collapse."];
const HOW_TO_PLAY_SENTENCE= [
    "Use the up, down, left and right keys",
    "to control your ship",
    "and use the buttons",
    "to fire shots and defeat enemies."];

export class AttractScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AttractScene' });
    }

    create(){
        // 隠しキー操作
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        //ランキングクラス
        this.ranking = new Ranking(this);
        // console.log("ranking", GameState.ranking.alltime);

        // 状態の初期化
        this.state = STATE.STORY;
        this.change_state();

        // this.add.image(this.game.canvas.width / 2,this.game.canvas.height,'story').setOrigin(0.5,1).setDepth(-1);

        // タイトルに戻る操作の登録
        this.my_input = new MyInput(this);
        this.my_input.registerNextAction(() => this.goto_title());
        this.input.on('pointerdown', this.goto_title, this);
    }

    change_state(){
        if (this.state === STATE.STORY){
            this.show_caption("STORY");
            this.sentenceMgr = new Sentences(this, 
                STORY_SENTENCE,
                  { speed: 1,
                    baseColor: 0xd0d0d0,
                    onFinished: () => {
                            this.time.addEvent({
                                delay: 6000,
                                callback: () => {
                                    this.state = STATE.RANKING_SESSION;
                                    this.change_state();
                                },
                            callbackScope: this
                            }); // End of AddEvent
                    } // End of onFinished
            }); // End of new Sentences
        } else if (this.state === STATE.RANKING_SESSION){
            this.sentenceMgr.clear();
            this.show_caption("SESSION RANKING");
            this.ranking.show_ranking_table(GameState.ranking.session);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_DAILY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_DAILY){
            this.show_caption("DAILY RANKING");
            this.ranking.show_ranking_table(GameState.ranking.daily);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_MONTHLY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_MONTHLY){
            this.show_caption("MONTHLY RANKING");
            // console.log("monthly ranking", GameState.ranking.monthly);
            this.ranking.show_ranking_table(GameState.ranking.monthly);
            this.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.state = STATE.RANKING_ALLTIME;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.RANKING_ALLTIME){
            this.show_caption("ALL-TIME RANKING");
            // console.log("all-time ranking", GameState.ranking.alltime);
            this.ranking.show_ranking_table(GameState.ranking.alltime);
            this.time.addEvent({
                delay: 5000,
                callback: () => {
                    this.state = STATE.HOW_TO_PLAY;
                    this.change_state();
                },
                callbackScope: this
            });
        } else if (this.state === STATE.HOW_TO_PLAY){
            this.ranking.clear_ranking_table();
            this.show_caption("HOW TO PLAY");
            this.sentenceMgr = new Sentences(this,
                HOW_TO_PLAY_SENTENCE,
                   { speed: 2,
                     onFinished: () => {
                        this.time.addEvent({
                            delay: 6000,
                            callback: () => {
                                this.state = STATE.END;
                                this.change_state();
                            },
                        callbackScope: this
                        }); // End of AddEvent
                     } // End of onFinished
            }); // End of new Sentences
        } else if (this.state === STATE.END){
            this.clear_caption();
            this.sentenceMgr.clear();
            this.scene.start('TitleScene');
        }
    }

    update(){
        this.sentenceMgr.update();

        // 隠しキーボード操作
        if (GameState.debug){
            if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
                this.goto_title();
            }
        }
    }

    goto_title(){
        this.scene.start('TitleScene');        
    }

    show_caption(caption){
        this.clear_caption();
        const pos_x = (this.game.canvas.width - caption.length * FONT_SIZE) / 2;
        const text = this.add.bitmapText(pos_x, 20, 'myFont', caption, FONT_SIZE);
        text.setName('captionText');        
    }
    clear_caption(){
        this.children.getAll().forEach(child => {
            if (child.name === 'captionText') {
                child.destroy();
            }
        });
    }

    destroy(){
    }
}