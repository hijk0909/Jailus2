// enemy_15.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy } from './enemy.js';

// Enemy_15：植物砲台（親クラス）
export class Enemy_15 extends Enemy {

    constructor(scene){
        super(scene);
        this.angle = 0;
        this.length = 20;
        this.parent = null;
        this.child = null;
        this.energy = 0;
    }

    init(pos){
        super.init(pos);
    }

    update(){
        super.update();
    }

    destroy(){
        if (this.parent){
            this.parent.child = null;
        }
        if (this.child) {
            this.child.parent = null;
            this.child.energy = 0;

            // let child = this.child;
            // while (child) {
            //     child.energy = 0;
            //     child = child.child;
            // }
        }
        super.destroy();
    }
}