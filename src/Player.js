/**
 * Created by samael on 16/1/30.
 */

var Player = cc.Sprite.extend({
    _isAvailable: false,
    _MoveForward: false,
    _movingType: 0,
    ctor: function() {
        this._super("res/player.png");
        this._isAvailable = true;
        this.scheduleUpdate()
        return true;
    },

    update: function(dt) {
        var type = this._movingType;
        this.move(type, dt)
    },

    move: function(type, dt) {
        if (type == 0) return;
        var oldRot = this.getRotation();
        var oldX = this.getPositionX();
        var oldY  = this.getPositionY();
        var radians = cc.degreesToRadians(oldRot);
        // 向前
        var x = Math.sin(radians) * JAM_CONFIG.move_distance * dt;
        var y = Math.cos(radians) * JAM_CONFIG.move_distance * dt;
        if (type == -1) {
            x = -x;
            y = -y;
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
                var oldRot = s.getRotation() % 360;

                if (keyCode == cc.KEY.right) {
                    console.log(oldRot, oldRot + JAM_CONFIG.rotate);
                    s.setRotation(oldRot + JAM_CONFIG.rotate);
                }
                if (keyCode == cc.KEY.left) {
                    s.setRotation(oldRot - JAM_CONFIG.rotate);
                }

                if (keyCode == cc.KEY.up) {
                    s._movingType = 1;
                }
                if (keyCode == cc.KEY.down) {
                    s._movingType = -1;
                }

                if (keyCode == cc.KEY.space) {
                    s.pushBack();
                }
            },
            onKeyReleased: function(keyCode, event){
                var s = event.getCurrentTarget();
                cc.log("Key with keycode " + keyCode + " released" );
                console.log(s.getPosition())
                if (keyCode == cc.KEY.up || keyCode == cc.KEY.down) {
                    s._movingType = 0;
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
    }
});