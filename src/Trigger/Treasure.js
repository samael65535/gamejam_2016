/**
 * Created by samael on 16/1/31.
 */

var Treasure = cc.Sprite.extend({
    isColl: false,
    ctor: function() {
        this._super("res/map/treasure.png");
        return true;
    },

    checkPlayer: function(playerArray) {

    }
});