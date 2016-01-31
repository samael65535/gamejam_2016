/**
 * Created by samael on 16/1/30.
 */
var Spear = cc.Sprite.extend({
    _owner: null,
    _isProgressing: false,
    startFrame: 1,
    endFrame: 3,
    frameName: "tuci0",
    itemType: "spear",
    ctor: function(o) {
        this._super("res/weapons/spear01.png");
        this._owner = o;
    },

    checkOrder: function() {
        this.getParent().reorderChild(this, -1);
    },

    attack: function() {
        if (this._isProgressing == true) return;
        this._isProgressing = true;
        this._owner.attackAnimation(this.frameName, this.startFrame, this.endFrame, ".png");
        var pos = cc.p(0, 0);
        var r = 0;
        switch(this._owner._movingType) {
            case JAM_CONFIG.UP:
                pos.y = 1 * cc.winSize.width;
                r = 0;
                break;
            case JAM_CONFIG.DOWN:
                pos.y = -1 * cc.winSize.width;
                r = 180;
                break;
            case JAM_CONFIG.LEFT:
                pos.x = -1 * cc.winSize.width;
                r = 270;
                break;
            case JAM_CONFIG.RIGHT:
                pos.x = 1 * cc.winSize.width;
                r = 90;
                break;
        }
        cc.audioEngine.playEffect("res/sound/spear.mp3");
        var si = new SpearItem(true, this._owner.playerNum);
        si.isOnGround = false;
        var bx = this._owner.getBoundingBoxToWorld();
        si.setRotation(r);
        si.setPosition(bx.x + bx.width, bx.y + bx.height);
        GameLayerInstance.addChild(si, JAM_ORDER.player,JAM_CHILD_TAG.ITEM);
        GameLayerInstance._itemArray.push(si);
        si.runAction(cc.moveBy(1.6, pos));
        this._owner.resetWeapon();
        //var action = cc.moveBy(2.5/24, cc.p(0, 15));
        //this.runAction(cc.sequence(
        //    action,
        //    action.reverse(),
        //    cc.callFunc(function() {
        //        this.releaseAttack();
        //    }, this)
        //));
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
            } else if (cc.rectIntersectsRect(rectW1, rect2) && !p.isDeath) {
                p._movingType = 0;
                p.doDeath(this._owner._movingType);
                this._owner._movingType = 0
            }
        }, this);
    },

    drop: function() {

    }
});