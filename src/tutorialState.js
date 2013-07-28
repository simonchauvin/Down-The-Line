/**
 * Start menu state
 * @returns {___that0}
 */
function tutorialState() {
    "use strict";
    var that = Object.create(FMENGINE.fmState());

    /**
     * Initialize the menu
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();

        var text = FMENGINE.fmGameObject(99),
            sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 100, 80, text),
            renderer = FMENGINE.fmTextRendererComponent("How to play", text);
        renderer.setFormat('#fff', '40px sans-serif', 'middle');
        that.add(text);

        text = FMENGINE.fmGameObject(99);
        sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 55, 140, text);
        renderer = FMENGINE.fmTextRendererComponent("Click to start", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);

        text = FMENGINE.fmGameObject(99);
        sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 240, 300, text);
        renderer = FMENGINE.fmTextRendererComponent("Bring the pink and blue entities to the sun.", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);
        text = FMENGINE.fmGameObject(99);
        sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 240, 340, text);
        renderer = FMENGINE.fmTextRendererComponent("Click to put down waypoints and create a path.", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);
        text = FMENGINE.fmGameObject(99);
        sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 240, 380, text);
        renderer = FMENGINE.fmTextRendererComponent("Near waypoints entities will follow the path you created.", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);
        text = FMENGINE.fmGameObject(99);
        sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 240, 420, text);
        renderer = FMENGINE.fmTextRendererComponent("Entities can drag the others away when they meet.", text);
        renderer.setFormat('#fff', '20px sans-serif', 'middle');
        that.add(text);
    };

    /**
     * Update of the menu state
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

        if (FMENGINE.fmGame.isKeyReleased(FMENGINE.fmKeyboard.ENTER) || FMENGINE.fmGame.isMouseClicked()) {
            FMENGINE.fmGame.switchState(playState(levels()));
        }
    };

    return that;
}