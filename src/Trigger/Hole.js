/**
 * Created by samael on 16/1/31.
 */

var Hole = cc.Sprite.extend({
    isColl: false,
    ctor: function() {
        this._super("res/map/heidong.png");
        return true;
    },

    checkPlayer: function(playerArray) {

    }
});