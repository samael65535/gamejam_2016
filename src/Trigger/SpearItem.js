/**
 * Created by samael on 16/1/30.
 */

var SpearItem = cc.Sprite.extend({
    itemType: "spear",
    isDamaged: false,
    fromPlayer: 0,
    isAvailable: true,
    isOnGround: true,
    ctor: function(isDamaged, fromPlayer) {
        this._super("res/weapons/spear01.png");
        this.isDamaged = isDamaged;
        if (fromPlayer == undefined) fromPlayer = 0;
        this.fromPlayer = fromPlayer;
        return true;
    },

    checkPlayer: function(playerArray) {
        _.each(playerArray, function(v, k) {
            if (v.playerNum == this.fromPlayer) return;
            if (this.isDamaged) {
                if (Util.checkIntersects(v, this)) {
                    v.doDeath(1);
                }
            } else {
                if (Util.checkIntersects(v, this)) {
                    if (v.isAvailable == false) return;
                    if (this.itemType == v._weapon.itemType ) return;
                    this.isAvailable = false;
                    this.removeFromParent();
                    v.loadWeapon(this.itemType)
                }
            }
        }, this);
    },

    checkTrigger: function(triggerArray) {
        _.each(triggerArray, function(v) {
            if (Util.checkIntersects(v, this) && v.isOnGround == true) {
                this.pushBack();
            }
        },this);
    },

    checkItem: function(itemArray) {
        _.each(itemArray, function(v) {
            if (v == this) return;
            if (Util.checkIntersects(v, this) && v.isOnGround == this.isOnGround && v.isOnGround == false) {
                v.stopAllActions();
            }
        },this);
    },

    pushBack: function() {
        if (this.isAvailable == false) return
        this.stopAllActions();
        this.isAvailable = true;
        this.isDamaged = false;
        this.fromPlayer = 0;
        var oldRot = this.getRotation();
        var radians = cc.degreesToRadians(oldRot);
        GameLayerInstance._itemArray.push(this)
        var x = Math.sin(radians) * 1 * -10;
        var y = Math.cos(radians) * 1 * -10;
        this.runAction(cc.sequence(
            cc.moveBy(0.2, cc.p(x, y)),
            cc.callFunc(function() {
                this.isAvailable = true;
            }.bind(this))
        ));
    }
});
