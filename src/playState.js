/**
 * Start play state
 * @returns {___that0}
 */
function playState(pLevels) {
    "use strict";
    var that = Object.create(FMENGINE.fmState()),
        game = FMENGINE.fmGame,
        levels = pLevels,
        assetManager = FMENGINE.fmAssetManager,
        param = FMENGINE.fmParameters,
        background,
        replay,
        victory,
        victoryLabel,
        path,
        lastRadius = 30,
        defeat,
        thePlayer,
        hollow,
        goal,
        numberOfWaypointsLabel,
        waypointsIndexesLabel = [],
        numberOfEntitiesLabel,
        lastIndex = 0,
        planets = [],
        entities = [],
        levelFinished = false;

    /**
    * Initialize the play state.
    */
    that.init = function () {
        Object.getPrototypeOf(that).init();
        FMENGINE.fmParameters.backgroundColor = 'rgb(255,255,255)';
        var map = tmxMap(),
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
        hollow = FMENGINE.fmGameObject(99);
        FMENGINE.fmSpatialComponent(game.getMouseX() - 40, game.getMouseY() - 40, hollow);
        renderer = FMENGINE.fmAnimatedSpriteRendererComponent(assetManager.getAssetByName("waypoint"), 80, 80, hollow);
        renderer.setAlpha(0.5);
        that.add(hollow);
        background = FMENGINE.fmGameObject(0);
        FMENGINE.fmSpatialComponent(0, 0, background);
        FMENGINE.fmSpriteRendererComponent(FMENGINE.fmAssetManager.getAssetByName("background"), 800, 576, background);
        sound = FMENGINE.fmSoundComponent(background);
        sound.addSound(assetManager.getAssetByName("ambiance"));
        sound.play("ambiance", 1, true);
        that.add(background);

        path = FMENGINE.fmGameObject(15);
        FMENGINE.fmSpatialComponent(0, 0, path);
        renderer = FMENGINE.fmLineRendererComponent(3, '#9FCFBC', path);
        renderer.setAlpha(0.5);
        that.add(path);

        replay = FMENGINE.fmGameObject(99);
        FMENGINE.fmSpatialComponent(5, 5, replay);
        FMENGINE.fmSpriteRendererComponent(FMENGINE.fmAssetManager.getAssetByName("replay"), 30, 29, replay);
        sound = FMENGINE.fmSoundComponent(replay);
        sound.addSound(assetManager.getAssetByName("replaySnd"));
        that.add(replay);
        //Loading objects from tmx file
        map.load(FMENGINE.fmAssetManager.getAssetByName(levels.currentLevel).getContent());
        //map.load(FMENGINE.fmAssetManager.getAssetByName("level15").getContent());
        //Create player
        thePlayer = player(parseInt(map.properties.maxNumberOfWaypoints), parseInt(map.properties.minNumberOfEntities));
        //Waypoints left label
        numberOfWaypointsLabel = FMENGINE.fmGameObject(99);
        FMENGINE.fmSpatialComponent(game.getMouseX() - 5, game.getMouseY(), numberOfWaypointsLabel);
        text = FMENGINE.fmTextRendererComponent(thePlayer.maxNumberOfWaypoints, numberOfWaypointsLabel);
        text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
        that.add(numberOfWaypointsLabel);
        //Load objects
        objects = map.getObjectGroup('objects');
        for (i = 0; i < objects.objects.length; i = i + 1) {
            object = objects.objects[i];
            //Create waypoints
            if (object.type === "waypoint") {
                waypoint = FMENGINE.fmGameObject(5);
                spatial = FMENGINE.fmSpatialComponent(object.x, object.y, waypoint);
                renderer = FMENGINE.fmAnimatedSpriteRendererComponent(assetManager.getAssetByName("waypoint"), 80, 80, waypoint);
                renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true, true);
                renderer.play("default");
                FMENGINE.fmAabbComponent(80, 80, waypoint);
                sound = FMENGINE.fmSoundComponent(waypoint);
                sound.addSound(assetManager.getAssetByName("putDownWaypoint"));
                that.add(waypoint);
                waypoint.addType("waypoint");
                thePlayer.waypoints.push(waypoint);
                path.components[FMENGINE.fmComponentTypes.RENDERER].addPoint(FMENGINE.fmPoint(spatial.x + 40, spatial.y + 40));
                //Show index
                /*indexLabel = FMENGINE.fmGameObject(15);
                FMENGINE.fmSpatialComponent(object.x + 5, object.y + 20, indexLabel);
                FMENGINE.fmTextRendererComponent(lastIndex, indexLabel);
                that.add(indexLabel);
                lastIndex++;*/
                thePlayer.currentNumberOfWaypoints++;
                waypoint.objectiveIndex = thePlayer.currentNumberOfWaypoints;
                numberOfWaypointsLabel.components[FMENGINE.fmComponentTypes.RENDERER].text = thePlayer.maxNumberOfWaypoints - thePlayer.currentNumberOfWaypoints;
                //waypointsIndexesLabel.push(indexLabel);
            }
            //Create planets
            if (object.type === "planet1") {
                aPlanet = planet(object.x, object.y, 1);
                that.add(aPlanet);
                planets.push(aPlanet);
            }
            if (object.type === "planet2") {
                aPlanet = planet(object.x, object.y, 2);
                that.add(aPlanet);
                planets.push(aPlanet);
            }
            //Create entities
            if (object.type === "entity1") {
                anEntity = entity(object.x, object.y, 1);
                that.add(anEntity);
                entities.push(anEntity);
            }
            if (object.type === "entity2") {
                anEntity = entity(object.x, object.y, 2);
                that.add(anEntity);
                entities.push(anEntity);
            }
            //Create goal
            if (object.name === "goal") {
                goal = FMENGINE.fmGameObject(3);
                FMENGINE.fmSpatialComponent(object.x - 44, object.y - 44, goal);
                renderer = FMENGINE.fmSpriteRendererComponent(assetManager.getAssetByName("goal"), 120, 120, goal);
                renderer.setAlpha(1 / (thePlayer.minNumberOfEntities + 1));
                //renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], 15, true, true);
                //renderer.play("default");
                physic = FMENGINE.fmCircleComponent(FMENGINE.fmPoint(object.x + 16, object.y + 16), 60, goal);
                /*emitter = FMENGINE.fmEmitterComponent(FMENGINE.fmPoint(60, 60), goal);
                emitter.createParticles(1000, assetManager.getAssetByName("sunParticle"), 5, 5, 1 / (thePlayer.minNumberOfEntities + 1), 1);
                emitter.setXVelocity(0, 400);
                emitter.setYVelocity(0, 400);
                emitter.emit(1, 1, 100);*/
                that.add(goal);

                //Entities left label
                numberOfEntitiesLabel = FMENGINE.fmGameObject(15);
                if (thePlayer.minNumberOfEntities >= 10) {
                    FMENGINE.fmSpatialComponent(object.x + 4, object.y + 16, numberOfEntitiesLabel);
                } else {
                    FMENGINE.fmSpatialComponent(object.x + 10, object.y + 16, numberOfEntitiesLabel);
                }
                text = FMENGINE.fmTextRendererComponent(thePlayer.minNumberOfEntities, numberOfEntitiesLabel);
                text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
                that.add(numberOfEntitiesLabel);
            }
        }
        that.sortByZIndex();
    };

    /**
    * Initialize the play state.
    */
    that.restart = function () {
        var map = tmxMap(),
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
        levelFinished = false;
        lastIndex = 0;
        that.remove(goal);
        goal = null;
        if (victory) {
            that.remove(victory);
            victory = null;
        }
        if (defeat) {
            that.remove(defeat);
            defeat = null;
        }
        that.remove(numberOfWaypointsLabel);
        numberOfWaypointsLabel = null;
        that.remove(numberOfEntitiesLabel);
        numberOfEntitiesLabel = null;
        for (i = 0; i < waypointsIndexesLabel.length; i = i + 1) {
            aWaypoint = waypointsIndexesLabel[i];
            that.remove(aWaypoint);
        }
        waypointsIndexesLabel = [];
        for (i = 0; i < thePlayer.waypoints.length; i = i + 1) {
            aWaypoint = thePlayer.waypoints[i];
            that.remove(aWaypoint);
        }
        thePlayer.entities = [];
        thePlayer.waypoints = [];
        for (i = 0; i < entities.length; i = i + 1) {
            anEntity = entities[i];
            that.remove(anEntity);
        }
        entities = [];
        //Loading objects from tmx file
        map.load(FMENGINE.fmAssetManager.getAssetByName(levels.currentLevel).getContent());
        //Create player
        thePlayer = player(parseInt(map.properties.maxNumberOfWaypoints), parseInt(map.properties.minNumberOfEntities));
        //Waypoints left label
        numberOfWaypointsLabel = FMENGINE.fmGameObject(99);
        FMENGINE.fmSpatialComponent(game.getMouseX() - 5, game.getMouseY(), numberOfWaypointsLabel);
        text = FMENGINE.fmTextRendererComponent(thePlayer.maxNumberOfWaypoints, numberOfWaypointsLabel);
        text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
        that.add(numberOfWaypointsLabel);
        //Load objects
        objects = map.getObjectGroup('objects');
        for (i = 0; i < objects.objects.length; i = i + 1) {
            object = objects.objects[i];
            //Create waypoints
            if (object.type === "waypoint") {
                waypoint = FMENGINE.fmGameObject(5);
                spatial = FMENGINE.fmSpatialComponent(object.x, object.y, waypoint);
                renderer = FMENGINE.fmAnimatedSpriteRendererComponent(assetManager.getAssetByName("waypoint"), 80, 80, waypoint);
                renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true, true);
                renderer.play("default");
                FMENGINE.fmAabbComponent(80, 80, waypoint);
                sound = FMENGINE.fmSoundComponent(waypoint);
                sound.addSound(assetManager.getAssetByName("putDownWaypoint"));
                that.add(waypoint);
                waypoint.addType("waypoint");
                thePlayer.waypoints.push(waypoint);
                path.components[FMENGINE.fmComponentTypes.RENDERER].addPoint(FMENGINE.fmPoint(spatial.x + 40, spatial.y + 40));
                //Show index
                /*indexLabel = FMENGINE.fmGameObject(15);
                FMENGINE.fmSpatialComponent(object.x + 5, object.y + 20, indexLabel);
                FMENGINE.fmTextRendererComponent(lastIndex, indexLabel);
                that.add(indexLabel);
                lastIndex++;*/
                thePlayer.currentNumberOfWaypoints++;
                waypoint.objectiveIndex = thePlayer.currentNumberOfWaypoints;
                numberOfWaypointsLabel.components[FMENGINE.fmComponentTypes.RENDERER].text = thePlayer.maxNumberOfWaypoints - thePlayer.currentNumberOfWaypoints;
                //waypointsIndexesLabel.push(indexLabel);
            }
            //Create entities
            if (object.type === "entity1") {
                anEntity = entity(object.x, object.y, 1);
                that.add(anEntity);
                entities.push(anEntity);
            }
            if (object.type === "entity2") {
                anEntity = entity(object.x, object.y, 2);
                that.add(anEntity);
                entities.push(anEntity);
            }
            //Create goal
            if (object.name === "goal") {
                goal = FMENGINE.fmGameObject(3);
                FMENGINE.fmSpatialComponent(object.x - 44, object.y - 44, goal);
                renderer = FMENGINE.fmSpriteRendererComponent(assetManager.getAssetByName("goal"), 120, 120, goal);
                renderer.setAlpha(1 / (thePlayer.minNumberOfEntities + 1));
                //renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], 15, true, true);
                //renderer.play("default");
                physic = FMENGINE.fmCircleComponent(FMENGINE.fmPoint(object.x - 44, object.y - 44), 60, goal);
                that.add(goal);
                //Entities left label
                numberOfEntitiesLabel = FMENGINE.fmGameObject(99);
                if (thePlayer.minNumberOfEntities >= 10) {
                    FMENGINE.fmSpatialComponent(object.x + 4, object.y + 16, numberOfEntitiesLabel);
                } else {
                    FMENGINE.fmSpatialComponent(object.x + 10, object.y + 16, numberOfEntitiesLabel);
                }
                text = FMENGINE.fmTextRendererComponent(thePlayer.minNumberOfEntities, numberOfEntitiesLabel);
                text.setFormat('#1a1a1a', '20px sans-serif', 'middle');
                that.add(numberOfEntitiesLabel);
            }
        }
        that.sortByZIndex();
    };

    /**
    * Update the play state.
    */
    that.update = function (dt) {
        Object.getPrototypeOf(that).update(dt);
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
        if (game.isMouseClicked()) {
            //Create waypoint
            if (game.getMouseX() <= 5 || game.getMouseX() >= 35
                    || game.getMouseY() <= 5 || game.getMouseY() >= 34) {
                if (thePlayer.currentNumberOfWaypoints < thePlayer.maxNumberOfWaypoints) {
                    waypoint = FMENGINE.fmGameObject(5);
                    mouseX = game.getMouseX();
                    mouseY = game.getMouseY();
                    spatial = FMENGINE.fmSpatialComponent(mouseX - 40, mouseY - 40, waypoint);
                    renderer = FMENGINE.fmAnimatedSpriteRendererComponent(assetManager.getAssetByName("waypoint"), 80, 80, waypoint);
                    renderer.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7], 15, true, true);
                    renderer.play("default");
                    FMENGINE.fmAabbComponent(80, 80, waypoint);
                    sound = FMENGINE.fmSoundComponent(waypoint);
                    sound.addSound(assetManager.getAssetByName("putDownWaypoint"));
                    sound.play("putDownWaypoint", 1, false);
                    that.add(waypoint);
                    waypoint.addType("waypoint");
                    thePlayer.waypoints.push(waypoint);
                    path.components[FMENGINE.fmComponentTypes.RENDERER].addPoint(FMENGINE.fmPoint(spatial.x + 40, spatial.y + 40));
                    //Show index
                    /*indexLabel = FMENGINE.fmGameObject(15);
                    FMENGINE.fmSpatialComponent(mouseX - 35, mouseY - 20, indexLabel);
                    FMENGINE.fmTextRendererComponent(lastIndex, indexLabel);
                    that.add(indexLabel);
                    lastIndex++;*/
                    thePlayer.currentNumberOfWaypoints++;
                    waypoint.objectiveIndex = thePlayer.currentNumberOfWaypoints;
                    numberOfWaypointsLabel.components[FMENGINE.fmComponentTypes.RENDERER].text = thePlayer.maxNumberOfWaypoints - thePlayer.currentNumberOfWaypoints;
                    //waypointsIndexesLabel.push(indexLabel);
                    //Move entities waiting
                    for (i = 0; i < thePlayer.entities.length; i = i + 1) {
                        anEntity = thePlayer.entities[i];
                        if (anEntity.type === 1) {
                            anEntity.addWaypoint(waypoint);
                        }
                    }
                    that.sortByZIndex();
                }
                //Go to the next level
                if (levelFinished) {
                    if (levels.currentLevel !== levels.endLevel) {
                        levels.goToNextLevel();
                        that.restart();
                    } else {
                        game.switchState(endState());
                    }
                }
            } else if (game.getMouseX() >= 5 && game.getMouseX() <= 35
                    && game.getMouseY() >= 5 && game.getMouseY() <= 34) {
                replay.components[FMENGINE.fmComponentTypes.SOUND].play("replaySnd", 0.3, false);
                that.restart();
            }
        }
        //Check if an entity is in the influence area of a waypoint
        for (i = 0; i < thePlayer.waypoints.length; i = i + 1) {
            waypoint = thePlayer.waypoints[i];
            for (j = 0; j < entities.length; j = j + 1) {
                anEntity = entities[j];
                if (!anEntity.hasPath() && anEntity.components[FMENGINE.fmComponentTypes.PHYSIC].isCollidingWithAabb(waypoint.components[FMENGINE.fmComponentTypes.PHYSIC])) {
                    //anEntity.setPath(thePlayer.waypoints, thePlayer.waypoints.length - i - 1);
                    //anEntity.setPath(thePlayer.waypoints, i);
                    thePlayer.entities.push(anEntity);
                    anEntity.sound.play("attracted", 1, false);
                    if (anEntity.type === 1) {
                        anEntity.addWaypoint(waypoint);
                    } else {
                        for (j = i; j >= 0; j = j - 1) {
                            waypoint = thePlayer.waypoints[j];
                            anEntity.addWaypoint(thePlayer.waypoints[j]);
                        }
                    }
                }
            }
        }

        //Check if an entity is in the influence area of another entity or a
        //planet
        for (i = 0; i < entities.length; i = i + 1) {
            anEntity = entities[i];
            for (j = i + 1; j < entities.length; j = j + 1) {
                anotherEntity = entities[j];
                if (anEntity.components[FMENGINE.fmComponentTypes.PHYSIC].isCollidingWithAabb(anotherEntity.components[FMENGINE.fmComponentTypes.PHYSIC])) {
                    if (!anEntity.hasPath()) {
                        anEntity.sound.play("collision", 0.5, false);
                        //anEntity.setPath(thePlayer.waypoints, anotherEntity.getCurrentPathIndex());
                        thePlayer.entities.push(anEntity);
                        if (anEntity.type === 1) {
                            if (anotherEntity.type === 1) {
                                for (n = anotherEntity.getCurrentPathIndex(); n < anotherEntity.getWaypoints().length; n = n + 1) {
                                    waypoint = anotherEntity.getWaypoints()[n];
                                    anEntity.addWaypoint(waypoint);
                                }
                            } else {
                                for (n = anotherEntity.waypoints[anotherEntity.getCurrentPathIndex()].objectiveIndex - 2; n >= 0; n = n - 1) {
                                    waypoint = thePlayer.waypoints[n];
                                    anEntity.addWaypoint(waypoint);
                                }
                            }
                        } else {
                            if (anotherEntity.type === 1) {
                                for (n = anotherEntity.waypoints[anotherEntity.getCurrentPathIndex()].objectiveIndex - 2; n >= 0; n = n - 1) {
                                    waypoint = thePlayer.waypoints[n];
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
                        thePlayer.entities.push(anotherEntity);
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
                if (anEntity.components[FMENGINE.fmComponentTypes.PHYSIC].isCollidingWithCircle(goal.components[FMENGINE.fmComponentTypes.PHYSIC])) {
                    anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].stopFollowingPath();
                    waypoint = FMENGINE.fmGameObject(5);
                    spatial = goal.components[FMENGINE.fmComponentTypes.SPATIAL];
                    FMENGINE.fmSpatialComponent(spatial.x + 20, spatial.y + 20, waypoint);
                    anEntity.setPath([waypoint], 0);
                    anEntity.reachedGoal = true;
                    //TODO don't play when followed by multiple entities
                    anEntity.components[FMENGINE.fmComponentTypes.SOUND].play("enterTheSun", 0.5, false);
                    if (thePlayer.currentNumberOfEntities < thePlayer.minNumberOfEntities) {
                        thePlayer.currentNumberOfEntities++;
                        if (thePlayer.minNumberOfEntities - thePlayer.currentNumberOfEntities < 10 && thePlayer.minNumberOfEntities - (thePlayer.currentNumberOfEntities - 1) >= 10) {
                            numberOfEntitiesLabel.components[FMENGINE.fmComponentTypes.SPATIAL].x += 6;
                        }
                        numberOfEntitiesLabel.components[FMENGINE.fmComponentTypes.RENDERER].text = thePlayer.minNumberOfEntities - thePlayer.currentNumberOfEntities;
                        goal.components[FMENGINE.fmComponentTypes.RENDERER].setAlpha(thePlayer.currentNumberOfEntities / thePlayer.minNumberOfEntities);
                    }
                }
            } else if (!anEntity.hidden && anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].isLastWaypointReached()) {
                anEntity.hidden = true;
                anEntity.hide();
            }
            //Check if an entity is near a planet
            for (j = 0; j < planets.length; j = j + 1) {
                aPlanet = planets[j];
                if (!anEntity.lost && anEntity.components[FMENGINE.fmComponentTypes.PHYSIC].isCollidingWithCircle(aPlanet.gravityArea.components[FMENGINE.fmComponentTypes.PHYSIC])) {
                    //anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].stopFollowingPath();
                    anEntity.planet = aPlanet;
                    if (aPlanet.type === 1) {
                        spatial = aPlanet.components[FMENGINE.fmComponentTypes.SPATIAL];
                        otherSpatial = anEntity.components[FMENGINE.fmComponentTypes.SPATIAL];
                        physic = anEntity.components[FMENGINE.fmComponentTypes.PHYSIC];
                        var xDiff =  Math.abs((spatial.x + 50 + physic.offset.x + physic.width / 2) - otherSpatial.x + 15),
                            yDiff =  Math.abs((spatial.y + 50 + physic.offset.y + physic.height / 2) - otherSpatial.y + 15),
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
                    if (anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].getLength() > 0 && !anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].isActive()) {
                        //anEntity.components[FMENGINE.fmComponentTypes.PATHFINDING].resumeFollowingPath();
                    }
                }
            }
        }

        //Stick hollow to cursor
        if (thePlayer.currentNumberOfWaypoints < thePlayer.maxNumberOfWaypoints
                && (game.getMouseX() <= 5 || game.getMouseX() >= 35
                    || game.getMouseY() <= 5 || game.getMouseY() >= 34)) {
            hollow.components[FMENGINE.fmComponentTypes.SPATIAL].x = game.getMouseX() - 40;
            hollow.components[FMENGINE.fmComponentTypes.SPATIAL].y = game.getMouseY() - 40;
            hollow.show();
            numberOfWaypointsLabel.components[FMENGINE.fmComponentTypes.SPATIAL].x = game.getMouseX() - 5;
            numberOfWaypointsLabel.components[FMENGINE.fmComponentTypes.SPATIAL].y = game.getMouseY();
            numberOfWaypointsLabel.show();
            document.getElementById("canvas").style.cursor = 'none';
        } else if (hollow.isVisible()) {
            hollow.hide();
            numberOfWaypointsLabel.hide();
            document.getElementById("canvas").style.cursor = 'default';
        }

        //Checking victory condition
        if (!levelFinished && thePlayer.currentNumberOfEntities >= thePlayer.minNumberOfEntities) {
            var arrived = true;
            for (i = 0; i < thePlayer.entities.length; i = i + 1) {
                anEntity = thePlayer.entities[i];
                if (anEntity.reachedGoal && !anEntity.hidden) {
                    arrived = false;
                }
            }
            if (arrived) {
                levelFinished = true;
                victory = FMENGINE.fmGameObject(15);
                spatial = FMENGINE.fmSpatialComponent(goal.components[FMENGINE.fmComponentTypes.SPATIAL].x, goal.components[FMENGINE.fmComponentTypes.SPATIAL].y, victory);
                FMENGINE.fmCircleRendererComponent(FMENGINE.fmPoint(spatial.x + 60, spatial.y + 60), 60, '#ffff69', victory);
                sound = FMENGINE.fmSoundComponent(victory);
                sound.addSound(assetManager.getAssetByName("win"));
                sound.play("win", 0.7, false);
                that.add(victory);
                victoryLabel = FMENGINE.fmGameObject(20);
                FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 120, FMENGINE.fmGame.getScreenHeight() / 2 - 20, victoryLabel);
                label = FMENGINE.fmTextRendererComponent("Let's go somewhere else", victoryLabel);
                label.setFormat('000000', '24px sans serif', 'middle');
                that.add(victoryLabel);
                victoryLabel = FMENGINE.fmGameObject(20);
                FMENGINE.fmSpatialComponent(FMENGINE.fmGame.getScreenWidth() / 2 - 80, FMENGINE.fmGame.getScreenHeight() / 2 + 10, victoryLabel);
                label = FMENGINE.fmTextRendererComponent("Click to continue", victoryLabel);
                label.setFormat('000000', '24px sans serif', 'middle');
                that.add(victoryLabel);
                that.sortByZIndex();
            }
        }
        if (victory) {
            victory.components[FMENGINE.fmComponentTypes.RENDERER].setRadius(lastRadius);
            lastRadius += 5;
        }
    };

    /**
    * Destroy the state and its objects.
    */
    that.destroy = function () {
        var i;
        that.remove(goal);
        goal = null;
        if (victory) {
            that.remove(victory);
            victory = null;
        }
        if (victoryLabel) {
            that.remove(victoryLabel);
            victoryLabel = null;
        }
        if (defeat) {
            that.remove(defeat);
            defeat = null;
        }
        that.remove(numberOfWaypointsLabel);
        numberOfWaypointsLabel = null;
        that.remove(numberOfEntitiesLabel);
        numberOfEntitiesLabel = null;
        for (i = 0; i < waypointsIndexesLabel.length; i = i + 1) {
            that.remove(waypointsIndexesLabel[i]);
        }
        for (i = 0; i < thePlayer.waypoints.length; i = i + 1) {
            that.remove(thePlayer.waypoints[i]);
        }
        thePlayer.waypoints = [];
        for (i = 0; i < entities.length; i = i + 1) {
            that.remove(entities[i]);
        }
        entities = [];
        Object.getPrototypeOf(that).destroy();
        that = null;
    };

    return that;
}