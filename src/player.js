/*globals FM */
/**
 * 
 */
var Player = function (pMaxNumberOfWaypoints, pMinNumberOfEntities) {
    "use strict";

    this.entities = [];

    this.currentNumberOfWaypoints = 0;
    this.maxNumberOfWaypoints = pMaxNumberOfWaypoints;

    this.currentNumberOfEntities = 0;
    this.minNumberOfEntities = pMinNumberOfEntities;

    this.waypoints = [];
};