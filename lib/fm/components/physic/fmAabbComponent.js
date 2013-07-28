/**
 * Under Creative Commons Licence.
 *
 * @author Simon Chauvin.
 * @param {int} pWidth width of the aabb.
 * @param {int} pHeight height of the aabb.
 * @param {fmGameObject} The game object to which the component belongs.
 * @returns {fmAabbComponent} The axis aligned bounding box component itself.
 */
FMENGINE.fmAabbComponent = function (pWidth, pHeight, pOwner) {
    "use strict";
    /**
     * fmAabbComponent is based on fmPhysicComponent.
     */
    var that = FMENGINE.fmPhysicComponent(pWidth, pHeight, pOwner),
        /**
         * Spatial component reference.
         */
        spatial = pOwner.components[FMENGINE.fmComponentTypes.SPATIAL],
        /**
         * Simulate a movement according to a given x and y velocity.
         */
        tryToMove = function (gameObjects, xVel, yVel) {
            var i,
                j,
                n,
                otherGameObject,
                otherPhysic;
            //Update the position of the game object's collider according to the x and y velocities
            spatial.x += xVel;
            spatial.y += yVel;
            //If no collision is detected
            for (i = 0; i < gameObjects.length; i = i + 1) {
                otherGameObject = gameObjects[i];
                //If a game object is found and is alive and is not the current one
                if (pOwner.getId() !== otherGameObject.getId() && otherGameObject.isAlive()) {
                    for (j = 0; j < that.collidesWith.length; j = j + 1) {
                        otherPhysic = otherGameObject.components[FMENGINE.fmComponentTypes.PHYSIC];
                        if (otherPhysic) {
                            for (n = 0; n < otherPhysic.collidesWith.length; n = n + 1) {
                                if (otherGameObject.hasType(that.collidesWith[j]) || pOwner.hasType(otherPhysic.collidesWith[n])) {
                                    if (otherPhysic.isCollidingWithAabb(that)) {
                                        //Collision detected, impossible to move
                                        //Rollback to old collider positions
                                        spatial.x -= xVel;
                                        spatial.y -= yVel;
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //No collision detected, let's move
            return true;
        },
        /**
         * Move from a given x and y velocity.
         */
        move = function (gameObjects, xVel, yVel) {
            //If there are collision tiles and if the velocity is greater than the size of the tiles
            if ((Math.abs(xVel) >= FMENGINE.fmParameters.COLLIDER_MINIMUM_SIZE 
                    || Math.abs(yVel) >= FMENGINE.fmParameters.COLLIDER_MINIMUM_SIZE)) {
                move(gameObjects, xVel / 2, yVel / 2);
                move(gameObjects, xVel - xVel / 2, yVel - yVel / 2);
                return;
            }

            //Try to move the game object
            if (tryToMove(gameObjects, xVel, yVel)) {
                return;
            }

            //Try to move on the x axis
            var i, vel, maxSpeed = Math.abs(xVel);
            for (i = 0; i < maxSpeed; i = i + 1) {
                if (xVel === 0)
                    vel = 0;
                else if (xVel > 0)
                    vel = 1;
                else
                    vel = -1;
                //If impossible to move the game object is as far as it can be
                if (!tryToMove(gameObjects, vel, 0)) {
                    //TODO Bouncing
                    //that.velocity.x = that.elasticity * -that.velocity.x;
                    break;
                }
            }
            //Try to move on the y axis
            maxSpeed = Math.abs(yVel);
            for (i = 0; i < maxSpeed; i = i + 1) {
                if (yVel === 0)
                    vel = 0;
                if (yVel > 0)
                    vel = 1;
                else
                    vel = -1;
                //If impossible to move the game object is as far as it can be
                if (!tryToMove(gameObjects, 0, vel)) {
                    //TODO Bouncing
                    //that.velocity.y = that.elasticity * -that.velocity.y;
                    break;
                }
            }
        };

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
                    || (worldBounds.length > 1 && xPos + that.width >= worldBounds[1])
                    || (worldBounds.length > 2 && yPos <= worldBounds[2])
                    || (worldBounds.length > 3 && yPos + that.height >= worldBounds[3])) {
                return true;
            }
        }
        //If there are collisions with tiles
        if (collisions.length > 0) {
            tileWidth = collisions.getTileWidth();
            tileHeight = collisions.getTileHeight();
            i1 = Math.floor(yPos / tileHeight);
            j1 = Math.floor(xPos / tileWidth);
            i2 = Math.floor((yPos + that.height) / tileHeight);
            j2 = Math.floor((xPos + that.width) / tileWidth);
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
        if (collider.isCollidingWithAabb(that)) {
            return true;
        }
        return false;
    };

    /**
     * Check if the current aabb component is colliding with another aabb collider
     */
    that.isCollidingWithAabb = function (aabb) {
        var otherSpatial = aabb.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            xPos = spatial.x + that.offset.x,
            yPos = spatial.y + that.offset.y,
            otherXPos = otherSpatial.x + aabb.offset.x,
            otherYPos = otherSpatial.y + aabb.offset.y;
        if ((xPos >= otherXPos + aabb.width)
                || (xPos + that.width <= otherXPos)
                || (yPos >= otherYPos + aabb.height)
                || (yPos + that.height <= otherYPos)) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Check if the current aabb component is colliding with a circle collider.
     */
    that.isCollidingWithCircle = function (circle) {
        var spatialCircle = circle.owner.components[FMENGINE.fmComponentTypes.SPATIAL],
            cornerDist = 0,
            minX = spatial.x + that.offset.x,
            maxX = minX + that.width,
            minY = spatial.y + that.offset.y,
            maxY = minY + that.height,
            circleCenterX = circle.getCenter().x,
            circleCenterY = circle.getCenter().y;

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
        return (cornerDist <= (circle.radius * circle.radius));
    };

    /**
     * Draw debug information.
     */
    that.drawDebug = function (bufferContext) {
        bufferContext.strokeStyle = '#f4f';
        bufferContext.strokeRect(spatial.x + that.offset.x - bufferContext.xOffset, spatial.y + that.offset.y - bufferContext.yOffset, that.width,
                                that.height);
    };

    /**
    * Destroy the component and its objects.
    */
    that.destroy = function () {
        spatial = null;
        //TODO destroy parent attributes and objects
        that = null;
    };

    return that;
};