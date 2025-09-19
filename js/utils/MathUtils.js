// MathUtils.js
import { GLOBALS } from "../GameConst.js";
import { GameState } from '../GameState.js';

export class MyMath {

    // 変換：Z座標から表示用深度へ
    static z_to_depth(z){
        return Math.floor(- z / 10) ;
    }

    // 変換：z座標から縮小率へ
    static z_to_scale(z){
        return (GLOBALS.FIELD.DEPTH - z) / GLOBALS.FIELD.DEPTH;
    }

    // 変換：z座標から縮小率へ（地形のZ座標基準）
    static z_to_sprite_scale(z){
        return (GLOBALS.FIELD.DEPTH - z) / (GLOBALS.FIELD.DEPTH - GLOBALS.LAYER.LAYER3.Z);
    }

    // 変換：グローバルX座標(map4基準)から表示x座標へ
    static global_x_to_disp_x(x, z){
        const diff = x - GLOBALS.FIELD.WIDTH / 2;
        return diff * ((GLOBALS.FIELD.DEPTH - z) / GLOBALS.FIELD.DEPTH) + GLOBALS.FIELD.WIDTH / 2;
    }

    // 変換：グローバルY座標(map4基準)から表示Y座標へ
    static global_y_to_disp_y(y, z){
        const diff = y - GameState.vanish_point;
        return diff * ((GLOBALS.FIELD.DEPTH - z) / GLOBALS.FIELD.DEPTH) + GameState.vanish_point;
    }

    // 取得：グローバル座標(map4基準)とz座標の縮小比率
    static get_disp_ratio(z){
        return (GLOBALS.FIELD.DEPTH - z ) / GLOBALS.FIELD.DEPTH;
    }

    // 変換：表示x座標からグローバルX座標(map4基準)へ
    static disp_x_to_global_x(x, z){
        const diff = x - GLOBALS.FIELD.WIDTH / 2;
        return diff * GLOBALS.FIELD.DEPTH / (GLOBALS.FIELD.DEPTH - z) + GLOBALS.FIELD.WIDTH / 2;
    }

    // 変換：マップ座標（tiledMap）からグローバル座標（map4基準）へ
    static map_pos_to_global_pos(pos){
        const ratio = GLOBALS.FIELD.DEPTH / (GLOBALS.FIELD.DEPTH - GLOBALS.LAYER.LAYER3.Z);
        const x_1 = pos.x - GameState.scroll_x / ratio;
        const x_diff = x_1 - GLOBALS.FIELD.WIDTH / 2;
        const x_2 = x_diff * ratio + GLOBALS.FIELD.WIDTH / 2;
        const y_diff = pos.y - GLOBALS.LAYER.LAYER3.HEIGHT / 2;
        const y_2 = y_diff * ratio + GLOBALS.FIELD.HEIGHT / 2;
        return new Phaser.Math.Vector2(x_2, y_2);
    }

    // 判定：フィールド内（map4基準）に存在しているか
    static inField(pos){
        return (
            pos.x >= ( 0 - GLOBALS.FIELD.MARGIN) &&
            pos.x <= ( GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN) &&
            pos.y >= ( 0 - GLOBALS.FIELD.MARGIN) &&
            pos.y <= ( GLOBALS.FIELD.HEIGHT + GLOBALS.FIELD.MARGIN)
        );
    }

    // 判定：矩形領域が重なっているか
    static isRectangleOverlap(pos1, col1, pos2, col2){
        return Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(pos1.x - col1.width / 2, pos1.y - col1.height / 2, col1.width, col1.height),
            new Phaser.Geom.Rectangle(pos2.x - col2.width / 2, pos2.y - col2.height / 2, col2.width, col2.height));
    }

}