/**
 * Created by samael on 16/1/30.
 */

var Player = cc.Sprite.extend({
    _isAvailable: false,
    _isMoving: false,
    _movingType: 0,
    _weapons: null,
    _headSprite: null,
    playerNum: 0,
    isBlock: false,
    ctor: function(playerNum) {
        this._super("res/dongzuo-1p/zou01-1p.png");
        this._headSprite = new cc.Sprite("res/dongzuo-1p/jingzhi-1p.png");
        this.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.playerNum = playerNum;
        var size = this.getContentSize();
        this._headSprite.attr({
            x: size.width / 2,
            y: -20,
            anchorX: 0.5,
            anchorY: 0
        });
        this.addChild(this._headSprite);
        this._isAvailable = true;
        this.scheduleUpdate();
        this._lastKeyCode = null;
        this._weapons = new Sword(this);
        this._headSprite.addChild(this._weapons);
        this._weapons.checkOrder();
        this.startMoving();
        return true;
    },

    startMoving: function() {
        var animationAction = Util.createAnimation("res/dongzuo-1p/zou0", 1, 2, 2/24, "-1p.png");
        this.runAction(cc.repeatForever(animationAction));
    },

    stopAnimation: function() {
        this.stopAllActions();
    },

    attack: function() {
        this._weapons.attack()
    },

    attackAnimation: function(weaponsName, start, end) {
        var frameName = "res/dongzuo-1p/" + weaponsName;
        var animationAction = Util.createAnimation(frameName, start, end, 2/24, "-1p.png");
        //this._headSprite.runAction(
        //    animationAction
        //);
        console.log("heheh")
    },

    stopAttackAnimation: function() {
        this._headSprite.stopAllActions();
    },

    releaseAttack: function() {
        this._weapons.releaseAttack();
    },

    update: function(dt) {
        var type = this._movingType;
        this.move(type, dt)
    },

    move: function(type, dt) {
        if (type == 0) {
            this.stopAnimation();
            this._isMoving = false;
            return;
        }
        if (this._isMoving == false) {
            this.startMoving();
            this._isMoving = true;
        }
        var x = 0, y = 0;
        var oldX = this.getPositionX();
        var oldY = this.getPositionY();
        var v = 1;
        if (this.isBlock) v = -10;
        switch (type) {
            case JAM_CONFIG.UP:
                y = JAM_CONFIG.move_distance * dt * v;
                break;
            case JAM_CONFIG.RIGHT:
                x = JAM_CONFIG.move_distance * dt * v;
                break;
            case JAM_CONFIG.DOWN:
                y = -JAM_CONFIG.move_distance * dt * v;
                break;
            case JAM_CONFIG.LEFT:
                x = -JAM_CONFIG.move_distance * dt * v;
                break;
            default:
                return;
        }

        this.attr({
            x: oldX + x,
            y: oldY + y
        });
    },

    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if (this._isAvailable == false) return;
                var s = event.getCurrentTarget();
                if (s.playerNum == 1) {
                    if (keyCode == cc.KEY.up) {
                        s._movingType = JAM_CONFIG.UP;
                        s.setRotation(0);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.down) {
                        s._movingType = JAM_CONFIG.DOWN;
                        s.setRotation(180);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.right) {
                        s._movingType = JAM_CONFIG.RIGHT;
                        s.setRotation(90);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.left) {
                        s._movingType = JAM_CONFIG.LEFT;
                        s.setRotation(270);
                        s._lastKeyCode = keyCode;
                    }

                    if (keyCode == cc.KEY.space) {
                        // s.pushBack();
                        s.attack();
                    }
                } else if (s.playerNum == 2) {
                    if (keyCode == cc.KEY.w) {
                        s._movingType = JAM_CONFIG.UP;
                        s.setRotation(0);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.s) {
                        s._movingType = JAM_CONFIG.DOWN;
                        s.setRotation(180);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.d) {
                        s._movingType = JAM_CONFIG.RIGHT;
                        s.setRotation(90);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.a) {
                        s._movingType = JAM_CONFIG.LEFT;
                        s.setRotation(270);
                        s._lastKeyCode = keyCode;
                    }

                    if (keyCode == cc.KEY.p) {
                        // s.pushBack();
                        s.attack();
                    }
                }
            },

            onKeyReleased: function(keyCode, event){
                var s = event.getCurrentTarget();
                cc.log("Key with keycode " + keyCode + " released" );
                if (keyCode == s._lastKeyCode) {
                    s._movingType = 0;
                    s._lastKeyCode = null;
                }
                if (s.playerNum == 1) {
                    if (keyCode == cc.KEY.space) {
                        s.releaseAttack();
                    }
                } else if (s.playerNum == 2){
                    if (keyCode == cc.KEY.p) {
                        s.releaseAttack();
                    }
                }
            }
        }, this);
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
    },

    pushBack: function() {
        this._isAvailable = false;
        var oldRot = this.getRotation();
        var radians = cc.degreesToRadians(oldRot);
        var x = Math.sin(radians) * 1 * -5;
        var y = Math.cos(radians) * 1 * -5;
        this.runAction(cc.sequence(
            cc.moveBy(0.2, cc.p(x, y)),
            cc.callFunc(function() {
                this._isAvailable = true;
            }.bind(this))
        ));
    },

    checkPlayerCollide: function(playerArray) {
        _.each(playerArray, function(v, k) {
            if (v.playerNum == this.playerNum) return;
            var rect1 = v.getBoundingBox();
            var rect2 = this.getBoundingBox();
            this.isBlock = cc.rectIntersectsRect(rect1, rect2);
        }, this);
    }
});