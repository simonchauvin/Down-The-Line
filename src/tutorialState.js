/*globals FM */
/**
 * Start menu state
 */
var tutorialState = function () {
    "use strict";
    FM.State.call(this);
};
tutorialState.prototype = Object.create(FM.State.prototype);
tutorialState.prototype.constructor = tutorialState;
/**
 * Initialize the menu
 */
tutorialState.prototype.init = function () {
    "use strict";
    FM.State.prototype.init.call(this);

    var text = new FM.GameObject(99),
        renderer;
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 100, 80, text));
    renderer = text.addComponent(new FM.TextRendererComponent("How to play", text));
    renderer.setFormat('#fff', '40px sans-serif', 'middle');
    this.add(text);

    text = new FM.GameObject(99);
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 55, 140, text));
    renderer = text.addComponent(new FM.TextRendererComponent("Click to start", text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(text);

    text = new FM.GameObject(99);
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 240, 300, text));
    renderer = text.addComponent(new FM.TextRendererComponent("Bring the pink and blue entities to the sun.", text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(text);
    text = new FM.GameObject(99);
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 240, 340, text));
    renderer = text.addComponent(new FM.TextRendererComponent("Click to put down waypoints and create a path.", text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(text);
    text = new FM.GameObject(99);
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 240, 380, text));
    renderer = text.addComponent(new FM.TextRendererComponent("Near waypoints entities will follow the path you created.", text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(text);
    text = new FM.GameObject(99);
    text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 240, 420, text));
    renderer = text.addComponent(new FM.TextRendererComponent("Entities can drag the others away when they meet.", text));
    renderer.setFormat('#fff', '20px sans-serif', 'middle');
    this.add(text);
};

/**
 * Update of the menu state
 */
tutorialState.prototype.update = function (dt) {
    "use strict";
    FM.State.prototype.update.call(this, dt);

    if (FM.Game.isKeyReleased(FM.Keyboard.ENTER) || FM.Game.isMouseClicked()) {
        FM.Game.switchState(new playState(levels()));
    }
};