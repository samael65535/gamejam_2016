/**
 * Created by samael on 16/1/30.
 */

var Sword = cc.Sprite.extend({
    _owner: null,
    _isProgressing: false,
    startFrame: 1,
    endFrame: 3,
    frameName: "tuci0",
    itemType: "sword",
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
        this._isProgressing = true;
        this._owner.attackAnimation(this.frameName, this.startFrame, this.endFrame)
        var action = cc.moveBy(2.5/24, cc.p(0, 80));
        this.runAction(cc.sequence(
            action,
            action.reverse(),
            cc.callFunc(function() {
            }, this)
        ));
    },

    releaseAttack: function() {
        this._isProgressing = false;
    },

    checkDamage: function(playerArray) {
        _.each(playerArray, function(p, k){
            if(this._owner == null || this._owner.playerNum == p.playerNum || p.isDeath) return;
            var rectW1 = this.getBoundingBoxToWorld();
            var rectW2 = p._weapon.getBoundingBoxToWorld();
            var rect2 = p.getBoundingBoxToWorld();

            if (cc.rectIntersectsRect(rectW1, rectW2)) {
                p.pushBack();
                this._owner.pushBack();
            } else if (cc.rectIntersectsRect(rectW1, rect2) && !p.isDeath) {
                var pos1 = cc.p(rectW1.x, rectW1.y);
                var pos2 = cc.p(rect2.x, rect2.y);

                p.doDeath(Util.faceType(pos1,  pos2));
            }
        }, this);
    }
});