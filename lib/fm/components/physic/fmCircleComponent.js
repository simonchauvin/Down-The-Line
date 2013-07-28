/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmCircleComponent} The circle component itself.
 */
FMENGINE.fmCircleComponent = function (pCenter, pRadius, pOwner) {
    "use strict";
    /**
     * fmB2CircleComponent is based on fmPhysicComponent.
     */
    var that = FMENGINE.fmPhysicComponent(pRadius * 2, pRadius * 2, pOwner),
        /**
         * Center of the circle.
         */
        center = pCenter,
	/**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL];
    /**
     * Radius of the circle
     */
    that.radius = pRadius;

    /**
    * Update the component.
    */
    that.update = function (dt) {
        //Add x acceleration to x velocity
        var vel = that.velocity.x + that.acceleration.x * dt;
        if (Math.abs(vel) <= that.maxVelocity.x) {
            that.velocity.x = vel;
        } else if (vel < 0) {
            that.velocity.x = -that.maxVelocity.x;
        } else if (vel > 0) {
            that.velocity.x = that.maxVelocity.x;
        }

        //Add y acceleration to y velocity
        vel = that.velocity.y + that.acceleration.y * dt;
        if (Math.abs(vel) <= that.maxVelocity.y) {
            that.velocity.y = vel;
	} else if (vel < 0) {
            that.velocity.y = -that.maxVelocity.y;
	} else if (vel > 0) {
            that.velocity.y = that.maxVelocity.y;
	}

        //Add friction
        that.velocity.x *= 1 - that.friction;
        that.velocity.y *= 1 - that.friction;

        //If this game object collides with at least one type of game object
        /*if (that.collidesWith.length > 0) {
            var quad = FMENGINE.fmGame.getCurrentState().getQuad(),
                gameObjects = quad.retrieve(pOwner);
            //If there are other game objects near this one
            if (gameObjects.length > 0) {
                //Move the game object
                //move(gameObjects, that.velocity.x * dt, that.velocity.y * dt);
            }
        }*/

        spatial.x += that.velocity.x * dt;
        spatial.y += that.velocity.y * dt;

        //TODO add direction debug
        /*if (xVelocity_ != 0) {
            direction = Math.atan(yVelocity_ / xVelocity_) / (Math.PI / 180);
        } else {
            direction = 0;
        }*/
    };

    /**
     * Check collisions with the world bounds and tiles.
     */
    that.checkWorldCollisions = function (collisions, worldBounds) {
        var xPos = spatial.x + that.offset.x,
            yPos = spatial.y + that.offset.y,
            tileWidth,
            tileHeight,
            i1,
            j1,
            i2,
            j2,
            i,
            j;
        //If the world has solid bounds
        if (worldBounds.length > 0) {
            //If the game object is colliding with one of those bounds
            if ((worldBounds.length > 0 && xPos <= worldBounds[0])
                    || (worldBounds.length > 1 && xPos + that.radius * 2 >= worldBounds[1])
                    || (worldBounds.length > 2 && yPos <= worldBounds[2])
                    || (worldBounds.length > 3 && yPos + that.radius * 2 >= worldBounds[3])) {
                return true;
            }
        }
        //If there are collisions in the static world
        if (collisions.length > 0) {
            //TODO change so that it is a circle vs aabb collision
            tileWidth = collisions.getTileWidth();
            tileHeight = collisions.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.radius * 2) / tileHeight);
            j2 = Math.floor((xPos + that.radius * 2) / tileWidth);
            for (i = i1; i <= i2; i = i + 1) {
                for (j = j1; j <= j2; j = j + 1) {
                    if (collisions[i] && collisions[i][j] === 1) {
                        if (j === j1 || j === j2 || i === i1 || i === i2) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    /**
     * Check collisions with other game object's collider.
     */
    that.checkCollisions = function (collider) {
        if (collider.isCollidingWithCircle(that)) {
            return true;
        }
        return false;
    };

    /**
     * Check if the current circle component is colliding with an aabb collider
     */
    that.isCollidingWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            cornerDist = 0,
            minX = otherSpatial.x + aabb.offset.x,
            maxX = minX + aabb.getWidth(),
            minY = otherSpatial.y + aabb.offset.y,
            maxY = minY + aabb.getHeight(),
            circleCenterX = spatial.x + that.offset.x + that.radius,
            circleCenterY = spatial.y + that.offset.y + that.radius;

        if (circleCenterX < minX) {
            cornerDist += (minX - circleCenterX) * (minX - circleCenterX);
        } else if (circleCenterX > maxX) {
            cornerDist += (circleCenterX - maxX) * (circleCenterX - maxX);
        }
        if (circleCenterY < minY) {
            cornerDist += (minY - circleCenterY) * (minY - circleCenterY);
        } else if (circleCenterY > maxY) {
            cornerDist += (circleCenterY - maxY) * (circleCenterY - maxY);
        }
        //Return true if the dist to the corner is less than the radius of the circle collider
        return cornerDist <= (that.radius * that.radius);
    };

    /**
     * Check if the current circle component is colliding with another circle collider
     */
    that.isCollidingWithCircle = function (circle) {
        var spatialCircle = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            minX = spatial.x + that.offset.x,
            minY = spatial.y + that.offset.y,
            circleCenterX = spatialCircle.x + circle.offset.x + circle.radius,
            circleCenterY = spatialCircle.y + circle.offset.y + circle.radius,
            dX = (minX + that.radius) - (circleCenterX),
            dY = (minY + that.radius) - (circleCenterY),
            sqrD = (dX * dX) + (dY * dY);
        if (sqrD > (that.radius + circle.radius) * (that.radius + circle.radius)) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.beginPath();
        bufferContext.globalAlpha = 0.3;
        bufferContext.arc((center.x + that.offset.x) - bufferContext.xOffset, (center.y + that.offset.y) - bufferContext.yOffset, that.radius, 0, 2 * Math.PI, false);
        bufferContext.fill();
        bufferContext.globalAlpha = 1;
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        //TODO destroy parent attributes and objects
        allowCollisions = null;
        that = null;
    };

    /**
     * Retrieve the center of the circle.
     * @returns {fmPoint} center of the circle.
     */
    that.getCenter = function () {
        return center;
    };

    return that;
};