import * as mc from "@minecraft/server";
import Utility from "./utilities";
import TestRunner from "./tests/test_main";

function mainTick() {
    try {
        // main loop here
        // call this method at the end of the main loop to keep the script running
        mc.system.run(mainTick);
    }
    catch (e) {
        mc.world.sendMessage("Error in main.js::mainTick(): " + e);
    }
}

function init() {
    try {
        // anything that needs to be initialized or executed once at startup should be done here
        // this is a global method for all classes. if you need to initialize a specific class, you should do that in the class itself
        // ex: initialize the utility class
        Utility.init();
        TestRunner.init();
        // register a subscriber 
        mc.world.afterEvents.playerLeave.subscribe(exit);
        mc.world.sendMessage("Script initialized");
        mc.system.run(mainTick);
    }
    catch (e) {
        mc.world.sendMessage("Error in main.js::init(): " + e);
    }
}

function exit() {
    try {
        // check to see if the world is shutting down bc all players have left
        let players = mc.world.getPlayers();
        if (players.length !== 0) {
            return;
        }
        // anything that needs to be cleaned up or executed once at shutdown should be done here
        // this is a global method for all classes. if you need to clean up a specific class, you should do that in the class itself
    }
    catch (e) {
        mc.world.sendMessage("Error in main.js::exit(): " + e);
    }
}

init();
