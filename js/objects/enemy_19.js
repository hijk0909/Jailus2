// enemy_19.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy } from './enemy.js';


// Enemy_19：火炎竜（親クラス）
export class Enemy_19 extends Enemy {

    constructor(scene){
        super(scene);
        this.angle = 0;
        this.length = 20;
        this.prev = null;
        this.parent = null;
    }

    init(pos){
        super.init(pos);
    }

    update(){
        super.update();
    }

    _update_child(){
        // 継承先で実装
    }

    destroy(){
        super.destroy();
    }
}