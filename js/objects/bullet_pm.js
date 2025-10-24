// bullet_pm.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Bullet } from './bullet.js';
import { Bullet_PS } from './bullet_ps.js';

const GRAVITY = 0.3;

// 自弾：投下中ボム
export class Bullet_PM extends Bullet {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.temp_velocity = new Phaser.Math.Vector2(0,0);
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

    update(){
        this.temp_velocity.copy(this.velocity).scale(GameState.ff);
        this.pos.add(this.temp_velocity);
        this.velocity.y += GRAVITY * GameState.ff;
        if (!MyMath.inView(this.pos, this.z)){
            this.alive = false;
        }
        this.sprite.setVisible(true);
        super.update();
    }

    _hit_terrain(){
        this.alive = false;
        const bps = new Bullet_PS(this.scene);
        bps.init(this.pos);
        GameState.bullets_p.push(bps);
    }

    destroy(){
        super.destroy();
    }
}