import * as mc from "@minecraft/server";
import CoordinateLookup from "./CoordLookup.js";
export default class BlockPlacement {
    //----------------------------------------------------------------------------------
    // Returns the minimum X and Z values that squares might be built at
    //----------------------------------------------------------------------------------
    static getMinCoordinates() {
        // Just start at 0,0
        return {
            x: 0,
            y: -60,
            z: 0,
        };
    }
    //----------------------------------------------------------------------------------
    // Returns the maximum X and Z values that squares might be built at
    //----------------------------------------------------------------------------------
    static getMaxCoordinates() {
        // The farthest X,Z is calculated from the number of squares * the size of squares.
        return {
            x: BlockPlacement.squareCount.x * BlockPlacement.squareSize.x,
            y: -60,
            z: BlockPlacement.squareCount.z * BlockPlacement.squareSize.z,
        };
    }
    //----------------------------------------------------------------------------------
    // Set a block and (if roomNumber > 0) track it as part of a room.
    //----------------------------------------------------------------------------------
    static setBlock(location, blockPerm, roomNumber) {
        // Set the block as requested
        const dimension = mc.world.getDimension("overworld");
        dimension.getBlock(location)?.setPermutation(blockPerm);
        // If specified, also track the block as part of a room by adding it to the
        // coordinate lookup table.
        if (roomNumber >= 0) {
            CoordinateLookup.saveCoordinateMapping(location, roomNumber);
        }
    }
    //----------------------------------------------------------------------------------
    // WORLD BUILDING
    //----------------------------------------------------------------------------------
    // Build one square
    static drawSquare(squareNumber) {
        // The squares will alternate between black (even squares) and white (odd squares)
        const blockPerm = (squareNumber % 2 == 0)
            ? mc.BlockPermutation.resolve("minecraft:obsidian")
            : mc.BlockPermutation.resolve("minecraft:quartz_block");
        // Figure out which row/column this square is part of
        const squareIndexX = squareNumber % BlockPlacement.squareCount.x;
        const squareIndexZ = Math.floor(squareNumber / BlockPlacement.squareCount.x);
        // The "start position" of a square is the lowest X/Z value corner
        const squareStartCoordinates = {
            x: squareIndexX * BlockPlacement.squareSize.x,
            y: -60,
            z: squareIndexZ * BlockPlacement.squareSize.z,
        };
        for (let indexX = 0; indexX < BlockPlacement.squareSize.x; indexX++) {
            for (let indexZ = 0; indexZ < BlockPlacement.squareSize.z; indexZ++) {
                BlockPlacement.setBlock({
                    x: squareStartCoordinates.x + indexX,
                    y: squareStartCoordinates.y,
                    z: squareStartCoordinates.z + indexZ,
                }, blockPerm, squareNumber);
            }
        }
    }
    //----------------------------------------------------------------------------------
    // WORLD BUILDING - Build all of the squares.
    // This work is done over a series of ticks - function returns TRUE to keep getting
    // called and FALSE when done.  Building everying in one tick would take too long
    // and hit watchdog timeout errors.
    //----------------------------------------------------------------------------------
    static buildWorld() {
        const totalSquares = BlockPlacement.squareCount.x * BlockPlacement.squareCount.z;
        // Drawing the arena all at once takes too long and hits watchdog errors.  Draw a square
        // at a time, a few squares per tick, and then take a break.
        for (let squaresThisTick = 0; (squaresThisTick < BlockPlacement.SQUARES_PER_TICK) && (BlockPlacement.squaresBuilt < totalSquares); squaresThisTick++, BlockPlacement.squaresBuilt++) {
            BlockPlacement.drawSquare(BlockPlacement.squaresBuilt);
        }
        // Return TRUE to keep getting ticked, or FALSE when we're done initializing
        return (BlockPlacement.squaresBuilt < totalSquares);
    }
}
// Number of squares - odd numbers make a checkerboard
BlockPlacement.squareCount = {
    x: 17,
    y: 1,
    z: 17,
};
// Size of each square
BlockPlacement.squareSize = {
    x: 3,
    y: 1,
    z: 3,
};
// How many squares have been built so far
BlockPlacement.squaresBuilt = 0;
// How many squares to build each tick
BlockPlacement.SQUARES_PER_TICK = 4;

//# sourceMappingURL=../../_GameLoopSampleDebug/BlockPlacement.js.map
