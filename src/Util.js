/**
 * Created by samael on 16/1/30.
 */
var Util = {
    createAnimation: function(filename, start, end, unit, suffix) {
        var animation = new cc.Animation();
        //
        for (var i = start; i <= end; i++) {
            var frameName =  filename + i + suffix;
            animation.addSpriteFrameWithFile(frameName);
        }
        //animation.setRestoreOriginalFrame(true);
        animation.setDelayPerUnit(unit);
        var animationAction = new cc.Animate(animation);
        return animationAction;
        this.runAction(cc.repeatForever(animationAction));
    }
}