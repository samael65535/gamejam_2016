/**
 * Created by samael on 16/1/30.
 */

var Sword = cc.Sprite.extend({
    _owner: null,
    _isProgressing: false,
    startFrame: 1,
    endFrame: 3,
    frameName: "tuci0",
    ctor: function(owner) {
        this._super("res/weapons/jian01.png");
        this._owner = owner;
        this.setAnchorPoint(0.5, 0);
        this.setPosition(105, 73);

        return true;
    },

    checkOrder: function() {
        this.getParent().reorderChild(this, -1);
    },

    attack: function() {
        if (this._isProgressing == true) return;
        this._isProgressing  = true;
        this._owner.attackAnimation(this.frameName, this.startFrame, this.endFrame)
        var action = cc.moveBy(2.5/24, cc.p(0, 15));
        this.runAction(cc.sequence(
            action,
            action.reverse(),
            cc.callFunc(function() {
            }, this)
        ));
    },

    releaseAttack: function() {
        this._isProgressing = false;
    }
});