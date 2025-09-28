// item_point.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Item } from './item.js';

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

    destroy(){
        super.destroy();
    }
}