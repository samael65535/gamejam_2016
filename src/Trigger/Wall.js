/**
 * Created by samael on 16/1/30.
 */
var Wall = cc.LayerColor.extend({
    isOnGround: true,
    type: 0,
    ctor: function(size) {
        this._super(cc.color(255, 0, 0, 0));
        this.setContentSize(size);
        return true;
    },

    checkPlayer: function(playerArray) {
        _.each(playerArray, function(v, k) {
            if (Util.checkIntersects(this, v)) {
                this.pushBack(v);
            }
        }, this);
    },

    pushBack: function(target) {
        this._isAvailable = false;
        var x = 0, y = 0;
        switch(this.type) {
            case 1:
                x = 0;
                y = -10;
                break;
            case 2:
                x = -10;
                y = 0;
                break;
            case 3:
                x = 0;
                y = 10;
                break;
            case 4:
                x = 10;
                y = 0;
                break;
        }

        target.runAction(cc.sequence(
            cc.moveBy(0.2, cc.p(x, y)),
            cc.callFunc(function() {
                this._isAvailable = true;
            }.bind(this))
        ));
    }
});