// enemy_19.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy } from './enemy.js';
import { Enemy_19_head } from './enemy_19_head.js';
import { Enemy_19_body } from './enemy_19_body.js';
import { Effect_Exp } from './effect_exp.js';

const NUM_CHILDREN = 9;
const PARTS_CLASS_LIST = [
    Enemy_19_head,
    Enemy_19_body,
    Enemy_19_body, 
    Enemy_19_body,
    Enemy_19_body,
    Enemy_19_body,
    Enemy_19_body,
    Enemy_19_body,
    Enemy_19_body
];
const PARTS_FRAME_LIST = [76,77,78,77,77,77,78,77,79];
const INITIAL_LENGTH = 3;

// Enemy_19：火炎竜（全体管理クラス）
export class Enemy_19a extends Enemy {

    constructor(scene){
        super(scene);
        this.life = 28;
        this.collision = { width : 0, height : 0};
        this.children = [NUM_CHILDREN];
    }

    init(pos){
        super.init(pos);
        let prev = null;
        for (let i = 0 ; i < NUM_CHILDREN; i++){
            const parts_class = PARTS_CLASS_LIST[i];
            const child = new parts_class(this.scene);
            child.parent = this;
            child.prev = prev;
            const cpos = pos.clone();
            cpos.x += i * INITIAL_LENGTH;
            child.init(cpos);
            child.sprite.setFrame(PARTS_FRAME_LIST[i]);
            GameState.enemies.push(child);
            this.children[i] = child;
            prev = child;
        }
    }

    hit(amount){
        // console.log("life", amount, this.life);
        super.hit(amount);
        if (this.life <= 0){
            // ライフが尽きたら全ての子パーツを削除
            for (let i = 0 ; i < NUM_CHILDREN; i++){
                const child = this.children[i];

                GameState.sound.se_explosion.play();
                const eff = new Effect_Exp(this.scene);
                eff.init(child.pos);
                GameState.effects.push(eff);

                child.alive = false;
            }
            this.alive = false;
        }
    }

    update(){
        let isComplete = true;
        for (let i = 0 ; i < NUM_CHILDREN; i++){
            const child = this.children[i];
            if (child && child.alive){
                child._update_child();
            } else {
                isComplete = false;
            }
        }
        if (!isComplete){
            // パーツの一部でも（画面外に行く等で）欠けたら全体を削除
            for (let i = 0 ; i < NUM_CHILDREN; i++){
                const child = this.children[i];
                child.alive = false;
            }
            this.alive = false;
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}