/*globals FM */
/**
 * Start play state
 */
var playState = function (pLevels) {
    "use strict";
    FM.State.apply(this);
    this.game = FM.Game;
    this.levels = pLevels;
    this.assetManager = FM.AssetManager;
    this.param = FM.Parameters;
    this.background = null;
    this.replay = null;
    this.victory = null;
    this.victoryLabel = null;
    this.path = null;
    this.lastRadius = 30;
    this.defeat = false;
    this.thePlayer = null;
    this.hollow = null;
    this.goal = null;
    this.numberOfWaypointsLabel = null;
    this.waypointsIndexesLabel = [];
    this.numberOfEntitiesLabel = null;
    this.lastIndex = 0;
    this.planets = [];
    this.entities = [];
    this.levelFinished = false;
};
playState.prototype = Object.create(FM.State.prototype);
playState.prototype.constructor = playState;
/**
* Initialize the play state.
*/
playState.prototype.init = function () {
    "use strict";
    FM.State.prototype.init.apply(this);
    FM.Parameters.backgroundColor = 'rgb(255,255,255)';
    var map = new FM.TmxMap(),
        objects,
        object,
        waypoint,
        indexLabel,
        aPlanet,
        anEntity,
        spatial,
        physic,
        renderer,
        sound,
        text,
        emitter,
        i;
    this.hollow = new FM.GameObject(99);
    this.hollow.addComponent(new FM.SpatialComponent(this.game.getMouseX() - 40, this.game.getMouseY() - 40, this.hollow));
    renderer = this.hollow.addComponent(new FM.AnimatedSpriteRendererComponent(this.assetManager.getAssetByName("waypoint"), 80, 80, this.hollow));
    renderer.setAlpha(0.5);
    this.add(this.hollow);
    this.background = new FM.GameObject(0);
    this.background.addComponent(new FM.SpatialComponent(0, 0, this.background));
    this.background.addComponent(new FM.SpriteRendererComponent(this.assetManager.getAssetByName("background"), 800, 576, this.background));
    sound = this.background.addComponent(new FM.AudioComponent(this.background));
    sound.addSound(this.assetManager.getAssetByName("ambiance"));
    sound.play("ambiance", 1, true);
    this.add(this.background);

    this.path = new FM.GameObject(15);
    this.path.addComponent(new FM.SpatialComponent(0, 0, this.path));
    renderer = this.path.addComponent(new FM.LineRendererComponent(3, '#9FCFBC', this.path));
    renderer.setAlpha(0.5);
    this.add(this.path);

    this.replay = new FM.GameObject(99);
    this.replay.addComponent(new FM.SpatialComponent(5, 5, this.replay));
    this.replay.addComponent(new FM.SpriteRendererComponent(this.assetManager.getAssetByName("replay"), 30, 29, this.replay));
    sound = this.replay.addComponent(new FM.AudioComponent(this.replay));
    sound.addSound(this.assetManager.getAssetByName("replaySnd"));
    this.add(this.replay);
    //Loading objects from tmx file
    map.load(this.assetManager.getAssetByName(this.levels.currentLevel).getContent());
    //map.load(FM.AssetManager.getAssetByName("level15").getContent());
    //Create player
    this.thePlayer = new Player(parseInt(map.properties.maxNumberOfWaypoints), parseInt(map.properties.minNumberOfEntities));
    //Waypoints left label
    this.numberOfWaypointsLabel = new FM.GameObject(99);
    this.numberOfWaypointsLabel.addComponent(new FM.SpatialComponent(this.game.getMouseX() - 5, this.game.getMouseY(), this.numberOfWaypointsLabel));
    text = this.numberOfWaypointsLabel.addComponent(new FM.TextRendererComponent(this.thePlayer.maxNumberOfWaypoints, this.numberOfWaypointsLabel));
    text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
    this.add(this.numberOfWaypointsLabel);
    //Load objects
    objects = map.getObjectGroup('objects');
    for (i = 0; i < objects.objects.length; i = i + 1) {
        object = objects.objects[i];
        //Create waypoints
        if (object.type === "waypoint") {
            waypoint = new FM.GameObject(5);
            spatial = waypoint.addComponent(new FM.SpatialComponent(object.x, object.y, waypoint));
            renderer = waypoint.addComponent(new FM.AnimatedSpriteRendererComponent(this.assetManager.getAssetByName("waypoint"), 80, 80, waypoint));
            renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
            renderer.play("default");
            waypoint.addComponent(new FM.AabbComponent(80, 80, waypoint));
            sound = waypoint.addComponent(new FM.AudioComponent(waypoint));
            sound.addSound(this.assetManager.getAssetByName("putDownWaypoint"));
            this.add(waypoint);
            waypoint.addType("waypoint");
            this.thePlayer.waypoints.push(waypoint);
            this.path.components[FM.ComponentTypes.RENDERER].addPoint(new FM.Vector(spatial.position.x + 40, spatial.position.y + 40));
            //Show index
            /*indexLabel = FM.gameObject(15);
            FM.spatialComponent(object.x + 5, object.y + 20, indexLabel);
            FM.textRendererComponent(lastIndex, indexLabel);
            that.add(indexLabel);
            lastIndex++;*/
            this.thePlayer.currentNumberOfWaypoints++;
            waypoint.objectiveIndex = this.thePlayer.currentNumberOfWaypoints;
            this.numberOfWaypointsLabel.components[FM.ComponentTypes.RENDERER].text = this.thePlayer.maxNumberOfWaypoints - this.thePlayer.currentNumberOfWaypoints;
            //waypointsIndexesLabel.push(indexLabel);
        }
        //Create planets
        if (object.type === "planet1") {
            aPlanet = planet(object.x, object.y, 1);
            this.add(aPlanet);
            this.planets.push(aPlanet);
        }
        if (object.type === "planet2") {
            aPlanet = planet(object.x, object.y, 2);
            this.add(aPlanet);
            this.planets.push(aPlanet);
        }
        //Create entities
        if (object.type === "entity1") {
            anEntity = new entity(object.x, object.y, 1);
            this.add(anEntity);
            this.entities.push(anEntity);
        }
        if (object.type === "entity2") {
            anEntity = new entity(object.x, object.y, 2);
            this.add(anEntity);
            this.entities.push(anEntity);
        }
        //Create goal
        if (object.name === "goal") {
            this.goal = new FM.GameObject(3);
            this.goal.addComponent(new FM.SpatialComponent(object.x - 44, object.y - 44, this.goal));
            renderer = this.goal.addComponent(new FM.SpriteRendererComponent(this.assetManager.getAssetByName("goal"), 120, 120, this.goal));
            renderer.setAlpha(1 / (this.thePlayer.minNumberOfEntities + 1));
            //renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], 15, true);
            //renderer.play("default");
            physic = this.goal.addComponent(new FM.CircleComponent(60, this.goal));
            /*emitter = this.goal.addComponent(new FM.EmitterComponent(new FM.Vector(60, 60), this.goal));
            emitter.createParticles(1000, FM.AssetManager.getAssetByName("sunParticle"), 5, 5, 1 / (this.thePlayer.minNumberOfEntities + 1), 1);
            emitter.setXVelocity(0, 400);
            emitter.setYVelocity(0, 400);
            emitter.emit(1, 1, 100);*/
            this.add(this.goal);
            //Entities left label
            this.numberOfEntitiesLabel = new FM.GameObject(15);
            if (this.thePlayer.minNumberOfEntities >= 10) {
                this.numberOfEntitiesLabel.addComponent(new FM.SpatialComponent(object.x + 4, object.y + 16, this.numberOfEntitiesLabel));
            } else {
                this.numberOfEntitiesLabel.addComponent(new FM.SpatialComponent(object.x + 10, object.y + 16, this.numberOfEntitiesLabel));
            }
            text = this.numberOfEntitiesLabel.addComponent(new FM.TextRendererComponent(this.thePlayer.minNumberOfEntities, this.numberOfEntitiesLabel));
            text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
            this.add(this.numberOfEntitiesLabel);
        }
    }
    this.sortByZIndex();
};

/**
* Initialize the play state.
*/
playState.prototype.restart = function () {
    "use strict";
    var map = new FM.TmxMap(),
        objects,
        object,
        waypoint,
        indexLabel,
        text,
        anEntity,
        aWaypoint,
        spatial,
        physic,
        renderer,
        sound,
        i;
    this.levelFinished = false;
    this.lastIndex = 0;
    this.remove(this.goal);
    this.goal = null;
    if (this.victory) {
        this.remove(this.victory);
        this.victory = null;
    }
    if (this.victoryLabel) {
        this.remove(this.victoryLabel);
        this.victoryLabel = null;
    }
    if (this.defeat) {
        this.remove(this.defeat);
        this.defeat = null;
    }
    this.remove(this.numberOfWaypointsLabel);
    this.numberOfWaypointsLabel = null;
    this.remove(this.numberOfEntitiesLabel);
    this.numberOfEntitiesLabel = null;
    for (i = 0; i < this.waypointsIndexesLabel.length; i = i + 1) {
        aWaypoint = this.waypointsIndexesLabel[i];
        this.remove(aWaypoint);
    }
    this.waypointsIndexesLabel = [];
    for (i = 0; i < this.thePlayer.waypoints.length; i = i + 1) {
        aWaypoint = this.thePlayer.waypoints[i];
        this.remove(aWaypoint);
    }
    this.thePlayer.entities = [];
    this.thePlayer.waypoints = [];
    for (i = 0; i < this.entities.length; i = i + 1) {
        anEntity = this.entities[i];
        this.remove(anEntity);
    }
    this.entities = [];
    this.path.components[FM.ComponentTypes.RENDERER].clear();
    //Loading objects from tmx file
    map.load(FM.AssetManager.getAssetByName(this.levels.currentLevel).getContent());
    //Create player
    this.thePlayer = new Player(parseInt(map.properties.maxNumberOfWaypoints), parseInt(map.properties.minNumberOfEntities));
    //Waypoints left label
    this.numberOfWaypointsLabel = new FM.GameObject(99);
    this.numberOfWaypointsLabel.addComponent(new FM.SpatialComponent(this.game.getMouseX() - 5, this.game.getMouseY(), this.numberOfWaypointsLabel));
    text = this.numberOfWaypointsLabel.addComponent(new FM.TextRendererComponent(this.thePlayer.maxNumberOfWaypoints, this.numberOfWaypointsLabel));
    text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
    this.add(this.numberOfWaypointsLabel);
    //Load objects
    objects = map.getObjectGroup('objects');
    for (i = 0; i < objects.objects.length; i = i + 1) {
        object = objects.objects[i];
        //Create waypoints
        if (object.type === "waypoint") {
            waypoint = new FM.GameObject(5);
            spatial = waypoint.addComponent(new FM.SpatialComponent(object.x, object.y, waypoint));
            renderer = waypoint.addComponent(new FM.AnimatedSpriteRendererComponent(this.assetManager.getAssetByName("waypoint"), 80, 80, waypoint));
            renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
            renderer.play("default");
            waypoint.addComponent(new FM.AabbComponent(80, 80, waypoint));
            sound = waypoint.addComponent(new FM.AudioComponent(waypoint));
            sound.addSound(this.assetManager.getAssetByName("putDownWaypoint"));
            this.add(waypoint);
            waypoint.addType("waypoint");
            this.thePlayer.waypoints.push(waypoint);
            this.path.components[FM.ComponentTypes.RENDERER].addPoint(new FM.Vector(spatial.position.x + 40, spatial.position.y + 40));
            //Show index
            /*indexLabel = FM.gameObject(15);
            FM.spatialComponent(object.x + 5, object.y + 20, indexLabel);
            FM.textRendererComponent(lastIndex, indexLabel);
            that.add(indexLabel);
            lastIndex++;*/
            this.thePlayer.currentNumberOfWaypoints++;
            waypoint.objectiveIndex = this.thePlayer.currentNumberOfWaypoints;
            this.numberOfWaypointsLabel.components[FM.ComponentTypes.RENDERER].text = this.thePlayer.maxNumberOfWaypoints - this.thePlayer.currentNumberOfWaypoints;
            //waypointsIndexesLabel.push(indexLabel);
        }
        //Create entities
        if (object.type === "entity1") {
            anEntity = new entity(object.x, object.y, 1);
            this.add(anEntity);
            this.entities.push(anEntity);
        }
        if (object.type === "entity2") {
            anEntity = new entity(object.x, object.y, 2);
            this.add(anEntity);
            this.entities.push(anEntity);
        }
        //Create goal
        if (object.name === "goal") {
            this.goal = new FM.GameObject(3);
            this.goal.addComponent(new FM.SpatialComponent(object.x - 44, object.y - 44, this.goal));
            renderer = this.goal.addComponent(new FM.SpriteRendererComponent(this.assetManager.getAssetByName("goal"), 120, 120, this.goal));
            renderer.setAlpha(1 / (this.thePlayer.minNumberOfEntities + 1));
            //renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], 15, true);
            //renderer.play("default");
            physic = this.goal.addComponent(new FM.CircleComponent(60, this.goal));
            this.add(this.goal);
            //Entities left label
            this.numberOfEntitiesLabel = new FM.GameObject(99);
            if (this.thePlayer.minNumberOfEntities >= 10) {
                this.numberOfEntitiesLabel.addComponent(new FM.SpatialComponent(object.x + 4, object.y + 16, this.numberOfEntitiesLabel));
            } else {
                this.numberOfEntitiesLabel.addComponent(new FM.SpatialComponent(object.x + 10, object.y + 16, this.numberOfEntitiesLabel));
            }
            text = this.numberOfEntitiesLabel.addComponent(new FM.TextRendererComponent(this.thePlayer.minNumberOfEntities, this.numberOfEntitiesLabel));
            text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
            this.add(this.numberOfEntitiesLabel);
        }
    }
    this.sortByZIndex();
};

/**
* Update the play state.
*/
playState.prototype.update = function (dt) {
    "use strict";
    FM.State.prototype.update.apply(this, [dt]);
    var mouseX,
        mouseY,
        waypoint,
        sound,
        spatial,
        otherSpatial,
        renderer,
        physic,
        label,
        aPlanet,
        anEntity,
        anotherEntity,
        i,
        j,
        n;

    //Allow creation of the paths
    if (this.game.isMouseClicked()) {
        //Create waypoint
        if (this.game.getMouseX() <= 5 || this.game.getMouseX() >= 35
                || this.game.getMouseY() <= 5 || this.game.getMouseY() >= 34) {
            if (this.thePlayer.currentNumberOfWaypoints < this.thePlayer.maxNumberOfWaypoints) {
                waypoint = new FM.GameObject(5);
                mouseX = this.game.getMouseX();
                mouseY = this.game.getMouseY();
                spatial = waypoint.addComponent(new FM.SpatialComponent(mouseX - 40, mouseY - 40, waypoint));
                renderer = waypoint.addComponent(new FM.AnimatedSpriteRendererComponent(this.assetManager.getAssetByName("waypoint"), 80, 80, waypoint));
                renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
                renderer.play("default");
                waypoint.addComponent(new FM.AabbComponent(80, 80, waypoint));
                sound = waypoint.addComponent(new FM.AudioComponent(waypoint));
                sound.addSound(this.assetManager.getAssetByName("putDownWaypoint"));
                sound.play("putDownWaypoint", 1, false);
                this.add(waypoint);
                waypoint.addType("waypoint");
                this.thePlayer.waypoints.push(waypoint);
                this.path.components[FM.ComponentTypes.RENDERER].addPoint(new FM.Vector(spatial.position.x + 40, spatial.position.y + 40));
                //Show index
                /*indexLabel = FM.gameObject(15);
                FM.spatialComponent(mouseX - 35, mouseY - 20, indexLabel);
                FM.textRendererComponent(lastIndex, indexLabel);
                that.add(indexLabel);
                lastIndex++;*/
                this.thePlayer.currentNumberOfWaypoints++;
                waypoint.objectiveIndex = this.thePlayer.currentNumberOfWaypoints;
                this.numberOfWaypointsLabel.components[FM.ComponentTypes.RENDERER].text = this.thePlayer.maxNumberOfWaypoints - this.thePlayer.currentNumberOfWaypoints;
                //waypointsIndexesLabel.push(indexLabel);
                //Move entities waiting
                for (i = 0; i < this.thePlayer.entities.length; i = i + 1) {
                    anEntity = this.thePlayer.entities[i];
                    if (anEntity.type === 1) {
                        anEntity.addWaypoint(waypoint);
                    }
                }
                this.sortByZIndex();
            }
            //Go to the next level
            if (this.levelFinished) {
                if (this.levels.currentLevel !== this.levels.endLevel) {
                    this.levels.goToNextLevel();
                    this.restart();
                } else {
                    this.game.switchState(new endState());
                }
            }
        } else if (this.game.getMouseX() >= 5 && this.game.getMouseX() <= 35
                && this.game.getMouseY() >= 5 && this.game.getMouseY() <= 34) {
            this.replay.components[FM.ComponentTypes.SOUND].play("replaySnd", 0.3, false);
            this.restart();
        }
    }
    //Check if an entity is in the influence area of a waypoint
    for (i = 0; i < this.thePlayer.waypoints.length; i = i + 1) {
        waypoint = this.thePlayer.waypoints[i];
        for (j = 0; j < this.entities.length; j = j + 1) {
            anEntity = this.entities[j];
            if (!anEntity.hasPath() && anEntity.components[FM.ComponentTypes.PHYSIC].overlapsWithAabb(waypoint.components[FM.ComponentTypes.PHYSIC])) {
                anEntity.setPath(this.thePlayer.waypoints, this.thePlayer.waypoints.length - i - 1);
                //anEntity.setPath(this.thePlayer.waypoints, i);
                this.thePlayer.entities.push(anEntity);
                anEntity.sound.play("attracted", 1, false);
                if (anEntity.type === 1) {
                    anEntity.addWaypoint(waypoint);
                } else {
                    for (j = i; j >= 0; j = j - 1) {
                        waypoint = this.thePlayer.waypoints[j];
                        anEntity.addWaypoint(this.thePlayer.waypoints[j]);
                    }
                }
            }
        }
    }

    //Check if an entity is in the influence area of another entity or a
    //planet
    for (i = 0; i < this.entities.length; i = i + 1) {
        anEntity = this.entities[i];
        for (j = i + 1; j < this.entities.length; j = j + 1) {
            anotherEntity = this.entities[j];
            if (anEntity.components[FM.ComponentTypes.PHYSIC].overlapsWithAabb(anotherEntity.components[FM.ComponentTypes.PHYSIC])) {
                if (!anEntity.hasPath()) {
                    anEntity.sound.play("collision", 0.5, false);
                    //anEntity.setPath(thePlayer.waypoints, anotherEntity.getCurrentPathIndex());
                    this.thePlayer.entities.push(anEntity);
                    if (anEntity.type === 1) {
                        if (anotherEntity.type === 1) {
                            for (n = anotherEntity.getCurrentPathIndex(); n < anotherEntity.getWaypoints().length; n = n + 1) {
                                waypoint = anotherEntity.getWaypoints()[n];
                                anEntity.addWaypoint(waypoint);
                            }
                        } else {
                            for (n = anotherEntity.waypoints[anotherEntity.getCurrentPathIndex()].objectiveIndex - 2; n >= 0; n = n - 1) {
                                waypoint = this.thePlayer.waypoints[n];
                                anEntity.addWaypoint(waypoint);
                            }
                        }
                    } else {
                        if (anotherEntity.type === 1) {
                            for (n = anotherEntity.waypoints[anotherEntity.getCurrentPathIndex()].objectiveIndex - 2; n >= 0; n = n - 1) {
                                waypoint = this.thePlayer.waypoints[n];
                                anEntity.addWaypoint(waypoint);
                            }
                        } else {
                            for (n = anotherEntity.getCurrentPathIndex(); n < anotherEntity.getWaypoints().length; n = n + 1) {
                                waypoint = anotherEntity.getWaypoints()[n];
                                anEntity.addWaypoint(waypoint);
                            }
                        }
                    }
                } else if (!anotherEntity.hasPath()) {
                    anotherEntity.sound.play("collision", 0.5, false);
                    //anotherEntity.setPath(thePlayer.waypoints, anEntity.getCurrentPathIndex());
                    this.thePlayer.entities.push(anotherEntity);
                    if (anotherEntity.type === 1) {
                        if (anEntity.type === 1) {
                            for (n = anEntity.getCurrentPathIndex(); n < anEntity.getWaypoints().length; n = n + 1) {
                                waypoint = anEntity.getWaypoints()[n];
                                anotherEntity.addWaypoint(waypoint);
                            }
                        } else {
                            for (n = anEntity.waypoints.length - (anEntity.waypoints[anEntity.getCurrentPathIndex()].objectiveIndex) - 1; n >= 0; n = n - 1) {
                                waypoint = anEntity.waypoints[n];
                                anotherEntity.addWaypoint(waypoint);
                            }
                        }
                    } else {
                        if (anEntity.type === 1) {
                            for (n = anEntity.waypoints.length - (anEntity.waypoints[anEntity.getCurrentPathIndex()].objectiveIndex) - 1; n >= 0; n = n - 1) {
                                waypoint = anEntity.waypoints[n];
                                anotherEntity.addWaypoint(waypoint);
                            }
                        } else {
                            for (n = anEntity.getCurrentPathIndex(); n < anEntity.getWaypoints().length; n = n + 1) {
                                waypoint = anEntity.getWaypoints()[n];
                                anotherEntity.addWaypoint(waypoint);
                            }
                        }
                    }
                }
            }
        }
        //Entities reached the goal
        if (!anEntity.reachedGoal) {
            if (anEntity.components[FM.ComponentTypes.PHYSIC].overlapsWithCircle(this.goal.components[FM.ComponentTypes.PHYSIC])) {
                anEntity.components[FM.ComponentTypes.PATHFINDING].stopFollowingPath();
                waypoint = new FM.GameObject(5);
                spatial = this.goal.components[FM.ComponentTypes.SPATIAL];
                waypoint.addComponent(new FM.SpatialComponent(spatial.position.x + 20, spatial.position.y + 20, waypoint));
                anEntity.setPath([waypoint], 0);
                anEntity.reachedGoal = true;
                //TODO don't play when followed by multiple entities
                anEntity.components[FM.ComponentTypes.SOUND].play("enterTheSun", 0.5, false);
                if (this.thePlayer.currentNumberOfEntities < this.thePlayer.minNumberOfEntities) {
                    this.thePlayer.currentNumberOfEntities++;
                    if (this.thePlayer.minNumberOfEntities - this.thePlayer.currentNumberOfEntities < 10 && this.thePlayer.minNumberOfEntities - (this.thePlayer.currentNumberOfEntities - 1) >= 10) {
                        this.numberOfEntitiesLabel.components[FM.ComponentTypes.SPATIAL].position.x += 6;
                    }
                    this.numberOfEntitiesLabel.components[FM.ComponentTypes.RENDERER].text = this.thePlayer.minNumberOfEntities - this.thePlayer.currentNumberOfEntities;
                    this.goal.components[FM.ComponentTypes.RENDERER].setAlpha(this.thePlayer.currentNumberOfEntities / this.thePlayer.minNumberOfEntities);
                }
            }
        } else if (!anEntity.hidden && anEntity.components[FM.ComponentTypes.PATHFINDING].isLastWaypointReached()) {
            anEntity.hidden = true;
            anEntity.hide();
        }
        //Check if an entity is near a planet
        for (j = 0; j < this.planets.length; j = j + 1) {
            aPlanet = this.planets[j];
            if (!anEntity.lost && anEntity.components[FM.ComponentTypes.PHYSIC].overlapsWithCircle(aPlanet.gravityArea.components[FM.ComponentTypes.PHYSIC])) {
                //anEntity.components[FM.ComponentTypes.PATHFINDING].stopFollowingPath();
                anEntity.planet = aPlanet;
                if (aPlanet.type === 1) {
                    spatial = aPlanet.components[FM.ComponentTypes.SPATIAL];
                    otherSpatial = anEntity.components[FM.ComponentTypes.SPATIAL];
                    physic = anEntity.components[FM.ComponentTypes.PHYSIC];
                    var xDiff =  Math.abs((spatial.position.x + 50 + physic.offset.x + physic.width / 2) - otherSpatial.position.x + 15),
                        yDiff =  Math.abs((spatial.position.y + 50 + physic.offset.y + physic.height / 2) - otherSpatial.position.y + 15),
                        coeff;
                    if (xDiff < yDiff) {
                        coeff = xDiff / yDiff;
                        anEntity.gravitySpeed.x = (aPlanet.maxGravity * coeff);
                        anEntity.gravitySpeed.y = aPlanet.maxGravity;
                    } else if (xDiff > yDiff) {
                        coeff = yDiff / xDiff;
                        anEntity.gravitySpeed.x = aPlanet.maxGravity;
                        anEntity.gravitySpeed.y = (aPlanet.maxGravity * coeff);
                    } else {
                        anEntity.gravitySpeed.x = aPlanet.maxGravity;
                        anEntity.gravitySpeed.y = aPlanet.maxGravity;
                    }
                } else {
                    //dsf
                }
            } else {
                anEntity.planet = null;
                if (anEntity.components[FM.ComponentTypes.PATHFINDING].getLength() > 0 && !anEntity.components[FM.ComponentTypes.PATHFINDING].isActive()) {
                    //anEntity.components[FM.ComponentTypes.PATHFINDING].resumeFollowingPath();
                }
            }
        }
    }

    //Stick hollow to cursor
    if (this.thePlayer.currentNumberOfWaypoints < this.thePlayer.maxNumberOfWaypoints
            && (this.game.getMouseX() <= 5 || this.game.getMouseX() >= 35
                || this.game.getMouseY() <= 5 || this.game.getMouseY() >= 34)) {
        this.hollow.components[FM.ComponentTypes.SPATIAL].position.x = this.game.getMouseX() - 40;
        this.hollow.components[FM.ComponentTypes.SPATIAL].position.y = this.game.getMouseY() - 40;
        this.hollow.show();
        this.numberOfWaypointsLabel.components[FM.ComponentTypes.SPATIAL].position.x = this.game.getMouseX() - 5;
        this.numberOfWaypointsLabel.components[FM.ComponentTypes.SPATIAL].position.y = this.game.getMouseY();
        this.numberOfWaypointsLabel.show();
        document.getElementById("canvas").style.cursor = 'none';
    } else if (this.hollow.isVisible()) {
        this.hollow.hide();
        this.numberOfWaypointsLabel.hide();
        document.getElementById("canvas").style.cursor = 'default';
    }

    //Checking victory condition
    if (!this.levelFinished && this.thePlayer.currentNumberOfEntities >= this.thePlayer.minNumberOfEntities) {
        var arrived = true;
        for (i = 0; i < this.thePlayer.entities.length; i = i + 1) {
            anEntity = this.thePlayer.entities[i];
            if (anEntity.reachedGoal && !anEntity.hidden) {
                arrived = false;
            }
        }
        if (arrived) {
            this.levelFinished = true;
            this.victory = new FM.GameObject(15);
            spatial = this.victory.addComponent(new FM.SpatialComponent(this.goal.components[FM.ComponentTypes.SPATIAL].position.x, this.goal.components[FM.ComponentTypes.SPATIAL].position.y, this.victory));
            this.victory.addComponent(new FM.CircleRendererComponent(new FM.Vector(spatial.x + 60, spatial.y + 60), '#ffff69', this.victory));
            sound = this.victory.addComponent(new FM.AudioComponent(this.victory));
            sound.addSound(this.assetManager.getAssetByName("win"));
            sound.play("win", 0.7, false);
            this.add(this.victory);
            this.victoryLabel = new FM.GameObject(20);
            this.victoryLabel.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 120, FM.Game.getScreenHeight() / 2 - 20, this.victoryLabel));
            label = this.victoryLabel.addComponent(new FM.TextRendererComponent("Let's go somewhere else", this.victoryLabel));
            label.setFormat('000000', '24px sans serif', 'middle');
            this.add(this.victoryLabel);
            this.victoryLabel = new FM.GameObject(20);
            this.victoryLabel.addComponent(new FM.SpatialComponent(FM.Game.getScreenWidth() / 2 - 80, FM.Game.getScreenHeight() / 2 + 10, this.victoryLabel));
            label = this.victoryLabel.addComponent(new FM.TextRendererComponent("Click to continue", this.victoryLabel));
            label.setFormat('000000', '24px sans serif', 'middle');
            this.add(this.victoryLabel);
            this.sortByZIndex();
        }
    }
    if (this.victory) {
        this.victory.components[FM.ComponentTypes.RENDERER].setRadius(this.lastRadius);
        this.lastRadius += 5;
    }
};

/**
* Destroy the state and its objects.
*/
playState.prototype.destroy = function () {
    "use strict";
    FM.State.prototype.destroy.call(this);
    this.goal = null;
    if (this.victory) {
        this.victory = null;
    }
    if (this.victoryLabel) {
        this.victoryLabel = null;
    }
    if (this.defeat) {
        this.defeat = null;
    }
    this.replay = null;
    this.numberOfWaypointsLabel = null;
    this.numberOfEntitiesLabel = null;
    this.waypointsIndexesLabel = null;
    this.thePlayer.waypoints = null;
    this.entities = null;
    this.path = null;
};