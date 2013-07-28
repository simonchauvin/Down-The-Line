/**
 * Start menu state
 * @returns {___that0}
 */
function endState() {
    "use strict";
    var that = Object.create(FMENGINE.fmState());

    /**
     * Initialize the menu
     */
    that.init = function () {
        Object.getPrototypeOf(that).init();
        FMENGINE.fmParameters.backgroundColor = 'rgb(0,0,0)';
        var text = FMENGINE.fmGameObject(99),
            sp = FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 150, 300, text),
            renderer = FMENGINE.fmTextRendererComponent("Thanks for playing!", text);
        renderer.setFormat('#fff', '40px sans-serif', 'middle');
        that.add(text);
    };

    /**
     * Update of the menu state
     */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);

    };

    return that;
}