// bullet_e.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

export class Bullet_E extends Bullet {

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
        .setFrame(4)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) -1)
        .setVisible(false);

        // アニメーションの設定
        if (!this.scene.anims.exists('bullet_e_anims')) {
            this.scene.anims.create({key:'bullet_e_anims',
                frames: this.scene.anims.generateFrameNumbers('ss_bullet', { start: 4, end: 7 }),
                frameRate: 18, repeat: -1
            });
        }
        this.sprite.play('bullet_e_anims');
    }

    update(){
        // console.log("GameState.ff", GameState.ff);
        // this.pos.add(this.velocity.scale(GameState.ff));
        this.temp_velocity.copy(this.velocity).scale(GameState.ff);
        this.pos.add(this.temp_velocity);
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