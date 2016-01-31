/**
 * Created by samael on 16/1/30.
 */
var Wall = cc.LayerColor.extend({
    isOnGround: true,
    ctor: function(size) {
        this._super(cc.color(255, 0, 0, 0));
        this.setContentSize(size);
        return true;
    },

    checkPlayer: function(playerArray) {
        _.each(playerArray, function(v, k) {
            if (Util.checkIntersects(this, v)) {
                v.pushBack();
            }
        }, this);
    }
});