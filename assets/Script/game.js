var MajiangInfo = require("MajiangInfo")

var turn = {
    "turn1": "my",
    "turn2": "right",
    "turn3": "up",
    "turn4": "left",
}//轮转标志，表示这回合该谁出牌了

cc.Class({
    extends: cc.Component,

    properties: {

        myAtlas:{
            default:null,
            type:cc.SpriteAtlas,
        },

        rightAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        upAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        leftAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        emptyAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        majiangPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    onLoad: function () {

        this.my = this.node.getChildByName("me");
        this.myInHand = this.my.getChildByName("inHand");
        this.myInOutSide = this.my.getChildByName("inOutSide");
        this.newMajiang = this.my.getChildByName("newMajiang");

        this.right = this.node.getChildByName("right");
        this.rightInHand = this.right.getChildByName("inHand");
        this.rightInOutSide = this.right.getChildByName("inOutSide");
        this.newMajiangRight = this.right.getChildByName("newMajiang");

        this.up = this.node.getChildByName("up");
        this.upInHand = this.up.getChildByName("inHand");
        this.upInOutSide = this.up.getChildByName("inOutSide");
        this.newMajiangUp = this.up.getChildByName("newMajiang");

        this.left = this.node.getChildByName("left");
        this.leftInHand = this.left.getChildByName("inHand");
        this.leftInOutSide = this.left.getChildByName("inOutSide");
        this.newMajiangLeft = this.left.getChildByName("newMajiang");

        this.btnGoNext = this.node.getChildByName("btnGoNext");
        this.btnGoNext.on('click', this.goNext, this);

        this.majiongArray = this.createMaJiangArray();//创建初始数组

        this.myMajiangs = [];//我的手牌
        this.rightMajiangs = [];//右边的手牌
        this.upMajiangs = [];//上边的手牌
        this.leftMajiangs = [];//左边的手牌
        this.myMajiangsInOutSide = [];//我的出牌
        this.rightMajiangsInOutSide = [];//右边的出牌
        this.upMajiangsInOutSide = [];//上边的出牌
        this.leftMajiangsInOutSide = [];//左边的出牌

        this.newMajiangStr = "";//我的新麻将的名字，如1筒
        this.newMajiang.on('click', this.clickNewMajiang, this);

        this.newMajiangStrRight = "";//右边的新麻将的名字
        this.newMajiangStrUp = "";//上边的新麻将的名字
        this.newMajiangStrLeft = "";//左边的新麻将的名字

        this.turn = turn.turn1;//表示当前轮到我方出牌

        this.createMajiongsInHand();//随机分配四方的初始手牌
        this.getMyMajiangInHand(this.myMajiangs.length);//生成我的初始手牌
        this.getRightMajiangInHand(this.rightMajiangs.length);//生成左边的初始手牌
        this.getUpMajiangInHand(this.upMajiangs.length);//生成上边的初始手牌
        this.getLeftMajiangInHand(this.leftMajiangs.length);//生成右边的初始手牌

        this.getNewMajiang();//获取新麻将
    },

    //创建初始牌组
    createMaJiangArray: function () {

        var array = [
            "1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
            "1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
            "1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
            "1筒","2筒","3筒","4筒","5筒","6筒","7筒","8筒","9筒",
            "1条","2条","3条","4条","5条","6条","7条","8条","9条",
            "1条","2条","3条","4条","5条","6条","7条","8条","9条",
            "1条","2条","3条","4条","5条","6条","7条","8条","9条",
            "1条","2条","3条","4条","5条","6条","7条","8条","9条",
            "1万","2万","3万","4万","5万","6万","7万","8万","9万",
            "1万","2万","3万","4万","5万","6万","7万","8万","9万",
            "1万","2万","3万","4万","5万","6万","7万","8万","9万",
            "1万","2万","3万","4万","5万","6万","7万","8万","9万",
            "东","南","西","北","发","白","中",
            "东","南","西","北","发","白","中",
            "东","南","西","北","发","白","中",
            "东","南","西","北","发","白","中",
        ];

        return array;
    },

    //创建初始手牌数组
    createMajiongsInHand: function () {

        for (var i = 0; i < 52; i++) {

            var randomNum = Math.floor(Math.random()*this.majiongArray.length)

            if ( i % 4 == 0 ) {

                this.myMajiangs.push(this.majiongArray[randomNum]);

            } else if ( i % 4 == 1 ) {

                this.rightMajiangs.push(this.majiongArray[randomNum]);

            } else if ( i % 4 == 2 ) {

                this.upMajiangs.push(this.majiongArray[randomNum]);

            } else if ( i % 4 == 3 ) {

                this.leftMajiangs.push(this.majiongArray[randomNum]);

            }

            this.majiongArray.splice(randomNum,1);
        }

        sortMajiangs(this.myMajiangs);
        sortMajiangs(this.rightMajiangs);
        sortMajiangs(this.upMajiangs);
        sortMajiangs(this.leftMajiangs);
    },

    getMyMajiangInHand: function (num) {

        for (var i = this.myInHand.childrenCount; i < num; i++) {

            var str = MajiangInfo.myMajiangInhandName[this.myMajiangs[i]];
            addOneMajiang(str, this.myInHand, this.myAtlas, this.majiangPrefab, i);
            this.myInHand.getChildByTag(i).on('click', this.clickMyMajiang, this);
        }
    },

    clickMyMajiang: function (event) {

        if ( this.turn != turn.turn1 ) {
            cc.log("还没轮到你出牌呢");
            return
        }

        this.myInHand.removeChildByTag(event.target.tag);
        var str = "B" + event.target.name.substring(1);
        this.myMajiangsInOutSide.push(str);
        addOneMajiang(str, this.myInOutSide, this.upAtlas, this.majiangPrefab);

        this.myMajiangs.splice(event.target.tag,1);
        this.myMajiangs.push(this.newMajiangStr);
        sortMajiangs(this.myMajiangs);
        this.myInHand.removeAllChildren();
        this.getMyMajiangInHand(this.myMajiangs.length);

        this.turn = turn.turn2;

        this.newMajiang.active = false;

        this.getNewMajiang();
    },

    getNewMajiang: function () {

        if ( this.majiongArray.length == 0 ) {
            cc.log("牌组的牌已经全部打完了,这局流局");
            this.turn = "gameover";
            return
        }

        if ( this.turn == turn.turn1 ) {

            this.newMajiang.active = true;
            var randomNum = Math.floor(Math.random()*this.majiongArray.length);
            this.newMajiangStr = this.majiongArray[randomNum];
            var str = MajiangInfo.myMajiangInhandName[this.newMajiangStr];
            var frame = this.myAtlas.getSpriteFrame(str);
            this.newMajiang.getComponent(cc.Sprite).spriteFrame = frame;
            this.majiongArray.splice(randomNum,1);

        } else if ( this.turn == turn.turn2 ) {

            this.newMajiangRight.active = true;
            var randomNum = Math.floor(Math.random()*this.majiongArray.length);
            this.newMajiangStrRight = this.majiongArray[randomNum];
            this.rightMajiangs.push(this.newMajiangStrRight);
            var str = MajiangInfo.rightMajiangInhandName[this.newMajiangStrRight];
            var frame = this.emptyAtlas.getSpriteFrame("e_mj_right");
            this.newMajiangRight.getComponent(cc.Sprite).spriteFrame = frame;
            this.majiongArray.splice(randomNum,1);

        } else if ( this.turn == turn.turn3 ) {

            this.newMajiangUp.active = true;
            var randomNum = Math.floor(Math.random()*this.majiongArray.length);
            this.newMajiangStrUp = this.majiongArray[randomNum];
            this.upMajiangs.push(this.newMajiangStrUp);
            var str = MajiangInfo.upMajiangInhandName[this.newMajiangStrUp];
            var frame = this.emptyAtlas.getSpriteFrame("e_mj_up");
            this.newMajiangUp.getComponent(cc.Sprite).spriteFrame = frame;
            this.majiongArray.splice(randomNum,1);

        } else if ( this.turn == turn.turn4 ) {

            this.newMajiangLeft.active = true;
            var randomNum = Math.floor(Math.random()*this.majiongArray.length);
            this.newMajiangStrLeft = this.majiongArray[randomNum];
            this.leftMajiangs.push(this.newMajiangStrLeft);
            var str = MajiangInfo.leftMajiangInhandName[this.newMajiangStrLeft];
            var frame = this.emptyAtlas.getSpriteFrame("e_mj_left");
            this.newMajiangLeft.getComponent(cc.Sprite).spriteFrame = frame;
            this.majiongArray.splice(randomNum,1);

        }
    },

    clickNewMajiang: function () {

        var str = MajiangInfo.upMajiangInhandName[this.newMajiangStr];
        this.myMajiangsInOutSide.push(str);
        addOneMajiang(str, this.myInOutSide, this.upAtlas, this.majiangPrefab);

        this.turn = turn.turn2;

        this.newMajiang.active = false;

        this.getNewMajiang();
    },

    goNext: function () {

        //让非我方操控的玩家随机出一张牌

        if ( this.turn == turn.turn1 ) {
            cc.log("轮到你的回合了,快出牌");
            return
        } else if ( this.turn == turn.turn2 ) {

            var randomNum = Math.floor(Math.random()*this.rightMajiangs.length);
            var str = MajiangInfo.rightMajiangInhandName[this.rightMajiangs[randomNum]];
            addOneMajiang(str, this.rightInOutSide, this.rightAtlas, this.majiangPrefab);
            this.rightMajiangs.splice(randomNum,1);
            sortMajiangs(this.rightMajiangs);
            this.rightInHand.removeAllChildren();
            this.getRightMajiangInHand(this.rightMajiangs.length);
            this.newMajiangRight.active = false;

            this.turn = turn.turn3;
            this.getNewMajiang();

        } else if ( this.turn == turn.turn3 ) {

            var randomNum = Math.floor(Math.random()*this.upMajiangs.length);
            var str = MajiangInfo.upMajiangInhandName[this.upMajiangs[randomNum]];
            addOneMajiang(str, this.upInOutSide, this.upAtlas, this.majiangPrefab);
            this.upMajiangs.splice(randomNum,1);
            sortMajiangs(this.upMajiangs);
            this.upInHand.removeAllChildren();
            this.getUpMajiangInHand(this.upMajiangs.length);
            this.newMajiangUp.active = false;

            this.turn = turn.turn4;
            this.getNewMajiang();

        } else if ( this.turn == turn.turn4 ) {

            var randomNum = Math.floor(Math.random()*this.leftMajiangs.length);
            var str = MajiangInfo.leftMajiangInhandName[this.leftMajiangs[randomNum]];
            addOneMajiang(str, this.leftInOutSide, this.leftAtlas, this.majiangPrefab);
            this.leftMajiangs.splice(randomNum,1);
            sortMajiangs(this.leftMajiangs);
            this.leftInHand.removeAllChildren();
            this.getLeftMajiangInHand(this.leftMajiangs.length);
            this.newMajiangLeft.active = false;

            this.turn = turn.turn1;
            this.getNewMajiang();
        }
    },

    getRightMajiangInHand: function (num) {

        for (var i = this.rightInHand.childrenCount; i < num; i++) {

            // var str = MajiangInfo.rightMajiangInhandName[this.rightMajiangs[i]];
            // addOneMajiang(str, this.rightInHand, this.rightAtlas, this.majiangPrefab);

            addOneMajiang("e_mj_right", this.rightInHand, this.emptyAtlas, this.majiangPrefab);
        }
    },

    getUpMajiangInHand: function (num) {

        for (var i = this.upInHand.childrenCount; i < num; i++) {

            // var str = MajiangInfo.upMajiangInhandName[this.upMajiangs[i]];
            // addOneMajiang(str, this.upInHand, this.upAtlas, this.majiangPrefab);

            addOneMajiang("e_mj_up", this.upInHand, this.emptyAtlas, this.majiangPrefab);
        }
    },

    getLeftMajiangInHand: function (num) {

        for (var i = this.leftInHand.childrenCount; i < num; i++) {

            // var str = MajiangInfo.leftMajiangInhandName[this.leftMajiangs[i]];
            // addOneMajiang(str, this.leftInHand, this.leftAtlas, this.majiangPrefab);

            addOneMajiang("e_mj_left", this.leftInHand, this.emptyAtlas, this.majiangPrefab);
        }
    },

});

//tag升序
function sortByTag (a,b) {

    var aa = MajiangInfo.majiangTag[a];
    var bb = MajiangInfo.majiangTag[b];

    return bb - aa;
}

//根据麻将的tag，万-条-筒-东南西北发中白来排序
function sortMajiangs (array) {

    array.sort(sortByTag);
}

//添加一张麻将
function addOneMajiang (str,layout,atlas,prefab,tag) {

    var majiang = cc.instantiate(prefab);

    var frame = atlas.getSpriteFrame(str);
    majiang.getComponent(cc.Sprite).spriteFrame = frame;

    if ( tag != undefined ) {
        majiang.tag = tag;
        majiang.name = str;
    }

    layout.addChild(majiang);
}
