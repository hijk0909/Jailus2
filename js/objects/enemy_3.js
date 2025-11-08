// enemy_3.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = {
    EASY : 180,
    HARD : 60
}

// Enemy_3：固定砲台
export class Enemy_3 extends Enemy {

    constructor(scene){
        super(scene);
        this.shot_count = COOLDOWN_INTERVAL.EASY;
        this.life = 2;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(24);

        // アニメーションの定義
        if (!this.scene.anims.exists("anims_enemy3")) {
            this.scene.anims.create({
                key: "anims_enemy3",
                defaultTextureKey: 'ss_enemy',
                frames: [
                    { frame: 24, duration: 900 },
                    { frame: 25, duration: 150 },
                    { frame: 26, duration: 900 },
                    { frame: 25, duration: 150 }
                ],
                repeat: -1
            });
        }
        this.sprite.play("anims_enemy3");
    }

    update(){
        this.pos.x -= GameState.scroll_dx;
        this.shot_count -= GameState.ff;
        if (this.shot_count < 0){
            this.shot_count = MyMath.lerp_by_difficulty(COOLDOWN_INTERVAL.EASY, COOLDOWN_INTERVAL.HARD);
            this.shoot_aim();
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}