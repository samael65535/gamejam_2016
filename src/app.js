var GameLayerInstance
var GameLayer = cc.Layer.extend({
    sprite:null,
    _board: null,
    _playerArray: null,
    _triggerArray: null,
    _itemArray: null,
    _wallBG: null,
    _bg: null,
    _r1: null,
    _r2: null,

    _score1: 0,
    _score2: 0,
    _score1Label: null,
    _score2Label: null,

    ctor:function () {
        this._super();
        cc.audioEngine.playMusic("res/sound/start.mp3", true);
        this._score1Label = new cc.LabelTTF("1P 得分: " + this._score1, "Arial", 30);
        this._score1Label.setPosition(300, 20);
        this.addChild(this._score1Label, 100);

        this._score2Label = new cc.LabelTTF("2P 得分: " + this._score2, "Arial", 30);
        this._score2Label.setPosition(cc.winSize.width - 300,  20)
        this.addChild(this._score2Label, 100);


        this._playerArray = [];
        this._itemArray = [];
        this._triggerArray = [];

        this._bg = new cc.Sprite("res/map/map01.jpg");
        this._bg.attr({
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this._bg, JAM_ORDER.board);

        this._wallBG = new cc.Sprite("res/map/qiang.png");
        this._wallBG.attr({
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this._wallBG, JAM_ORDER.board);

        for (var i = 1 ; i <= 4; i++) {
            var size = cc.size(cc.winSize.width, 6);
            if (i % 2 == 0) size = cc.size(6, cc.winSize.height);
            var wall = new Wall(size);
            var pos = 0;
            switch(i){
                case 1:
                    pos = cc.p(0, cc.winSize.height - 6);
                    break;
                case 2:
                    pos = cc.p(cc.winSize.width - 3, 0);
                    break;
                case 3:
                    pos = cc.p(0, 0);
                    break;
                case 4:
                    pos = cc.p(0, 0);
                    break;
            }
            wall.setPosition(pos);
            this.addChild(wall, JAM_ORDER.player, JAM_CHILD_TAG.TRIGGER);
        }

        this.scheduleUpdate();
        GameLayerInstance = this;
        var posList = [
            [cc.p(123 / 2 + 30, cc.winSize.height - 98 / 2 - 30), cc.p(0.5,0.5)],
            [cc.p(cc.winSize.width / 2, cc.winSize.height - 98/2 - 30), cc.p(0.5,0.5)],
            [cc.p(cc.winSize.width - 123/2 - 30, cc.winSize.height - 98/2 - 30), cc.p(0.5, 0.5)],

            [cc.p(123/2 + 30, 98 / 2 + 30), cc.p(0.5, 0.5)],
            [cc.p(cc.winSize.width / 2, 98/2+ 30), cc.p(0.5, 0.5)],
            [cc.p(cc.winSize.width - 123/2-30 ,98/2 + 30), cc.p(0.5, 0.5)]

        ];
        var tp = _.sample(posList);
        var p = new SpearItem(false, 0);
        p.setPosition(tp[0]);
        this.addChild(p, JAM_ORDER.board + 1, JAM_CHILD_TAG.ITEM);

        for (var i = 0; i < 6; i++) {
            var v = new Treasure();
            v.setPosition(posList[i][0]);
            v.setAnchorPoint(posList[i][1]);
            this.addChild(v, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);
        }

        var spur = new Spur();
        spur.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(spur, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);
        var spurSize = spur.getContentSize();

        //
        var r1 = new Reborn();
        r1.setPosition(cc.winSize.width / 4, cc.winSize.height / 2);
        this.addChild(r1, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);
        this._r1 = r1;

        var r2 = new Reborn();
        r2.setPosition(cc.winSize.width / 4 * 3, cc.winSize.height / 2);
        this.addChild(r2, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);
        spurSize.height += 20;
        this._r2 = r2;

        ///
        var h1 = new Hole();
        h1.setPosition(cc.winSize.width / 5,  cc.winSize.height / 2 - spurSize.height / 2);
        this.addChild(h1, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);

        var h2 = new Hole();
        h2.setPosition(cc.winSize.width / 5 , cc.winSize.height / 2 + spurSize.height / 2);
        this.addChild(h2, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);

        var h3 = new Hole();
        h3.setPosition(cc.winSize.width / 5 * 4, cc.winSize.height / 2 - spurSize.height / 2);
        this.addChild(h3, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);

        var h4 = new Hole();
        h4.setPosition(cc.winSize.width / 5 * 4, cc.winSize.height / 2 + spurSize.height / 2);
        this.addChild(h4, JAM_ORDER.trigger,JAM_CHILD_TAG.TRIGGER);

        var p = new Player(1);
        p.attr({
            x: r1.getPositionX(),
            y: r1.getPositionY(),
        });
        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player, JAM_CHILD_TAG.PLAYER);

        p= new Player(2);
        p.attr({
            x: r2.getPositionX(),
            y: r2.getPositionY()
        });

        this.addChild(p, JAM_ORDER.player,JAM_CHILD_TAG.PLAYER);

        this._startLayer = new cc.Sprite("res/start_layer.png");
        this._startLayer.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(this._startLayer, 100);

        return true;
    },

    update: function(dt) {
        this._itemArray = _.filter(this.getChildren(), function(v, k) {
            return v.getTag() == JAM_CHILD_TAG.ITEM;
        }, this);
        this._playerArray = _.filter(this.getChildren(), function(v, k) {
            return v.getTag() == JAM_CHILD_TAG.PLAYER
        }, this);
        this._triggerArray = _.filter(this.getChildren(), function(v, k) {
            return v.getTag() == JAM_CHILD_TAG.TRIGGER
        }, this);

        this.checkGround(dt); // 地图道具
        this.checkPlayerEach(dt); // 玩家相互判定
        this.checkWeapons(dt); // 武器碰撞判定
        this.checkTrigger(dt); // 地面陷阱判定
    },

    checkGround: function(dt) {
        _.each(this._itemArray, function(v, k) {
            v.checkPlayer(this._playerArray);
            v.checkItem(this._itemArray);
            v.checkTrigger(this._triggerArray);
        }, this);
    },

    checkPlayerEach: function() {
        _.each(this._playerArray, function(v, k) {
            v.checkPlayerCollide(this._playerArray);
        }, this)
    },

    checkTrigger: function(dt) {
        _.each(this._triggerArray, function(v, k) {
            v.checkPlayer(this._playerArray);
        }, this)
    },

    checkWeapons: function(dt) {
        _.each(this._playerArray, function(v, k) {
            var weapon = v._weapon;
            weapon.checkDamage(this._playerArray);
        }, this)
    },

    rebornPlayer: function(playerNum, pos) {
        if (playerNum == 1) {
            this._score2 += 1;
            this._score2Label.setString("2P 得分: " + this._score2)
        }else {
            this._score1 += 1;
            this._score1Label.setString("1P 得分: " + this._score1)
        }
        var f = 1;
        if (pos.x > cc.winSize.width / 2) f = 1;
        else f = 2;
        var p = new Player(playerNum);
        var r = this["_r" + f];
        p.attr({
            x: r.getPositionX(),
            y: r.getPositionY()
        });
        this.addChild(p, JAM_ORDER.player, JAM_CHILD_TAG.PLAYER);
    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

