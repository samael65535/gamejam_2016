/**
 * Created by samael on 16/1/30.
 */

var Player = cc.Sprite.extend({
    _isAvailable: false,
    _isMoving: false,
    _isMovingAnimation: false,
    _movingType: 0,
    _weapon: null,
    _headSprite: null,
    playerNum: 0,
    isBlock: false,
    isDeath: false,
    _triggerWidth: 50,
    _triggerHeight: 20,
    ctor: function(playerNum) {
        this._super("res/dongzuo-1p/zou01-1p.png");
        this.setCascadeColorEnabled(true);

        this._headSprite = new cc.Sprite("res/dongzuo-1p/jingzhi-1p.png");
        this.attr({
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.playerNum = playerNum;
        var size = this.getContentSize();
        this._headSprite.attr({
            x: size.width / 2,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.2
        });
        this.addChild(this._headSprite);
        this._isAvailable = true;
        this.scheduleUpdate();
        this._lastKeyCode = null;


        this._board = new cc.LayerColor(cc.color(25, 25, 25, 255));
        this._board.setContentSize(cc.size(this._triggerWidth, this._triggerHeight));
        this.addChild(this._board, JAM_ORDER.board);


        this.resetWeapon();
        return true;
    },

    getRect: function() {
        var pos = this.getPosition();
        return cc.rect(pos.x, pos.y, this._triggerWidth, this._triggerHeight);
    },

    startMoving: function() {
        var animationAction = Util.createAnimation("res/dongzuo-1p/zou0", 1, 2, 2/24, "-1p.png");
        this.runAction(cc.repeatForever(animationAction));
    },

    stopAnimation: function() {
        this.stopAllActions();
    },

    attack: function() {
        this._weapon.attack()
    },

    attackAnimation: function(weaponsName, start, end) {
        var frameName = "res/dongzuo-1p/" + weaponsName;
        var animationAction = Util.createAnimation(frameName, start, end, 2/24, "-1p.png");
        this._headSprite.runAction(
            animationAction
        );
    },

    stopAttackAnimation: function() {
        this._headSprite.stopAllActions();
    },

    releaseAttack: function() {
        this._weapon.releaseAttack();
    },

    update: function(dt) {
        var type = this._movingType;
        this.move(type, dt)
    },

    move: function(type, dt) {
        if (this._isAvailable == false) return;
        if (this._isMoving == false) {
            if(this._isMovingAnimation == true) {
                this.stopAnimation();
            }
            this._isMovingAnimation = false;
            return;
        }
        if (this._isMoving && this._isMovingAnimation == false) {
            this._isMoving = true;
            this._isMovingAnimation = true;
            this.startMoving();
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
        this.isBlock = false;
        this.attr({
            x: oldX + x,
            y: oldY + y
        });
    },

    onEnter: function () {
        this._super();
        this.listener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if (this.isAvailable == false) return;
                var s = event.getCurrentTarget();
                if (s.playerNum == 1) {
                    if (keyCode == cc.KEY.up) {
                        s._movingType = JAM_CONFIG.UP;
                        s._isMoving = true;
                        s.setRotation(0);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.down) {
                        s._movingType = JAM_CONFIG.DOWN;
                        s._isMoving = true;
                        s.setRotation(180);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.right) {
                        s._movingType = JAM_CONFIG.RIGHT;
                        s._isMoving = true;
                        s.setRotation(90);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.left) {
                        s._movingType = JAM_CONFIG.LEFT;
                        s._isMoving = true;
                        s.setRotation(270);
                        s._lastKeyCode = keyCode;
                    }

                    if (keyCode == cc.KEY.space) {
                        s.attack();
                    }
                } else if (s.playerNum == 2) {
                    if (keyCode == cc.KEY.w) {
                        s._movingType = JAM_CONFIG.UP;
                        s._isMoving = true;
                        s.setRotation(0);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.s) {
                        s._movingType = JAM_CONFIG.DOWN;
                        s._isMoving = true;
                        s.setRotation(180);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.d) {
                        s._movingType = JAM_CONFIG.RIGHT;
                        s._isMoving = true;
                        s.setRotation(90);
                        s._lastKeyCode = keyCode;
                    }
                    if (keyCode == cc.KEY.a) {
                        s._movingType = JAM_CONFIG.LEFT;
                        s._isMoving = true;
                        s.setRotation(270);
                        s._lastKeyCode = keyCode;
                    }

                    if (keyCode == cc.KEY.p) {
                        s.attack();
                    }
                }
            },

            onKeyReleased: function(keyCode, event){
                var s = event.getCurrentTarget();
                if (keyCode == s._lastKeyCode) {
                    s._isMoving = false;
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
                return;
            }
        });
        cc.eventManager.addListener(this.listener, this);
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this.listener);
    },

    pushBack: function() {
        this._isAvailable = false;
        var oldRot = this.getRotation();
        var radians = cc.degreesToRadians(oldRot);
        var x = Math.sin(radians) * 1 * -10;
        var y = Math.cos(radians) * 1 * -10;
        this.runAction(cc.sequence(
            cc.moveBy(0.2, cc.p(x, y)),
            cc.callFunc(function() {
                this._isAvailable = true;
            }.bind(this))
        ));
    },

    checkPlayerCollide: function(playerArray) {
        _.each(playerArray, function(v, k) {
            if (v.playerNum == this.playerNum|| v.isDeath == true) return;
            var rect1 = v.getBoundingBox();
            var rect2 = this.getBoundingBox();
            this.isBlock = cc.rectIntersectsRect(rect1, rect2) &&  this.isDeath == false && v.isDeath == false;
            if (v._movingType == this._movingType && this.isBlock) {
                this._movingType = 0;
            }
        }, this);
    },

    doDeath: function(type) {
        if (this.isDeath) return;
        this.isDeath = true;
        var blood = new cc.Sprite("res/effect/feijian01.png");
        var action = Util.createAnimation("res/effect/feijian0", 1, 4, 2/24, ".png");
        blood.runAction(action);
        var r = 0;
        switch(type) {
            case 1:
                r = 180;
                break;
            case 2:
                r = 270;
                break;
            case 3:
                r = 0;
                break;
            case 4:
                r = 90;
                break;
            default:
                break;
        }
        blood.setRotation(r);
        blood.setPosition(this.getPosition());
        GameLayerInstance.addChild(blood, JAM_ORDER.board);
        this.removeFromParent();
        this.removeAllChildren();
    },

    loadWeapon: function(weapon) {
        if (weapon == this._weapon.itemType) return;
        var pos = this._weapon.getPosition();
        this._weapon.removeFromParent();
        this._weapon = new Spear(this);
        this._weapon.setPosition(pos);

        this._headSprite.addChild(this._weapon, 10);
        this._weapon.checkOrder();
    },

    resetWeapon: function() {
        if (this._weapon) this._weapon.removeFromParent();
        this._weapon = new Sword(this);
        this._headSprite.addChild(this._weapon);
        this._weapon.checkOrder();
    }

});