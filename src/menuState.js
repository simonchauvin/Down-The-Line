/*globals FM */
/**
 * Start menu state
 */
var menuState = function () {
    "use strict";
    FM.State.call(this);
};
menuState.prototype = Object.create(FM.State.prototype);
menuState.prototype.constructor = menuState;
/**
 * Initialize the menu
 */
menuState.prototype.init = function () {
    "use strict";
    FM.State.prototype.init.call(this);

    var menu = new FM.GameObject(5);
    menu.addComponent(new FM.SpatialComponent(0, 0, menu));
    menu.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("menu"), 800, 576, menu));
    this.add(menu);
};

/**
 * Update of the menu state
 */
menuState.prototype.update = function (dt) {
    "use strict";
    FM.State.prototype.update.call(this, dt);

    if (FM.Game.isKeyReleased(FM.Keyboard.ENTER) || FM.Game.isMouseClicked()) {
        FM.Game.switchState(new tutorialState());
    }
};