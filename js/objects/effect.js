// effect.js
import { GLOBALS } from '../GameConst.js';
import { Drawable } from './drawable.js';
import { MyMath } from '../utils/MathUtils.js';

export class Effect extends Drawable {

    constructor(scene){
        super(scene);
        this.velocity = new Phaser.Math.Vector2(0,0);
    }

    init(pos){
        super.init(pos);
    }

    update(){
        super.update();
        this.pos.add(this.velocity);
    }

    destroy(){
        super.destroy();
    }
}