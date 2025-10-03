// GameConst.js

export const GLOBALS = {
    VERSION : "2025.09.30",
    STAGE_MAX : 8,
    INIT_LIVES : 3,
    EXTEND_FIRST : 20000,
    EXTEND_EVERY : 50000,

    DELTA: 16.6667,

    STAGE_STATE: {
        START : 1,
        STARTING : 2,
        PLAYING : 3,
        FAIL : 4,
        FAILED : 5,
        CLEAR : 6,
        CLEARED : 7,
        ALL_CLEARED : 8,
        PAUSE : 9
    },
    FIELD: {
        WIDTH : 800,
        HEIGHT : 600,
        MARGIN : 200,
        DEPTH : 600
    },
    LAYER:{
        LAYER1 : {
            HEIGHT : 200,
            Z : 400
        },
        LAYER2 : {
            HEIGHT : 400,
            Z : 200
        },
        LAYER3 : {
            HEIGHT : 512,
            Z : 88
        },
        LAYER4 : {
            HEIGHT : 600,
            Z : 0
        },
        CEILING : {
            WIDTH :  800,
            HEIGHT : 400,
            Z_TOP : 0,
            Z_BOTTOM : 400
        },
        FLOOR : {
            WIDTH :  800,
            HEIGHT : 400,
            Z_TOP : 400,
            Z_BOTTOM : 0
        }
    },

    SPAWN_POS:{
        MAP : 1,
        RIGHT_MIDDLE : 2,
        RIGHT_RANDOM : 3,
        RIGHT_Y      : 4,
        RIGHT_Y_Z    : 5
    },

    RANKING_URL : "https://script.google.com/macros/s/AKfycbzNK_MQVWDv0sx-cvmKJSLi_C77gLK8SlRSTtCYh1ol1VwLmzRlFKLkjbDogeesPJrn/exec",
    RANKING_DEFAULT : [
        {"name": "JAILUS2 ","score":  10000,"stage": 8,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   9000,"stage": 7,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   8000,"stage": 6,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   7000,"stage": 5,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   6000,"stage": 4,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   5000,"stage": 3,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   4000,"stage": 2,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   3000,"stage": 1,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   2000,"stage": 1,"time": "2025-09-04T12:19:22.000Z"},
        {"name": "JAILUS2 ","score":   1000,"stage": 1,"time": "2025-09-04T12:19:22.000Z"}
    ]
};