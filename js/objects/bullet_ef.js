// bullet_e.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

export class Bullet_EF extends Bullet {
// 敵・火炎弾

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.temp_velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 5;
        this.collision = { width : 16, height : 16};
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(16)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) -1)
        .setVisible(false);

        // アニメーションの設定
        if (!this.scene.anims.exists('bullet_ef_anims')) {
            this.scene.anims.create({key:'bullet_ef_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_bullet', { start: 16, end: 17 }),
                frameRate: 18, repeat: -1
            });
        }
        this.sprite.play('bullet_ef_anims');
    }

    update(){
        this.temp_velocity.copy(this.velocity).scale(GameState.ff);
        this.pos.add(this.temp_velocity);
        this.sprite.angle = this.angle + 90;
        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}