import * as mc from "@minecraft/server";
import Game from "./Game.js";
//----------------------------------------------------------------------------------
// Main game tick method
//----------------------------------------------------------------------------------
function mainTick() {
    try {
        Game.gameTick();
    }
    catch (e) {
        mc.world.sendMessage("Error in main::mainTick(): " + e);
    }
    mc.system.run(mainTick);
}
//----------------------------------------------------------------------------------
// One-time script initialization
//----------------------------------------------------------------------------------
function init() {
    try {
        // Anything that needs to be initialized or executed once at startup should be done here.
        Game.init();
        mc.world.sendMessage("Script initialized");
        // Now start the tick loop
        mc.system.run(mainTick);
    }
    catch (e) {
        mc.world.sendMessage("Error in main::init(): " + e);
    }
}
//----------------------------------------------------------------------------------
// Global code
//----------------------------------------------------------------------------------
init();

//# sourceMappingURL=../../_GameLoopSampleDebug/main.js.map
