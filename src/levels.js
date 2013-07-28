var levels = function () {
    "use strict";
    var that = {};
    that.currentLevel = "level14";
    that.endLevel = "level14";

    that.goToNextLevel = function () {
        switch (that.currentLevel) {
        case "level0":
            that.currentLevel = "level1";
            break;
        case "level1":
            that.currentLevel = "level2";
            break;
        case "level2":
            that.currentLevel = "level3";
            break;
        case "level3":
            that.currentLevel = "level4";
            break;
        case "level4":
            that.currentLevel = "level5";
            break;
        case "level5":
            that.currentLevel = "level6";
            break;
        case "level6":
            that.currentLevel = "level7";
            break;
        case "level7":
            that.currentLevel = "level8";
            break;
        case "level8":
            that.currentLevel = "level9";
            break;
        case "level9":
            that.currentLevel = "level10";
            break;
        case "level10":
            that.currentLevel = "level11";
            break;
        case "level11":
            that.currentLevel = "level12";
            break;
        case "level12":
            that.currentLevel = "level13";
            break;
        case "level13":
            that.currentLevel = "level14";
            break;
        case "level14":
            that.currentLevel = "level15";
            break;
        case "level15":
            that.currentLevel = "level16";
            break;
        case "level16":
            that.currentLevel = "level17";
            break;
        case "level17":
            that.currentLevel = "level18";
            break;
        case "level18":
            that.currentLevel = "level19";
            break;
        case "level19":
            that.currentLevel = "level20";
            break;
        }
    };

    return that;
};