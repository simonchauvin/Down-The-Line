/*globals FM */
/**
 * 
 */
var entity = function (pX, pY, pType) {
    "use strict";
    FM.GameObject.call(this, 10);
    this.spatial = this.addComponent(new FM.SpatialComponent(pX, pY, this));
    this.renderer = this.addComponent(new FM.SpriteRendererComponent(FM.AssetManager.getAssetByName("entity1"), 30, 30, this));
    this.physic = this.addComponent(new FM.AabbComponent(30, 30, this));
    this.path = this.addComponent(new FM.SimplePathComponent(this));
    this.xPlanetReached = false;
    this.yPlanetReached = false;

    this.gravitySpeed = new FM.Vector(0, 0);
    this.planet = null;
    this.lost = false;
    this.reachedGoal = false;
    this.hidden = false;
    this.type = pType;
    this.sound = this.addComponent(new FM.AudioComponent(this));
    this.sound.addSound(FM.AssetManager.getAssetByName("enterTheSun"));
    this.sound.addSound(FM.AssetManager.getAssetByName("attracted"));
    this.sound.addSound(FM.AssetManager.getAssetByName("collision"));
    this.waypoints = [];

    if (this.type === 2) {
        this.renderer.setImage(FM.AssetManager.getAssetByName("entity2"), 30, 30);
    }

    this.addType("entity");
};
entity.prototype = Object.create(FM.GameObject.prototype);
entity.prototype.constructor = entity;
/**
 * 
 * @param {type} dt
 * @returns {undefined}
 */
entity.prototype.update = function (dt) {
    "use strict";
    if (this.planet) {
        var xPos =  this.spatial.position.x + this.physic.offset.x + this.physic.width / 2,
            yPos =  this.spatial.position.y + this.physic.offset.y + this.physic.height / 2,
            planetSpatial = this.planet.components[FM.ComponentTypes.SPATIAL],
            planetPhysic = this.planet.components[FM.ComponentTypes.PHYSIC];
        //Update x position
        if (xPos < planetSpatial.position.x + 50) {
            if (this.physic.overlapsWithCircle(planetPhysic)) {
                this.physic.velocity.x = (planetSpatial.position.x + 50) - xPos;
                this.xPlanetReached = true;
                //console.log("x planet reached");
            } else {
                this.physic.velocity.x += this.gravitySpeed.x * dt;
            }
        } else if (xPos > planetSpatial.position.x + 50) {
            if (this.physic.overlapsWithCircle(planetPhysic)) {
                this.physic.velocity.x = xPos - (planetSpatial.position.x + 50);
                this.xPlanetReached = true;
                //console.log("x planet reached");
            } else {
                this.physic.velocity.x += -this.gravitySpeed.x * dt;
            }
        } else {
            this.xPlanetReached = true;
            this.physic.velocity.x = 0;
            //console.log("x planet reached");
        }
        //Update y position
        if (yPos < planetSpatial.position.y + 50) {
            if (this.physic.overlapsWithCircle(planetPhysic)) {
                this.physic.velocity.y = (planetSpatial.position.y + 50) - yPos;
                this.yPlanetReached = true;
                //console.log("y planet reached");
            } else {
                this.physic.velocity.y += this.gravitySpeed.y * dt;
            }
        } else if (yPos > planetSpatial.position.y + 50) {
            if (this.physic.overlapsWithCircle(planetPhysic)) {
                this.physic.velocity.y = yPos - (planetSpatial.position.y + 50);
                this.yPlanetReached = true;
                //console.log("y planet reached");
            } else {
                this.physic.velocity.y += -this.gravitySpeed.y * dt;
            }
        } else {
            this.yPlanetReached = true;
            this.physic.velocity.y = 0;
            //console.log("y planet reached");
        }
        if (this.xPlanetReached && this.yPlanetReached) {
            this.planet = null;
            this.lost = true;
            this.path.stopFollowingPath();
            this.path.clearPath();
            this.path.add(this.spatial.position.x + 50, this.spatial.position.y + 50, 0);
            this.path.startFollowingPath(100, 0);
        }
    } else {
        this.xPlanetReached = false;
        this.yPlanetReached = false;
    }
};

/**
* Destroy the entity
*/
entity.prototype.destroy = function () {
    "use strict";
    FM.GameObject.prototype.destroy.call(this);
};

/**
 * 
 * @returns {undefined}
 */
entity.prototype.setPath = function (pPath, index) {
    "use strict";
    var i,
        waypoint,
        waypointSpatial;
    this.path.clearPath();
    for (i = pPath.length - 1; i >= 0; i = i - 1) {
        waypoint = pPath[i];
        waypointSpatial = waypoint.components[FM.ComponentTypes.SPATIAL];
        this.path.add(waypointSpatial.position.x + 40, waypointSpatial.position.y + 40);
    }
    this.path.startFollowingPath(100, index);
};

/**
 * 
 * @returns {undefined}
 */
entity.prototype.addWaypoint = function (pWaypoint) {
    "use strict";
    var waypointSpatial = pWaypoint.components[FM.ComponentTypes.SPATIAL];
    this.waypoints.push(pWaypoint);
    this.path.add(waypointSpatial.position.x + 40, waypointSpatial.position.y + 40);
    if (this.path.getLength() <= 1) {
        this.path.startFollowingPath(100);
    } else {
        this.path.resumeFollowingPath();
    }
};

/**
 * 
 * @returns {undefined}
 */
entity.prototype.getCurrentPathIndex = function () {
    "use strict";
    return this.path.getCurrentIndex();
};

/**
 * 
 * @returns {undefined}
 */
entity.prototype.getWaypoints = function () {
    "use strict";
    var pathWaypoint,
        waypoint,
        waypoints = [],
        i;
    for (i = 0; i < this.path.getLength(); i = i + 1) {
        pathWaypoint = this.path.getWaypoints()[i];
        waypoint = new FM.GameObject(0);
        waypoint.addComponent(new FM.SpatialComponent(pathWaypoint.x - 40, pathWaypoint.y - 40, waypoint));
        waypoints.push(waypoint);
    }
    return waypoints;
};

/**
 * 
 * @returns {undefined}
 */
entity.prototype.getCurrentWaypoint = function () {
    "use strict";
    var pathWaypoint = this.path.getCurrentWaypoint(),
        waypoint = new FM.GameObject(0);
    waypoint.addComponent(new FM.SpatialComponent(pathWaypoint.x - 40, pathWaypoint.y - 40, waypoint));
    return waypoint;
};

/**
 * 
 */
entity.prototype.hasPath = function () {
    "use strict";
    return this.path.getLength() > 0;
};