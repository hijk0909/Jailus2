// bgm.js
import { GLOBALS } from '../GameConst.js';
import { GameState } from '../GameState.js';

export class BGM {
    constructor(scene){
        this.scene = scene;
        this.bgm = null;
    }

    set(bgm){
        this.bgm = bgm;
    }

    set_by_stage(){
        const BGM_LIST = [
            GameState.sound.bgm_stage_1,
            GameState.sound.bgm_stage_2,
            GameState.sound.bgm_stage_3,
            GameState.sound.bgm_stage_4,
            GameState.sound.bgm_stage_5,
            GameState.sound.bgm_stage_6,
            GameState.sound.bgm_stage_7,
            GameState.sound.bgm_stage_8
        ];
        this.bgm = BGM_LIST[GameState.stage - 1];
    }

    set_boss(){
        this.bgm = GameState.sound.bgm_zero_mind;
    }

    stop(){
        if (this.bgm){
            this.bgm.stop();
        }
    }

    play(){
        if (this.bgm){
            this.bgm.play();
        }
    }

    fadeout(){
        if (this.bgm && this.bgm.isPlaying){
            // BGMの音量を 1 から 0 に 1000ミリ秒（1秒）かけて変化
            this.scene.tweens.add({
                targets: this.bgm,
                volume: 0,                // 最終的な音量
                duration: 1000,           // 変化にかける時間（ミリ秒）
                ease: 'Linear',           // 変化の仕方
                onComplete: (tween, targets) => {
                    const fadedBGM = targets[0]; // volumeが0になったsoundインスタンス
                    fadedBGM.volume = GLOBALS.BGM_VOLUME;  // 元の音量に戻してから停止            
                    fadedBGM.stop();
                  }
            });
        }
    }

    pause(){
        if (this.bgm){
            this.bgm.pause();
        }
    }

    resume(){
        if (this.bgm){ this.bgm.resume(); }
     }
}