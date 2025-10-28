// enemy_17.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 60,
    HARD : 45
}

// Enemy_17： クジラ
export class Enemy_17 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = 5;
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.score = 1000;
        this.life = 24;
        this.collision = { width : 350, height : 150};
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy_17')
        .setOrigin(0.5, 0.5)
        .setFrame(0);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy17")) {
            this.scene.anims.create({key: "anims_enemy17",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy_17',
                    { start: 0, end: 1}),
                frameRate: 2, repeat: -1
            });
        }
        this.sprite.play("anims_enemy17");
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim(0,-120);
            this.shoot_fix(0,-150, -40);
            this.shoot_fix(180,-150, +40);
            if (GameState.difficulty >= 250){
                this.shoot_fix(0,-100, -50);
                this.shoot_fix(180,-100, +50);
            }
            if (GameState.difficulty >= 350){
                this.shoot_fix(0,-50, -60);
                this.shoot_fix(180,-50, +60);
            } 
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}