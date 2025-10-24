// NameEntryScene.js
import { GameState } from '../GameState.js';
import { GLOBALS } from '../GameConst.js';
import { Ranking } from './ranking.js';
import { MyInput } from '../utils/InputUtils.js';

export class NameEntryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NameEntryScene' });
    }

    create(){
        // ステージ表示
        this.stage = (GameState.stage > GLOBALS.STAGE_MAX) ? "ALL" : GameState.stage;

        //ランキング画面
        this.ranking = new Ranking(this);
        this.rank = Ranking.get_new_rank(GameState.ranking.session, GameState.score);
        GameState.ranking.session = Ranking.insert_temp_score(GameState.ranking.session, GameState.score, this.stage);
        this.ranking.show_ranking_table(GameState.ranking.session);
        //ネームエントリ画面（キーボード）
        this.name_entry = new name_entry(this, (name, score, stage) => {this.set_ranking(name, score, stage);});
        this.focus_pos = this.ranking.get_name_position(this.rank);
        this.name_entry.set_focus_pos(this.focus_pos);

        GameState.sound.bgm_name_entry.play();
      }

    set_ranking(name){
        Ranking.update_name(GameState.ranking.session, this.rank, name);
        this.ranking.show_ranking_table(GameState.ranking.session);
        Ranking.set_net_ranking(name, GameState.score, this.stage);
        GameState.get_ranking = true; //Attarck画面でのランキング再取得を許可
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.goto_title();
            },
            callbackScope: this
        });
    }

    goto_title(){
        GameState.sound.bgm_name_entry.stop();
        this.scene.start('TitleScene');
    }

    update(){
        this.name_entry.update();
    }

    destroy(){
        this.ranking.destroy();
        this.name_entry.destroy();
    }
}

// ネームエントリー画面描画
const KEY_SIZE = 48;
const KEY_COL = 10;
const KEY_ROW = 4;
const CURSOR_ALPHA = 0.9;
const FOCUS_COLOR = 0xff0000;
const FOCUS_COUNT_MAX = 60;
const NAME_MAX = 8;
const KEYBOARD = [
  ["0","1","2","3","4","5","6","7","8","9"],
  ["A","B","C","D","E","F","G","H","I","J"],
  ["K","L","M","N","O","P","Q","R","S","T"],
  ["U","V","W","X","Y","Z"," ","."," "," "],
];

class name_entry{
    constructor(scene, set_ranking){
        this.scene = scene;
        this.set_ranking = set_ranking; //コールバック
        this.visible = true;
        this.org_x = (this.scene.game.canvas.width - 480) / 2;
        this.org_y = 400;
        // 入力ユーティリティクラス
        this.my_input = new MyInput(this.scene);

        this.focus_pos = new Phaser.Math.Vector2(0.0);
        this.keyboard = this.scene.add.image(this.org_x,this.org_y,'keyboard').setOrigin(0,0)
                .setInteractive()
                .on('pointerdown', (pointer, localX, localY) => {this.cursor_move(localX, localY);})
                .on('pointermove', (pointer, localX, localY) => {this.cursor_move(localX, localY);});
        this.cursor_loc = new Phaser.Math.Vector2(0,1);
        this.cursor_sprite = this.scene.add.sprite(this.org_x, this.org_y, "cursor")
            .setOrigin(0,0) .setVisible(false);
        this.draw_cursor();
        this.graphics = this.scene.add.graphics().setDepth(3);
        this.focus_loc = 0;
        this.focus_count = 0;
        this.focus_count_max = 120;
        this.name = "       ";
        this.nameText = this.scene.add.bitmapText(this.focus_pos.x, this.focus_pos.y, 'myFont', this.name, 16);

        // 押下時一回のみ反応させるためのフラグ（JustPress化）
        this.i_up_before = false;
        this.i_down_before = false;
        this.i_left_before = false;
        this.i_right_before = false;
        this.i_button_before = false;
    }

    touch_keyboard(){
      // console.log("cursor", this.cursor_loc.x, this.cursor_loc.y);
      if (this.visible){
        if (this.cursor_loc.x === 8 && this.cursor_loc.y === 3){
          // １文字削除
          if (this.focus_loc > 0){
            const trimmed = this.name.substring(0, this.focus_loc - 1);
            this.name = trimmed.padEnd(NAME_MAX, ' ');
            this.focus_loc -= 1;
            GameState.sound.se_name_back.play();
          }
        } else if (this.cursor_loc.x === 9 && this.cursor_loc.y === 3){
          // 入力完了
          this.set_ranking(this.name);
          this.close_keyboard();
          GameState.sound.se_name_enter.play();
        } else {
          // １文字入力
          if (this.focus_loc < NAME_MAX){
            const letter = KEYBOARD[this.cursor_loc.y][this.cursor_loc.x];
            this.name = this.name.substring(0, this.focus_loc) + letter + this.name.substring(this.focus_loc + 1);
            this.focus_loc += 1;
            GameState.sound.se_name_type.play();
          }
        }
        this.nameText.setText(this.name);
      }
    }

    cursor_move(localX, localY){
      // console.log("cursor", localX, localY);
      if (localX > KEY_SIZE * KEY_COL){return;}
      if (localY > KEY_SIZE * KEY_ROW){return;}
      this.cursor_loc.x = Math.floor(localX / KEY_SIZE);
      this.cursor_loc.y = Math.floor(localY / KEY_SIZE); 
      this.draw_cursor();
    }

    close_keyboard(){
      this.keyboard.setVisible(false);
      this.cursor_sprite.setVisible(false);
      this.visible = false;
    }

    cursor_up(){
      this.cursor_loc.y = this.cursor_loc.y > 0 ? this.cursor_loc.y - 1 : 0;
      this.draw_cursor();
    }

    cursor_down(){
      this.cursor_loc.y = this.cursor_loc.y < 3 ? this.cursor_loc.y + 1 : 3;
      this.draw_cursor();
    }

    cursor_left(){
      this.cursor_loc.x = this.cursor_loc.x > 0 ? this.cursor_loc.x - 1 : 0;
      this.draw_cursor();
    }

    cursor_right(){
      this.cursor_loc.x = this.cursor_loc.x < 9 ? this.cursor_loc.x + 1 : 9;
      this.draw_cursor();
    }

    draw_cursor(){
      if (this.visible){
        this.cursor_sprite.setPosition(this.org_x + this.cursor_loc.x * KEY_SIZE - 6, this.org_y + this.cursor_loc.y * KEY_SIZE - 6)
          .setVisible(true).setAlpha(CURSOR_ALPHA);
      } else {
        this.cursor_sprite.setVisible(false);
      }
    }

    set_focus_pos(pos){
        this.focus_pos = pos;
        this.nameText.setPosition(pos.x, pos.y);
    }

    draw_focus(){
      this.graphics.clear();
      if (this.visible){
          this.focus_count = this.focus_count >= FOCUS_COUNT_MAX ? 0 : this.focus_count + 1;
          const focus_alpha = Math.cos(this.focus_count / FOCUS_COUNT_MAX * Math.PI * 2);
          this.graphics.lineStyle(4, FOCUS_COLOR);
          const pos_x = this.focus_pos.x + this.focus_loc * 16;
          const pos_y = this.focus_pos.y;
          this.graphics.lineBetween(pos_x, pos_y - 2, pos_x, pos_y + 18).setAlpha(focus_alpha);
      }
    }

    update(){  
        this.draw_focus();
        // 入力状態の更新
        this.my_input.update();
        // ネームエントリの更新
        if (GameState.i_up === true && this.i_up_before === false){this.cursor_up()};
        if (GameState.i_down === true && this.i_down_before === false){this.cursor_down()};
        if (GameState.i_left === true && this.i_left_before === false){this.cursor_left()};
        if (GameState.i_right === true && this.i_right_before === false)(this.cursor_right());
        if (GameState.i_button === true && this.i_button_before === false){this.touch_keyboard()};
        this.i_up_before = GameState.i_up;
        this.i_down_before = GameState.i_down;
        this.i_left_before = GameState.i_left;
        this.i_right_before = GameState.i_right;
        this.i_button_before = GameState.i_button;
    }

    destroy(){
        if ( this.graphics ){
            this.graphics.destroy();
            this.graphics = null;
        }
        this.scene.children.getAll().forEach(child => {
          if (child.name === 'nameEntryText') {
            child.destroy();
          }
        });
    }
} // End of name_entry