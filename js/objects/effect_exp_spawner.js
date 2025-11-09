// effect.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Effect } from './effect.js';
import { Effect_Exp } from './effect_exp.js';
import { MyMath } from '../utils/MathUtils.js';

const NUM_EXPLOSION = 8;
const SPAWN_PERIOD = 10;

export class Effect_Exp_Spawner extends Effect {

    constructor(scene){
        super(scene);
        this.num_counter = NUM_EXPLOSION;
        this.period_counter = SPAWN_PERIOD;
        this.width = 128;
        this.height = 128;

    }

    init(pos){
        super.init(pos);        
    }

    set_area(width, height){
        this.width = width;
        this.height = height;

    }

    update(){
        super.update();

        this.period_counter -= GameState.ff;
        if (this.period_counter < 0){
            this.period_counter = SPAWN_PERIOD;

            const pos = this.pos.clone();
            pos.x += this.width * (Math.random() - 0.5);
            pos.y += this.height * (Math.random() - 0.5);

            GameState.sound.se_explosion.play();
            const eff = new Effect_Exp(this.scene);
            eff.init(pos);
            GameState.effects.push(eff);

            this.num_counter -= 1;
            if (this.num_counter < 0){
                this.alive = false;
            }
        }
    }

    destroy(){
        super.destroy();
    }
}