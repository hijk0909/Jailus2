// game_exec.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Effect_Exp } from '../objects/effect_exp.js';
import { Effect_Ext } from '../objects/effect_ext.js';

export class Exec {
    constructor(scene) {
        this.scene = scene;
    }

    update(){

        // 敵の管理 と プレイヤーとの当たり判定
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            e.update();
            if (!e.is_alive()) {
                e.destroy();
                GameState.enemies.splice(i, 1);
                continue;
            }
            if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
                if (MyMath.isRectangleOverlap(e.pos,e.collision,GameState.player.pos,GameState.player.collision)){
                    // console.log("hit enemy");
                    GameState.stage_state = GLOBALS.STAGE_STATE.FAIL;
                    GameState.player.fail();
                }
            }
        }

        // 自弾の管理 と 敵との当たり判定
        for (let i = GameState.bullets_p.length - 1; i >= 0; i--) {
            const pb = GameState.bullets_p[i];
            pb.update();
            if (!pb.is_alive()) {
                pb.destroy();
                GameState.bullets_p.splice(i, 1);
                continue;
            }
            for (let j = GameState.enemies.length - 1; j >= 0; j --){
                const e = GameState.enemies[j];

                if (MyMath.isRectangleOverlap(pb.pos, pb.collision, e.pos, e.collision)){

                    if (e.life === -1){
                        // 破壊不可能敵
                        const eff = new Effect_Ext(this.scene);
                        eff.init(e.pos);
                        GameState.effects.push(eff);
                    } else {
                        e.life -= 1;
                        if (e.life === 0){
                            e.destroy();
                            GameState.enemies.splice(j,1);

                            const eff = new Effect_Exp(this.scene);
                            eff.init(e.pos);
                            GameState.effects.push(eff);
                        } else {
                            const eff = new Effect_Ext(this.scene);
                            eff.init(e.pos);
                            GameState.effects.push(eff);
                        }
                    }

                    pb.destroy();
                    GameState.bullets_p.splice(i, 1);
                    break;
                }
            }
        }

        // 敵弾の管理 と プレイヤーとの当たり判定
        for (let i = GameState.bullets_e.length - 1; i >= 0; i--) {
            const b = GameState.bullets_e[i];
            b.update();
            if (!b.is_alive()) {
                b.destroy();
                GameState.bullets_e.splice(i, 1);
                continue;
            }
            if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
               if (MyMath.isRectangleOverlap(b.pos,b.collision,GameState.player.pos,GameState.player.collision)){
                    // console.log("hit enemy bullet");
                    GameState.stage_state = GLOBALS.STAGE_STATE.FAIL;
                    GameState.player.fail();
                }
            }
        }

        // 画面効果の管理
        for (let i = GameState.effects.length - 1; i >= 0; i--) {
            const eff = GameState.effects[i];
            eff.update();
            if (!eff.is_alive()) {
                eff.destroy();
                GameState.effects.splice(i, 1);
                continue;
            }
        }

    } // End of update
}