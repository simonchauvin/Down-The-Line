/**
 * Object representing a point.
 * @author Simon Chauvin
 * @param {int} pX x position.
 * @param {int} pY y position.
 */
FMENGINE.fmPoint = function (pX, pY) {
    "use strict";
    var that = {};

    /**
     * x position.
     */
    that.x = pX;
    /**
     * y position.
     */
    that.y = pY;

    /**
    * Destroy the point and its objects.
    */
    that.destroy = function () {
        that = null;
    };

    return that;
};