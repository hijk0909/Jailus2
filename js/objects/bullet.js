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
    }

    init(pos){
        super.init(pos);
    }

    set_type(type){
        this.type = type;
    }

    set_velocity(pos1, pos2){
        this.velocity = pos2.clone().subtract(pos1).normalize().scale(this.speed);
    }


    update(){
        //地形との当たり判定
        const tile = GameState.bg.get_terrain(this.pos.x, this.pos.y);
        if (tile && tile.index !== -1) {
            this.alive = false;

            const eff = new Effect_Ext(this.scene);
            eff.init(this.pos);
            GameState.effects.push(eff);
        }
        super.update();
    }

    destroy(){
        super.destroy();
    }
}