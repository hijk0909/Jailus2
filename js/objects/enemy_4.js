// enemy.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';

const COOLDOWN_INTERVAL = 30;

// Enemy_4：バキュラ
export class Enemy_4 extends Enemy {

    constructor(scene){
        super(scene);
        this.speed = 5;
        this.life = -1;
        this.score = 10;
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_enemy')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1);

        // アニメーションの設定
        if (!this.scene.anims.exists("anims_enemy4")) {
            this.scene.anims.create({key: "anims_enemy4",
                frames: this.scene.anims.generateFrameNumbers('ss_enemy',
                    { start: 16, end: 20}),
                frameRate: 16, repeat: -1
            });
        }
        this.sprite.play("anims_enemy4");
    }

    update(){
        this.pos.x -= this.speed;
        super.update();
    }

    destroy(){
        super.destroy();
    }
}