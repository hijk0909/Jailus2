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

    update(time, delta){
        // ◆背景の更新
        GameState.bg.update(time, delta);

        // ◆敵の管理 と プレイヤーとの当たり判定
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            e.update(time, delta);
            if (!e.is_alive()) {
                e.destroy();
                GameState.enemies.splice(i, 1);
                continue;
            }
            if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
                if (MyMath.isRectangleOverlap(e.pos,e.collision,GameState.player.pos,GameState.player.collision)){
                    // console.log("hit enemy");
                    GameState.sound.se_failed.play();
                    if (!GameState.debug){
                        GameState.stage_state = GLOBALS.STAGE_STATE.FAIL;
                        GameState.player.fail();
                    }
                }
            }
        }

        // ◆自弾の管理 と 敵との当たり判定
        for (let i = GameState.bullets_p.length - 1; i >= 0; i--) {
            const pb = GameState.bullets_p[i];
            pb.update(time, delta);
            if (!pb.is_alive()) {
                pb.destroy();
                GameState.bullets_p.splice(i, 1);
                continue;
            }
            for (let j = GameState.enemies.length - 1; j >= 0; j --){
                const e = GameState.enemies[j];

                if (MyMath.isRectangleOverlap(pb.pos, pb.collision, e.pos, e.collision)){

                    if (e.life === -1){
                        // 破壊不可能な敵
                        const eff = new Effect_Ext(this.scene);
                        eff.init(pb.pos);
                        GameState.effects.push(eff);
                        GameState.add_score(e.score);
                    } else {
                        e.life -= 1;
                        if (e.life <= 0){
                            GameState.add_score(e.score);
                            if (e.boss){
                                e.shockwave();
                                if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
                                    // FAILED等の状態ではボスを倒してもクリア扱いしない
                                    GameState.stage_state = GLOBALS.STAGE_STATE.CLEAR;
                                }
                            }
                            e.destroy();
                            GameState.enemies.splice(j,1);

                            GameState.sound.se_explosion.play();
                            const eff = new Effect_Exp(this.scene);
                            eff.init(e.pos);
                            GameState.effects.push(eff);
                        } else {
                            const eff = new Effect_Ext(this.scene);
                            eff.init(pb.pos);
                            GameState.effects.push(eff);
                        }
                    }

                    if (pb.life === -1){
                        // 破壊不可能な自弾（スプレッド）
                    } else {
                        pb.life -= 1;
                        if (pb.life <= 0){
                            pb.alive = false;
                            break;
                        }
                    }
                }
            }
        }

        // ◆敵弾の管理 と プレイヤーとの当たり判定
        for (let i = GameState.bullets_e.length - 1; i >= 0; i--) {
            const b = GameState.bullets_e[i];
            b.update(time, delta);
            if (!b.is_alive()) {
                b.destroy();
                GameState.bullets_e.splice(i, 1);
                continue;
            }
            if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
               if (MyMath.isRectangleOverlap(b.pos,b.collision,GameState.player.pos,GameState.player.collision)){
                    // console.log("hit enemy bullet");
                    GameState.sound.se_failed.play();
                    if (GameState.player.get_barrier() > 0){
                        //バリアを消費して敵弾を消去
                        GameState.player.dec_barrier();
                        b.set_alive(false);
                        const eff = new Effect_Ext(this.scene);
                        eff.init(b.pos);
                        GameState.effects.push(eff);
                    } else {
                        if (!GameState.debug){
                            GameState.stage_state = GLOBALS.STAGE_STATE.FAIL;
                            GameState.player.fail();
                        }
                    }
                }
            }
        }

        // ◆アイテムの管理 と プレイヤーとの当たり判定
        for (let i = GameState.items.length - 1; i >= 0; i--) {
            const item = GameState.items[i];
            item.update(time, delta);
            if (!item.is_alive()) {
                item.destroy();
                GameState.items.splice(i, 1);
                continue;
            }
            if (GameState.stage_state === GLOBALS.STAGE_STATE.PLAYING){
               if (MyMath.isRectangleOverlap(item.pos,item.collision,GameState.player.pos,GameState.player.collision)){
                    item.activate();
                    item.destroy();
                    GameState.items.splice(i,1);                 
                }
            }
        }

        // ◆画面効果の管理
        for (let i = GameState.effects.length - 1; i >= 0; i--) {
            const eff = GameState.effects[i];
            eff.update(time, delta);
            if (!eff.is_alive()) {
                eff.destroy();
                GameState.effects.splice(i, 1);
                continue;
            }
        }

        // ◆生成器（敵）の管理
        for (let i = GameState.spawners.length - 1; i >= 0; i--) {
            const spawner = GameState.spawners[i];
            spawner.update(time, delta);
            if (!spawner.is_alive()) {
                spawner.destroy();
                GameState.spawners.splice(i, 1);
                continue;
            }
        }

        // ◆放出器（画面効果）の管理
        for (let i = GameState.emitters.length - 1; i >= 0; i--) {
            const emitter = GameState.emitters[i];
            emitter.update(time, delta);
            if (!emitter.is_alive()) {
                emitter.destroy();
                GameState.emitters.splice(i, 1);
                continue;
            }
        }

    } // End of update

    destroy_all_enemies(){
        // 全ての敵の削除
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            const e = GameState.enemies[i];
            e.set_alive(false);
            e.destroy();
            GameState.enemies.splice(i, 1);

            const eff = new Effect_Exp(this.scene);
            eff.init(e.pos);
            GameState.effects.push(eff);
        }
        // 全ての弾の消去
        for (let i = GameState.bullets_e.length - 1; i >= 0; i--) {
            const b = GameState.bullets_e[i];
            b.set_alive(false);
            b.destroy();
            GameState.bullets_e.splice(i, 1);

            const eff = new Effect_Ext(this.scene);
            eff.init(b.pos);
            GameState.effects.push(eff);
        }
    }

}