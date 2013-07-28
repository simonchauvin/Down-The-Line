/**
 * Start menu state
 * @returns {___that0}
 */
function menuState() {
    "use strict";
    var that = Object.create(FMENGINE.fmState());

    /**
     * Initialize the menu
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        var menu = FMENGINE.fmGameObject(5),
            sp = FMENGINE.fmSpatialComponent(0, 0, menu),
            renderer = FMENGINE.fmSpriteRendererComponent(FMENGINE.fmAssetManager.getAssetByName("menu"), 800, 576, menu);
        that.add(menu);
    };

    /**
     * Update of the menu state
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        if (FMENGINE.fmGame.isKeyReleased(FMENGINE.fmKeyboard.ENTER) || FMENGINE.fmGame.isMouseClicked()) {
            FMENGINE.fmGame.switchState(tutorialState());
        }
    };

    return that;
}