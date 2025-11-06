// enemy_23.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 120,
    HARD : 45
}

const STEP_ANGLE = 0.5;

// Enemy_23：追っかけ宇宙船
export class Enemy_23 extends Enemy {
   
    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.angle = 180;
        this.speed = 3.5;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(84);

    }

    update(){

        this.angle = MyMath.rotate_towards_target(this.angle, this.pos, GameState.player.pos, STEP_ANGLE);
        if (this.sprite){
            this.sprite.angle = this.angle + 90;
        }
        const angleRad = Phaser.Math.DegToRad(this.angle);
        this.pos.x += Math.cos(angleRad) * this.speed * GameState.ff;
        this.pos.y += Math.sin(angleRad) * this.speed * GameState.ff;

        super.update();

        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_fix(this.angle + 90);
        }
    }

    destroy(){
        super.destroy();
    }
}