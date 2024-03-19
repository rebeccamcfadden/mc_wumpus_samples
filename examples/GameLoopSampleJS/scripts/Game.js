import * as mc from "@minecraft/server";
import CoordinateLookup from "./CoordLookup.js";
import BlockPlacement from "./BlockPlacement.js";
export default class Game {
    //----------------------------------------------------------------------------------
    // REFRESH POSITION - print current location
    //----------------------------------------------------------------------------------
    static refreshPosition() {
        // Look up the room number from the player's current location
        const curRoom = CoordinateLookup.getRoomNumber(Game.player.location);
        // If this is different from where they were previously, print it
        if ((curRoom != Game.prevRoom) && (curRoom >= 0)) {
            mc.world.sendMessage(Game.player.name + " is in room " + curRoom);
        }
        // Save the new location for future reference
        Game.prevRoom = curRoom;
    }
    //----------------------------------------------------------------------------------
    // GAME INITIALIZATION
    //----------------------------------------------------------------------------------
    static init() {
        // This is a single-player game
        let players = mc.world.getAllPlayers();
        Game.player = players[0];
        // Initialize the coordinate lookup table
        const minCoords = BlockPlacement.getMinCoordinates();
        const maxCoords = BlockPlacement.getMaxCoordinates();
        CoordinateLookup.initialize(minCoords.x, maxCoords.x, minCoords.z, maxCoords.z);
    }
    static gameTick() {
        if (Game.buildingWorld) {
            // Let world-building take more than one tick, to break up the work.
            // Keep rebuilding across ticks until done.
            Game.buildingWorld = BlockPlacement.buildWorld();
        }
        else if (Game.curTick % Game.REFRESH_POSITION_TICKS == 0) {
            // Keep track of what room the player's in
            Game.refreshPosition();
        }
        Game.curTick++;
    }
}
// Track the previous room to help detection when the player moves to a new room
Game.prevRoom = -1;
// The game has two phases: a world-building phase and a playing phase
Game.buildingWorld = true;
//----------------------------------------------------------------------------------
// GAME LOOP
//----------------------------------------------------------------------------------
// To avoid slowing down the game, don't actually check the player's position every
// tick.  Instead do it every 10th tick.
Game.REFRESH_POSITION_TICKS = 10;
Game.curTick = 0;

//# sourceMappingURL=../../_GameLoopSampleDebug/Game.js.map
