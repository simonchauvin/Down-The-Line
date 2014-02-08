/*globals FM */
/**
 * 
 */
var planet = function (pX, pY, pType) {
    "use strict";
    var that = new FM.GameObject(3),
        spatial = that.addComponent(new FM.SpatialComponent(pX - 50, pY - 50, that)),
        renderer = that.addComponent(new FM.AnimatedSpriteRendererComponent(FM.assetManager.getAssetByName("planet1"), 100, 100, that)),
        physic = that.addComponent(new FM.CircleComponent(50, that));

    renderer.addAnimation("default", [0, 1, 2, 3, 4], 10, true);
    renderer.play("default");
    that.type = pType;
    that.gravityArea = new FM.GameObject(1);
    that.maxGravity = 1500;
    that.gravityArea.addComponent(new FM.SpatialComponent(pX - 50, pY - 50, that.gravityArea));
    that.gravityArea.addComponent(new FM.CircleComponent(300, that.gravityArea));
    FM.game.getCurrentState().add(that.gravityArea);
    that.sound = that.addComponent(new FM.AudioComponent(that));
    //that.sound.addSound(FM.fmAssetManager.getAssetByName("enterTheSun"));

    if (that.type === 2) {
        renderer.setImage(FM.AssetManager.getAssetByName("planet2"), 100, 100, that);
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