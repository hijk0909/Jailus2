// bullet.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Drawable } from './drawable.js';
import { Effect_Ext } from './effect_ext.js';
import { MyMath } from '../utils/MathUtils.js';

export class Bullet extends Drawable {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
        this.speed = 10;
        this.life = 1;
    }

    init(pos){
        super.init(pos);
    }

    set_type(type){
        this.type = type;
    }

    set_velocity(pos1, pos2, angle = 0){
        const direction = pos2.clone().subtract(pos1).normalize();
        direction.rotate(Phaser.Math.DegToRad(angle));
        this.velocity = direction.scale(this.speed);
    }

    update(){
        super.update();
        //地形との当たり判定
        if (this.z === GLOBALS.LAYER.LAYER3.Z){
            if (GameState.bg.is_terrain_at_point(this.pos.x, this.pos.y)){
                this._hit_terrain();
            }
        }
    }

    _hit_terrain(){
        this.alive = false;
        const eff = new Effect_Ext(this.scene);
        eff.init(this.pos);
        GameState.effects.push(eff);
    }

    destroy(){
        super.destroy();
    }
}