
var GameLayer = cc.Layer.extend({
    sprite:null,
    _board: null,
    _playerArray: null,

    ctor:function () {
        this._super();
        var size = cc.winSize;

        this._playerArray = [];
        var p= new Player();
        p.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this._playerArray.push(p);
        this.addChild(p, JAM_ORDER.player);

        this._board = new cc.LayerColor(cc.color(255, 0, 0, 255));
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
        this.checkBoard();
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
    },

    endGame: function() {

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

