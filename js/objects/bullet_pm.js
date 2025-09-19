// bullet_pm.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';

const GRAVITY = 0.3;

export class Bullet_PM extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.collision = { width : 32, height : 16};
    }

    init(pos){
        super.init(pos);

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_bullet')
        .setOrigin(0.5, 0.5)
        .setFrame(2)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1)
        .setVisible(false);
    }

    set_velocity(vel){
        this.velocity = vel;
    }

    update(){
        // this.pos.x -= GameState.scroll_dx;
        this.pos.add(this.velocity);        
        this.velocity.y += GRAVITY;
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