// spawn.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';
import { MyMath } from '../utils/MathUtils.js';
import { Enemy_1 } from '../objects/enemy_1.js';
import { Enemy_3 } from '../objects/enemy_3.js';
import { Enemy_4 } from '../objects/enemy_4.js';
import { Enemy_5 } from '../objects/enemy_5.js';
import { Enemy_6 } from '../objects/enemy_6.js';
import { Enemy_7 } from '../objects/enemy_7.js';
import { Enemy_8 } from '../objects/enemy_8.js';
import { Enemy_9 } from '../objects/enemy_9.js';
import { Enemy_10 } from '../objects/enemy_10.js';
import { Enemy_11 } from '../objects/enemy_11.js';
import { Enemy_B1 } from '../objects/enemy_b1.js';
import { Enemy_B2 } from '../objects/enemy_b2.js';
import { Enemy_B3 } from '../objects/enemy_b3.js';
import { Enemy_B4 } from '../objects/enemy_b4.js';
import { Enemy_B5 } from '../objects/enemy_b5.js';
import { Enemy_B6 } from '../objects/enemy_b6.js';
import { Enemy_B7 } from '../objects/enemy_b7.js';
import { Enemy_B8 } from '../objects/enemy_b8.js';
import { Item_Point } from '../objects/item_point.js';
import { Item_Runway } from '../objects/item_runway.js';

const EnemyClassList = {
    'enemy_1' : Enemy_1,
    'enemy_3' : Enemy_3,
    'enemy_4' : Enemy_4,
    'enemy_5' : Enemy_5,
    'enemy_6' : Enemy_6,
    'enemy_7' : Enemy_7,
    'enemy_8' : Enemy_8,
    'enemy_9' : Enemy_9,
    'enemy_10': Enemy_10,
    'enemy_11': Enemy_11,
    'enemy_b1': Enemy_B1,
    'enemy_b2': Enemy_B2,
    'enemy_b3': Enemy_B3,
    'enemy_b4': Enemy_B4,
    'enemy_b5': Enemy_B5,
    'enemy_b6': Enemy_B6,
    'enemy_b7': Enemy_B7,
    'enemy_b8': Enemy_B8
}

const SpawnPosList = {
    'map' :         GLOBALS.SPAWN_POS.MAP,
    'right_middle': GLOBALS.SPAWN_POS.RIGHT_MIDDLE,
    'right_random': GLOBALS.SPAWN_POS.RIGHT_RANDOM,
    'right_y':      GLOBALS.SPAWN_POS.RIGHT_Y,
    'right_y_z':    GLOBALS.SPAWN_POS.RIGHT_Y_Z
}

const RUNWAY_HEIGHT = 24;

export class Spawn {

    static battery(scene, obj){
        const pos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2 ,obj.y + obj.height / 2));
        const e3 = new Enemy_3(scene);
        e3.init(pos);
        GameState.enemies.push(e3);
    }

    static item(scene, obj){
        let subtype_val = null;
        if (obj.properties) {
            const prop = obj.properties.find(p => p.name === "subtype");
            if (prop) {
                subtype_val = prop.value;
            }
        }
        // console.log("subtype", subtypeValue);
        const pos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2 ,obj.y + obj.height / 2));
        if (subtype_val === "point"){
            const item = new Item_Point(scene);
            item.init(pos);
            GameState.items.push(item);
        } else if (subtype_val === "runway"){
            const pos2 = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2, obj.y + obj.height - 2));
            const item = new Item_Runway(scene);
            item.init(pos2);
            item.set_collision(obj.width, RUNWAY_HEIGHT);
            GameState.items.push(item);
        }
    }

    static enemy(scene, obj){
        // 座標の計算
        const map_pos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2 ,obj.y + obj.height / 2));
        // パラメータの取り出し
        let val_subtype = "enemy_1";
        let val_z = GLOBALS.LAYER.LAYER3.Z;
        let val_spawn_pos = GLOBALS.SPAWN_POS.RIGHT_MIDDLE;
        if (obj.properties) {
            const prop_subtype = obj.properties.find(p => p.name === "subtype");
            if ( prop_subtype) { val_subtype = prop_subtype.value; }
            const prop_z = obj.properties.find(p => p.name === "z");
            if ( prop_z ) { val_z = parseInt(prop_z.value, 10); }
            const prop_spawn_pos = obj.properties.find(p => p.name === "spawn_pos");
            if ( prop_spawn_pos ) { val_spawn_pos = prop_spawn_pos.value; }
        }

        // 敵の生成
        const EnemyClass = EnemyClassList[val_subtype];
        const enemy = new EnemyClass(scene);
        // 敵の初期位置
        const spawn_pos = SpawnPosList[val_spawn_pos];
        if (spawn_pos === GLOBALS.SPAWN_POS.MAP){
            enemy.init(map_pos);
        } else if (spawn_pos === GLOBALS.SPAWN_POS.RIGHT_MIDDLE){
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, GLOBALS.FIELD.HEIGHT / 2));
        } else if (spawn_pos === GLOBALS.SPAWN_POS.RIGHT_RANDOM){
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, Math.random()*300+150));
        } else if (spawn_pos === GLOBALS.SPAWN_POS.RIGHT_Y){
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, map_pos.y));
        } else if (spawn_pos === GLOBALS.SPAWN_POS.RIGHT_Y_Z){
            enemy.init(new Phaser.Math.Vector2(
                MyMath.disp_x_to_global_x(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, val_z),
                map_pos.y));
            enemy.set_z(val_z);
        }
        GameState.enemies.push(enemy);
        return;
    }

    static spawner(scene, obj){
        const spawner = new Spawner(scene);
        spawner.init(obj);
        GameState.spawners.push(spawner);
    }

} // End of Spawn

class Spawner {
    constructor(scene) {
        this.scene = scene;
        this.alive = true;
        this.obj = null;
        this.duration = 0;  //[sec]
        this.duration_cnt = 0;
        this.interval = 1; //[sec]
        this.interval_cnt = 0;
        this.type = null;
    }

    init(obj){
        this.obj = obj;
        // パラメータの取り出し
        let duration_val = 10;
        let interval_val = 1;
        if (obj.properties) {
            const prop_duration = obj.properties.find(p => p.name === "duration");
            if ( prop_duration) { duration_val = parseInt(prop_duration.value, 10);}
            const prop_interval = obj.properties.find(p => p.name === "interval");
            if ( prop_interval ) { interval_val = parseFloat(prop_interval.value, 10); }
        }
        this.duration = this.duration_cnt = duration_val;
        this.interval = interval_val;
    }

    update(time, delta){
        // console.log("spawn update", this.duration_cnt, this.interval_cnt);
        this.duration_cnt -= delta / 1000;
        if (this.duration_cnt <= 0){
            this.alive = false;
        }
        this.interval_cnt -= delta / 1000;
        if (this.interval_cnt <= 0){
            this.interval_cnt = this.interval;
            Spawn.enemy(this.scene, this.obj);
        }
    }

    is_alive() {
        return this.alive;
    }

    destroy(){
    }

} // End of Spawner
