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
        this.setPosition(95, 70);

        return true;
    },

    checkOrder: function() {
        this.getParent().reorderChild(this, -1);
    },

    attack: function() {
        if (this._isProgressing == true) return;
        this._isProgressing = true;
        cc.audioEngine.playEffect("res/sound/attack.mp3");
        this._owner.attackAnimation(this.frameName, this.startFrame, this.endFrame)
        var action = cc.moveBy(2.3/24, cc.p(0, 30));
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
        var arr = [];
        _.each(playerArray, function(p, k){
            if(this._owner == null || this._owner.playerNum == p.playerNum || p.isDeath) return;
            var rectW1 = this.getBoundingBoxToWorld();
            var rectW2 = p._weapon.getBoundingBoxToWorld();
            var rect2 = p.getBoundingBoxToWorld();
            var rect1 = this._owner.getBoundingBoxToWorld();
            var pos1 = cc.p(rectW1.x, rectW1.y);
            var pos2 = cc.p(rect2.x, rect2.y);
            var pos3 = cc.p(rectW2.x, rectW2.y);
            var pos4 = cc.p(rect1.x, rect1.y);
            if (cc.rectIntersectsRect(rectW1, rectW2)) {
                p.pushBack();
                this._owner.pushBack();
            }
            if (cc.rectIntersectsRect(rectW1, rect2) && !p.isDeath) {

                p.doDeath(Util.faceType(pos1, pos2));
            }
            if (cc.rectIntersectsRect(rectW2, rect1) && !this._owner.isDeath) {

                this._owner.doDeath(Util.faceType(pos3,  pos4));
            }
        }, this);
    }
});