/**
 * Created by samael on 16/1/31.
 */

var Spur = cc.Sprite.extend({
    _jiguan: null,
    isColl: false,
    ctor: function() {
        this._super("res/map/dici01.png");
        var size = this.getContentSize();
        this._jiguan = new  cc.Sprite("res/map/jiguankaiguan.png");
        this._jiguan.setPosition(size.width/2, size.height/2);
        this.addChild(this._jiguan);
        return true;
    },

    checkPlayer: function(playerArray) {

    }
});