// enemy_5.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const ACCEL = 0.01;
const MAX_SPEED = 10;

// Enemy_5：ニコニコ
export class Enemy_5 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = 1;
        this.life = 3;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(21);
    }

    update(){
        this.pos.x -= this.speed * GameState.ff;
        this.speed = Math.min(MAX_SPEED, this.speed + ACCEL * GameState.ff);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}