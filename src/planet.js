/**
 * 
 */
var planet = function (pX, pY, pType) {
    "use strict";
    var that = Object.create(FMENGINE.fmGameObject(3)),
        spatial = FMENGINE.fmSpatialComponent(pX - 50, pY - 50, that),
        renderer = FMENGINE.fmAnimatedSpriteRendererComponent(FMENGINE.fmAssetManager.getAssetByName("planet1"), 100, 100, that),
        physic = FMENGINE.fmCircleComponent(FMENGINE.fmPoint(pX, pY), 15, that);

    renderer.addAnimation("default", [0, 1, 2, 3, 4], 10, false, true);
    renderer.play("default");
    that.type = pType;
    that.gravityArea = FMENGINE.fmGameObject(1);
    that.maxGravity = 1500;
    FMENGINE.fmSpatialComponent(pX - 50, pY - 50, that.gravityArea);
    FMENGINE.fmCircleComponent(FMENGINE.fmPoint(pX, pY), 50, that.gravityArea);
    FMENGINE.fmGame.getCurrentState().add(that.gravityArea);
    that.sound = FMENGINE.fmSoundComponent(that);
    //that.sound.addSound(FMENGINE.fmAssetManager.getAssetByName("enterTheSun"));

    if (that.type === 2) {
        renderer.setImage(FMENGINE.fmAssetManager.getAssetByName("planet2"), 100, 100, that);
    }

    that.addType("planet");

    /**
     * 
     * @param {type} dt
     * @returns {undefined}
     */
    that.update = function (dt) {

    };

    /**
    * Destroy the entity
    */
    that.destroy = function () {
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    return that;
};