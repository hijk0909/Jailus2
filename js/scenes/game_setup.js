// game_setup.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { Player } from '../objects/player.js';
import { Enemy } from '../objects/enemy.js';

export class Setup {
    constructor(scene) {
        this.scene = scene;
    }

    create(){
        // プレイヤー
        GameState.player = new Player(this.scene);
        GameState.player.init(new Phaser.Math.Vector2(-100, 300));
    }

    clean_up(){
        // 背景
        if (GameState.bg){
            GameState.bg.destroy();
        }

        // 自機
        if (GameState.player){
            GameState.player.destroy();
        }

        // 敵機
        for (let i = GameState.enemies.length - 1; i >= 0; i--) {
            GameState.enemies[i].destroy();
            GameState.enemies.splice(i, 1);
        }
        GameState.enemies = [];

        // 敵弾
        for (let i = GameState.bullets_e.length - 1; i >= 0; i--) {
            GameState.bullets_e[i].destroy();
            GameState.bullets_e.splice(i, 1);
        }
        GameState.bullets_e = [];

        // 自弾
        for (let i = GameState.bullets_p.length - 1; i >= 0; i--) {
            GameState.bullets_p[i].destroy();
            GameState.bullets_p.splice(i, 1);
        }
        GameState.bullets_p = [];

        // アイテム
        for (let i = GameState.items.length - 1; i >= 0; i--) {
            GameState.items[i].destroy();
            GameState.items.splice(i, 1);
        }
        GameState.items = [];

        // 画面効果
        for (let i = GameState.effects.length - 1; i >= 0; i--){
            GameState.effects[i].destroy();
            GameState.effects.splice(i,1);
        }
        GameState.effects = [];
    } // End of clean_up()
}