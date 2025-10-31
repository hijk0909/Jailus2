// enemy_22.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { Enemy_22a } from './enemy_22a.js';

const SPAWN_INTERVAL = 20;
const SPAWN_NUM = 10;

// Enemy_22： 脳みそ（生成器）
export class Enemy_22 extends Enemy {

    constructor(scene){
        super(scene);
        this.collision = { width : 0, height : 0};
        this.spawn_count = 0;
        this.spawn_num = SPAWN_NUM;
    }

    init(pos){
        super.init(pos);
    }

    update(){
        this.spawn_count -= GameState.ff;
        if (this.spawn_count < 0){
            this.spawn_num -= 1;
            if (this.spawn_num <= 0){
                this.alive = false;
            } else {
                this.spawn_count = SPAWN_INTERVAL;            
                const child = new Enemy_22a(this.scene);
                child.init(this.pos);
                GameState.enemies.push(child);
            }
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}