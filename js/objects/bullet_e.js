// bullet_e.js
import { GLOBALS } from '../GameConst.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

export class Bullet_E extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 5;
        this.collision = { width : 16, height : 16};
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(1)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) -1)
        .setVisible(false);
    }

    update(){
        this.pos.add(this.velocity);
        if (!MyMath.inField(this.pos)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    destroy(){
        super.destroy();
    }
}