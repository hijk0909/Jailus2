// GameConst.js

export const GLOBALS = {
    STAGE_MAX : 3,
    STAGE_STATE: {
        START : 1,
        STARTING : 2,
        PLAYING : 3,
        FAIL : 4,
        FAILED : 5,
        CLEAR : 6,
        CLEARED : 7
    },
    FIELD: {
        WIDTH : 800,
        HEIGHT : 600,
        MARGIN : 100,
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
    }
}