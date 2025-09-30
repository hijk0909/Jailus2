// GameScene.js
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

const SPAWN_INTERVAL = 180;
const SPAWN_INTERVAL_3 = 30;
const SPAWN_INTERVAL_5 = 30;

export class Background {
    constructor(scene) {
        this.scene = scene;
        this.stage_data = this.scene.cache.json.get('stage_data');
        this.areas = [];
        this.spawn_counter = SPAWN_INTERVAL;
        for (let stage in this.stageHandlers) {
            this.stageHandlers[stage].create = this.stageHandlers[stage].create.bind(this);
            this.stageHandlers[stage].update = this.stageHandlers[stage].update.bind(this);
            this.stageHandlers[stage].spawn = this.stageHandlers[stage].spawn.bind(this);
        }

    }

    create(){
        const stage_info = this.stage_data.stages.find(s => s.stage === GameState.stage);
        this.areas = stage_info.areas;
        GameState.scroll_x = this.areas[GameState.area - 1];
        // console.log("GameState.scroll_x", GameState.scroll_x);

        // レイヤー画像の初期化
        const ceiling_y = 0;
        this.ceilingLayer = this.scene.add.tileSprite(0, ceiling_y, GLOBALS.LAYER.CEILING.WIDTH, GLOBALS.LAYER.CEILING.HEIGHT, stage_info.ceiling)
            .setOrigin(0)
            .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.CEILING.Z_BOTTOM));

        const floor_y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
        this.floorLayer = this.scene.add.tileSprite(0, floor_y, GLOBALS.LAYER.FLOOR.WIDTH, GLOBALS.LAYER.FLOOR.HEIGHT, stage_info.floor)
            .setOrigin(0)
            .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.FLOOR.Z_TOP));

        const layer1_y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER1.Z);
        this.layer1 = this.scene.add.tileSprite(0, layer1_y, GLOBALS.FIELD.WIDTH, GLOBALS.LAYER.LAYER1.HEIGHT, stage_info.layer1)
            .setOrigin(0)
            .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER1.Z));
        this.layer1.tilePositionX = GameState.scroll_x * (GLOBALS.LAYER.LAYER1.HEIGHT / GLOBALS.FIELD.HEIGHT);

        const layer2_y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER2.Z);
        this.layer2 = this.scene.add.tileSprite(0, layer2_y, GLOBALS.FIELD.WIDTH, GLOBALS.LAYER.LAYER2.HEIGHT, stage_info.layer2)
            .setOrigin(0)
            .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER2.Z));
        this.layer2.tilePositionX = GameState.scroll_x * (GLOBALS.LAYER.LAYER2.HEIGHT / GLOBALS.FIELD.HEIGHT);

        const layer3_y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER3.Z);
        const tilemap = this.scene.make.tilemap({key: stage_info.map});
        const tileset = tilemap.addTilesetImage('bg_tileset', 'bg_tileset_key');
        this.layer3 = tilemap.createLayer('layer_1', tileset, 0, layer3_y);
        this.layer3_pending_objects = tilemap.getObjectLayer("object_1").objects;
        this.layer3.x = - GameState.scroll_x * (GLOBALS.LAYER.LAYER3.HEIGHT / GLOBALS.FIELD.HEIGHT);

        this.layer4 = this.scene.add.tileSprite(0, 0, GLOBALS.FIELD.WIDTH, GLOBALS.LAYER.LAYER4.HEIGHT, stage_info.layer4)
            .setOrigin(0)
            .setDepth(MyMath.z_to_depth(GLOBALS.LAYER.LAYER4.Z));
        this.layer4.tilePositionX = GameState.scroll_x;

        // ステージ毎に定義するcreate処理
        this.stageHandlers[GameState.stage].create();
    }

    update(time, delta){

        if (GameState.scroll){
            GameState.scroll_dx = 1.5 * GameState.ff; //速度(layer4基準)
            GameState.scroll_x += GameState.scroll_dx;  //位置(layer4基準)
            this.area_update();
        } else {
            GameState.scroll_dx = 0;
        }

        // 消失点の移動
        const VANISH_POINT_MIN = 100;
        const VANISH_POINT_MAX = GLOBALS.FIELD.HEIGHT - 100;
        GameState.vanish_point = GameState.player.pos.y / GLOBALS.FIELD.HEIGHT * (VANISH_POINT_MAX - VANISH_POINT_MIN) + VANISH_POINT_MIN;

        this.layer4.tilePositionX += GameState.scroll_dx;
        this.layer3.x = - GameState.scroll_x * (GLOBALS.LAYER.LAYER3.HEIGHT / GLOBALS.FIELD.HEIGHT);
        this.layer3.y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER3.Z);
        this.layer2.tilePositionX += GameState.scroll_dx * (GLOBALS.LAYER.LAYER2.HEIGHT / GLOBALS.FIELD.HEIGHT);
        this.layer2.y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER2.Z);
        this.layer1.tilePositionX += GameState.scroll_dx * (GLOBALS.LAYER.LAYER1.HEIGHT / GLOBALS.FIELD.HEIGHT);
        this.layer1.y = MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.LAYER1.Z);

        // ステージ毎に定義するupdate処理
        this.stageHandlers[GameState.stage].update(time, delta);

        // ステージ毎に定義する、マップに紐づかない敵の生成処理
        this.stageHandlers[GameState.stage].spawn();

        // ◆マップに紐づいたオブジェクトの生成処理
        const process_factories = {
            battery : (obj) => this.spawn_battery(obj),
            item    : (obj) => this.spawn_item(obj),
            enemy   : (obj) => this.spawn_enemy(obj),
            event   : (obj) => this.trigger_event(obj)
        };

        this.layer3_pending_objects = this.layer3_pending_objects.filter(obj => {
            const rx = MyMath.global_x_to_disp_x(GameState.scroll_x + GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN * MyMath.get_disp_ratio(GLOBALS.LAYER.LAYER3.Z), GLOBALS.LAYER.LAYER3.Z);
            if ((obj.x + obj.width /2) < rx){
                if (process_factories[obj.type]){
                    process_factories[obj.type](obj);
                }
                return false; //リストから削除
            }
            return true;
        });

    } // End of Update

    area_reset(){
        for (let i = this.areas.length - 1; i >= 0; i--){
            if (this.areas[i] < GameState.scroll_x){
                GameState.area = i + 1;
                break;
            }
        }
    }

    area_update(){
        if (GameState.area < this.areas.length){
            if (this.areas[GameState.area] < GameState.scroll_x){
                GameState.area++;
            }
        }
    }

    // ◆マップに紐づいた生成処理
    spawn_battery(obj){
        const pos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2 ,obj.y + obj.height / 2));
        const e3 = new Enemy_3(this.scene);
        e3.init(pos);
        GameState.enemies.push(e3);
    }

    spawn_item(obj){
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
            const item = new Item_Point(this.scene);
            item.init(pos);
            GameState.items.push(item);
        } else if (subtype_val === "runway"){
            const pos2 = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2, obj.y + obj.height - 2));
            const item = new Item_Runway(this.scene);
            item.init(pos2);
            item.set_collision(obj.width, 4);
            GameState.items.push(item);
        }
    }

    spawn_enemy(obj){
        const pos = MyMath.map_pos_to_global_pos(new Phaser.Math.Vector2(obj.x + obj.width / 2 ,obj.y + obj.height / 2));
        let subtype_val = null;
        let z_val = null;
        if (obj.properties) {
            const prop_subtype = obj.properties.find(p => p.name === "subtype");
            if ( prop_subtype) { subtype_val = prop_subtype.value; }
            const prop_z = obj.properties.find(p => p.name === "z");
            if ( prop_z ) { z_val = parseInt(prop_z.value, 10); }
        }
        // console.log("subtype", subtypeValue);
        if (subtype_val === "enemy_5"){
            const enemy = new Enemy_5(this.scene);
            // マップに括り付けた位置に設定する
            enemy.init(pos);
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_6"){
            // console.log("z", z_val);
            const enemy = new Enemy_6(this.scene);
            // 奥行に関わらず画面右端に見える位置から登場する
            const pos_2 = new Phaser.Math.Vector2(
                MyMath.disp_x_to_global_x(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, z_val),
                pos.y);
            enemy.init(pos_2);
            enemy.set_z(z_val);
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b1"){
            // console.log("enemy_b1");
            const enemy = new Enemy_B1(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b2"){
            const enemy = new Enemy_B2(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b3"){
            const enemy = new Enemy_B3(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b4"){
            const enemy = new Enemy_B4(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b5"){
            const enemy = new Enemy_B5(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b6"){
            const enemy = new Enemy_B6(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b7"){
            const enemy = new Enemy_B7(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        } else if (subtype_val === "enemy_b8"){
            console.log("enemy_b8");
            const enemy = new Enemy_B8(this.scene);
            enemy.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
            GameState.enemies.push(enemy);
        }
    }

    trigger_event(obj){
        let subtype_val = null;
        if (obj.properties) {
            const prop = obj.properties.find(p => p.name === "subtype");
            if (prop) {
                subtype_val = prop.value;
            }
        }
        if (subtype_val === "scroll_stop"){
            GameState.scroll = false;
        }
    }

    // ステージ毎の create(), update() 処理
    stageHandlers = {
        1: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);
                }    
            }
        },
        2: {
            create() {
                // 背景：スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

                // 背景：波状シェーダの初期化とレイヤーへの設定
                this.layer4.setPipeline('Ripple');
                this.ripple = this.scene.renderer.pipelines.get('Ripple');
                this.ripple.set1f('time', 0);
                this.ripple.set1f('frequency', 20.0);
                this.ripple.set1f('amplitude', 0.060);
                this.ripple.set1f('alpha', 0.6);
            },
            update(time, delta) {
                // 波状シェーダーのパラメータ更新
                this.ripple.set1f('time', time * 0.003);

                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uOffsetY', (GameState.scroll_x || 0) / GLOBALS.FIELD.HEIGHT * 4);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uOffsetY', (GameState.scroll_x || 0) / GLOBALS.FIELD.HEIGHT * 4);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter--;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);

                    const e4 = new Enemy_4(this.scene);
                    e4.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, Math.random()*300+150));
                    GameState.enemies.push(e4);
                }       
            }
        },
        3: {
            create() {
                // レイヤーの設定
                this.layer4.setAlpha(0.7);

                // 背景：スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

                // 背景：波状シェーダの初期化とレイヤーへの設定
                this.layer1.setPipeline('Ripple');
                this.ripple = this.scene.renderer.pipelines.get('Ripple');
                this.ripple.set1f('time', 0);
                this.ripple.set1f('frequency', 30.0);
                this.ripple.set1f('amplitude', 0.020);
                this.ripple.set1f('alpha', 0.8);
            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uOffsetY', - (GameState.scroll_x || 0) / GLOBALS.FIELD.HEIGHT * 0.5);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uOffsetY', (GameState.scroll_x || 0) / GLOBALS.FIELD.HEIGHT * 0.5);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));

                // 波状シェーダーのパラメータ更新
                this.ripple.set1f('time', time * 0.003);
            },
            spawn(){
                this.spawn_counter--;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL_3;

                    const e7 = new Enemy_7(this.scene);
                    e7.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, Math.random()*300+150));
                    GameState.enemies.push(e7);
                }       
            }
        },
        4: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);
                }    
            }
        },
        5: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL_5;

                    const e8 = new Enemy_8(this.scene);
                    e8.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e8);
                }    
            }
        },
        6: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);
                }    
            }
        },
        7: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);
                }    
            }
        },
        8: {
            create() {
                // レイヤーの設定
                this.layer2.setAlpha(0.8);
                this.layer4.setAlpha(0.8);

                // スクロールシェーダの初期化とレイヤーへの設定
                const scale = MyMath.z_to_scale(GLOBALS.LAYER.LAYER1.Z);

                this.ceilingLayer.setPipeline('ScrollCeil'); // シェーダ
                this.scrollCeil = this.scene.renderer.pipelines.get('ScrollCeil');
                this.scrollCeil.set1f('uScaleTop', 1.0);
                this.scrollCeil.set1f('uScaleBottom', scale);

                this.floorLayer.setPipeline('ScrollFloor');  //シェーダ
                this.scrollFloor = this.scene.renderer.pipelines.get('ScrollFloor');
                this.scrollFloor.set1f('uScaleTop', scale);
                this.scrollFloor.set1f('uScaleBottom', 1.0);

            },
            update(time, delta) {
                // スクロールシェーダのパラメータ更新
                this.ceilingLayer.y = 0;
                this.scrollCeil.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollCeil.set1f('uSqueeze', (MyMath.global_y_to_disp_y(0, GLOBALS.LAYER.CEILING.Z_BOTTOM) / GLOBALS.LAYER.CEILING.HEIGHT));

                this.floorLayer.y = MyMath.global_y_to_disp_y(GLOBALS.FIELD.HEIGHT, GLOBALS.LAYER.FLOOR.Z_TOP);
                this.scrollFloor.set1f('uOffsetX', (GameState.scroll_x || 0) / GLOBALS.FIELD.WIDTH);
                this.scrollFloor.set1f('uSqueeze', ((GLOBALS.FIELD.HEIGHT - this.floorLayer.y) / GLOBALS.LAYER.FLOOR.HEIGHT));
            },
            spawn(){
                this.spawn_counter -= 1;
                if (this.spawn_counter < 0){
                    this.spawn_counter = SPAWN_INTERVAL;

                    const e1 = new Enemy_1(this.scene);
                    e1.init(new Phaser.Math.Vector2(GLOBALS.FIELD.WIDTH + GLOBALS.FIELD.MARGIN, 300));
                    GameState.enemies.push(e1);
                }    
            }
        }
    }

    // ◆表示座標から地形のタイル番号を取得
    get_terrain(x,y){
        const disp_x = MyMath.global_x_to_disp_x(x,GLOBALS.LAYER.LAYER3.Z);
        const disp_y = MyMath.global_y_to_disp_y(y,GLOBALS.LAYER.LAYER3.Z);
        // console.log("get_terrain",Math.floor(x), Math.floor(y), Math.floor(disp_x), Math.floor(disp_y));
        return this.layer3.getTileAtWorldXY(disp_x, disp_y);
    }

    // ◆表示座標基準の矩形領域内の地形の有無を判定
    is_terrain(pos, col){
        const rectX = MyMath.global_x_to_disp_x(pos.x - col.width / 2,  GLOBALS.LAYER.LAYER3.Z);
        const rectY = MyMath.global_y_to_disp_y(pos.y - col.height / 2, GLOBALS.LAYER.LAYER3.Z);
        const rectW = col.width * MyMath.get_disp_ratio(GLOBALS.LAYER.LAYER3.Z);
        const rectH = col.height * MyMath.get_disp_ratio(GLOBALS.LAYER.LAYER3.Z);
        const tiles = this.layer3.getTilesWithinWorldXY(rectX, rectY, rectW, rectH);
        return tiles.some(tile => tile.index !== -1);
    }

    destroy(){
        if (this.ceilingLayer){
            this.ceilingLayer.destroy();
        }
        if (this.floorLayer){
            this.floorLayer.destroy();
        }
        if (this.layer1){
            this.layer1.destroy();
        }
        if (this.layer2){
            this.layer2.destroy();
        }
        if (this.layer3){
            this.layer3.destroy();
        }
        if (this.layer3_pending_objects){
            this.layer3_pending_objects = null;
        }
        if (this.layer4){
            this.layer4.destroy();
        }
    } // End of destroy()
}