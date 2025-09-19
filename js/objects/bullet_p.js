// bullet_p.js
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

export class Bullet_P extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 12;
        this.collision = { width : 32, height : 16};
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
        this.pos.x += this.speed;
        if (this.pos.x > GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}