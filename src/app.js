
var GameLayer = cc.Layer.extend({
    sprite:null,
    _board: null,
    _playerArray: null,
    _trapArray: null,
    _itemArray: null,
    _wallBG:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this._playerArray = [];
        this._itemArray = [];
        this._trapArray = [];
        var p = new Player(1);
        p.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player);

        p= new Player(2);
        p.attr({
            x: size.width / 2,
            y: size.height / 4
        });

        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player);

        this._wallBG = new cc.Sprite("res/map/qiang.png");
        this._wallBG.attr({
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this._wallBG, JAM_ORDER.board);

        this._board = new cc.LayerColor(cc.color(25, 25, 25, 255));
        this._board.setContentSize(cc.size(size.width * 0.8, size.height * 0.8));
        this._board.attr({
            x: size.width * 0.1,
            y: size.height * 0.1
        });
        this.addChild(this._board, JAM_ORDER.board);
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
            this.addChild(wall, JAM_ORDER.player);
            this._trapArray.push(wall)
        }
        p = new SpearItem();
        this._itemArray.push(p);
        p.attr({
            x: size.width / 4,
            y: size.height / 4
        });
        this.addChild(p,JAM_ORDER.board);

        this.scheduleUpdate();
        return true;
    },

    update: function(dt) {
        this.checkGround(dt); // 地图道具
        this.checkPlayerEach(dt); // 玩家相互判定
        this.checkBoard(dt);   // 出界
        this.checkWeapons(dt); // 武器碰撞判定
        this.checkTrigger(dt); // 地面陷阱判定
    },

    checkGround: function(dt) {
        _.each(this._itemArray, function(v, k) {
            v.checkPlayer(this._playerArray);
            v.checkItem(this._itemArray);
            v.checkTrigger(this._itemArray);
        }, this);
    },

    checkPlayerEach: function() {
        _.each(this._playerArray, function(v, k) {
            v.checkPlayerCollide(this._playerArray);
        }, this)
    },

    checkTrigger: function(dt) {
        _.each(this._trapArray, function(v, k) {
            v.checkPlayer(this._playerArray);
        }, this)
    },

    checkWeapons: function(dt) {
        _.each(this._playerArray, function(v, k) {
            var weapon = v._weapon;
            weapon.checkDamage(this._playerArray);
        }, this)
    },

    checkBoard: function() {
        var rect = this._board.getBoundingBox();
        _.each(this._playerArray, function(v, k) {
            var pos = v.getPosition();
            var s = v.getBoundingBoxToWorld();

        }, this);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

