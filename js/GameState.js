// GameState.js
import { GLOBALS } from './GameConst.js';

export const GameState = {
    // ゲーム全体情報
    ff : 1.0,
    stage : 1,
    stage_state : GLOBALS.STAGE_STATE.START,
    vanish_point : GLOBALS.FIELD.HEIGHT / 2,
    scroll_dx : 0,
    scroll_x : 0,
    bg : null,

    // 入力状態（MyInput で設定）
    i_pointer : null,
    i_touch : false,
    i_up : false,
    i_down : false,
    i_left : false,
    i_right : false,
    i_button : false,
    i_button_before : false,

    // オブジェクト管理
    player : null,
    enemies : [],
    bullets_e : [],
    bullets_p : [],
    effects : [],

    reset(){
        this.stage = 1;
    }
}