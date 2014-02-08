/*globals FM */
/**
 * Start menu state
 */
var endState = function () {
    "use strict";
    FM.State.apply(this);
};
endState.prototype = Object.create(FM.State.prototype);
/**
 * Initialize the menu
 */
endState.prototype.init = function () {
    "use strict";
    FM.State.prototype.init.apply(this);
    FM.Parameters.backgroundColor = 'rgb(0,0,0)';
    var text = new FM.GameObject(99),
        sp = text.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 150, 300, text)),
        renderer = text.addComponent(new FM.TextRendererComponent("Thanks for playing!", text));
    renderer.setFormat('#fff', '40px sans-serif', 'middle');
    this.add(text);
};

/**
 * Update of the menu state
 */
endState.prototype.update = function (dt) {
    "use strict";
    FM.State.prototype.update.apply(this, [dt]);

};