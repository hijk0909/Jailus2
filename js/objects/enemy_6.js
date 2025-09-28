// enemy_6.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';
import { Bullet_EB } from './bullet_eb.js';

const COOLDOWN_INTERVAL = 45;
const SPEED = 2;

// Enemy_6：移動砲台
export class Enemy_6 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = SPEED;
        this.count = COOLDOWN_INTERVAL;
        this.z = GLOBALS.LAYER.LAYER2.Z;
        this.scale = 2.0;
        this.collision = { width : 0, height : 0};
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(22)
        .setDepth(MyMath.z_to_depth(this.z));
    }

    update(){
        this.pos.x -= this.speed;
        super.update();
        this.count -= 1;
        if (this.count < 0){
            this.count = COOLDOWN_INTERVAL;
            this.shoot_ballistic();
        }
    }

    shoot_ballistic(){
        const beb = new Bullet_EB(this.scene);
        beb.init(this.pos);
        beb.set_ballistic(this.z);
        GameState.bullets_e.push(beb);
    }
    
    destroy(){
        super.destroy();
    }
}