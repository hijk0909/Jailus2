// item_port.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Item } from './item.js';
import { Effect_Text } from './effect_text.js';

export class Item_Runway extends Item {

    constructor(scene){
        super(scene);
        this.collision = { width : 32, height : 24};
        this.grahpics_r = null;
        this.z = GLOBALS.LAYER.LAYER3.Z;
        this.color_counter = 0;
    }

    init(pos){
        super.init(pos);
        // Runway描画用
        this.graphics_r = this.scene.add.graphics().setDepth(MyMath.z_to_depth(this.z));
        // this.graphics = this.scene.add.graphics().setDepth(3);
    }

    set_collision(obj_width, obj_height){
        // console.log("obj_width", obj_width);
        this.collision = { width : obj_width, height : obj_height};
    }

    update(){
        this.color_counter = (this.color_counter + 13 * GameState.ff) % 360;
        const phaserColorInstance = Phaser.Display.Color.HSLToColor(this.color_counter / 360, 1, 0.5);
        const color = phaserColorInstance.color32;

        this.graphics_r.clear();
        this.graphics_r.lineStyle(8, color);
        this.graphics_r.strokeRect(
            MyMath.global_x_to_disp_x(this.pos.x - this.collision.width / 2, this.z),
            MyMath.global_y_to_disp_y(this.pos.y - this.collision.height / 2, this.z),
            this.collision.width * MyMath.get_disp_ratio(this.z),
            this.collision.height * MyMath.get_disp_ratio(this.z)
        )
        super.update();
    }

    activate(){
        const eff = new Effect_Text(this.scene);
        eff.init(GameState.player.pos);
        eff.set_text("Barrier");
        GameState.effects.push(eff);
        GameState.barrier = GLOBALS.BARRIER_MAX;
        GameState.player.set_barrier();
        GameState.sound.se_barrier.play();
    }

    destroy(){
        if ( this.graphics_r ){
            this.graphics_r.destroy();
            this.graphics_r = null;
        }
        super.destroy();
    }
}