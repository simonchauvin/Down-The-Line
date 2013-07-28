var start = function () {
    "use strict";
    //Add assets
    var assetManager = FMENGINE.fmAssetManager,
        param = FMENGINE.fmParameters;
    //Debug mode
    param.debug = true;

    //Audio
    assetManager.addAsset("enterTheSun", param.AUDIO, "assets/sfx/enter_the_sun.wav");
    assetManager.addAsset("putDownWaypoint", param.AUDIO, "assets/sfx/put_down_waypoint.wav");
    assetManager.addAsset("win", param.AUDIO, "assets/sfx/win.wav");
    assetManager.addAsset("attracted", param.AUDIO, "assets/sfx/attracted.wav");
    assetManager.addAsset("collision", param.AUDIO, "assets/sfx/collision.wav");
    assetManager.addAsset("ambiance", param.AUDIO, "assets/sfx/ambiance.wav");
    assetManager.addAsset("replaySnd", param.AUDIO, "assets/sfx/replay.wav");

    //Images
    assetManager.addAsset("menu", param.IMAGE, "assets/gfx/menu.png");
    assetManager.addAsset("background", param.IMAGE, "assets/gfx/background.png");
    assetManager.addAsset("replay", param.IMAGE, "assets/gfx/replay.png");
    assetManager.addAsset("victory", param.IMAGE, "assets/gfx/victory.png");
    assetManager.addAsset("goal", param.IMAGE, "assets/gfx/goal.png");
    assetManager.addAsset("planet1", param.IMAGE, "assets/gfx/planet1.png");
    assetManager.addAsset("planet2", param.IMAGE, "assets/gfx/planet2.png");
    assetManager.addAsset("entity1", param.IMAGE, "assets/gfx/entity1.png");
    assetManager.addAsset("entity2", param.IMAGE, "assets/gfx/entity2.png");
    assetManager.addAsset("waypoint", param.IMAGE, "assets/gfx/waypoint.png");
    assetManager.addAsset("sunParticle", param.IMAGE, "assets/gfx/sun_particle.png");

    //Levels
    assetManager.addAsset("level0", param.FILE, "levels/level0.tmx");
    assetManager.addAsset("level1", param.FILE, "levels/level1.tmx");
    assetManager.addAsset("level2", param.FILE, "levels/level2.tmx");
    assetManager.addAsset("level3", param.FILE, "levels/level3.tmx");
    assetManager.addAsset("level4", param.FILE, "levels/level4.tmx");
    assetManager.addAsset("level5", param.FILE, "levels/level5.tmx");
    assetManager.addAsset("level6", param.FILE, "levels/level6.tmx");
    assetManager.addAsset("level7", param.FILE, "levels/level7.tmx");
    assetManager.addAsset("level8", param.FILE, "levels/level8.tmx");
    assetManager.addAsset("level9", param.FILE, "levels/level9.tmx");
    assetManager.addAsset("level10", param.FILE, "levels/level10.tmx");
    assetManager.addAsset("level11", param.FILE, "levels/level11.tmx");
    assetManager.addAsset("level12", param.FILE, "levels/level12.tmx");
    assetManager.addAsset("level13", param.FILE, "levels/level13.tmx");
    assetManager.addAsset("level14", param.FILE, "levels/level14.tmx");
    assetManager.addAsset("level15", param.FILE, "levels/level15.tmx");
    assetManager.addAsset("level16", param.FILE, "levels/level16.tmx");
    assetManager.addAsset("level17", param.FILE, "levels/level17.tmx");
    assetManager.addAsset("level18", param.FILE, "levels/level18.tmx");
    assetManager.addAsset("level19", param.FILE, "levels/level19.tmx");
    assetManager.addAsset("level20", param.FILE, "levels/level20.tmx");

    //Load assets
    assetManager.loadAssets();

    //Specify the folder in which you put {FM.js(engine);}
    param.libraryDirectory = "lib";

    //Start game
    FMENGINE.fmGame.run("canvas", "Down The Line", 800, 576, menuState);
};

window.addEventListener("load", start, false);