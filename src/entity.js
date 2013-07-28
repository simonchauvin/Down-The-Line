/**
 * 
 */
var entity = function (pX, pY, pType) {
    "use strict";
    var that = Object.create(FMENGINE.fmGameObject(10)),
        spatial = FMENGINE.fmSpatialComponent(pX, pY, that),
        renderer = FMENGINE.fmSpriteRendererComponent(FMENGINE.fmAssetManager.getAssetByName("entity1"), 30, 30, that),
        physic = FMENGINE.fmAabbComponent(30, 30, that),
        path = FMENGINE.fmSimplePathComponent(that),
        xPlanetReached = false,
        yPlanetReached = false;

    that.gravitySpeed = FMENGINE.fmPoint(0, 0);
    that.planet = null;
    that.lost = false;
    that.reachedGoal = false;
    that.hidden = false;
    that.type = pType;
    that.sound = FMENGINE.fmSoundComponent(that);
    that.sound.addSound(FMENGINE.fmAssetManager.getAssetByName("enterTheSun"));
    that.sound.addSound(FMENGINE.fmAssetManager.getAssetByName("attracted"));
    that.sound.addSound(FMENGINE.fmAssetManager.getAssetByName("collision"));
    that.waypoints = [];

    if (that.type === 2) {
        renderer.setImage(FMENGINE.fmAssetManager.getAssetByName("entity2"), 30, 30, that);
    }

    that.addType("entity");
    physic.addTypeToCollideWith("waypoint");

    /**
     * 
     * @param {type} dt
     * @returns {undefined}
     */
    that.update = function (dt) {
        if (that.planet) {
            var xPos =  spatial.x + physic.offset.x + physic.width / 2,
                yPos =  spatial.y + physic.offset.y + physic.height / 2,
                planetSpatial = that.planet.components[FMENGINE.fmComponentTypes.SPATIAL],
                planetPhysic = that.planet.components[FMENGINE.fmComponentTypes.PHYSIC];
            //Update x position
            if (xPos < planetSpatial.x + 50) {
                if (physic.isCollidingWithCircle(planetPhysic)) {
                    physic.velocity.x = (planetSpatial.x + 50) - xPos;
                    xPlanetReached = true;
                    //console.log("x planet reached");
                } else {
                    physic.velocity.x += that.gravitySpeed.x * dt;
                }
            } else if (xPos > planetSpatial.x + 50) {
                if (physic.isCollidingWithCircle(planetPhysic)) {
                    physic.velocity.x = xPos - (planetSpatial.x + 50);
                    xPlanetReached = true;
                    //console.log("x planet reached");
                } else {
                    physic.velocity.x += -that.gravitySpeed.x * dt;
                }
            } else {
                xPlanetReached = true;
                physic.velocity.x = 0;
                //console.log("x planet reached");
            }
            //Update y position
            if (yPos < planetSpatial.y + 50) {
                if (physic.isCollidingWithCircle(planetPhysic)) {
                    physic.velocity.y = (planetSpatial.y + 50) - yPos;
                    yPlanetReached = true;
                    //console.log("y planet reached");
                } else {
                    physic.velocity.y += that.gravitySpeed.y * dt;
                }
            } else if (yPos > planetSpatial.y + 50) {
                if (physic.isCollidingWithCircle(planetPhysic)) {
                    physic.velocity.y = yPos - (planetSpatial.y + 50);
                    yPlanetReached = true;
                    //console.log("y planet reached");
                } else {
                    physic.velocity.y += -that.gravitySpeed.y * dt;
                }
            } else {
                yPlanetReached = true;
                physic.velocity.y = 0;
                //console.log("y planet reached");
            }
            if (xPlanetReached && yPlanetReached) {
                that.planet = null;
                that.lost = true;
                path.stopFollowingPath();
                path.clearPath();
                path.add(spatial.x + 50, spatial.y + 50, 0);
                path.startFollowingPath(100, 0);
            }
        } else {
            xPlanetReached = false;
            yPlanetReached = false;
        }
    };

    /**
    * Destroy the entity
    */
    that.destroy = function () {
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    /**
     * 
     * @returns {undefined}
     */
    that.setPath = function (pPath, index) {
        var i,
            waypoint,
            waypointSpatial;
        path.clearPath();
        for (i = pPath.length - 1; i >= 0; i = i - 1) {
            waypoint = pPath[i];
            waypointSpatial = waypoint.components[FMENGINE.fmComponentTypes.SPATIAL];
            path.add(waypointSpatial.x + 40, waypointSpatial.y + 40);
        }
        path.startFollowingPath(100, index);
    };

    /**
     * 
     * @returns {undefined}
     */
    that.addWaypoint = function (pWaypoint) {
        var waypointSpatial = pWaypoint.components[FMENGINE.fmComponentTypes.SPATIAL];
        that.waypoints.push(pWaypoint);
        path.add(waypointSpatial.x + 40, waypointSpatial.y + 40);
        if (path.getLength() <= 1) {
            path.startFollowingPath(100);
        } else {
            path.resumeFollowingPath();
        }
    };

    /**
     * 
     * @returns {undefined}
     */
    that.getCurrentPathIndex = function () {
        return path.getCurrentIndex();
    };

    /**
     * 
     * @returns {undefined}
     */
    that.getWaypoints = function () {
        var pathWaypoint,
            waypoint,
            waypoints = [],
            i;
        for (i = 0; i < path.getLength(); i = i + 1) {
            pathWaypoint = path.getWaypoints()[i];
            waypoint = FMENGINE.fmGameObject(0);
            FMENGINE.fmSpatialComponent(pathWaypoint.x - 40, pathWaypoint.y - 40, waypoint);
            waypoints.push(waypoint);
        }
        return waypoints;
    };

    /**
     * 
     * @returns {undefined}
     */
    that.getCurrentWaypoint = function () {
        var pathWaypoint = path.getCurrentWaypoint(),
            waypoint = FMENGINE.fmGameObject(0);
        FMENGINE.fmSpatialComponent(pathWaypoint.x - 40, pathWaypoint.y - 40, waypoint);
        return waypoint;
    };

    /**
     * 
     */
    that.hasPath = function () {
        return path.getLength() > 0;
    };

    return that;
};