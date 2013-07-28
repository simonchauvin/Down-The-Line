/**
 * 
 */
var player = function (pMaxNumberOfWaypoints, pMinNumberOfEntities) {
    "use strict";
    var that = {};

    that.entities = [];

    that.currentNumberOfWaypoints = 0;
    that.maxNumberOfWaypoints = pMaxNumberOfWaypoints;

    that.currentNumberOfEntities = 0;
    that.minNumberOfEntities = pMinNumberOfEntities;

    that.waypoints = [];

    return that;
};