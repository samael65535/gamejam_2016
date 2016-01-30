
var GameLayer = cc.Layer.extend({
    sprite:null,
    _board: null,
    _playerArray: null,
    _triggerArray: null,

    ctor:function () {
        this._super();
        var size = cc.winSize;

        this._playerArray = [];
        this._triggerArray = [];
        var p= new Player(1);
        p.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player);

        p= new Player(2);
        p.attr({
            x: size.width / 3,
            y: size.height / 4
        });


        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player);

        this._board = new cc.LayerColor(cc.color(25, 25, 25, 255));
        this._board.setContentSize(cc.size(size.width * 0.8, size.height * 0.8));
        this._board.attr({
            x: size.width * 0.1,
            y: size.height * 0.1
        });
        this.addChild(this._board, JAM_ORDER.board);
        this.scheduleUpdate();
        return true;
    },

    update: function(dt) {
        this.checkPlayerEach(dt); // 玩家相互判定
        this.checkBoard(dt);   // 出界
        this.checkWeapons(dt); // 武器碰撞判定
        this.checkTrigger(dt); // 地面陷阱判定
    },

    checkPlayerEach: function() {
        _.each(this._playerArray, function(v, k) {
            v.checkPlayerCollide(this._playerArray);
        }, this)
    },

    checkTrigger: function(dt) {
        _.each(this._triggerArray, function(v, k) {

        }, this)
    },

    checkWeapons: function(dt) {

    },

    checkBoard: function() {
        var rect = this._board.getBoundingBox();
        _.each(this._playerArray, function(v, k ) {
            var pos = v.getPosition();
            if (rect.x < pos.x && pos.x < rect.x + rect.width
                && rect.y < pos.y && pos.y < rect.height + rect.y){

            } else {
                console.log("death");
            }

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

