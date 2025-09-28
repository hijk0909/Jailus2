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
    scroll : true,
    bg : null,
    bgm : null,
    score : 0,
    high_score : 0,
    extend : GLOBALS.EXTEND_FIRST,
    lives : GLOBALS.INIT_LIVES,
    ranking : {
        session : GLOBALS.RANKING_DEFAULT,
        daily : null,
        monthly : null,
        alltime :null
    },
    debug : false,

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
    items : [],

    reset(){
        this.stage = 1;
        this.score = 0;
        this.lives = GLOBALS.INIT_LIVES;
        this.extend = GLOBALS.EXTEND_FIRST;
    },

    add_score(score){
        this.score += score;
        if (this.score > this.high_score){
            this.high_score = this.score;
        }
        if (this.score >= this.extend){
            this.lives += 1;
            // this.ui.show_lives();
            // this.sound.se_extend.play();
            this.extend += GLOBALS.EXTEND_EVERY;
        }
    },

    add_score_without_extend(score){
        this.score += score;
        if (this.score > this.high_score){
            this.high_score = this.score;
        }        
    },

    bgm_set(bgm){ this.bgm = bgm; },
    bgm_stop(){ if (this.bgm){ this.bgm.stop(); } },
    bgm_play(){ if (this.bgm){ this.bgm.play(); } },
    bgm_pause(){ if (this.bgm){ this.bgm.pause(); } },
    bgm_resume(){ if (this.bgm){ this.bgm.resume(); } }
}