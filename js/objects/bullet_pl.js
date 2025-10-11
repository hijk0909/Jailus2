// bullet_p.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

const X_MARGIN = 70;

// 自弾：レーザー
export class Bullet_PL extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 12;
        this.collision = { width : 32, height : 16};
        this.life = 1;
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(0)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1)
        .setVisible(false);
    }

    update(){
        this.pos.x += this.speed * GameState.ff;
        if (this.pos.x > GLOBALS.FIELD.WIDTH + X_MARGIN){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}