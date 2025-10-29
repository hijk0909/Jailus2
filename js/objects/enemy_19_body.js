// enemy_19_body.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Enemy_19 } from './enemy_19.js';

const STIFFNESS = 0.02;
const DAMPING = 0.9;
const IDEAL_LENGTH = 52;

// Enemy_19_body：火炎竜（胴体クラス）
export class Enemy_19_body extends Enemy_19 {

    constructor(scene){
        super(scene);
        this.angle = 180;
        this.length = 20;
        this.prev = null;
        this.parent = null;
        this.life = -1;
        this.velocity = new Phaser.Math.Vector2(-1, 0);
        this.vy = 0;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(77);
    }

    update(){
        super.update();
    }

    _update_child(){
        let dx = this.prev.pos.x - this.pos.x;
        let dy = this.prev.pos.y - this.pos.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        let force = (dist - IDEAL_LENGTH) * STIFFNESS;

        this.velocity.x += (dx / dist) * force;
        this.velocity.y += (dy / dist) * force;
        this.velocity.x *= DAMPING;
        this.velocity.y *= DAMPING;
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        if (this.sprite){
            this.sprite.angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx)) - 180;
        }
    }

    hit(amount){
        this.parent.hit(1);
        if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING &&
            GameState.difficulty >= GLOBALS.DIFFICULTY.COUNTER_BULLET){
            // 打ち返し弾
            this.shoot_aim();
        }
        // super.hit(amount);
    }

    destroy(){
        super.destroy();
    }
}