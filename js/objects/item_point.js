// item_point.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Item } from './item.js';
import { Effect_Text } from './effect_text.js';

export class Item_Point extends Item {

    constructor(scene){
        super(scene);
        this.collision = { width : 32, height : 32};
    }

    init(pos){
        super.init(pos);

        // スプライトの設定
        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, 'ss_item')
        .setOrigin(0.5, 0.5)
        .setFrame(4)
        .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER3.Z) - 1);
    }

    update(){
        super.update();
    }

    effect(){
        const score = (Math.floor(Math.random()*10)+1)*1000;
        const eff = new Effect_Text(this.scene);
        eff.init(GameState.player.pos);
        eff.set_text(score.toString());
        GameState.effects.push(eff);
        GameState.add_score(score);
    }

    destroy(){
        super.destroy();
    }
}